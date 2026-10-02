import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route("https://ets-demo.eu1.pipes.meiro.io/**", (r) =>
    r.fulfill({ contentType: "application/json", body: "{}" }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Sadece Gerekli", exact: true })
    .click();
});
test("presenter lifecycle, email cap, cancellation and responsive trip hub", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page
    .getByRole("button", { name: "Meiro · Demo Studio", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset this scenario", exact: true })
    .click();
  await page
    .getByLabel("Experiment arm", { exact: true })
    .selectOption("treatment");
  await page
    .getByRole("button", { name: "2 · Start a saved quote", exact: true })
    .click();
  await page
    .getByRole("button", { name: "3 · Leave for 30 minutes", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "recovery", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Email previews", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preview eligible email", exact: true })
    .click();
  await expect(
    page
      .frameLocator("iframe")
      .getByRole("heading", { name: "Tatiline sadece bir adım kaldı" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Preview eligible email", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Journey", exact: true }).click();
  await page
    .getByRole("button", { name: "4 · Confirm demo booking", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "pretrip", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Close demo studio", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Transfer ekle · 2.400 TL (Demo)",
      exact: true,
    })
    .click();
  await expect(
    page.getByText("Transferin rezervasyonuna dahil."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Meiro · Demo Studio", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "service", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel trip", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "cancelled", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Value & reporting", exact: true })
    .click();
  await expect(page.getByText("Not connected", { exact: true })).toBeVisible();
  await expect(page.getByText("140%", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
test("expired saved quote is blocked and price watch requires explicit permission", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Meiro · Demo Studio", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset this scenario", exact: true })
    .click();
  await page
    .getByLabel("Experiment arm", { exact: true })
    .selectOption("treatment");
  await page
    .getByRole("button", { name: "2 · Start a saved quote", exact: true })
    .click();
  await page.getByRole("button", { name: "+48 hours", exact: true }).click();
  await page.getByRole("button", { name: "+2 hours", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "expired", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset this scenario", exact: true })
    .click();
  await page
    .getByLabel("Experiment arm", { exact: true })
    .selectOption("treatment");
  await page
    .getByRole("button", { name: "Seed explicit price watch", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Simulate price drop to 95.000 TL", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "price", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Experiment arm", { exact: true })
    .selectOption("control");
  await expect(
    page.getByRole("heading", { name: "control", exact: true }),
  ).toBeVisible();
});

test("watched price remains consistent through the exact quote and booking", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Meiro · Demo Studio", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset this scenario", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Seed explicit price watch", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Simulate price drop to 95.000 TL", exact: true })
    .click();
  const watch = await page.evaluate(
    () => JSON.parse(localStorage.getItem("ets-lifecycle-v1")).watch,
  );
  await page.goto(
    `/otel/${watch.hotel_id}?${new URLSearchParams(watch.trip)}`,
  );
  await expect(page.locator(".booking-summary")).toContainText("95.000 TL");
  await page
    .getByRole("button", { name: "Rezervasyona Devam Et", exact: true })
    .click();
  await page.locator("[name=first]").fill("Demo");
  await page.locator("[name=last]").fill("Traveler");
  await page.locator("[name=email]").fill("preview@example.invalid");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Demo Rezervasyonu Tamamla", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Demo rezervasyonun onaylandı!",
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("ets-lifecycle-v1")).booking.total,
    ),
  ).toBe(95000);
});
