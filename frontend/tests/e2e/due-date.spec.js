import { test, expect } from "@playwright/test";

test.describe("Due Date Feature", () => {
  test("create task with overdue due date shows red indicator", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const taskName = `Overdue-Task-${timestamp}`;

    await page.goto("/");
    await expect(page.getByTestId("api-status")).toHaveText("healthy", {
      timeout: 10000,
    });

    // Open create task dialog
    await page.getByTestId("add-task-button").click();
    await expect(page.getByTestId("task-name-input")).toBeVisible();

    // Fill in task name
    await page.getByTestId("task-name-input").fill(taskName);

    // Set a past due date (overdue) using JavaScript to set the value directly
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const pastDateStr = pastDate.toISOString().slice(0, 16);
    await page.getByTestId("task-due-date-input").fill(pastDateStr);

    // Submit
    await page.getByTestId("create-task-button").click();

    // Wait for the task to appear
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 });

    // Find the task card in the todo column
    const todoColumn = page.getByTestId("column-todo");
    const taskCard = todoColumn.locator(`article:has-text("${taskName}")`);

    // Verify the red due date indicator is shown
    const dueDateIndicator = taskCard.locator("[data-testid^='due-date-']");
    await expect(dueDateIndicator).toBeVisible();
    await expect(dueDateIndicator).toHaveClass(/text-red-600/);
  });

  test("create task with due date within 24 hours shows orange indicator", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const taskName = `Urgent-Task-${timestamp}`;

    await page.goto("/");
    await expect(page.getByTestId("api-status")).toHaveText("healthy", {
      timeout: 10000,
    });

    // Open create task dialog
    await page.getByTestId("add-task-button").click();
    await expect(page.getByTestId("task-name-input")).toBeVisible();

    // Fill in task name
    await page.getByTestId("task-name-input").fill(taskName);

    // Set a due date within 24 hours (2 hours from now)
    const urgentDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const urgentDateStr = urgentDate.toISOString().slice(0, 16);
    await page.getByTestId("task-due-date-input").fill(urgentDateStr);

    // Submit
    await page.getByTestId("create-task-button").click();

    // Wait for the task to appear
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 });

    // Find the task card
    const todoColumn = page.getByTestId("column-todo");
    const taskCard = todoColumn.locator(`article:has-text("${taskName}")`);

    // Verify the orange due date indicator is shown
    const dueDateIndicator = taskCard.locator("[data-testid^='due-date-']");
    await expect(dueDateIndicator).toBeVisible();
    await expect(dueDateIndicator).toHaveClass(/text-orange-500/);
  });

  test("create task with due date more than 24 hours away shows no indicator", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const taskName = `Future-Task-${timestamp}`;

    await page.goto("/");
    await expect(page.getByTestId("api-status")).toHaveText("healthy", {
      timeout: 10000,
    });

    // Open create task dialog
    await page.getByTestId("add-task-button").click();
    await expect(page.getByTestId("task-name-input")).toBeVisible();

    // Fill in task name
    await page.getByTestId("task-name-input").fill(taskName);

    // Set a due date 48 hours from now
    const futureDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const futureDateStr = futureDate.toISOString().slice(0, 16);
    await page.getByTestId("task-due-date-input").fill(futureDateStr);

    // Submit
    await page.getByTestId("create-task-button").click();

    // Wait for the task to appear
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 });

    // Find the task card
    const todoColumn = page.getByTestId("column-todo");
    const taskCard = todoColumn.locator(`article:has-text("${taskName}")`);

    // Verify no due date indicator is shown
    await expect(taskCard.locator("[data-testid^='due-date-']")).not.toBeVisible();
  });

  test("create task without due date shows no indicator", async ({ page }) => {
    const timestamp = Date.now();
    const taskName = `No-Due-Date-Task-${timestamp}`;

    await page.goto("/");
    await expect(page.getByTestId("api-status")).toHaveText("healthy", {
      timeout: 10000,
    });

    // Open create task dialog
    await page.getByTestId("add-task-button").click();
    await expect(page.getByTestId("task-name-input")).toBeVisible();

    // Fill in task name only (no due date)
    await page.getByTestId("task-name-input").fill(taskName);

    // Submit without setting a due date
    await page.getByTestId("create-task-button").click();

    // Wait for the task to appear
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 });

    // Find the task card
    const todoColumn = page.getByTestId("column-todo");
    const taskCard = todoColumn.locator(`article:has-text("${taskName}")`);

    // Verify no due date indicator is shown
    await expect(taskCard.locator("[data-testid^='due-date-']")).not.toBeVisible();
  });
});
