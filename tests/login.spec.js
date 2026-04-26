const { test, expect } = require(`@playwright/test`);

const URL = "https://www.saucedemo.com/";

// Helper login function
async function login(page) {
  await page.goto(URL);
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
}

// ✅ Login success
test("User can login", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/inventory/);
});

// ❌ Login failure
test("User cannot login with wrong credentials", async ({ page }) => {
  await page.goto(URL);

  await page.locator("#user-name").fill("wrong_user");
  await page.locator("#password").fill("wrong_password");
  await page.locator("#login-button").click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});
