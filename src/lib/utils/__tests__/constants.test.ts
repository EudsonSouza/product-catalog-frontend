import { describe, it, expect } from 'vitest'
import {
  API_CONFIG,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  DEFAULT_MAX_PRICE,
  GRID_LAYOUTS,
  PRICE_RANGE,
  WHATSAPP_PHONE,
  HTTP_METHODS,
  APP_CONFIG,
} from '../constants'

describe('constants', () => {
  describe('API_CONFIG', () => {
    it('should have required configuration properties', () => {
      expect(API_CONFIG).toHaveProperty('BASE_URL')
      expect(API_CONFIG).toHaveProperty('TIMEOUT')
      expect(API_CONFIG).toHaveProperty('RETRY_ATTEMPTS')
    })

    it('should have valid BASE_URL', () => {
      expect(typeof API_CONFIG.BASE_URL).toBe('string')
      expect(API_CONFIG.BASE_URL.length).toBeGreaterThan(0)
    })

    it('should have reasonable timeout value', () => {
      expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0)
      expect(API_CONFIG.TIMEOUT).toBeLessThanOrEqual(30000)
    })

    it('should have positive retry attempts', () => {
      expect(API_CONFIG.RETRY_ATTEMPTS).toBeGreaterThan(0)
      expect(API_CONFIG.RETRY_ATTEMPTS).toBeLessThanOrEqual(10)
    })
  })

  describe('API_ENDPOINTS', () => {
    it('should have PRODUCTS endpoint', () => {
      expect(API_ENDPOINTS.PRODUCTS).toBe('/api/products')
    })
  })

  describe('DEFAULT_HEADERS', () => {
    it('should include Content-Type', () => {
      expect(DEFAULT_HEADERS['Content-Type']).toBe('application/json')
    })

    it('should include Accept header', () => {
      expect(DEFAULT_HEADERS.Accept).toBe('application/json')
    })
  })

  describe('HTTP_METHODS', () => {
    it('should define standard HTTP methods', () => {
      expect(HTTP_METHODS.GET).toBe('GET')
      expect(HTTP_METHODS.POST).toBe('POST')
      expect(HTTP_METHODS.PUT).toBe('PUT')
      expect(HTTP_METHODS.DELETE).toBe('DELETE')
    })
  })

  describe('GRID_LAYOUTS', () => {
    it('should have STANDARD layout', () => {
      expect(GRID_LAYOUTS.STANDARD).toBeTruthy()
      expect(typeof GRID_LAYOUTS.STANDARD).toBe('string')
    })

    it('should have DENSE layout', () => {
      expect(GRID_LAYOUTS.DENSE).toBeTruthy()
      expect(typeof GRID_LAYOUTS.DENSE).toBe('string')
    })

    it('should have different layouts', () => {
      expect(GRID_LAYOUTS.STANDARD).not.toBe(GRID_LAYOUTS.DENSE)
    })
  })

  describe('PRICE_RANGE', () => {
    it('should have MIN, MAX, and STEP', () => {
      expect(PRICE_RANGE).toHaveProperty('MIN')
      expect(PRICE_RANGE).toHaveProperty('MAX')
      expect(PRICE_RANGE).toHaveProperty('STEP')
    })

    it('should have MIN less than MAX', () => {
      expect(PRICE_RANGE.MIN).toBeLessThan(PRICE_RANGE.MAX)
    })

    it('should have positive STEP', () => {
      expect(PRICE_RANGE.STEP).toBeGreaterThan(0)
    })
  })

  describe('DEFAULT_MAX_PRICE', () => {
    it('should be a positive number', () => {
      expect(DEFAULT_MAX_PRICE).toBeGreaterThan(0)
    })

    it('should be within PRICE_RANGE', () => {
      expect(DEFAULT_MAX_PRICE).toBeGreaterThanOrEqual(PRICE_RANGE.MIN)
      expect(DEFAULT_MAX_PRICE).toBeLessThanOrEqual(PRICE_RANGE.MAX)
    })
  })

  describe('WHATSAPP_PHONE', () => {
    it('should be a valid phone number string', () => {
      expect(typeof WHATSAPP_PHONE).toBe('string')
      expect(WHATSAPP_PHONE.length).toBeGreaterThan(0)
    })

    it('should start with country code', () => {
      expect(WHATSAPP_PHONE).toMatch(/^55/)
    })
  })

  describe('APP_CONFIG', () => {
    it('should have NAME and DESCRIPTION', () => {
      expect(APP_CONFIG).toHaveProperty('NAME')
      expect(APP_CONFIG).toHaveProperty('DESCRIPTION')
    })

    it('should have DEFAULT_CATEGORY and DEFAULT_GENDER', () => {
      expect(APP_CONFIG.DEFAULT_CATEGORY).toBe('all')
      expect(APP_CONFIG.DEFAULT_GENDER).toBe('all')
    })

    it('should have COMPANY config', () => {
      expect(APP_CONFIG.COMPANY).toHaveProperty('NAME')
      expect(APP_CONFIG.COMPANY).toHaveProperty('PHONE')
    })

    it('should have PAGINATION config', () => {
      expect(APP_CONFIG.PAGINATION).toHaveProperty('DEFAULT_LIMIT')
      expect(APP_CONFIG.PAGINATION).toHaveProperty('MAX_LIMIT')
      expect(APP_CONFIG.PAGINATION.DEFAULT_LIMIT).toBeLessThanOrEqual(APP_CONFIG.PAGINATION.MAX_LIMIT)
    })
  })
})
