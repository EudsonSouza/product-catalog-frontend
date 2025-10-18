import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '../product-card'
import { Product, Gender } from '@/lib/types'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product description for testing purposes',
  basePrice: 99.99,
  categoryId: 'cat-1',
  categoryName: 'Electronics',
  gender: Gender.UNISEX,
  isFeatured: true,
  isActive: true,
  images: ['https://example.com/image.jpg'],
  slug: 'test-product',
  createdAt: new Date('2024-01-15').toISOString(),
}

describe('ProductCard', () => {
  describe('Rendering', () => {
    it('should render product card', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should render product name', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Product')
    })

    it('should render product description', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText(/test product description/i)).toBeInTheDocument()
    })

    it('should render product price', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('$ 99.99')).toBeInTheDocument()
    })

    it('should render category badge', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Electronics')).toBeInTheDocument()
    })

    it('should render gender badge', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Unisex')).toBeInTheDocument()
    })
  })

  describe('Product Image', () => {
    it('should render product image with correct src', () => {
      render(<ProductCard product={mockProduct} />)
      const image = screen.getByAltText('Test Product')
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('should use fallback image when no images provided', () => {
      const productNoImage = { ...mockProduct, images: [] }
      render(<ProductCard product={productNoImage} />)
      const image = screen.getByAltText('Test Product')
      expect(image).toHaveAttribute('src')
    })

    it('should use fallback image when images array is undefined', () => {
      const productNoImage = { ...mockProduct, images: undefined as any }
      render(<ProductCard product={productNoImage} />)
      const image = screen.getByAltText('Test Product')
      expect(image).toHaveAttribute('src')
    })

    it('should have lazy loading attribute', () => {
      render(<ProductCard product={mockProduct} />)
      const image = screen.getByAltText('Test Product')
      expect(image).toHaveAttribute('loading', 'lazy')
    })

    it('should have correct image alt text', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByAltText('Test Product')).toBeInTheDocument()
    })
  })

  describe('Featured Badge', () => {
    it('should show featured badge for featured products', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('should not show featured badge for non-featured products', () => {
      const nonFeaturedProduct = { ...mockProduct, isFeatured: false }
      render(<ProductCard product={nonFeaturedProduct} />)
      expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    })
  })

  describe('Favorite Button', () => {
    it('should render favorite button', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByRole('button', { name: /favorite/i })).toBeInTheDocument()
    })

    it('should call onFavoriteClick when favorite button is clicked', async () => {
      const handleFavorite = vi.fn()
      render(<ProductCard product={mockProduct} onFavoriteClick={handleFavorite} />)

      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      await userEvent.click(favoriteButton)

      expect(handleFavorite).toHaveBeenCalledWith('1')
      expect(handleFavorite).toHaveBeenCalledTimes(1)
    })

    it('should not crash when onFavoriteClick is not provided', async () => {
      render(<ProductCard product={mockProduct} />)

      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      await userEvent.click(favoriteButton)

      // Should not throw
      expect(favoriteButton).toBeInTheDocument()
    })

    it('should have accessible label', () => {
      render(<ProductCard product={mockProduct} />)
      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      expect(favoriteButton).toHaveAttribute('aria-label')
    })
  })

  describe('WhatsApp Contact Button', () => {
    it('should render contact button', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
    })

    it('should have correct WhatsApp URL', () => {
      render(<ProductCard product={mockProduct} />)
      const link = screen.getByRole('link', { name: /whatsapp/i })
      expect(link).toHaveAttribute('href')
      expect(link.getAttribute('href')).toContain('wa.me')
      expect(link.getAttribute('href')).toContain('Test%20Product')
    })

    it('should open in new tab', () => {
      render(<ProductCard product={mockProduct} />)
      const link = screen.getByRole('link', { name: /whatsapp/i })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should be full width', () => {
      render(<ProductCard product={mockProduct} />)
      const button = screen.getByRole('link', { name: /whatsapp/i })
      expect(button).toHaveClass('w-full')
    })
  })

  describe('Gender Display', () => {
    it('should display male gender correctly', () => {
      const maleProduct = { ...mockProduct, gender: Gender.MALE }
      render(<ProductCard product={maleProduct} />)
      expect(screen.getByText('Male')).toBeInTheDocument()
    })

    it('should display female gender correctly', () => {
      const femaleProduct = { ...mockProduct, gender: Gender.FEMALE }
      render(<ProductCard product={femaleProduct} />)
      expect(screen.getByText('Female')).toBeInTheDocument()
    })

    it('should display unisex gender correctly', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Unisex')).toBeInTheDocument()
    })
  })

  describe('Price Formatting', () => {
    it('should format price with currency symbol', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('$ 99.99')).toBeInTheDocument()
    })

    it('should format large prices correctly', () => {
      const expensiveProduct = { ...mockProduct, basePrice: 1999.99 }
      render(<ProductCard product={expensiveProduct} />)
      expect(screen.getByText('$ 1999.99')).toBeInTheDocument()
    })

    it('should format small prices correctly', () => {
      const cheapProduct = { ...mockProduct, basePrice: 9.99 }
      render(<ProductCard product={cheapProduct} />)
      expect(screen.getByText('$ 9.99')).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<ProductCard product={mockProduct} className="custom-class" />)
      const card = container.querySelector('.custom-class')
      expect(card).toBeInTheDocument()
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<ProductCard product={mockProduct} className="my-custom" />)
      const card = container.querySelector('.my-custom')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('group')
      expect(card).toHaveClass('overflow-hidden')
    })
  })

  describe('Card Structure', () => {
    it('should have card header', () => {
      const { container } = render(<ProductCard product={mockProduct} />)
      expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
    })

    it('should have card content', () => {
      const { container } = render(<ProductCard product={mockProduct} />)
      expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
    })

    it('should have card footer', () => {
      const { container } = render(<ProductCard product={mockProduct} />)
      expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
    })
  })

  describe('Long Content Handling', () => {
    it('should handle long product names', () => {
      const longNameProduct = {
        ...mockProduct,
        name: 'This is a very long product name that should be truncated with ellipsis',
      }
      render(<ProductCard product={longNameProduct} />)
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveClass('line-clamp-1')
    })

    it('should handle long descriptions', () => {
      const longDescProduct = {
        ...mockProduct,
        description: 'This is a very long description that should be clamped to two lines maximum and show ellipsis at the end when it overflows the container',
      }
      render(<ProductCard product={longDescProduct} />)
      const description = screen.getByText(/very long description/i)
      expect(description).toHaveClass('line-clamp-2')
    })

    it('should handle long category names', () => {
      const longCategoryProduct = {
        ...mockProduct,
        categoryName: 'Very Long Category Name',
      }
      render(<ProductCard product={longCategoryProduct} />)
      expect(screen.getByText('Very Long Category Name')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero price', () => {
      const freeProduct = { ...mockProduct, basePrice: 0 }
      render(<ProductCard product={freeProduct} />)
      expect(screen.getByText('$ 0.00')).toBeInTheDocument()
    })

    it('should handle empty description', () => {
      const noDescProduct = { ...mockProduct, description: '' }
      render(<ProductCard product={noDescProduct} />)
      // Should render card without description text
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    it('should handle special characters in product name', () => {
      const specialProduct = { ...mockProduct, name: 'Product & "Special" <Chars>' }
      render(<ProductCard product={specialProduct} />)
      expect(screen.getByText(/Product & "Special" <Chars>/)).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive text sizes', () => {
      render(<ProductCard product={mockProduct} />)
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveClass('text-sm')
      expect(heading).toHaveClass('md:text-base')
    })

    it('should have responsive description text', () => {
      render(<ProductCard product={mockProduct} />)
      const description = screen.getByText(/test product description/i)
      expect(description).toHaveClass('text-xs')
      expect(description).toHaveClass('md:text-sm')
    })

    it('should have responsive price text', () => {
      render(<ProductCard product={mockProduct} />)
      const price = screen.getByText('$ 99.99')
      expect(price).toHaveClass('text-base')
      expect(price).toHaveClass('md:text-lg')
    })
  })
})
