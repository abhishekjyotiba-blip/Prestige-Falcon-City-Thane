import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("neighbourhood tabs use real keyboard focus and preserve ARIA associations", async ({ page }) => {
  const group = page.getByRole("tablist", { name: "Neighbourhood categories" });
  const connectivity = group.getByRole("tab", { name: "Connectivity" });
  await connectivity.scrollIntoViewIfNeeded();
  await connectivity.focus();
  for (const [key, name] of [["ArrowLeft", "Lifestyle"], ["ArrowRight", "Connectivity"], ["End", "Lifestyle"], ["Home", "Connectivity"], ["ArrowRight", "Education"]]) {
    await page.keyboard.press(key);
    const tab = group.getByRole("tab", { name });
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(tab).toHaveAttribute("tabindex", "0");
    const id = await tab.getAttribute("id");
    const controlled = await tab.getAttribute("aria-controls");
    const panel = page.locator("#location").getByRole("tabpanel");
    expect(await panel.getAttribute("id")).toBe(controlled);
    await expect(panel).toHaveAttribute("aria-labelledby", id!);
    await expect(group.locator('[role=tab][tabindex="0"]')).toHaveCount(1);
  }
  await expect(page.getByRole("button", { name: "Example: School", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("schematic marker and place selection synchronize without claiming distances", async ({ page }) => {
  const map = page.getByRole("group", { name: "Connectivity schematic; not an actual map" });
  await map.getByRole("button", { name: "Select example Rail link", exact: true }).click();
  await expect(page.getByRole("button", { name: "Example: Rail link", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Example: Road link", exact: true }).click();
  await expect(map.getByRole("button", { name: "Select example Road link", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#location")).toContainText("Distances pending");
  await expect(page.locator("#location").getByText(/Distance details for/)).toHaveCount(0);
  await expect(page.locator('script[src*="maps.googleapis.com"]')).toHaveCount(0);
});

test("amenity tabs and page anchors remain navigation, not enquiry analytics", async ({ page, isMobile }) => {
  await page.evaluate(() => { (window as unknown as { dataLayer: unknown[] }).dataLayer = []; });
  const group = page.getByRole("tablist", { name: "Explore amenities and facilities" });
  const amenities = group.getByRole("tab", { name: "Amenities", exact: true });
  await amenities.scrollIntoViewIfNeeded();
  await amenities.focus();
  await page.keyboard.press("ArrowRight");
  const facilities = group.getByRole("tab", { name: "Facilities", exact: true });
  await expect(facilities).toBeFocused();
  await expect(facilities).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(amenities).toBeFocused();
  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Location", exact: true }).first().click();
  await expect(page).toHaveURL(/#location$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const events = await page.evaluate(() => (window as unknown as { dataLayer: { event: string }[] }).dataLayer);
  expect(events.filter(({ event }) => ["cta_click", "form_open", "lead_success"].includes(event))).toEqual([]);
});
