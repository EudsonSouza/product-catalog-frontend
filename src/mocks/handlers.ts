import { http, HttpResponse } from 'msw'
import { Gender, Product } from '@/lib/types/product'

const API_BASE = 'http://localhost:5182'

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

export const handlers = [
  // GET /api/products
  http.get(`${API_BASE}/api/products`, () => {
    return HttpResponse.json(mockProducts)
  }),

  // GET /api/products/:id
  http.get(`${API_BASE}/api/products/:id`, ({ params }) => {
    const { id } = params
    const product = mockProducts.find(p => p.id === id)

    if (!product) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found'
      })
    }

    return HttpResponse.json(product)
  }),

  // Error simulation endpoints for testing
  http.get(`${API_BASE}/api/products/error/500`, () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }),

  http.get(`${API_BASE}/api/products/error/timeout`, async () => {
    await new Promise(resolve => setTimeout(resolve, 15000))
    return HttpResponse.json(mockProducts)
  }),
]
