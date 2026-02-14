import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Column from './Column'
import { createMockItems } from '../test/mock-data'
import type { ColumnKey } from '../types'

describe('Column', () => {
  const defaultProps = {
    columnKey: 'todo' as ColumnKey,
    title: 'To Do',
    items: createMockItems(2),
    onDragStart: vi.fn(),
    onDrop: vi.fn(),
    onDelete: vi.fn(),
  }

  it('renders column with title', () => {
    render(<Column {...defaultProps} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('displays item count', () => {
    render(<Column {...defaultProps} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(<Column {...defaultProps} />)
    
    defaultProps.items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    })
  })

  it('displays empty state when no items', () => {
    render(<Column {...defaultProps} items={[]} />)
    expect(screen.getByText('Drag tasks here')).toBeInTheDocument()
  })

  it('displays 0 count when no items', () => {
    render(<Column {...defaultProps} items={[]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('has correct test id', () => {
    render(<Column {...defaultProps} />)
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()
  })

  it('renders different columns correctly', () => {
    const { rerender } = render(<Column {...defaultProps} />)
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()

    rerender(<Column {...defaultProps} columnKey="inprogress" title="In Progress" />)
    expect(screen.getByTestId('column-inprogress')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()

    rerender(<Column {...defaultProps} columnKey="done" title="Done" />)
    expect(screen.getByTestId('column-done')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onDelete when task delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(<Column {...defaultProps} onDelete={onDelete} />)

    const deleteButton = screen.getByTestId(`delete-task-${defaultProps.items[0].id}`)
    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(defaultProps.items[0].id)
  })

  it('handles drop event', () => {
    const onDrop = vi.fn()
    render(<Column {...defaultProps} onDrop={onDrop} />)

    const dropZone = screen.getByTestId('column-todo').querySelector('.p-3')
    expect(dropZone).toBeInTheDocument()

    if (dropZone) {
      const dropEvent = new Event('drop', { bubbles: true })
      dropZone.dispatchEvent(dropEvent)

      expect(onDrop).toHaveBeenCalledTimes(1)
      expect(onDrop).toHaveBeenCalledWith(expect.any(Object), 'todo')
    }
  })

  it('allows drag over', () => {
    render(<Column {...defaultProps} />)

    const dropZone = screen.getByTestId('column-todo').querySelector('.p-3')
    expect(dropZone).toBeInTheDocument()

    if (dropZone) {
      const dragOverEvent = new Event('dragover', { 
        bubbles: true,
        cancelable: true 
      })
      const preventDefaultSpy = vi.spyOn(dragOverEvent, 'preventDefault')
      
      dropZone.dispatchEvent(dragOverEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
    }
  })
})
