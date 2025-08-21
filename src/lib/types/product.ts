export enum Gender {
  UNISEX = 0,
  MALE = 1,
  FEMALE = 2,
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  gender: Gender;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  images: string[];
  categoryName: string;
}

export interface ProductFilters {
  query?: string;
  category?: string;
  gender?: string;
  maxPrice?: number;
}

export interface ProductGridConfig {
  dense: boolean;
}

export const FALLBACK_IMAGE = 'https://picsum.photos/seed/p/800/600';