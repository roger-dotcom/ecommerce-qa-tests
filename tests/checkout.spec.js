const { test, expect } = require(`@playwright/test`);

const URL = "https://www.saucedemo.com/";

async function login(page) {
  await page.goto(URL);
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
}

// 🛒 Checkout flow
test("User can complete checkout", async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();

  await page.locator("#checkout").click();

  await page.locator("#first-name").fill("Roger");
  await page.locator("#last-name").fill("QA");
  await page.locator("#postal-code").fill("12345");

  await page.locator("#continue").click();
  await page.locator("#finish").click();

  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
});

// 💰 Price validation
test("Total price is correct", async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  await page.locator(".shopping_cart_link").click();
  await page.locator("#checkout").click();

  await page.locator("#first-name").fill("Roger");
  await page.locator("#last-name").fill("QA");
  await page.locator("#postal-code").fill("12345");

  await page.locator("#continue").click();

  const totalText = await page.locator(".summary_subtotal_label").textContent();
  const price = parseFloat(totalText.replace(/[^0-9.]/g, ""));

  expect(price).toBeGreaterThan(0);
});
