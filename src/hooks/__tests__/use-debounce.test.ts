import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 50))
    expect(result.current).toBe('test')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 50 },
      }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 50 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Wait for debounce
    await waitFor(
      () => {
        expect(result.current).toBe('updated')
      },
      { timeout: 200 }
    )
  })

  it('should work with numbers', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      {
        initialProps: { value: 123 },
      }
    )

    expect(result.current).toBe(123)

    rerender({ value: 456 })

    await waitFor(
      () => {
        expect(result.current).toBe(456)
      },
      { timeout: 200 }
    )
  })

  it('should work with objects', async () => {
    const initial = { name: 'test' }
    const updated = { name: 'updated' }

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      {
        initialProps: { value: initial },
      }
    )

    expect(result.current).toBe(initial)

    rerender({ value: updated })

    await waitFor(
      () => {
        expect(result.current).toBe(updated)
      },
      { timeout: 200 }
    )
  })
})
