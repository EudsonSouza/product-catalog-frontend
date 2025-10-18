import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilters } from '../use-filters'

describe('useFilters', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useFilters())

    expect(result.current.filters).toEqual({
      query: undefined,
      category: undefined,
      gender: undefined,
      maxPrice: undefined,
    })
  })

  it('should initialize with custom filters', () => {
    const initialFilters = {
      query: 'laptop',
      category: 'Electronics',
      gender: 'Male',
      maxPrice: 1000,
    }

    const { result } = renderHook(() => useFilters(initialFilters))

    expect(result.current.filters).toEqual(initialFilters)
  })

  it('should set a single filter', () => {
    const { result } = renderHook(() => useFilters())

    act(() => {
      result.current.setFilter('category', 'Electronics')
    })

    expect(result.current.filters.category).toBe('Electronics')
    expect(result.current.filters.query).toBeUndefined()
  })

  it('should set multiple filters', () => {
    const { result } = renderHook(() => useFilters())

    act(() => {
      result.current.setFilter('category', 'Electronics')
    })

    act(() => {
      result.current.setFilter('maxPrice', 500)
    })

    act(() => {
      result.current.setFilter('gender', 'Female')
    })

    expect(result.current.filters).toEqual({
      query: undefined,
      category: 'Electronics',
      gender: 'Female',
      maxPrice: 500,
    })
  })

  it('should update existing filter', () => {
    const { result } = renderHook(() =>
      useFilters({
        query: undefined,
        category: 'Electronics',
        gender: undefined,
        maxPrice: undefined,
      })
    )

    act(() => {
      result.current.setFilter('category', 'Clothing')
    })

    expect(result.current.filters.category).toBe('Clothing')
  })

  it('should clear all filters', () => {
    const { result } = renderHook(() =>
      useFilters({
        query: 'laptop',
        category: 'Electronics',
        gender: 'Male',
        maxPrice: 1000,
      })
    )

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.filters).toEqual({
      query: undefined,
      category: undefined,
      gender: undefined,
      maxPrice: undefined,
    })
  })

  it('should reset to initial filters', () => {
    const initialFilters = {
      query: undefined,
      category: 'Electronics',
      gender: undefined,
      maxPrice: 1000,
    }

    const { result } = renderHook(() => useFilters(initialFilters))

    // Change filters
    act(() => {
      result.current.setFilter('category', 'Clothing')
      result.current.setFilter('maxPrice', 500)
    })

    expect(result.current.filters).toEqual({
      query: undefined,
      category: 'Clothing',
      gender: undefined,
      maxPrice: 500,
    })

    // Reset to initial
    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters).toEqual(initialFilters)
  })

  it('should maintain filter independence', () => {
    const { result } = renderHook(() => useFilters())

    act(() => {
      result.current.setFilter('query', 'search term')
    })

    expect(result.current.filters.query).toBe('search term')
    expect(result.current.filters.category).toBeUndefined()
    expect(result.current.filters.gender).toBeUndefined()
    expect(result.current.filters.maxPrice).toBeUndefined()
  })

  it('should handle undefined values', () => {
    const { result } = renderHook(() =>
      useFilters({
        query: 'test',
        category: 'Electronics',
        gender: undefined,
        maxPrice: undefined,
      })
    )

    act(() => {
      result.current.setFilter('category', undefined)
    })

    expect(result.current.filters.category).toBeUndefined()
  })
})
