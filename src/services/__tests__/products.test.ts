import { describe, it, expect } from 'vitest'
import { getProducts, getProductById } from '../products'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('products service', () => {
  describe('getProducts', () => {
    it('should fetch and return products', async () => {
      const products = await getProducts()

      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it('should return products with correct structure', async () => {
      const products = await getProducts()
      const product = products[0]

      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('description')
      expect(product).toHaveProperty('basePrice')
      expect(product).toHaveProperty('categoryName')
      expect(product).toHaveProperty('gender')
      expect(product).toHaveProperty('isFeatured')
      expect(product).toHaveProperty('slug')
    })

    it('should validate product data has required fields', async () => {
      const products = await getProducts()

      products.forEach(product => {
        expect(typeof product.id).toBe('string')
        expect(typeof product.name).toBe('string')
        expect(typeof product.basePrice).toBe('number')
        expect(product.id.length).toBeGreaterThan(0)
        expect(product.name.length).toBeGreaterThan(0)
      })
    })

    it('should throw error for invalid response format', async () => {
      server.use(
        http.get('http://localhost:5182/api/products', () => {
          return HttpResponse.json({ invalid: 'data' })
        })
      )

      await expect(getProducts()).rejects.toThrow('Invalid response format')
    })

    it('should throw error for products with missing required fields', async () => {
      server.use(
        http.get('http://localhost:5182/api/products', () => {
          return HttpResponse.json([
            { id: '1', name: 'Test' }, // Missing basePrice
          ])
        })
      )

      await expect(getProducts()).rejects.toThrow('missing required fields')
    })

    it('should filter products by query', async () => {
      const products = await getProducts({ query: 'headphones' })

      expect(products.length).toBeGreaterThan(0)
      products.forEach(product => {
        const matchesQuery =
          product.name.toLowerCase().includes('headphones') ||
          product.description.toLowerCase().includes('headphones')
        expect(matchesQuery).toBe(true)
      })
    })

    it('should filter products by category', async () => {
      const products = await getProducts({ category: 'Electronics' })

      expect(products.length).toBeGreaterThan(0)
      products.forEach(product => {
        expect(product.categoryName).toBe('Electronics')
      })
    })

    it('should not filter when category is "all"', async () => {
      const allProducts = await getProducts()
      const filteredProducts = await getProducts({ category: 'all' })

      expect(filteredProducts.length).toBe(allProducts.length)
    })

    it('should filter products by maxPrice', async () => {
      const maxPrice = 100
      const products = await getProducts({ maxPrice })

      products.forEach(product => {
        expect(product.basePrice).toBeLessThanOrEqual(maxPrice)
      })
    })

    it('should apply multiple filters together', async () => {
      const products = await getProducts({
        category: 'Electronics',
        maxPrice: 400,
      })

      products.forEach(product => {
        expect(product.categoryName).toBe('Electronics')
        expect(product.basePrice).toBeLessThanOrEqual(400)
      })
    })

    it('should return empty array when no products match filters', async () => {
      const products = await getProducts({
        query: 'nonexistent-product-xyz-123',
      })

      expect(products).toEqual([])
    })
  })

  describe('getProductById', () => {
    it('should fetch a single product by ID', async () => {
      const product = await getProductById('1')

      expect(product).toBeDefined()
      expect(product.id).toBe('1')
      expect(product.name).toBe('Wireless Headphones')
    })

    it('should return product with all required fields', async () => {
      const product = await getProductById('1')

      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('description')
      expect(product).toHaveProperty('basePrice')
      expect(product).toHaveProperty('categoryName')
      expect(product).toHaveProperty('gender')
      expect(product).toHaveProperty('slug')
    })

    it('should throw error for non-existent product', async () => {
      await expect(getProductById('999')).rejects.toThrow()
    })

    it('should throw error for invalid product data', async () => {
      server.use(
        http.get('http://localhost:5182/api/products/1', () => {
          return HttpResponse.json({ id: '1' }) // Missing required fields
        })
      )

      await expect(getProductById('1')).rejects.toThrow('missing required fields')
    })

    it('should handle different product IDs', async () => {
      const product1 = await getProductById('1')
      const product2 = await getProductById('2')

      expect(product1.id).not.toBe(product2.id)
      expect(product1.name).not.toBe(product2.name)
    })
  })
})
