import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFilters } from '@/lib/types';
import { getProducts } from '@/services/products';
import { ApiException } from '@/lib/types/api';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing product data
 * Handles loading, error states, and provides refetch functionality
 *
 * @param filters - Optional filters to apply to products
 * @returns Object containing products, loading state, error, and refetch function
 */
export function useProducts(filters?: ProductFilters): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProducts(filters);
      setProducts(data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      }
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
