import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import ItemDialog from './ItemDialog'

describe('ItemDialog', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockOnCreateTag = vi.fn()
  const mockTags = [
    { id: 1, name: 'Bug', color: 'red' },
    { id: 2, name: 'Feature', color: 'blue' },
  ]

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    availableTags: mockTags,
    onCreateTag: mockOnCreateTag,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when closed', () => {
    render(<ItemDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument()
  })

  it('renders create mode when item is null', () => {
    render(<ItemDialog {...defaultProps} />)
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-submit-button')).toHaveTextContent('Create Task')
  })

  it('renders edit mode when item is provided', () => {
    const item = {
      id: 1,
      name: 'Test Item',
      description: 'Test Description',
      tags: [{ id: 1, name: 'Bug', color: 'red' }],
    }
    render(<ItemDialog {...defaultProps} item={item} />)
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-submit-button')).toHaveTextContent('Save Changes')
    expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const backdrop = screen.getByTestId('dialog-backdrop')
    await user.click(backdrop)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const closeButton = screen.getByLabelText('Close dialog')
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const nameInput = screen.getByTestId('dialog-task-name-input')
    const descInput = screen.getByTestId('dialog-task-description-input')

    await user.type(nameInput, 'New Task')
    await user.type(descInput, 'New Description')

    const submitButton = screen.getByTestId('dialog-submit-button')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'New Task',
      description: 'New Description',
      tag_ids: [],
    })
  })

  it('does not submit with empty name', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const submitButton = screen.getByTestId('dialog-submit-button')
    await user.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('trims whitespace from name and description', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const nameInput = screen.getByTestId('dialog-task-name-input')
    const descInput = screen.getByTestId('dialog-task-description-input')

    await user.type(nameInput, '  Spaced Task  ')
    await user.type(descInput, '  Spaced Description  ')

    const submitButton = screen.getByTestId('dialog-submit-button')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Spaced Task',
      description: 'Spaced Description',
      tag_ids: [],
    })
  })

  it('passes undefined for empty description', async () => {
    const user = userEvent.setup()
    render(<ItemDialog {...defaultProps} />)

    const nameInput = screen.getByTestId('dialog-task-name-input')
    await user.type(nameInput, 'Task without description')

    const submitButton = screen.getByTestId('dialog-submit-button')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Task without description',
      description: undefined,
      tag_ids: [],
    })
  })

  it('clears form when dialog is closed and reopened', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ItemDialog {...defaultProps} />)

    const nameInput = screen.getByTestId('dialog-task-name-input')
    await user.type(nameInput, 'Temporary')

    // Close dialog
    rerender(<ItemDialog {...defaultProps} isOpen={false} />)

    // Reopen dialog
    rerender(<ItemDialog {...defaultProps} isOpen={true} />)

    expect(screen.getByTestId('dialog-task-name-input')).toHaveValue('')
  })
})
