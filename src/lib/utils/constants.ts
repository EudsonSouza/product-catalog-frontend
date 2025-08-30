import { messages } from "@/lib/i18n";

// API Configuration (moved from constants/api.ts)
export const API_CONFIG = {
  BASE_URL: "http://localhost:5182",
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
  Accept: "application/json",
} as const;

// WhatsApp configuration
export const WHATSAPP_PHONE = "5581999999999";

// Filter constants
export const DEFAULT_MAX_PRICE = 200;
export const PRICE_RANGE = {
  MIN: 10,
  MAX: 300,
  STEP: 5,
} as const;

// View configuration
export const GRID_LAYOUTS = {
  STANDARD: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  DENSE: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
} as const;

// Gender options for filters
export const GENDER_OPTIONS = [
  { value: "all", label: messages.ui.filters.gender.all },
  { value: "Female", label: messages.ui.filters.gender.female },
  { value: "Male", label: messages.ui.filters.gender.male },
  { value: "Unisex", label: messages.ui.filters.gender.unisex },
] as const;

// App metadata
export const APP_CONFIG = {
  NAME: messages.app.name,
  DESCRIPTION: messages.app.description,
  DEFAULT_CATEGORY: "all",
  DEFAULT_GENDER: "all",
  COMPANY: {
    NAME: 'Product Catalog',
    PHONE: '+5581999999999',
  },
  PAGINATION: {
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },
} as const;