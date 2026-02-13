import { test, expect } from '@playwright/test'

test.describe('Item Detail View and Edit', () => {
  test('view and edit task details through dialog', async ({ page }) => {
    const timestamp = Date.now()
    const taskName = `Detail-Test-Task-${timestamp}`
    const updatedTaskName = `Updated-${taskName}`
    const tagName = `Detail-Tag-${timestamp}`
    const newTagName = `New-Tag-${timestamp}`

    // Navigate to the application
    await page.goto('/')

    // Wait for the API to be healthy
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Create a task first
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-name-input').fill(taskName)
    await page.getByTestId('task-description-input').fill('Original description')

    // Create and add a tag
    await page.getByTestId('toggle-tags-button').click()
    await page.getByTestId('create-new-tag-button').click()
    await page.getByTestId('new-tag-name-input').fill(tagName)
    await page.getByTestId('create-tag-submit-button').click()

    // Wait for tag to be created and selected
    await expect(page.getByText(tagName)).toBeVisible()

    // Submit the task
    await page.getByTestId('create-task-button').click()

    // Wait for task to appear
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 })

    // Click on the task to open detail dialog
    const todoColumn = page.getByTestId('column-todo')
    const taskCard = todoColumn.getByTestId(/task-\d+/)
      .filter({ hasText: taskName })
      .first()
    await taskCard.click()

    // Verify detail dialog opens
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Task Details')).toBeVisible()

    // Verify all fields are displayed
    await expect(page.getByTestId('item-detail-name')).toHaveValue(taskName)
    await expect(page.getByTestId('item-detail-description')).toHaveValue('Original description')
    await expect(page.getByText(tagName)).toBeVisible()

    // Verify timestamps are displayed (not N/A)
    const createdTimestamp = page.getByTestId('item-detail-created')
    const updatedTimestamp = page.getByTestId('item-detail-updated')
    await expect(createdTimestamp).not.toHaveText('N/A')
    await expect(updatedTimestamp).not.toHaveText('N/A')

    // Edit the task name
    await page.getByTestId('item-detail-name').clear()
    await page.getByTestId('item-detail-name').fill(updatedTaskName)

    // Edit the description
    await page.getByTestId('item-detail-description').clear()
    await page.getByTestId('item-detail-description').fill('Updated description')

    // Add a new tag
    const dialog = page.getByRole('dialog')
    await dialog.getByTestId('toggle-tags-button').click()
    await dialog.getByTestId('create-new-tag-button').click()
    await dialog.getByTestId('new-tag-name-input').fill(newTagName)
    await dialog.getByTestId('create-tag-submit-button').click()

    // Wait for new tag to appear
    await expect(dialog.getByText(newTagName)).toBeVisible()

    // Save the changes
    await page.getByTestId('item-detail-save').click()

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })

    // Verify the task card shows updated information
    await expect(page.getByText(updatedTaskName)).toBeVisible()
    await expect(page.getByText('Updated description')).toBeVisible()
    await expect(page.getByText(tagName)).toBeVisible()
    await expect(page.getByText(newTagName)).toBeVisible()
  })

  test('close dialog with cancel button', async ({ page }) => {
    const timestamp = Date.now()
    const taskName = `Cancel-Test-${timestamp}`

    await page.goto('/')
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Create a simple task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-name-input').fill(taskName)
    await page.getByTestId('create-task-button').click()
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 })

    // Open detail dialog
    const taskCard = page.getByTestId('column-todo')
      .getByTestId(/task-\d+/)
      .filter({ hasText: taskName })
      .first()
    await taskCard.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Make some changes
    await page.getByTestId('item-detail-name').clear()
    await page.getByTestId('item-detail-name').fill('This should not save')

    // Click cancel
    await page.getByTestId('item-detail-cancel').click()

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })

    // Original task name should still be visible
    await expect(page.getByText(taskName)).toBeVisible()
    await expect(page.getByText('This should not save')).not.toBeVisible()
  })

  test('close dialog with ESC key', async ({ page }) => {
    const timestamp = Date.now()
    const taskName = `ESC-Test-${timestamp}`

    await page.goto('/')
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Create a simple task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-name-input').fill(taskName)
    await page.getByTestId('create-task-button').click()
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 })

    // Open detail dialog
    const taskCard = page.getByTestId('column-todo')
      .getByTestId(/task-\d+/)
      .filter({ hasText: taskName })
      .first()
    await taskCard.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Press ESC key
    await page.keyboard.press('Escape')

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
  })

  test('close dialog by clicking backdrop', async ({ page }) => {
    const timestamp = Date.now()
    const taskName = `Backdrop-Test-${timestamp}`

    await page.goto('/')
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Create a simple task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-name-input').fill(taskName)
    await page.getByTestId('create-task-button').click()
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 })

    // Open detail dialog
    const taskCard = page.getByTestId('column-todo')
      .getByTestId(/task-\d+/)
      .filter({ hasText: taskName })
      .first()
    await taskCard.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Click on backdrop (parent of dialog)
    await page.locator('[role="dialog"]').click({ position: { x: 0, y: 0 }, force: true })

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
  })

  test('show error when saving with empty name', async ({ page }) => {
    const timestamp = Date.now()
    const taskName = `Validation-Test-${timestamp}`

    await page.goto('/')
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Create a simple task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-name-input').fill(taskName)
    await page.getByTestId('create-task-button').click()
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 })

    // Open detail dialog
    const taskCard = page.getByTestId('column-todo')
      .getByTestId(/task-\d+/)
      .filter({ hasText: taskName })
      .first()
    await taskCard.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Clear the name field
    await page.getByTestId('item-detail-name').clear()

    // Try to save
    await page.getByTestId('item-detail-save').click()

    // Error should be displayed
    await expect(page.getByText('Name is required')).toBeVisible()

    // Dialog should still be open
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('delete button should not open dialog', async ({ page }) => {
    const timestamp = Date.now()
    const taskName = `Delete-Test-${timestamp}`

    await page.goto('/')
    await expect(page.getByTestId('api-status')).toHaveText('healthy', { timeout: 10000 })

    // Create a simple task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-name-input').fill(taskName)
    await page.getByTestId('create-task-button').click()
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 })

    // Hover over task to show delete button
    const taskCard = page.getByTestId('column-todo')
      .getByTestId(/task-\d+/)
      .filter({ hasText: taskName })
      .first()
    await taskCard.hover()

    // Click delete button
    const deleteButton = taskCard.getByTestId(/delete-task-\d+/)
    await deleteButton.click()

    // Dialog should not open
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Task should be deleted
    await expect(page.getByText(taskName)).not.toBeVisible({ timeout: 5000 })
  })
})
