import { http, HttpResponse } from 'msw'
import { Gender, Product } from '@/lib/types/product'

const API_BASE = 'http://localhost:5182'
const ALL_CATEGORIES = 'all'
const NOT_FOUND_STATUS = 404
const SERVER_ERROR_STATUS = 500
const TIMEOUT_DELAY = 15000

interface ProductFilters {
  searchQuery?: string
  category?: string
  maxPrice?: string
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with superior sound quality',
    basePrice: 299.99,
    categoryId: 'cat-1',
    categoryName: 'Electronics',
    gender: Gender.UNISEX,
    isFeatured: true,
    isActive: true,
    images: ['https://picsum.photos/seed/headphones/800/600'],
    slug: 'wireless-headphones',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: 'Comfortable running shoes designed for daily training and long-distance running',
    basePrice: 129.99,
    categoryId: 'cat-2',
    categoryName: 'Footwear',
    gender: Gender.MALE,
    isFeatured: false,
    isActive: true,
    images: ['https://picsum.photos/seed/shoes/800/600'],
    slug: 'running-shoes',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    name: 'Yoga Mat',
    description: 'Eco-friendly non-slip yoga mat perfect for all types of yoga practice',
    basePrice: 49.99,
    categoryId: 'cat-3',
    categoryName: 'Fitness',
    gender: Gender.FEMALE,
    isFeatured: false,
    isActive: true,
    images: ['https://picsum.photos/seed/yogamat/800/600'],
    slug: 'yoga-mat',
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '4',
    name: 'Smart Watch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS',
    basePrice: 399.99,
    categoryId: 'cat-1',
    categoryName: 'Electronics',
    gender: Gender.UNISEX,
    isFeatured: true,
    isActive: true,
    images: ['https://picsum.photos/seed/watch/800/600'],
    slug: 'smart-watch',
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '5',
    name: 'Leather Backpack',
    description: 'Stylish leather backpack with laptop compartment',
    basePrice: 159.99,
    categoryId: 'cat-4',
    categoryName: 'Accessories',
    gender: Gender.UNISEX,
    isFeatured: false,
    isActive: true,
    images: ['https://picsum.photos/seed/backpack/800/600'],
    slug: 'leather-backpack',
    createdAt: new Date('2024-02-25').toISOString(),
  },
]


function matchesSearchQuery(product: Product, query: string): boolean {
  const lowerQuery = query.toLowerCase()
  const nameMatches = product.name.toLowerCase().includes(lowerQuery)
  const descriptionMatches = product.description.toLowerCase().includes(lowerQuery)

  return nameMatches || descriptionMatches
}

function filterBySearchQuery(products: Product[], query?: string): Product[] {
  if (!query) return products

  return products.filter(product => matchesSearchQuery(product, query))
}

function filterByCategory(products: Product[], category?: string): Product[] {
  if (!category || category === ALL_CATEGORIES) return products

  return products.filter(product => product.categoryName === category)
}

function filterByMaxPrice(products: Product[], maxPriceStr?: string): Product[] {
  if (!maxPriceStr) return products

  const maxPrice = parseFloat(maxPriceStr)
  return products.filter(product => product.basePrice <= maxPrice)
}

function applyProductFilters(products: Product[], filters: ProductFilters): Product[] {
  let filtered = [...products]

  filtered = filterBySearchQuery(filtered, filters.searchQuery)
  filtered = filterByCategory(filtered, filters.category)
  filtered = filterByMaxPrice(filtered, filters.maxPrice)

  return filtered
}

function extractFiltersFromUrl(url: URL): ProductFilters {
  return {
    searchQuery: url.searchParams.get('query') ?? undefined,
    category: url.searchParams.get('category') ?? undefined,
    maxPrice: url.searchParams.get('maxPrice') ?? undefined,
  }
}

function findProductById(productId: string): Product | undefined {
  return mockProducts.find(product => product.id === productId)
}

function createNotFoundResponse() {
  return new HttpResponse(null, {
    status: NOT_FOUND_STATUS,
    statusText: 'Not Found'
  })
}

function createServerErrorResponse() {
  return new HttpResponse(null, {
    status: SERVER_ERROR_STATUS,
    statusText: 'Internal Server Error'
  })
}

async function simulateTimeout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, TIMEOUT_DELAY))
}

export const handlers = [
  // GET /api/products - with optional filtering
  http.get(`${API_BASE}/api/products`, ({ request }) => {
    const url = new URL(request.url)
    const filters = extractFiltersFromUrl(url)
    const filteredProducts = applyProductFilters(mockProducts, filters)

    return HttpResponse.json(filteredProducts)
  }),

  // GET /api/products/:id - get single product
  http.get(`${API_BASE}/api/products/:id`, ({ params }) => {
    const productId = params.id as string
    const product = findProductById(productId)

    if (!product) {
      return createNotFoundResponse()
    }

    return HttpResponse.json(product)
  }),

  // Error simulation: 500 Internal Server Error
  http.get(`${API_BASE}/api/products/error/500`, () => {
    return createServerErrorResponse()
  }),

  // Error simulation: Timeout
  http.get(`${API_BASE}/api/products/error/timeout`, async () => {
    await simulateTimeout()
    return HttpResponse.json(mockProducts)
  }),
]
