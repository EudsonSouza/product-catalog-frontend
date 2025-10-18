import { useState, useMemo } from 'react';
import { useDebounce } from './use-debounce';

interface UseSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  filteredItems: T[];
  clearSearch: () => void;
}

/**
 * Custom hook for search functionality with debouncing
 * Filters items based on search query with a debounced value
 *
 * @param items - Array of items to search through
 * @param searchFn - Function that determines if an item matches the query
 * @param debounceDelay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object containing search state and filtered results
 */
export function useSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceDelay = 300
): UseSearchReturn<T> {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceDelay);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items;
    }

    return items.filter((item) => searchFn(item, debouncedQuery.toLowerCase()));
  }, [items, debouncedQuery, searchFn]);

  const clearSearch = () => setQuery('');

  return {
    query,
    setQuery,
    debouncedQuery,
    filteredItems,
    clearSearch,
  };
}
