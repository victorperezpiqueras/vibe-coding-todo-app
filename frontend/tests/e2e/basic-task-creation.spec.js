import { test, expect } from '@playwright/test'

test.describe('Basic Task Creation', () => {
  test('create one task with one label in one column', async ({ page }) => {
    // Navigate to the application
    await page.goto('/')

    // Wait for the page to load and API to be healthy
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Click the "Add new task" button
    await page.getByTestId('add-task-button').click()

    // Wait for the form to appear
    await expect(page.getByTestId('task-name-input')).toBeVisible()

    // Fill in the task name
    await page.getByTestId('task-name-input').fill('My Test Task')

    // Fill in the task description
    await page.getByTestId('task-description-input').fill('This is a test task created by e2e test')

    // Create a new tag by clicking the tag selector dropdown
    await page.getByRole('combobox').click()

    // Click the "Create new tag" button in the dropdown
    await page.getByText('Create new tag').click()

    // Wait for tag creation dialog to appear
    await expect(page.getByPlaceholderText('Tag name')).toBeVisible()

    // Fill in tag details
    await page.getByPlaceholderText('Tag name').fill('E2E Test')

    // Click the create tag button in the dialog
    await page.getByRole('button', { name: 'Create' }).click()

    // Wait for the tag to be created and appear in the list
    await page.waitForTimeout(500)

    // Select the newly created tag
    await page.getByRole('combobox').click()
    await page.getByText('E2E Test').click()

    // Submit the task creation form
    await page.getByTestId('create-task-button').click()

    // Wait for the task to appear in the To Do column
    await expect(page.getByText('My Test Task')).toBeVisible({ timeout: 5000 })

    // Verify the task is in the To Do column
    const todoColumn = page.getByTestId('column-todo')
    await expect(todoColumn.getByText('My Test Task')).toBeVisible()

    // Verify the tag is displayed on the task
    await expect(todoColumn.getByText('E2E Test')).toBeVisible()

    // Verify the task description is visible
    await expect(todoColumn.getByText('This is a test task created by e2e test')).toBeVisible()

    // Verify the column counter shows 1 item
    const columnHeader = todoColumn.locator('div').filter({ hasText: 'To Do' }).first()
    await expect(columnHeader).toContainText('1')
  })
})
