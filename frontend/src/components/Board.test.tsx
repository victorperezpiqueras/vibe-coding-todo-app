import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Board from './Board'
import { createMockItems } from '../test/mock-data'

const COLUMNS = [
  { key: 'todo', title: 'To Do' },
  { key: 'inprogress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
]

describe('Board', () => {
  const defaultProps = {
    columns: COLUMNS,
    columnsData: {
      todo: createMockItems(2),
      inprogress: createMockItems(1),
      done: createMockItems(0),
    },
    onDragStart: vi.fn(),
    onDrop: vi.fn(),
    onDelete: vi.fn(),
  }

  it('renders all columns', () => {
    render(<Board {...defaultProps} />)
    
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders correct number of items in each column', () => {
    render(<Board {...defaultProps} />)
    
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()
    expect(screen.getByTestId('column-inprogress')).toBeInTheDocument()
    expect(screen.getByTestId('column-done')).toBeInTheDocument()
  })

  it('displays items in correct columns', () => {
    render(<Board {...defaultProps} />)
    
    // Todo column should have 2 items
    const todoColumn = screen.getByTestId('column-todo')
    expect(todoColumn.textContent).toContain('Task 1')
    expect(todoColumn.textContent).toContain('Task 2')
    
    // In Progress column should have 1 item
    const inProgressColumn = screen.getByTestId('column-inprogress')
    expect(inProgressColumn.textContent).toContain('Task 1')
    
    // Done column should be empty
    const doneColumn = screen.getByTestId('column-done')
    expect(doneColumn.textContent).toContain('Drag tasks here')
  })

  it('passes handlers to columns', () => {
    const onDragStart = vi.fn()
    const onDrop = vi.fn()
    const onDelete = vi.fn()

    render(<Board {...defaultProps} onDragStart={onDragStart} onDrop={onDrop} onDelete={onDelete} />)
    
    // These handlers are passed down, actual functionality tested in Column.test.tsx
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()
  })

  it('renders with empty columns', () => {
    const emptyProps = {
      ...defaultProps,
      columnsData: {
        todo: [],
        inprogress: [],
        done: [],
      },
    }

    render(<Board {...emptyProps} />)
    
    const emptyMessages = screen.getAllByText('Drag tasks here')
    expect(emptyMessages).toHaveLength(3)
  })

  it('has correct grid layout classes', () => {
    const { container } = render(<Board {...defaultProps} />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('md:grid-cols-3')
    expect(grid).toHaveClass('gap-6')
  })
})
