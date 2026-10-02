import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Never send analytics to the live ets-demo instance from tests.
  await page.route("https://ets-demo.eu1.pipes.meiro.io/**", async (route) => {
    if (route.request().url().endsWith("/mpt.js"))
      await route.fulfill({
        contentType: "text/javascript",
        body: "window.__sdkCalls=window.mpt.q || [];window.mpt=function(){window.__sdkCalls.push(Array.from(arguments))}",
      });
    else await route.fulfill({ contentType: "application/json", body: "{}" });
  });
});

test("consent gates events, full booking and confirmation survives refresh", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Sadece Gerekli", exact: true })
    .click();
  expect(await page.evaluate(() => window.mpt)).toBeUndefined();
  await page
    .getByRole("button", { name: "Çerez Ayarları", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Tümünü Kabul Et", exact: true })
    .click();
  await page.getByRole("button", { name: /2 Yetişkin/ }).first().click();
  await page
    .getByRole("button", { name: "Yetişkin artır", exact: true })
    .click();
  await page.getByRole("button", { name: "Uygula", exact: true }).click();
  await page.getByRole("button", { name: "Otel ara", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Bodrum Otelleri için toplam 7 tesis bulduk!",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Agaya Bodrum +16 Adult Only (Ex.Prive Bodrum) favorilere ekle",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Oteli İncele", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Rezervasyona Devam Et", exact: true })
    .click();
  await page.locator("[name=first]").fill("Synthetic");
  await page.locator("[name=last]").fill("Traveller");
  await page.locator("[name=email]").fill("synthetic@example.com");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Demo Rezervasyonu Tamamla", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Demo rezervasyonun onaylandı!" }),
  ).toBeVisible();
  const events = await page.evaluate(() => window.__etsEvents);
  const purchases = events.filter((e) => e.name === "purchase");
  expect(purchases).toHaveLength(1);
  expect(purchases[0].payload).toMatchObject({
    currency: "TRY",
    item_category: "hotel",
    otel_city: "Bodrum",
    brand: "etstur",
    demo_site: "ets",
    booking_type: "simulated",
  });
  expect(purchases[0].payload.value).toBeGreaterThan(0);
  const search = events.find((e) => e.name === "search");
  expect(search.payload).toMatchObject({
    destination: "Bodrum",
    item_category: "hotel",
    adults: 3,
  });
  expect(search.payload.origin).toBeUndefined();
  expect(events.find((e) => e.name === "view_item").payload).toMatchObject({
    currency: "TRY",
    otel_city: "Bodrum",
    item_category: "hotel",
  });
  const state = events.filter((e) => e.name === "ets_demo_state").at(-1);
  expect(state.payload).toMatchObject({ demo_site: "ets", currency: "TRY" });
  expect(["true", "false"]).toContain(state.payload.efilli_consent_marketing);
  expect(JSON.stringify(events)).not.toContain("synthetic@example.com");
  expect(JSON.stringify(events)).not.toContain("Synthetic");
  const sdk = await page.evaluate(() => window.__sdkCalls);
  expect(sdk).toContainEqual([
    "set",
    { demo: true, demo_site: "ets", brand: "etstur" },
  ]);
  expect(
    sdk.find((c) => c[0] === "config" && c[1].collection_endpoint)[1]
      .collection_endpoint,
  ).toBe("https://ets-demo.eu1.pipes.meiro.io/collect/etstur-web");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Demo rezervasyonun onaylandı!" }),
  ).toBeVisible();
  expect(
    (await page.evaluate(() => window.__etsEvents)).filter(
      (e) => e.name === "purchase",
    ),
  ).toHaveLength(0);
  await page
    .getByRole("button", { name: "Çerez Ayarları", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Sadece Gerekli", exact: true })
    .click();
  const before = await page.evaluate(() => window.__etsEvents.length);
  await page
    .getByRole("button", { name: "Ana Sayfaya Dön", exact: true })
    .click();
  expect(await page.evaluate(() => window.__etsEvents.length)).toBe(before);
  await page.goto("/favorilerim");
  await expect(page.locator(".hotel-card")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});

test("destination selection, filters and empty state work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Sadece Gerekli", exact: true })
    .click();
  await page.locator(".search-field").first().click();
  await page
    .getByRole("button", { name: "Kapadokya Nevşehir", exact: true })
    .click();
  await page.getByRole("button", { name: "Otel ara", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Kapadokya Otelleri için toplam 1 tesis bulduk!",
    }),
  ).toBeVisible();
  if (
    await page
      .getByRole("button", { name: "Filtrele", exact: true })
      .isVisible()
  )
    await page.getByRole("button", { name: "Filtrele", exact: true }).click();
  await page.locator('input[aria-label="En yüksek fiyat"]:visible').fill("1000");
  if (
    await page
      .getByRole("button", { name: "0 tesisi göster", exact: true })
      .isVisible()
  )
    await page
      .getByRole("button", { name: "0 tesisi göster", exact: true })
      .click();
  await expect(
    page.getByRole("heading", { name: "Uygun tesis bulunamadı" }),
  ).toBeVisible();
});

test("board change survives translated room controls and updates the booking", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/otel/agaya-bodrum");
  await page
    .getByRole("button", { name: "Sadece Gerekli", exact: true })
    .click();
  // Browser translators replace React-owned text nodes with font wrappers.
  // Reproduce that DOM mutation without relying on an installed extension.
  await page.locator(".room-buy > button").evaluateAll((buttons) => {
    for (const button of buttons) {
      const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const wrapper = document.createElement("font");
          wrapper.textContent = node.textContent;
          node.parentNode.replaceChild(wrapper, node);
        }
      }
    }
  });
  await page.locator(".room select").nth(1).selectOption("Her Şey Dahil");
  expect(errors).toEqual([]);
  await expect(page.locator(".selected-room h3")).toHaveText(
    "Deniz Manzaralı Oda",
  );
  await expect(page.locator(".booking-summary")).toContainText("Her Şey Dahil");
  await expect(page.locator(".booking-summary .total")).toContainText(
    "202.860 TL",
  );
  await page.locator(".room select").first().selectOption("Kahvaltı Dahil");
  await expect(page.locator(".selected-room h3")).toHaveText("Standart Oda");
  await page.locator(".room select").first().selectOption("Yarım Pansiyon");
  await expect(page.locator(".booking-summary .total")).toContainText(
    "150.267 TL",
  );
  await page
    .getByRole("button", { name: "Rezervasyona Devam Et", exact: true })
    .click();
  await expect(page.locator(".booking-summary")).toContainText(
    "Yarım Pansiyon",
  );
  expect(errors).toEqual([]);
});
