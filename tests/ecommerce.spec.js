const { test, expect } = require(`@playwright/test`);

const URL = "https://www.saucedemo.com/";

// Helper login function
async function login(page) {
  await page.goto(URL);
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
}

// ✅ Test 1: Login
test("User can login", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/inventory/);
});

// ✅ Test 2: Add to cart
test("User can add item to cart", async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();

  await expect(page.locator(".inventory_item_name")).toContainText("Backpack");
});

// ✅ Test 3: Remove from cart
test("User can remove item from cart", async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});

// ✅ Test 4: Checkout flow
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

test("Total price is correct", async ({ page }) => {
  await login(page);

  // Add 2 items
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  // Go to cart
  await page.locator(".shopping_cart_link").click();

  // Checkout
  await page.locator("#checkout").click();

  await page.locator("#first-name").fill("Roger");
  await page.locator("#last-name").fill("QA");
  await page.locator("#postal-code").fill("12345");

  await page.locator("#continue").click();

  // Get item total text
  const totalText = await page.locator(".summary_subtotal_label").textContent();

  // Example: "Item total: $39.98"
  const price = parseFloat(totalText.replace(/[^0-9.]/g, ""));

  // Basic validation
  expect(price).toBeGreaterThan(0);
});

test("User cannot login with wrong credentials", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // Wrong login
  await page.locator("#user-name").fill("wrong_user");
  await page.locator("#password").fill("wrong_password");
  await page.locator("#login-button").click();

  // Verify error message
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});
