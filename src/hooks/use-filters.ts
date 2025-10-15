import { useState, useCallback } from 'react';
import { ProductFilters } from '@/lib/types';

interface UseFiltersReturn {
  filters: ProductFilters;
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  clearFilters: () => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
  query: undefined,
  category: undefined,
  gender: undefined,
  maxPrice: undefined,
};

/**
 * Custom hook for managing product filters state
 * Provides utilities to set, clear, and reset filters
 *
 * @param initialFilters - Initial filter values
 * @returns Object containing filters state and manipulation functions
 */
export function useFilters(initialFilters: ProductFilters = DEFAULT_FILTERS): UseFiltersReturn {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const setFilter = useCallback(<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilter,
    clearFilters,
    resetFilters,
  };
}
