import { messages } from "@/lib/i18n";

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
} as const;