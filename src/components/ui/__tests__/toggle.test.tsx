import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from '../toggle'

describe('Toggle', () => {
  describe('Rendering', () => {
    it('should render toggle button', () => {
      render(<Toggle>Toggle me</Toggle>)
      expect(screen.getByRole('button', { name: 'Toggle me' })).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(<Toggle>Toggle</Toggle>)
      expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'toggle')
    })

    it('should render with aria-pressed attribute', () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveAttribute('aria-pressed')
    })
  })

  describe('Toggle State', () => {
    it('should be unpressed by default', () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
      expect(toggle).toHaveAttribute('data-state', 'off')
    })

    it('should toggle state on click', async () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')

      // Initial state: off
      expect(toggle).toHaveAttribute('data-state', 'off')

      // Click to turn on
      await userEvent.click(toggle)
      expect(toggle).toHaveAttribute('data-state', 'on')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')

      // Click to turn off
      await userEvent.click(toggle)
      expect(toggle).toHaveAttribute('data-state', 'off')
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
    })

    it('should start pressed when defaultPressed is true', () => {
      render(<Toggle defaultPressed>Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveAttribute('data-state', 'on')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
    })

    it('should be controlled with pressed prop', () => {
      const { rerender } = render(<Toggle pressed={false}>Toggle</Toggle>)
      const toggle = screen.getByRole('button')

      expect(toggle).toHaveAttribute('data-state', 'off')

      rerender(<Toggle pressed={true}>Toggle</Toggle>)
      expect(toggle).toHaveAttribute('data-state', 'on')
    })
  })

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(<Toggle variant="default">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('bg-transparent')
    })

    it('should apply outline variant styles', () => {
      render(<Toggle variant="outline">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('border')
      expect(toggle).toHaveClass('border-input')
      expect(toggle).toHaveClass('shadow-xs')
    })

    it('should apply pressed state styles', async () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')

      await userEvent.click(toggle)

      expect(toggle).toHaveClass('data-[state=on]:bg-accent')
      expect(toggle).toHaveClass('data-[state=on]:text-accent-foreground')
    })
  })

  describe('Sizes', () => {
    it('should apply default size styles', () => {
      render(<Toggle size="default">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('h-9')
      expect(toggle).toHaveClass('px-2')
      expect(toggle).toHaveClass('min-w-9')
    })

    it('should apply small size styles', () => {
      render(<Toggle size="sm">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('h-8')
      expect(toggle).toHaveClass('px-1.5')
      expect(toggle).toHaveClass('min-w-8')
    })

    it('should apply large size styles', () => {
      render(<Toggle size="lg">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('h-10')
      expect(toggle).toHaveClass('px-2.5')
      expect(toggle).toHaveClass('min-w-10')
    })
  })

  describe('Interactions', () => {
    it('should call onPressedChange when toggled', async () => {
      const handleChange = vi.fn()
      render(<Toggle onPressedChange={handleChange}>Toggle</Toggle>)

      const toggle = screen.getByRole('button')
      await userEvent.click(toggle)

      expect(handleChange).toHaveBeenCalledWith(true)

      await userEvent.click(toggle)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should not toggle when disabled', async () => {
      const handleChange = vi.fn()
      render(<Toggle disabled onPressedChange={handleChange}>Toggle</Toggle>)

      const toggle = screen.getByRole('button')
      await userEvent.click(toggle)

      expect(handleChange).not.toHaveBeenCalled()
      expect(toggle).toHaveAttribute('data-state', 'off')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Toggle disabled>Toggle</Toggle>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should have disabled styles', () => {
      render(<Toggle disabled>Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('disabled:opacity-50')
      expect(toggle).toHaveClass('disabled:pointer-events-none')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<Toggle className="custom-toggle">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('custom-toggle')
    })

    it('should merge custom className with default styles', () => {
      render(<Toggle className="custom-class">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('custom-class')
      expect(toggle).toHaveClass('inline-flex')
      expect(toggle).toHaveClass('rounded-md')
    })

    it('should combine className with variants', () => {
      render(<Toggle variant="outline" className="custom">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('custom')
      expect(toggle).toHaveClass('border')
    })
  })

  describe('Base styles', () => {
    it('should have base styling classes', () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')

      expect(toggle).toHaveClass('inline-flex')
      expect(toggle).toHaveClass('items-center')
      expect(toggle).toHaveClass('justify-center')
      expect(toggle).toHaveClass('rounded-md')
      expect(toggle).toHaveClass('text-sm')
      expect(toggle).toHaveClass('font-medium')
    })

    it('should have hover styles', () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('hover:bg-muted')
      expect(toggle).toHaveClass('hover:text-muted-foreground')
    })

    it('should have focus-visible styles', () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('focus-visible:ring-ring/50')
      expect(toggle).toHaveClass('outline-none')
    })

    it('should have transition styles', () => {
      render(<Toggle>Toggle</Toggle>)
      expect(screen.getByRole('button')).toHaveClass('transition-[color,box-shadow]')
    })

    it('should have whitespace-nowrap', () => {
      render(<Toggle>Toggle</Toggle>)
      expect(screen.getByRole('button')).toHaveClass('whitespace-nowrap')
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Toggle>Toggle</Toggle>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Toggle aria-label="Toggle feature">Toggle</Toggle>)
      expect(screen.getByRole('button', { name: 'Toggle feature' })).toBeInTheDocument()
    })

    it('should update aria-pressed when toggled', async () => {
      render(<Toggle>Toggle</Toggle>)
      const toggle = screen.getByRole('button')

      expect(toggle).toHaveAttribute('aria-pressed', 'false')

      await userEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
    })

    it('should have aria-invalid styles', () => {
      render(<Toggle aria-invalid="true">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('aria-invalid:border-destructive')
    })
  })

  describe('Use cases', () => {
    it('should work as a simple toggle', async () => {
      render(<Toggle>Bold</Toggle>)
      const toggle = screen.getByRole('button', { name: 'Bold' })

      expect(toggle).toHaveAttribute('data-state', 'off')
      await userEvent.click(toggle)
      expect(toggle).toHaveAttribute('data-state', 'on')
    })

    it('should work with icons', () => {
      render(
        <Toggle>
          <span>★</span> Favorite
        </Toggle>
      )
      expect(screen.getByText('★')).toBeInTheDocument()
      expect(screen.getByText('Favorite')).toBeInTheDocument()
    })

    it('should work in toolbar', () => {
      render(
        <div role="toolbar">
          <Toggle>Bold</Toggle>
          <Toggle>Italic</Toggle>
          <Toggle>Underline</Toggle>
        </div>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })
  })

  describe('Combination of props', () => {
    it('should combine variant and size', () => {
      render(<Toggle variant="outline" size="lg">Toggle</Toggle>)
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveClass('border')
      expect(toggle).toHaveClass('h-10')
    })

    it('should work with all props', async () => {
      const handleChange = vi.fn()
      render(
        <Toggle
          variant="outline"
          size="sm"
          className="custom"
          onPressedChange={handleChange}
          defaultPressed
        >
          Toggle
        </Toggle>
      )
      const toggle = screen.getByRole('button')

      expect(toggle).toHaveAttribute('data-state', 'on')
      expect(toggle).toHaveClass('border')
      expect(toggle).toHaveClass('h-8')
      expect(toggle).toHaveClass('custom')

      await userEvent.click(toggle)
      expect(handleChange).toHaveBeenCalledWith(false)
    })
  })
})
