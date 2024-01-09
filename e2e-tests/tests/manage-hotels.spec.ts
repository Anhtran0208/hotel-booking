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

test("should allow user to add hotel", async ({page}) => {
    await page.goto(`${UI_URL}add-hotel`)
    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("Test Description for test hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]', "3");
    await page.getByText("Budget").click()
    await page.getByLabel("Parking").check();
    await page.getByLabel("Spa").check();
    await page.locator('[name="adultCount"]').fill("3")
    await page.locator('[name="childrenCount"]').fill("3")
    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "imageFiles", "test1.jpg")
    ])

    await page.getByRole('button', { name: "Save"}).click();
    await expect(page.getByText("Saved Successfully")).toBeVisible();
})

test("should display hotels", async ({page}) => {
    await page.goto(`${UI_URL}my-hotels`);
    await expect(page.getByRole('heading', {name: 'Test Hotel'})).toBeVisible();
    await expect(page.getByText("Test description for test hotel")).toBeVisible();
    await expect(page.getByText("Test City, Test Country")).toBeVisible();
    await expect(page.getByText("$100 per night")).toBeVisible();
    await expect(page.getByText("Budget")).toBeVisible();
    await expect(page.getByText("3 adults, 3 children")).toBeVisible();
    await expect(page.getByText("3 stars")).toBeVisible();
    await expect (page.getByRole("link", {name: "Add Hotel"})).toBeVisible();
    await expect (page.getByRole("link", {name: "View Details"})).toBeVisible();
})

test ("should edit hotel", async({page}) => {
    await page.goto(`${UI_URL}my-hotels`);
    await page.getByRole("link", { name: "View Details"}).click();
    await page.waitForSelector('[name="name"]', {state: "attached"})
    await expect(page.locator('[name="name"]')).toHaveValue('Test Hotel')
    await page.locator('[name="name"]').fill("Test hotel 3 updated")
    await page.getByRole("button", {name: "Save"}).click();
    await expect(page.getByText("Update hotel successfully")).toBeVisible()
})
