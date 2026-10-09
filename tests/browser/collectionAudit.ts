import { expect, type Page } from "@playwright/test";

export async function monitorCollection(page: Page) {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method())) requests.push(request.url());
  });
  // An accidental write must fail the audit without reaching any destination.
  await page.route("**/*", (route) => ["GET", "HEAD"].includes(route.request().method())
    ? route.continue() : route.abort());
  await page.evaluate(() => {
    const target = window as unknown as { storageWrites: string[]; dataLayer: unknown[] };
    target.storageWrites = [];
    target.dataLayer ??= [];
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      target.storageWrites.push(`${key}:${value}`);
      original.call(this, key, value);
    };
  });
  return requests;
}

export async function assertNoCollectionFor(page: Page, requests: string[], milliseconds = 1000) {
  // A negative assertion needs a bounded observation period. An immediate
  // snapshot can miss a deferred fetch/storage/analytics effect. Sample through
  // the entire period, including after the caller closes/reopens the dialog.
  const until = Date.now() + milliseconds;
  do {
    expect(requests, "Unexpected contact request").toEqual([]);
    const audit = await page.evaluate(() => {
      const target = window as unknown as { storageWrites: string[]; dataLayer: unknown[] };
      return { writes: target.storageWrites, events: target.dataLayer };
    });
    expect(audit.writes, "Unexpected persistent contact write").toEqual([]);
    expect(JSON.stringify(audit.events), "Unexpected contact or success analytics")
      .not.toMatch(/Synthetic No Collection|9876543210|lead_success|development_lead_saved/);
    if (Date.now() >= until) break;
    await page.waitForTimeout(Math.max(0, Math.min(50, until - Date.now())));
  } while (true);
}
