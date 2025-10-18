import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render with text content', () => {
      render(<Badge>New</Badge>)
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render as span element by default', () => {
      const { container } = render(<Badge>Badge</Badge>)
      const badge = container.firstChild
      expect(badge?.nodeName).toBe('SPAN')
    })

    it('should have data-slot attribute', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveAttribute('data-slot', 'badge')
    })
  })

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(<Badge variant="default">Default</Badge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-primary')
      expect(badge).toHaveClass('text-primary-foreground')
      expect(badge).toHaveClass('border-transparent')
    })

    it('should apply secondary variant styles', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('bg-secondary')
      expect(badge).toHaveClass('text-secondary-foreground')
      expect(badge).toHaveClass('border-transparent')
    })

    it('should apply destructive variant styles', () => {
      render(<Badge variant="destructive">Destructive</Badge>)
      const badge = screen.getByText('Destructive')
      expect(badge).toHaveClass('bg-destructive')
      expect(badge).toHaveClass('text-white')
      expect(badge).toHaveClass('border-transparent')
    })

    it('should apply outline variant styles', () => {
      render(<Badge variant="outline">Outline</Badge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('text-foreground')
    })

    it('should use default variant when no variant specified', () => {
      render(<Badge>Default Badge</Badge>)
      const badge = screen.getByText('Default Badge')
      expect(badge).toHaveClass('bg-primary')
    })
  })

  describe('asChild prop', () => {
    it('should render as child component when asChild is true', () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>
      )
      const link = screen.getByRole('link', { name: 'Link Badge' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/test')
    })

    it('should apply badge styles to child component', () => {
      render(
        <Badge asChild variant="secondary">
          <a href="/test">Link</a>
        </Badge>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveClass('bg-secondary')
      expect(link).toHaveClass('text-secondary-foreground')
    })

    it('should work with button as child', () => {
      render(
        <Badge asChild>
          <button>Button Badge</button>
        </Badge>
      )
      const button = screen.getByRole('button', { name: 'Button Badge' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('inline-flex')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<Badge className="custom-badge">Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveClass('custom-badge')
    })

    it('should merge custom className with default styles', () => {
      render(<Badge className="custom-badge">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('custom-badge')
      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('rounded-md')
    })

    it('should preserve custom className with variants', () => {
      render(<Badge className="custom-badge" variant="outline">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('custom-badge')
      expect(badge).toHaveClass('text-foreground')
    })
  })

  describe('Base styles', () => {
    it('should have base styling classes', () => {
      render(<Badge>Badge</Badge>)
      const badge = screen.getByText('Badge')

      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('items-center')
      expect(badge).toHaveClass('rounded-md')
      expect(badge).toHaveClass('border')
      expect(badge).toHaveClass('px-2')
      expect(badge).toHaveClass('text-xs')
      expect(badge).toHaveClass('font-medium')
    })

    it('should have w-fit class', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveClass('w-fit')
    })

    it('should have whitespace-nowrap class', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveClass('whitespace-nowrap')
    })

    it('should have shrink-0 class', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveClass('shrink-0')
    })

    it('should have transition styles', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveClass('transition-[color,box-shadow]')
    })

    it('should have overflow-hidden class', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge')).toHaveClass('overflow-hidden')
    })
  })

  describe('Content', () => {
    it('should render text content', () => {
      render(<Badge>Featured</Badge>)
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('should render with numbers', () => {
      render(<Badge>99+</Badge>)
      expect(screen.getByText('99+')).toBeInTheDocument()
    })

    it('should render with icons and text', () => {
      render(
        <Badge>
          <span>★</span> Featured
        </Badge>
      )
      expect(screen.getByText('Featured')).toBeInTheDocument()
      expect(screen.getByText('★')).toBeInTheDocument()
    })

    it('should render empty badge', () => {
      const { container } = render(<Badge />)
      const badge = container.firstChild
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('inline-flex')
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Badge aria-label="New item">New</Badge>)
      expect(screen.getByLabelText('New item')).toBeInTheDocument()
    })

    it('should support role attribute', () => {
      render(<Badge role="status">Status</Badge>)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should have focus-visible styles', () => {
      render(<Badge>Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('focus-visible:border-ring')
      expect(badge).toHaveClass('focus-visible:ring-ring/50')
    })

    it('should have aria-invalid styles', () => {
      render(<Badge aria-invalid="true">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('aria-invalid:border-destructive')
      expect(badge).toHaveClass('aria-invalid:ring-destructive/20')
    })
  })

  describe('Combination of props', () => {
    it('should combine variant and className', () => {
      render(<Badge variant="destructive" className="custom">Alert</Badge>)
      const badge = screen.getByText('Alert')
      expect(badge).toHaveClass('bg-destructive')
      expect(badge).toHaveClass('custom')
    })

    it('should work with all props together', () => {
      render(
        <Badge
          variant="secondary"
          className="my-badge"
          aria-label="Label"
        >
          Badge
        </Badge>
      )
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('bg-secondary')
      expect(badge).toHaveClass('my-badge')
      expect(badge).toHaveAttribute('aria-label', 'Label')
    })
  })
})
