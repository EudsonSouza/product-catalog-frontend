import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSearch } from '../use-search'

interface TestItem {
  id: string
  name: string
  description: string
}

const mockItems: TestItem[] = [
  { id: '1', name: 'Laptop', description: 'High-performance laptop' },
  { id: '2', name: 'Mouse', description: 'Wireless mouse' },
  { id: '3', name: 'Keyboard', description: 'Mechanical keyboard' },
]

describe('useSearch', () => {
  const searchFn = (item: TestItem, query: string) =>
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)

  it('should return all items initially', () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    expect(result.current.filteredItems).toEqual(mockItems)
    expect(result.current.query).toBe('')
  })

  it('should filter items based on search query', async () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    act(() => {
      result.current.setQuery('laptop')
    })

    await waitFor(
      () => {
        expect(result.current.filteredItems).toHaveLength(1)
        expect(result.current.filteredItems[0].name).toBe('Laptop')
      },
      { timeout: 200 }
    )
  })

  it('should be case-insensitive', async () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    act(() => {
      result.current.setQuery('LAPTOP')
    })

    await waitFor(
      () => {
        expect(result.current.filteredItems).toHaveLength(1)
        expect(result.current.filteredItems[0].name).toBe('Laptop')
      },
      { timeout: 200 }
    )
  })

  it('should search in description', async () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    act(() => {
      result.current.setQuery('wireless')
    })

    await waitFor(
      () => {
        expect(result.current.filteredItems).toHaveLength(1)
        expect(result.current.filteredItems[0].name).toBe('Mouse')
      },
      { timeout: 200 }
    )
  })

  it('should return empty array when no matches', async () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    act(() => {
      result.current.setQuery('nonexistent')
    })

    await waitFor(
      () => {
        expect(result.current.filteredItems).toHaveLength(0)
      },
      { timeout: 200 }
    )
  })

  it('should clear search', async () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    act(() => {
      result.current.setQuery('laptop')
    })

    await waitFor(
      () => {
        expect(result.current.filteredItems).toHaveLength(1)
      },
      { timeout: 200 }
    )

    act(() => {
      result.current.clearSearch()
    })

    expect(result.current.query).toBe('')

    await waitFor(
      () => {
        expect(result.current.filteredItems).toEqual(mockItems)
      },
      { timeout: 200 }
    )
  })

  it('should handle empty query (whitespace only)', async () => {
    const { result } = renderHook(() => useSearch(mockItems, searchFn, 50))

    act(() => {
      result.current.setQuery('   ')
    })

    await waitFor(
      () => {
        expect(result.current.filteredItems).toEqual(mockItems)
      },
      { timeout: 200 }
    )
  })
})
