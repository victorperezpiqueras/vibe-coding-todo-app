import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders footer with default backend URL', () => {
    render(<Footer />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'http://localhost:8000/docs')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays backend URL text without protocol', () => {
    render(<Footer />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('localhost:8000/docs')
    expect(link).not.toHaveTextContent('http://')
  })

  it('renders with custom backend URL', () => {
    render(<Footer backendUrl="http://example.com:3000/api" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'http://example.com:3000/api')
    expect(link).toHaveTextContent('example.com:3000/api')
  })

  it('has correct styling classes', () => {
    const { container } = render(<Footer />)
    
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('mt-auto')
    expect(footer).toHaveClass('border-t')
    expect(footer).toHaveClass('bg-white')
  })

  it('contains "Backend:" label', () => {
    render(<Footer />)
    expect(screen.getByText(/backend:/i)).toBeInTheDocument()
  })
})
