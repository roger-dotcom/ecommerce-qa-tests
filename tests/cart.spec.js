const { test, expect } = require(`@playwright/test`);

const URL = "https://www.saucedemo.com/";

async function login(page) {
  await page.goto(URL);
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
}

// ➕ Add item
test("User can add item to cart", async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();

  await expect(page.locator(".inventory_item_name")).toContainText("Backpack");
});

// ➖ Remove item
test("User can remove item from cart", async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});
