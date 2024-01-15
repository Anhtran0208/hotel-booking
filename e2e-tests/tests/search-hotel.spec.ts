import { test, expect } from  "@playwright/test"
import path from "path";

const UI_URL="http://localhost:5173/"


test.beforeEach(async({ page }) => {
    await page.goto(UI_URL);

  //get the sign in button 
  await page.getByRole("link", { name: "Sign in"}).click();

  await expect(page.getByRole("heading", { name: "Sign in"})).toBeVisible();

  await page.locator("[name=email]").fill("my@gmail.com");
  await page.locator("[name=password]").fill("my1234");

  await page.getByRole("button", {name: "Login"}).click();

  await expect(page.getByText("Sign in successfully")).toBeVisible();
});

test("should search hotel", async ({page}) => {
    await page.goto(UI_URL);
    
    await page.getByPlaceholder("Where are you going?").fill("dublin")
    await page.getByRole("button", {name: "Search"}).click();
    await expect(page.getByText("Hotels found in dublin")).toBeVisible()
    await expect(page.getByText("Dublin GetAway")).toBeVisible()

})