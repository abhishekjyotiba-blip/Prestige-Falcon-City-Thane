import { expect, test } from "@playwright/test";
import { assertNoCollectionFor, monitorCollection } from "./collectionAudit";

// Mutation-style harness checks prove the real safety assertion detects delayed
// side effects. These synthetic effects are test-owned, not application behavior.
for (const [effect, message] of [
  ["request", "Unexpected contact request"],
  ["storage", "Unexpected persistent contact write"],
  ["analytics", "Unexpected contact or success analytics"],
]) {
  test(`collection audit rejects a deferred synthetic ${effect}`, async ({ page }) => {
    await page.goto("/");
    const requests = await monitorCollection(page);
    await page.evaluate((kind) => {
      setTimeout(() => {
        if (kind === "request") {
          void fetch("/__synthetic_regression_write", { method: "POST", body: "synthetic-only" }).catch(() => undefined);
        } else if (kind === "storage") {
          sessionStorage.setItem("synthetic-regression-write", "synthetic-only");
        } else {
          (window as unknown as { dataLayer: unknown[] }).dataLayer.push({ event: "lead_success", name: "Synthetic No Collection" });
        }
      }, 100);
    }, effect);
    await expect(assertNoCollectionFor(page, requests)).rejects.toThrow(message);
  });
}
