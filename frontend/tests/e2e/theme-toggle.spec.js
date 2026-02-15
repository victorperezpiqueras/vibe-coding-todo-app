import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("should render theme toggle button", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Check that theme toggle button exists
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
  });

  test("should default to light theme", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Check that document doesn't have dark class
    const htmlElement = page.locator("html");
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Check that sun icon is visible (light mode)
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    const buttonText = await themeToggle.textContent();
    expect(buttonText).toContain("☀");
  });

  test("should toggle to dark theme when clicked", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Click the theme toggle button
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await themeToggle.click();

    // Check that document has dark class
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Check that moon icon is visible (dark mode)
    const buttonText = await themeToggle.textContent();
    expect(buttonText).toContain("🌙");
  });

  test("should toggle back to light theme when clicked twice", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    const themeToggle = page.getByRole("button", { name: /toggle theme/i });

    // Toggle to dark
    await themeToggle.click();

    // Wait for dark mode to be applied
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Toggle back to light
    await themeToggle.click();

    // Check that dark class is removed
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Check that sun icon is visible again
    const buttonText = await themeToggle.textContent();
    expect(buttonText).toContain("☀");
  });

  test("should persist dark theme across page reloads", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Toggle to dark theme
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await themeToggle.click();

    // Verify dark mode is active
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Reload the page
    await page.reload();

    // Wait for the page to load again
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Verify dark mode is still active after reload
    await expect(htmlElement).toHaveClass(/dark/);

    // Verify moon icon is still visible
    const themeToggleAfterReload = page.getByRole("button", {
      name: /toggle theme/i,
    });
    const buttonText = await themeToggleAfterReload.textContent();
    expect(buttonText).toContain("🌙");
  });

  test("should persist light theme across page reloads", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Theme should be light by default, just reload to verify persistence
    const htmlElement = page.locator("html");
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Reload the page
    await page.reload();

    // Wait for the page to load again
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Verify light mode is still active after reload
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Verify sun icon is still visible
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    const buttonText = await themeToggle.textContent();
    expect(buttonText).toContain("☀");
  });

  test("should check localStorage contains correct theme value", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByTestId("api-status")).toBeVisible({
      timeout: 10000,
    });

    // Toggle to dark theme
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await themeToggle.click();

    // Check localStorage value
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem("theme"),
    );
    expect(storedTheme).toBe("dark");

    // Toggle back to light
    await themeToggle.click();

    // Check localStorage value again
    const storedThemeLight = await page.evaluate(() =>
      localStorage.getItem("theme"),
    );
    expect(storedThemeLight).toBe("light");
  });
});
