// Internationalization messages
// This file contains all user-facing text strings for easy translation

export const messages = {
  // App metadata
  app: {
    name: "Product Catalog",
    description: "Lingerie and pajamas – redirect to WhatsApp.",
  },

  // Navigation and UI
  ui: {
    search: {
      placeholder: "Search products...",
      maxPrice: "Max price",
    },
    filters: {
      category: {
        placeholder: "Category",
        all: "All",
      },
      gender: {
        placeholder: "Gender",
        all: "All",
        female: "Female",
        male: "Male",
        unisex: "Unisex",
      },
      button: "Filters",
    },
    buttons: {
      tryAgain: "Try again",
      contactWhatsApp: "Contact on WhatsApp",
    },
    labels: {
      density: "Density",
      favorite: "Favorite",
      featured: "Featured",
    },
  },

  // States
  states: {
    loading: "Loading products...",
    error: {
      title: "Error loading products",
      fetchFailed: "Failed to fetch products",
      networkError: "Network error - please check your connection",
      serverError: "Server error - please try again later",
      timeout: "Request timed out - please try again",
    },
    empty: {
      title: "Nothing found",
      description: "Try adjusting the filters or search.",
    },
  },

  // Product related
  product: {
    genders: {
      male: "Male",
      female: "Female",
      unisex: "Unisex",
    },
  },

  // WhatsApp message
  whatsApp: {
    messageTemplate: (productName: string, productSlug: string) => 
      `Hi! I'm interested in the product ${productName} (slug: ${productSlug}). Could you give me more details?`,
  },

  // Console/Dev messages
  dev: {
    fetchError: "Error fetching products:",
  },
} as const;

// Type for accessing nested message keys
export type MessageKey = 
  | "app.name"
  | "app.description"
  | "ui.search.placeholder"
  | "ui.search.maxPrice"
  | "ui.filters.category.placeholder"
  | "ui.filters.category.all"
  | "ui.filters.gender.placeholder"
  | "ui.filters.gender.all"
  | "ui.filters.gender.female"
  | "ui.filters.gender.male"
  | "ui.filters.gender.unisex"
  | "ui.filters.button"
  | "ui.buttons.tryAgain"
  | "ui.buttons.contactWhatsApp"
  | "ui.labels.density"
  | "ui.labels.favorite"
  | "ui.labels.featured"
  | "states.loading"
  | "states.error.title"
  | "states.error.fetchFailed"
  | "states.empty.title"
  | "states.empty.description"
  | "product.genders.male"
  | "product.genders.female"
  | "product.genders.unisex"
  | "dev.fetchError";

// Helper function to get nested values from object using dot notation
export const getMessage = (key: MessageKey): string => {
  const keys = key.split('.');
  let value: any = messages;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};