import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Product, ProductFilters } from '@/lib/types';
import { ApiException } from '@/lib/types/api';

/**
 * Fetch all products from the API
 * @param filters Optional filters to apply
 * @returns Promise resolving to array of products
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const products = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
    
    // Validate response
    if (!Array.isArray(products)) {
      throw new ApiException(
        'Invalid response format: expected array of products',
        500,
        'Internal Server Error'
      );
    }

    // Validate each product has required fields
    products.forEach((product, index) => {
      if (!product.id || !product.name || typeof product.basePrice !== 'number') {
        throw new ApiException(
          `Invalid product data at index ${index}: missing required fields`,
          500,
          'Invalid Data'
        );
      }
    });

    // Apply client-side filters if provided
    if (filters) {
      return applyClientFilters(products, filters);
    }

    return products;
  } catch (error) {
    // Re-throw ApiExceptions as-is
    if (error instanceof ApiException) {
      throw error;
    }

    // Handle unexpected errors
    throw new ApiException(
      error instanceof Error ? error.message : 'Failed to fetch products',
      500,
      'Internal Server Error'
    );
  }
};

/**
 * Get a single product by ID
 * @param id Product ID
 * @returns Promise resolving to a single product
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const product = await apiClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    
    // Validate required fields
    if (!product.id || !product.name || typeof product.basePrice !== 'number') {
      throw new ApiException(
        'Invalid product data: missing required fields',
        500,
        'Invalid Data'
      );
    }

    return product;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    throw new ApiException(
      error instanceof Error ? error.message : 'Failed to fetch product',
      500,
      'Internal Server Error'
    );
  }
};

/**
 * Apply client-side filters to products array
 * This is a helper function for when the API doesn't support server-side filtering
 * @param products Array of products to filter
 * @param filters Filters to apply
 * @returns Filtered products array
 */
const applyClientFilters = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter((product) => {
    // Apply query filter (search in name and description)
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      const matchesQuery = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      if (!matchesQuery) return false;
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      if (product.categoryName !== filters.category) return false;
    }

    // Apply gender filter
    if (filters.gender && filters.gender !== 'all') {
      // This would need to be adapted based on how gender is stored
      // For now, assuming gender is stored as string in the UI filters
      if (filters.gender !== 'all') return false; // Placeholder logic
    }

    // Apply price filter
    if (filters.maxPrice && product.basePrice > filters.maxPrice) {
      return false;
    }

    return true;
  });
};