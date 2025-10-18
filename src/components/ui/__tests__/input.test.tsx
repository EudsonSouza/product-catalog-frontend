import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(<Input aria-label="test input" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('data-slot', 'input')
    })

    it('should render as textbox role by default', () => {
      render(<Input aria-label="test input" />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Input types', () => {
    it('should support text type', () => {
      render(<Input type="text" aria-label="text input" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })

    it('should support email type', () => {
      render(<Input type="email" placeholder="Email" />)
      const input = screen.getByPlaceholderText('Email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should support password type', () => {
      render(<Input type="password" placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should support number type', () => {
      render(<Input type="number" placeholder="Number" />)
      const input = screen.getByPlaceholderText('Number')
      expect(input).toHaveAttribute('type', 'number')
    })

    it('should support search type', () => {
      render(<Input type="search" placeholder="Search" />)
      const input = screen.getByPlaceholderText('Search')
      expect(input).toHaveAttribute('type', 'search')
    })

    it('should support tel type', () => {
      render(<Input type="tel" placeholder="Phone" />)
      const input = screen.getByPlaceholderText('Phone')
      expect(input).toHaveAttribute('type', 'tel')
    })

    it('should support url type', () => {
      render(<Input type="url" placeholder="URL" />)
      const input = screen.getByPlaceholderText('URL')
      expect(input).toHaveAttribute('type', 'url')
    })
  })

  describe('Placeholder', () => {
    it('should display placeholder text', () => {
      render(<Input placeholder="Enter your name" />)
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    it('should have placeholder styles', () => {
      render(<Input placeholder="Placeholder" />)
      const input = screen.getByPlaceholderText('Placeholder')
      expect(input).toHaveClass('placeholder:text-muted-foreground')
    })
  })

  describe('Value and onChange', () => {
    it('should handle value changes', async () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} aria-label="test input" />)

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')

      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('test')
    })

    it('should display controlled value', () => {
      render(<Input value="controlled value" onChange={vi.fn()} aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveValue('controlled value')
    })

    it('should clear value', async () => {
      render(<Input defaultValue="initial" aria-label="test" />)
      const input = screen.getByRole('textbox')

      await userEvent.clear(input)
      expect(input).toHaveValue('')
    })
  })

  describe('Disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled aria-label="test" />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should have disabled styles', () => {
      render(<Input disabled aria-label="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('disabled:opacity-50')
      expect(input).toHaveClass('disabled:pointer-events-none')
    })

    it('should not accept input when disabled', async () => {
      render(<Input disabled aria-label="test" />)
      const input = screen.getByRole('textbox')

      await userEvent.type(input, 'test')
      expect(input).toHaveValue('')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<Input className="custom-class" aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveClass('custom-class')
    })

    it('should merge custom className with default styles', () => {
      render(<Input className="custom-class" aria-label="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
      expect(input).toHaveClass('rounded-md')
      expect(input).toHaveClass('border')
    })
  })

  describe('Base styles', () => {
    it('should have base styling classes', () => {
      render(<Input aria-label="test" />)
      const input = screen.getByRole('textbox')

      expect(input).toHaveClass('h-9')
      expect(input).toHaveClass('w-full')
      expect(input).toHaveClass('rounded-md')
      expect(input).toHaveClass('border')
      expect(input).toHaveClass('px-3')
    })

    it('should have focus styles', () => {
      render(<Input aria-label="test" />)
      const input = screen.getByRole('textbox')

      expect(input).toHaveClass('focus-visible:border-ring')
      expect(input).toHaveClass('outline-none')
    })

    it('should have transition styles', () => {
      render(<Input aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveClass('transition-[color,box-shadow]')
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Input aria-label="Username input" />)
      expect(screen.getByRole('textbox', { name: 'Username input' })).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(
        <>
          <Input aria-describedby="help-text" aria-label="test" />
          <span id="help-text">Help text</span>
        </>
      )
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('should support aria-invalid', () => {
      render(<Input aria-invalid="true" aria-label="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have error styles when aria-invalid', () => {
      render(<Input aria-invalid="true" aria-label="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('aria-invalid:border-destructive')
      expect(input).toHaveClass('aria-invalid:ring-destructive/20')
    })

    it('should support required attribute', () => {
      render(<Input required aria-label="test" />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })
  })

  describe('HTML attributes', () => {
    it('should support name attribute', () => {
      render(<Input name="username" aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username')
    })

    it('should support id attribute', () => {
      render(<Input id="email-input" aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-input')
    })

    it('should support maxLength attribute', () => {
      render(<Input maxLength={10} aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10')
    })

    it('should support min and max for number inputs', () => {
      render(<Input type="number" min={0} max={100} aria-label="test" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
    })

    it('should support pattern attribute', () => {
      render(<Input pattern="[0-9]*" aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[0-9]*')
    })

    it('should support autoComplete attribute', () => {
      render(<Input autoComplete="email" aria-label="test" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('autoComplete', 'email')
    })
  })

  describe('Focus behavior', () => {
    it('should be focusable', async () => {
      render(<Input aria-label="test" />)
      const input = screen.getByRole('textbox')

      input.focus()
      expect(input).toHaveFocus()
    })

    it('should not be focusable when disabled', () => {
      render(<Input disabled aria-label="test" />)
      const input = screen.getByRole('textbox')

      input.focus()
      expect(input).not.toHaveFocus()
    })
  })
})
