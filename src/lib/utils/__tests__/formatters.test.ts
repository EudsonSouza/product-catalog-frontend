import { describe, it, expect } from 'vitest'
import { formatPrice, genderLabel, generateWhatsAppURL } from '../formatters'
import { Gender } from '@/lib/types/product'

describe('formatters', () => {
  describe('formatPrice', () => {
    it('should format price with currency symbol and two decimals', () => {
      expect(formatPrice(99.99)).toBe('$ 99.99')
      expect(formatPrice(1000)).toBe('$ 1000.00')
      expect(formatPrice(0)).toBe('$ 0.00')
    })

    it('should handle negative prices', () => {
      expect(formatPrice(-50)).toBe('$ -50.00')
    })

    it('should handle very large numbers', () => {
      expect(formatPrice(1000000)).toBe('$ 1000000.00')
    })

    it('should handle decimal values correctly', () => {
      expect(formatPrice(99.9)).toBe('$ 99.90')
      expect(formatPrice(99.999)).toBe('$ 100.00')
    })

    it('should handle zero correctly', () => {
      expect(formatPrice(0)).toBe('$ 0.00')
    })
  })

  describe('genderLabel', () => {
    it('should return correct labels for gender values', () => {
      expect(genderLabel(Gender.MALE)).toBe('Male')
      expect(genderLabel(Gender.FEMALE)).toBe('Female')
      expect(genderLabel(Gender.UNISEX)).toBe('Unisex')
    })

    it('should return Unisex for undefined', () => {
      expect(genderLabel(undefined)).toBe('Unisex')
    })

    it('should return Unisex for invalid values', () => {
      expect(genderLabel(999 as Gender)).toBe('Unisex')
    })
  })

  describe('generateWhatsAppURL', () => {
    it('should generate correct WhatsApp URL', () => {
      const url = generateWhatsAppURL('Test Product', 'test-product')
      expect(url).toContain('https://wa.me/')
      expect(url).toContain('5581999999999')
      expect(url).toContain('Test%20Product')
    })

    it('should encode special characters', () => {
      const url = generateWhatsAppURL('Test & Product!', 'test-product')
      expect(url).toContain('Test%20%26%20Product!')
    })

    it('should include product slug in message', () => {
      const url = generateWhatsAppURL('Product', 'product-slug')
      expect(url).toContain('product-slug')
    })

    it('should handle empty product name', () => {
      const url = generateWhatsAppURL('', 'slug')
      expect(url).toContain('https://wa.me/')
    })

    it('should handle special characters in slug', () => {
      const url = generateWhatsAppURL('Product', 'test-product-123')
      expect(url).toContain('test-product-123')
    })
  })
})
