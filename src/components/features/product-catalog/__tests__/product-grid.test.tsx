import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductGrid } from '../product-grid'
import { Product } from '@/lib/types'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    basePrice: 100,
    discountPercentage: 10,
    categoryId: '1',
    categoryName: 'Category 1',
    imageUrl: '/image1.jpg',
    stock: 10,
    gender: 'U',
    isNew: false,
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    basePrice: 200,
    discountPercentage: 0,
    categoryId: '2',
    categoryName: 'Category 2',
    imageUrl: '/image2.jpg',
    stock: 5,
    gender: 'M',
    isNew: true,
  },
]

describe('ProductGrid', () => {
  describe('Main Flow - Product Display', () => {
    it('should render all products in grid', () => {
      render(<ProductGrid products={mockProducts} />)

      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 2')).toBeInTheDocument()
    })

    it('should render empty grid when no products', () => {
      const { container } = render(<ProductGrid products={[]} />)
      const grid = container.querySelector('div')

      expect(grid?.children.length).toBe(0)
    })

    it('should display product prices', () => {
      render(<ProductGrid products={mockProducts} />)

      expect(screen.getByText('$ 100.00')).toBeInTheDocument()
      expect(screen.getByText('$ 200.00')).toBeInTheDocument()
    })
  })

  describe('Layout Modes', () => {
    it('should use standard grid layout by default', () => {
      const { container } = render(<ProductGrid products={mockProducts} />)
      const grid = container.firstChild as HTMLElement

      expect(grid).toHaveClass('grid')
      expect(grid).not.toHaveClass('grid-cols-2')
    })

    it('should use dense grid layout when dense prop is true', () => {
      const { container } = render(<ProductGrid products={mockProducts} dense={true} />)
      const grid = container.firstChild as HTMLElement

      expect(grid).toHaveClass('grid')
      expect(grid).toHaveClass('grid-cols-2')
    })
  })

  describe('User Interactions', () => {
    it('should call onFavoriteClick when favorite button is clicked', async () => {
      const user = userEvent.setup()
      const onFavoriteClick = vi.fn()

      render(<ProductGrid products={mockProducts} onFavoriteClick={onFavoriteClick} />)

      const favoriteButtons = screen.getAllByRole('button', { name: /favorite/i })
      await user.click(favoriteButtons[0])

      expect(onFavoriteClick).toHaveBeenCalledWith('1')
    })

    it('should handle multiple products favorite clicks', async () => {
      const user = userEvent.setup()
      const onFavoriteClick = vi.fn()

      render(<ProductGrid products={mockProducts} onFavoriteClick={onFavoriteClick} />)

      const favoriteButtons = screen.getAllByRole('button', { name: /favorite/i })
      await user.click(favoriteButtons[0])
      await user.click(favoriteButtons[1])

      expect(onFavoriteClick).toHaveBeenCalledTimes(2)
      expect(onFavoriteClick).toHaveBeenNthCalledWith(1, '1')
      expect(onFavoriteClick).toHaveBeenNthCalledWith(2, '2')
    })
  })
})
