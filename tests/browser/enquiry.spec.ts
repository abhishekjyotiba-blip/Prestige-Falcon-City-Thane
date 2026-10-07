import { expect, test, type Page } from "@playwright/test";

async function openPrice(page: Page) {
  const opener = page.getByRole("button", { name: /Get latest price/ });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  return opener;
}

test.beforeEach(async ({ page }) => {
  // Tests use synthetic contacts and a local production build. No live services
  // or real campaign assets/coordinates are prerequisites for these regressions.
  await page.goto("/");
});

test("dialog traps real keyboard focus and returns focus on Escape", async ({ page }) => {
  const opener = await openPrice(page);
  const close = page.getByRole("button", { name: "Close enquiry form" });
  const consent = page.getByRole("checkbox");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Mobile number")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(consent).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(consent).toBeFocused();
  await page.evaluate(() => (document.querySelector(".brand") as HTMLElement).focus());
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("close and backdrop discard drafts and consent between enquiry sources", async ({ page }) => {
  await openPrice(page);
  await page.getByLabel("Your name").fill("Synthetic Draft");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Close enquiry form" }).click();
  await page.getByRole("button", { name: /View plans & brochure/ }).click();
  await expect(page.getByRole("heading", { name: "Plans & brochure enquiry" })).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("");
  await expect(page.getByLabel("Mobile number")).toHaveValue("");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page.locator(".enquiry-backdrop").click({ position: { x: 5, y: 5 } });
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("removed opener uses a visible header focus fallback", async ({ page, isMobile }) => {
  await openPrice(page);
  await page.getByRole("button", { name: /Get latest price/ }).evaluate((element) => element.remove());
  await page.keyboard.press("Escape");
  await expect(isMobile ? page.getByRole("button", { name: "Open menu" }) : page.getByRole("button", { name: "Enquire", exact: true })).toBeFocused();
});

test("public submission and duplicate attempts never collect or emit success", async ({ page }) => {
  const contactRequests: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method())) contactRequests.push(request.url());
  });
  await page.route("**/*", (route) => ["GET", "HEAD"].includes(route.request().method())
    ? route.continue() : route.abort());
  await page.evaluate(() => {
    (window as unknown as { storageWrites?: string[] }).storageWrites = [];
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      (window as unknown as { storageWrites: string[] }).storageWrites.push(`${key}:${value}`);
      original.call(this, key, value);
    };
  });
  await openPrice(page);
  await page.getByLabel("Your name").fill("Synthetic No Collection");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByRole("checkbox").check();
  await expect(page.getByRole("button", { name: "Enquiries open soon" })).toBeDisabled();
  await page.getByLabel("Mobile number").press("Enter");
  const prevented = await page.locator(".enquiry-form").evaluate((form) => {
    const button = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
    button.disabled = false;
    button.click(); button.click();
    return [1, 2].map(() => {
      const submit = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submit); return submit.defaultPrevented;
    });
  });
  expect(prevented).toEqual([true, true]);
  expect(contactRequests).toEqual([]);
  const audit = await page.evaluate(() => {
    const target = window as unknown as { storageWrites: string[]; dataLayer: unknown[] };
    return { writes: target.storageWrites, events: target.dataLayer };
  });
  expect(audit.writes).toEqual([]);
  expect(JSON.stringify(audit.events)).not.toMatch(/Synthetic No Collection|9876543210|lead_success|development_lead_saved/);
  await expect(page.getByText("Preview only.", { exact: false })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(1);
});

test("all enquiry routes emit one contextual open event without typed contact data", async ({ page, isMobile }) => {
  const routes = [
    ["header", "enquiry", "Enquire"],
    ["hero_price", "price", "Get latest price"],
    ["hero_plans", "brochure", "View plans & brochure"],
    ["hero_whatsapp", "whatsapp", "Chat on WhatsApp"],
    ["hero_registration", "registration", "Express your interest"],
    ["preview_price", "price", "Request price update; approved material pending"],
    ["preview_master_plan", "master_plan", "Request master plan; approved material pending"],
    ["preview_floor_plan", "floor_plan", "Request floor plans; approved material pending"],
    ["preview_video", "video", "Request video update; approved material pending"],
    ["plans_master", "master_plan", "Request master plan"],
    ["plans_floor", "floor_plan", "Request floor plans"],
    ["final_site_visit", "site_visit", "Request a site visit"],
    ["updates_pending", "updates", "Keep me updated"],
  ];
  for (const [source, intent, name] of routes) {
    if (source === "header" && isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await page.evaluate(() => { (window as unknown as { dataLayer: unknown[] }).dataLayer = []; });
    const opener = page.getByRole("button", { name: source.startsWith("hero_") && source !== "hero_registration" ? new RegExp(name) : name, exact: !source.startsWith("hero_") });
    await opener.click();
    await expect(page.getByRole("dialog")).toHaveAttribute("data-source", source);
    await page.getByLabel("Your name").fill("Synthetic Analytics");
    await page.getByLabel("Mobile number").fill("9876543210");
    const events = await page.evaluate(() => (window as unknown as { dataLayer: { event: string; source?: string; intent?: string }[] }).dataLayer);
    expect(events.filter((event) => event.event === "cta_click")).toEqual([{ event: "cta_click", project: "Prestige Falcon City Thane", source, intent }]);
    expect(events.filter((event) => event.event === "form_open")).toEqual([{ event: "form_open", project: "Prestige Falcon City Thane", source, intent }]);
    expect(JSON.stringify(events)).not.toMatch(/Synthetic Analytics|9876543210|lead_success|development_lead_saved/);
    await page.getByRole("button", { name: "Close enquiry form" }).click();
  }
});

test("sticky actions suppress during enquiry and restore after close", async ({ page }) => {
  await page.locator("#details").scrollIntoViewIfNeeded();
  const sticky = page.locator(".sticky-actions");
  await expect(sticky).toBeVisible();
  for (const [name, source] of [["Get price update", "sticky"], ["WhatsApp enquiry", "sticky_whatsapp"]]) {
    await page.evaluate(() => { (window as unknown as { dataLayer: unknown[] }).dataLayer = []; });
    await sticky.getByRole("button", { name }).click();
    await expect(sticky).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveAttribute("data-source", source);
    const events = await page.evaluate(() => (window as unknown as { dataLayer: { event: string; source?: string; intent?: string }[] }).dataLayer);
    const intent = source === "sticky" ? "price" : "whatsapp";
    for (const event of ["cta_click", "form_open"]) {
      expect(events.filter((entry) => entry.event === event)).toEqual([{ event, project: "Prestige Falcon City Thane", source, intent }]);
    }
    await page.keyboard.press("Escape");
    await expect(sticky).toBeVisible();
  }
  await page.locator(".closing-section").scrollIntoViewIfNeeded();
  await expect(sticky).toHaveCount(0);
});
