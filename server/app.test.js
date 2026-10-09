import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {afterEach, test} from 'node:test';
import {createApp} from './app.js';

const servers = [];
const folders = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise(resolve => server.close(resolve))));
  await Promise.all(folders.splice(0).map(folder => rm(folder, {recursive: true, force: true})));
});

async function setup(env = {}) {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'prestige-leads-'));
  folders.push(folder);
  const file = path.join(folder, 'inbox.jsonl');
  const app = createApp({env: {NODE_ENV: 'test', ENABLE_DEV_LEADS: '1', DEV_LEADS_FILE: file, ...env}});
  const server = app.listen(0);
  servers.push(server);
  await new Promise(resolve => server.once('listening', resolve));
  return {url: `http://127.0.0.1:${server.address().port}`, file};
}

const lead = () => ({name: 'Test Person', phoneE164: '+919876543210', intent: 'master_plan',
  assetId: 'master_plan', sourceSection: 'hero', attribution: {utmSource: 'test'},
  consent: {noticeVersion: 'v1', capturedAt: new Date().toISOString(), whatsappOptIn: true}});
const post = (url, body, headers = {}) => fetch(`${url}/api/leads`, {method: 'POST',
  headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)});

test('durably appends accepted lead, returns pending asset and deduplicates a retry', async () => {
  const {url, file} = await setup();
  const body = lead();
  const [first, second] = await Promise.all([
    post(url, body, {'Idempotency-Key': 'request-12345678'}),
    post(url, body, {'Idempotency-Key': 'request-12345678'}),
  ]);
  assert.equal(first.status, 202);
  assert.equal(second.status, 202);
  const accepted = await first.json();
  assert.deepEqual(await second.json(), accepted);
  assert.equal(accepted.status, 'accepted');
  assert.deepEqual(accepted.asset, {status: 'upcoming'});
  assert.deepEqual(accepted.whatsapp, {status: 'unavailable'});
  const records = (await readFile(file, 'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(records.length, 1);
  assert.equal(records[0].phoneE164, body.phoneE164);
  assert.equal(records[0].leadId, accepted.leadId);
  assert.equal((await post(url, {...body, name: 'Different'}, {'Idempotency-Key': 'request-12345678'})).status, 409);
  assert.equal((await (await fetch(`${url}/api/assets`)).json()).assets.every(asset => asset.status === 'upcoming'), true);
});

test('rejects invalid inputs and oversized submissions without echoing personal data', async () => {
  const {url} = await setup();
  for (const body of [
    {...lead(), phoneE164: '9876543210'},
    {...lead(), name: '<script>alert(1)</script>'},
    {...lead(), intent: 'unknown'},
    {...lead(), consent: {...lead().consent, whatsappOptIn: 'yes'}},
  ]) {
    const response = await post(url, body);
    assert.equal(response.status, 400);
    assert.equal(JSON.stringify(await response.json()).includes(body.phoneE164), false);
  }
  assert.equal((await post(url, {...lead(), name: 'A'.repeat(9000)})).status, 413);
});

test('production fails closed even if local inbox is enabled', async () => {
  const {url, file} = await setup({NODE_ENV: 'production'});
  const response = await post(url, lead());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, 'lead_destination_unavailable');
  await assert.rejects(readFile(file, 'utf8'), {code: 'ENOENT'});
});

test('disabled development inbox fails closed', async () => {
  const {url} = await setup({ENABLE_DEV_LEADS: '0'});
  assert.equal((await post(url, lead())).status, 503);
});

test('storage failure returns unavailable instead of an accepted lead', async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'prestige-broken-inbox-'));
  folders.push(folder);
  const {url} = await setup({DEV_LEADS_FILE: folder}); // A directory cannot be appended as a file.
  const response = await post(url, lead());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, 'lead_destination_unavailable');
});

test('limits repeated requests per client', async () => {
  const {url} = await setup();
  for (let i = 0; i < 10; i++) {
    const response = await post(url, {...lead(), phoneE164: `+91987654321${i}`});
    assert.equal(response.status, 202);
  }
  assert.equal((await post(url, lead())).status, 429);
});
