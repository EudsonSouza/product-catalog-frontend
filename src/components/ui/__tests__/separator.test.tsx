import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from '../separator'

describe('Separator', () => {
  describe('Rendering', () => {
    it('should render separator element', () => {
      const { container } = render(<Separator />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Separator />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-slot', 'separator')
    })

    it('should render with role="none" when decorative', () => {
      const { container } = render(<Separator />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('role', 'none')
    })
  })

  describe('Orientation', () => {
    it('should render horizontal by default', () => {
      const { container } = render(<Separator />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('should render horizontal separator with correct styles', () => {
      const { container } = render(<Separator orientation="horizontal" />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
      expect(separator).toHaveClass('data-[orientation=horizontal]:h-px')
      expect(separator).toHaveClass('data-[orientation=horizontal]:w-full')
    })

    it('should render vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })

    it('should render vertical separator with correct styles', () => {
      const { container } = render(<Separator orientation="vertical" />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('data-[orientation=vertical]:h-full')
      expect(separator).toHaveClass('data-[orientation=vertical]:w-px')
    })
  })

  describe('Decorative prop', () => {
    it('should be decorative by default (role="none")', () => {
      const { container } = render(<Separator />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('role', 'none')
    })

    it('should respect decorative=true (role="none")', () => {
      const { container } = render(<Separator decorative={true} />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('role', 'none')
    })

    it('should respect decorative=false (role="separator")', () => {
      const { container } = render(<Separator decorative={false} />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('role', 'separator')
    })
  })

  describe('Base styles', () => {
    it('should have base styling classes', () => {
      const { container } = render(<Separator />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('bg-border')
      expect(separator).toHaveClass('shrink-0')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Separator className="custom-separator" />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('custom-separator')
    })

    it('should merge custom className with default styles', () => {
      const { container } = render(<Separator className="my-4" />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('my-4')
      expect(separator).toHaveClass('bg-border')
    })

    it('should combine className with orientation', () => {
      const { container } = render(
        <Separator orientation="vertical" className="mx-2" />
      )
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('mx-2')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('Accessibility', () => {
    it('should have separator role when not decorative', () => {
      const { container } = render(<Separator decorative={false} />)
      const separator = container.querySelector('[role="separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should have role="none" when decorative', () => {
      const { container } = render(<Separator decorative={true} />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('role', 'none')
    })

    it('should be accessible when not decorative', () => {
      const { container } = render(<Separator decorative={false} />)
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('role', 'separator')
    })

    it('should support aria-label when not decorative', () => {
      const { container } = render(
        <Separator decorative={false} aria-label="Section divider" />
      )
      const separator = container.querySelector('[aria-label="Section divider"]')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Common use cases', () => {
    it('should work as content divider', () => {
      const { container } = render(
        <div>
          <p>Content above</p>
          <Separator />
          <p>Content below</p>
        </div>
      )
      expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument()
    })

    it('should work in flex layouts', () => {
      const { container } = render(
        <div style={{ display: 'flex' }}>
          <span>Item 1</span>
          <Separator orientation="vertical" className="mx-2" />
          <span>Item 2</span>
        </div>
      )
      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('Props forwarding', () => {
    it('should forward data attributes', () => {
      const { container } = render(<Separator data-testid="my-separator" />)
      const separator = container.querySelector('[data-testid="my-separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should forward id attribute', () => {
      const { container } = render(<Separator id="separator-1" />)
      const separator = container.querySelector('#separator-1')
      expect(separator).toBeInTheDocument()
    })
  })
})
