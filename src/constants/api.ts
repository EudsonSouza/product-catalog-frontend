// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://product-catalog-api-1t6o.onrender.com",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: "/api/products",
} as const;

// Full API URLs
export const API_URLS = {
  PRODUCTS: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}`,
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

// Request Headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
} as const;