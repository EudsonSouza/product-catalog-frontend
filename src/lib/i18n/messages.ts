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
    navigation: {
      home: "Home",
      products: "All Products",
      featured: "Featured",
      menu: "Menu",
      closeMenu: "Close menu",
      openMenu: "Open menu",
    },
    search: {
      placeholder: "Search products...",
      maxPrice: "Max price",
      search: "Search",
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
      clearFilters: "Clear filters",
      clearSearch: "Clear search",
    },
    buttons: {
      tryAgain: "Try again",
      contactWhatsApp: "Contact on WhatsApp",
      retry: "Retry",
      viewAllProducts: "View all products",
    },
    labels: {
      density: "Density",
      favorite: "Favorite",
      featured: "Featured",
    },
    footer: {
      description: "A modern product showcase platform designed for small businesses. Browse our collection and contact us directly via WhatsApp for purchases.",
      madeWith: "Made with ❤️ for small businesses",
      quickLinks: "Quick Links",
      contact: "Contact",
      whatsApp: "WhatsApp",
      businessHours: "Business Hours: Mon-Fri 9AM-6PM",
      allRightsReserved: "All rights reserved.",
      builtWith: "Built with Next.js & TypeScript",
    },
  },

  // States
  states: {
    loading: "Loading products...",
    loadingMessage: "Loading...",
    error: {
      title: "Error loading products",
      fetchFailed: "Failed to fetch products",
      networkError: "Network error - please check your connection",
      serverError: "Server error - please try again later",
      timeout: "Request timed out - please try again",
      somethingWentWrong: "Something went wrong",
      errorMessage: "We encountered an error while loading the content. Please try again.",
      connectionProblem: "Connection problem",
      connectionDescription: "We're having trouble connecting to our servers. Please check your internet connection and try again.",
    },
    empty: {
      title: "Nothing found",
      description: "Try adjusting the filters or search.",
      noProducts: "No products found",
      noProductsDescription: "We couldn't find any products matching your criteria. Try adjusting your filters or search terms.",
      noSearchResults: "No results for",
      noSearchResultsDescription: "We couldn't find any products matching your search. Try different keywords or check for typos.",
      noCategoryProducts: "No products in",
      noCategoryProductsDescription: "This category doesn't have any products yet. Check back soon or browse other categories.",
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