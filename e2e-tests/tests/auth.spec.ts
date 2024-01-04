import { test, expect } from '@playwright/test';

const UI_URL="http://localhost:5173/"

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button 
  await page.getByRole("link", { name: "Sign in"}).click();

  await expect(page.getByRole("heading", { name: "Sign in"})).toBeVisible();

  await page.locator("[name=email]").fill("my@gmail.com");
  await page.locator("[name=password]").fill("my1234");

  await page.getByRole("button", {name: "Login"}).click();

  await expect(page.getByText("Sign in successfully")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();
});

test("should allow user to register", async({page}) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000 + 10000)}@test.com`
  await page.goto(UI_URL)

  await page.getByRole("link", {name: "Sign in"}).click();
  await page.getByRole("link", {name: "Create an account"}).click();
  await expect (page.getByRole("heading", {name: "Create an Account"})).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName")
  await page.locator("[name=lastName]").fill("test_lastName")
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", {name: "Create Account"}).click();

  await expect(page.getByText("Registered successfully")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();
})
