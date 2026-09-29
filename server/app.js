import express from 'express';
import {createHash, randomUUID} from 'node:crypto';
import {mkdir, open} from 'node:fs/promises';
import path from 'node:path';

const intents = new Set(['price', 'master_plan', 'floor_plan', 'video', 'callback']);
const attributionFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent', 'gclid'];
const error = (res, status, code, message) => res.status(status).json({error: {code, message}});
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

function parseLead(body) {
  if (!isObject(body) || !text(body.name, 100) || !/^[\p{L}][\p{L}\p{M} .'-]{0,99}$/u.test(body.name.trim()) ||
      typeof body.phoneE164 !== 'string' || !/^\+91[6-9]\d{9}$/.test(body.phoneE164) ||
      !intents.has(body.intent) || !text(body.sourceSection, 80) ||
      (body.assetId !== undefined && !text(body.assetId, 100)) ||
      (body.assetId !== undefined && !/^[a-zA-Z0-9_-]+$/.test(body.assetId)) ||
      !isObject(body.consent) || !text(body.consent.noticeVersion, 80) ||
      typeof body.consent.capturedAt !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(body.consent.capturedAt) ||
      !Number.isFinite(Date.parse(body.consent.capturedAt)) ||
      Math.abs(Date.now() - Date.parse(body.consent.capturedAt)) > 24 * 60 * 60 * 1000 ||
      typeof body.consent.whatsappOptIn !== 'boolean' ||
      (body.attribution !== undefined && (!isObject(body.attribution) ||
        Object.entries(body.attribution).some(([key, value]) => !attributionFields.includes(key) ||
          (value !== undefined && (typeof value !== 'string' || value.length > 200)))))) return null;

  return {
    name: body.name.trim().replace(/\s+/g, ' '), phoneE164: body.phoneE164,
    intent: body.intent, ...(body.assetId ? {assetId: body.assetId} : {}),
    sourceSection: body.sourceSection.trim(),
    attribution: Object.fromEntries(attributionFields.filter(key => body.attribution?.[key])
      .map(key => [key, body.attribution[key]])),
    consent: {noticeVersion: body.consent.noticeVersion.trim(),
      capturedAt: body.consent.capturedAt, whatsappOptIn: body.consent.whatsappOptIn},
  };
}

// The local inbox is a testing adapter only. There is deliberately no production adapter.
export function createApp({env = process.env, now = () => Date.now()} = {}) {
  const app = express();
  app.disable('x-powered-by');
  const devInboxEnabled = env.ENABLE_DEV_LEADS === '1' && env.NODE_ENV !== 'production';
  const inboxPath = path.resolve(env.DEV_LEADS_FILE || 'server/data/leads.jsonl');
  const recent = new Map();
  const requests = new Map();
  let writeQueue = Promise.resolve();

  app.use(express.json({limit: '8kb', strict: true}));
  app.get('/api/assets', (_req, res) => res.set('Cache-Control', 'no-store').json({assets: [
    {assetId: 'price', kind: 'price', status: 'upcoming'},
    {assetId: 'master_plan', kind: 'master_plan', status: 'upcoming'},
    {assetId: 'floor_plan', kind: 'floor_plan', status: 'upcoming'},
    {assetId: 'video', kind: 'video', status: 'upcoming'},
  ]}));

  app.post('/api/leads', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!devInboxEnabled) return error(res, 503, 'lead_destination_unavailable', 'Lead submissions are temporarily unavailable. Please try again later.');
    const time = now();
    for (const [key, value] of requests) if (value.expiresAt <= time) requests.delete(key);
    for (const [key, value] of recent) if (value.expiresAt <= time) recent.delete(key);
    const ip = req.ip || 'unknown';
    const window = requests.get(ip) || {count: 0, expiresAt: time + 15 * 60_000};
    window.count += 1;
    requests.set(ip, window);
    if (window.count > 10) return error(res, 429, 'rate_limited', 'Too many requests. Please try again later.');

    const lead = parseLead(req.body);
    if (!lead) return error(res, 400, 'invalid_lead', 'Please check the lead details and try again.');
    const requestKey = req.get('Idempotency-Key');
    if (requestKey !== undefined && !/^[a-zA-Z0-9_-]{8,128}$/.test(requestKey))
      return error(res, 400, 'invalid_idempotency_key', 'Please check the request and try again.');
    const fingerprint = createHash('sha256').update(JSON.stringify(lead)).digest('hex');
    const key = requestKey ? `key:${requestKey}` : `body:${fingerprint}`;
    const prior = recent.get(key);
    if (prior) {
      if (prior.fingerprint !== fingerprint) return error(res, 409, 'idempotency_conflict', 'Please use a new request key.');
      try { return res.status(202).json(await prior.result); }
      catch { recent.delete(key); return error(res, 503, 'lead_destination_unavailable', 'Lead submissions are temporarily unavailable. Please try again later.'); }
    }

    const response = {leadId: randomUUID(), status: 'accepted', asset: {status: 'upcoming'},
      whatsapp: {status: lead.consent.whatsappOptIn ? 'unavailable' : 'not_requested'}};
    const record = {leadId: response.leadId, receivedAt: new Date(time).toISOString(),
      followUpStatus: 'pending', ...lead};
    // Serialize appends, then fsync before acknowledging. A write failure never becomes success.
    const result = writeQueue.catch(() => {}).then(async () => {
      await mkdir(path.dirname(inboxPath), {recursive: true, mode: 0o700});
      const file = await open(inboxPath, 'a', 0o600);
      try { await file.writeFile(`${JSON.stringify(record)}\n`); await file.sync(); }
      finally { await file.close(); }
      return response;
    });
    writeQueue = result;
    recent.set(key, {fingerprint, result, expiresAt: time + (requestKey ? 15 * 60_000 : 60_000)});
    try { res.status(202).json(await result); }
    catch {
      recent.delete(key);
      error(res, 503, 'lead_destination_unavailable', 'Lead submissions are temporarily unavailable. Please try again later.');
    }
  });

  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.too.large') return error(res, 413, 'payload_too_large', 'Request is too large.');
    if (err instanceof SyntaxError && 'body' in err) return error(res, 400, 'invalid_json', 'Please check the request and try again.');
    return error(res, 500, 'internal_error', 'Unable to process the request.');
  });
  return app;
}
