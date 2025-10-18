import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with content', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild
      expect(card).toHaveAttribute('data-slot', 'card')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('shadow-sm')
      expect(card).toHaveClass('flex')
      expect(card).toHaveClass('flex-col')
    })

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
      expect(card).toHaveClass('rounded-xl')
    })

    it('should support all div attributes', () => {
      const { container } = render(
        <Card id="card-1" data-testid="test-card">
          Content
        </Card>
      )
      const card = container.firstChild
      expect(card).toHaveAttribute('id', 'card-1')
      expect(card).toHaveAttribute('data-testid', 'test-card')
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.firstChild
      expect(header).toHaveAttribute('data-slot', 'card-header')
    })

    it('should have grid layout classes', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.firstChild
      expect(header).toHaveClass('grid')
      expect(header).toHaveClass('px-6')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardHeader className="custom">Header</CardHeader>)
      const header = container.firstChild
      expect(header).toHaveClass('custom')
      expect(header).toHaveClass('grid')
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(<CardTitle>Card Title</CardTitle>)
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.firstChild
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })

    it('should have title styling classes', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.firstChild
      expect(title).toHaveClass('font-semibold')
      expect(title).toHaveClass('leading-none')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardTitle className="text-2xl">Title</CardTitle>)
      const title = container.firstChild
      expect(title).toHaveClass('text-2xl')
      expect(title).toHaveClass('font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(<CardDescription>Card description text</CardDescription>)
      expect(screen.getByText('Card description text')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.firstChild
      expect(description).toHaveAttribute('data-slot', 'card-description')
    })

    it('should have description styling classes', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.firstChild
      expect(description).toHaveClass('text-muted-foreground')
      expect(description).toHaveClass('text-sm')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardDescription className="custom">Desc</CardDescription>)
      const description = container.firstChild
      expect(description).toHaveClass('custom')
      expect(description).toHaveClass('text-sm')
    })
  })

  describe('CardAction', () => {
    it('should render card action', () => {
      render(<CardAction>Action button</CardAction>)
      expect(screen.getByText('Action button')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<CardAction>Action</CardAction>)
      const action = container.firstChild
      expect(action).toHaveAttribute('data-slot', 'card-action')
    })

    it('should have action positioning classes', () => {
      const { container } = render(<CardAction>Action</CardAction>)
      const action = container.firstChild
      expect(action).toHaveClass('col-start-2')
      expect(action).toHaveClass('row-span-2')
      expect(action).toHaveClass('justify-self-end')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardAction className="custom">Action</CardAction>)
      const action = container.firstChild
      expect(action).toHaveClass('custom')
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Content text</CardContent>)
      expect(screen.getByText('Content text')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.firstChild
      expect(content).toHaveAttribute('data-slot', 'card-content')
    })

    it('should have content padding classes', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.firstChild
      expect(content).toHaveClass('px-6')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardContent className="py-4">Content</CardContent>)
      const content = container.firstChild
      expect(content).toHaveClass('py-4')
      expect(content).toHaveClass('px-6')
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
    })

    it('should have footer styling classes', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('px-6')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardFooter className="justify-end">Footer</CardFooter>)
      const footer = container.firstChild
      expect(footer).toHaveClass('justify-end')
      expect(footer).toHaveClass('flex')
    })
  })

  describe('Complete Card Composition', () => {
    it('should render all card sections together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should render card with header and action', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('should render card with only content', () => {
      render(
        <Card>
          <CardContent>Simple content</CardContent>
        </Card>
      )

      expect(screen.getByText('Simple content')).toBeInTheDocument()
    })

    it('should render card without header', () => {
      render(
        <Card>
          <CardContent>Content without header</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Content without header')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should render card with custom classes on all sections', () => {
      const { container } = render(
        <Card className="card-custom">
          <CardHeader className="header-custom">
            <CardTitle className="title-custom">Title</CardTitle>
          </CardHeader>
          <CardContent className="content-custom">Content</CardContent>
          <CardFooter className="footer-custom">Footer</CardFooter>
        </Card>
      )

      expect(container.querySelector('.card-custom')).toBeInTheDocument()
      expect(container.querySelector('.header-custom')).toBeInTheDocument()
      expect(container.querySelector('.title-custom')).toBeInTheDocument()
      expect(container.querySelector('.content-custom')).toBeInTheDocument()
      expect(container.querySelector('.footer-custom')).toBeInTheDocument()
    })

    it('should maintain proper DOM structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      const card = container.querySelector('[data-slot="card"]')
      const header = container.querySelector('[data-slot="card-header"]')
      const title = container.querySelector('[data-slot="card-title"]')
      const content = container.querySelector('[data-slot="card-content"]')

      expect(card).toContainElement(header)
      expect(header).toContainElement(title)
      expect(card).toContainElement(content)
    })
  })

  describe('Edge Cases', () => {
    it('should render empty card', () => {
      const { container } = render(<Card />)
      const card = container.firstChild
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-xl')
    })

    it('should render card with complex children', () => {
      render(
        <Card>
          <CardContent>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
    })

    it('should handle multiple CardContent sections', () => {
      render(
        <Card>
          <CardContent>Content 1</CardContent>
          <CardContent>Content 2</CardContent>
        </Card>
      )

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })
})
