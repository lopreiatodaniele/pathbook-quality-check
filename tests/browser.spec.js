import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("actual HTTP acceptance, native upper boundary and keyboard submit", async ({ page, request }) => {
  const rejected = await request.post("/api/book", { data: { title: "Workshop", seats: 4 } }); expect(rejected.status()).toBe(422);
  const accepted = await request.post("/api/book", { data: { title: "Workshop", seats: 3 } }); expect(accepted.status()).toBe(201); expect((await accepted.json()).seats).toBe(3);
  await page.goto("/"); await page.getByRole("textbox", { name: "Workshop title" }).fill("HTML forms"); await page.getByRole("spinbutton", { name: "Seats" }).fill("3"); await page.getByRole("spinbutton", { name: "Seats" }).press("Enter");
  await expect(page.getByRole("list", { name: "Accepted acknowledgements" })).toContainText("HTML forms · 3 seats");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("503 and malformed receipt retain a draft; recovery is a new controlled attempt", async ({ page }) => {
  await page.goto("/"); await page.getByRole("combobox", { name: "Receiver fixture" }).selectOption("reject"); await page.getByRole("textbox", { name: "Workshop title" }).fill("CSS grids"); await page.getByRole("button", { name: "Request seats" }).click();
  await expect(page.getByRole("alert")).toContainText("503"); await expect(page.getByRole("textbox", { name: "Workshop title" })).toHaveValue("CSS grids");
  await page.getByRole("combobox", { name: "Receiver fixture" }).selectOption("malformed"); await page.getByRole("textbox", { name: "Workshop title" }).fill("CSS grids"); await page.getByRole("button", { name: "Request seats" }).click(); await expect(page.getByRole("alert")).toBeVisible(); await expect(page.getByRole("textbox", { name: "Workshop title" })).toHaveValue("CSS grids");
  await page.getByRole("combobox", { name: "Receiver fixture" }).selectOption("success"); await page.getByRole("textbox", { name: "Workshop title" }).fill("CSS grids"); await page.getByRole("button", { name: "Request seats" }).click(); await expect(page.getByRole("list")).toContainText("CSS grids");
});
test("aborted request failure is visible and literal data stays literal", async ({ page }) => {
  await page.goto("/"); await page.route("**/api/book", route => route.abort()); await page.getByRole("textbox", { name: "Workshop title" }).fill("HTML forms"); await page.getByRole("button", { name: "Request seats" }).click(); await expect(page.getByRole("alert")).toBeVisible(); await expect(page.getByRole("textbox", { name: "Workshop title" })).toHaveValue("HTML forms");
  await page.unroute("**/api/book"); await page.getByRole("textbox", { name: "Workshop title" }).fill("<b>Workshop</b>"); await page.getByRole("button", { name: "Request seats" }).click(); await expect(page.getByRole("list")).toContainText("<b>Workshop</b>"); await expect(page.locator("li b")).toHaveCount(0);
});
test("controlled delayed reply cannot regain authority after Cancel", async ({ page }) => {
  let release; const held = new Promise(resolve => { release = resolve; });
  await page.route("**/api/book", async route => { await held; await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "old", title: "HTML forms", seats: 1 }) }).catch(() => {}); });
  await page.goto("/"); await page.getByRole("textbox", { name: "Workshop title" }).fill("HTML forms"); await page.getByRole("button", { name: "Request seats" }).click(); await page.getByRole("button", { name: "Cancel waiting" }).click(); await expect(page.getByRole("textbox", { name: "Workshop title" })).toBeFocused(); release(); await expect(page.getByRole("list").locator("li")).toHaveCount(0);
});
test("scoped axe checks complement keyboard and error-state assertions", async ({ page }) => {
  await page.goto("/"); expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("combobox", { name: "Receiver fixture" }).selectOption("reject"); await page.getByRole("textbox", { name: "Workshop title" }).fill("CSS grids"); await page.getByRole("button", { name: "Request seats" }).click(); await expect(page.getByRole("alert")).toBeVisible(); expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
