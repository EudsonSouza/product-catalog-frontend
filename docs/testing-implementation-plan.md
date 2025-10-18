# Testing Implementation Plan - 80% Coverage Goal

## Objective

Implement comprehensive testing for the Product Catalog Frontend to achieve **80% code coverage** using the recommended testing stack (Vitest, React Testing Library, MSW, Playwright).

---

## Phase 1: Setup & Configuration (Days 1-2)

### Day 1: Install Dependencies

```bash
# Core testing dependencies
npm install -D vitest @vitest/ui @vitejs/plugin-react

# React Testing Library
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# MSW for API mocking
npm install -D msw

# Playwright for E2E
npm install -D @playwright/test

# Coverage reporting
npm install -D @vitest/coverage-v8
```

### Day 2: Configuration Files

#### 1. Create `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.config.*',
        '**/types/**',
        '**/*.d.ts',
        '**/index.ts', // Re-export files
        'vitest.setup.ts',
        'src/mocks/**',
        'e2e/**',
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### 2. Create `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './src/mocks/server'

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset handlers after each test
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Close server after all tests
afterAll(() => server.close())

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))
```

#### 3. Create `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

#### 4. Update `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:run && npm run test:e2e"
  }
}
```

#### 5. Create `.gitignore` entries

Add to `.gitignore`:
```
# Testing
coverage/
.vitest/
playwright-report/
test-results/
```

---

## Phase 2: API Mocking Setup (Day 3)

### Create MSW Handlers

#### `src/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    basePrice: 299.99,
    categoryName: 'Electronics',
    gender: 'UNISEX',
    isFeatured: true,
    images: ['https://via.placeholder.com/400'],
    slug: 'wireless-headphones',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily training',
    basePrice: 129.99,
    categoryName: 'Footwear',
    gender: 'MALE',
    isFeatured: false,
    images: ['https://via.placeholder.com/400'],
    slug: 'running-shoes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Yoga Mat',
    description: 'Eco-friendly non-slip yoga mat',
    basePrice: 49.99,
    categoryName: 'Fitness',
    gender: 'FEMALE',
    isFeatured: false,
    images: ['https://via.placeholder.com/400'],
    slug: 'yoga-mat',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const handlers = [
  // GET /api/products
  http.get(`${API_BASE}/products`, () => {
    return HttpResponse.json(mockProducts)
  }),

  // GET /api/products/:id
  http.get(`${API_BASE}/products/:id`, ({ params }) => {
    const { id } = params
    const product = mockProducts.find(p => p.id === id)

    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(product)
  }),

  // Error simulation endpoint for testing
  http.get(`${API_BASE}/products/error`, () => {
    return new HttpResponse(null, { status: 500 })
  }),

  http.get(`${API_BASE}/products/timeout`, async () => {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return HttpResponse.json(mockProducts)
  }),
]
```

#### `src/mocks/server.ts`

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

#### `src/mocks/browser.ts` (for development)

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

---

## Phase 3: Unit Tests - Utilities (Day 4)

**Coverage Target: 100% (utilities are easiest to test)**

### `src/lib/utils/__tests__/formatters.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice, genderLabel, generateWhatsAppURL } from '../formatters'

describe('formatters', () => {
  describe('formatPrice', () => {
    it('should format price with currency symbol', () => {
      expect(formatPrice(99.99)).toBe('$99.99')
      expect(formatPrice(1000)).toBe('$1,000.00')
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('should handle negative prices', () => {
      expect(formatPrice(-50)).toBe('-$50.00')
    })

    it('should handle very large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1,000,000.00')
    })
  })

  describe('genderLabel', () => {
    it('should return correct labels for gender values', () => {
      expect(genderLabel('MALE')).toBe('Male')
      expect(genderLabel('FEMALE')).toBe('Female')
      expect(genderLabel('UNISEX')).toBe('Unisex')
    })

    it('should handle lowercase input', () => {
      expect(genderLabel('male')).toBe('Male')
    })

    it('should handle invalid gender', () => {
      expect(genderLabel('invalid')).toBe('Unisex')
    })
  })

  describe('generateWhatsAppURL', () => {
    it('should generate correct WhatsApp URL', () => {
      const url = generateWhatsAppURL('Product Name', 'product-slug')
      expect(url).toContain('https://wa.me/')
      expect(url).toContain('Product%20Name')
    })

    it('should handle special characters', () => {
      const url = generateWhatsAppURL('Test & Product!', 'test-product')
      expect(url).toContain('Test%20%26%20Product!')
    })
  })
})
```

### `src/lib/utils/__tests__/constants.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { API_CONFIG, DEFAULT_HEADERS, DEFAULT_MAX_PRICE, GRID_LAYOUTS } from '../constants'

describe('constants', () => {
  describe('API_CONFIG', () => {
    it('should have required configuration', () => {
      expect(API_CONFIG).toHaveProperty('BASE_URL')
      expect(API_CONFIG).toHaveProperty('TIMEOUT')
      expect(API_CONFIG).toHaveProperty('RETRY_ATTEMPTS')
    })

    it('should have reasonable timeout value', () => {
      expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0)
      expect(API_CONFIG.TIMEOUT).toBeLessThanOrEqual(30000)
    })
  })

  describe('DEFAULT_HEADERS', () => {
    it('should include Content-Type', () => {
      expect(DEFAULT_HEADERS['Content-Type']).toBe('application/json')
    })
  })

  describe('GRID_LAYOUTS', () => {
    it('should have dense and normal layouts', () => {
      expect(GRID_LAYOUTS).toHaveProperty('dense')
      expect(GRID_LAYOUTS).toHaveProperty('normal')
    })
  })
})
```

---

## Phase 4: Unit Tests - Services (Day 5)

**Coverage Target: 90%**

### `src/services/__tests__/api.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '../api'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('ApiClient', () => {
  const API_BASE = 'http://localhost:8080/api'

  describe('get', () => {
    it('should successfully fetch data', async () => {
      const data = await apiClient.get('/products')
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should handle 404 errors', async () => {
      server.use(
        http.get(`${API_BASE}/products/999`, () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(apiClient.get('/products/999')).rejects.toThrow()
    })

    it('should handle 500 errors', async () => {
      server.use(
        http.get(`${API_BASE}/products`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(apiClient.get('/products')).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      server.use(
        http.get(`${API_BASE}/products`, () => {
          return HttpResponse.error()
        })
      )

      await expect(apiClient.get('/products')).rejects.toThrow()
    })
  })

  describe('retry logic', () => {
    it('should retry on server errors', async () => {
      let attemptCount = 0

      server.use(
        http.get(`${API_BASE}/products`, () => {
          attemptCount++
          if (attemptCount < 3) {
            return new HttpResponse(null, { status: 500 })
          }
          return HttpResponse.json([])
        })
      )

      const data = await apiClient.get('/products')
      expect(attemptCount).toBeGreaterThan(1)
      expect(data).toBeDefined()
    })
  })
})
```

### `src/services/__tests__/products.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { getProducts } from '../products'

describe('products service', () => {
  describe('getProducts', () => {
    it('should fetch and return products', async () => {
      const products = await getProducts()

      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
      expect(products[0]).toHaveProperty('id')
      expect(products[0]).toHaveProperty('name')
      expect(products[0]).toHaveProperty('basePrice')
    })

    it('should return products with correct structure', async () => {
      const products = await getProducts()
      const product = products[0]

      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        basePrice: expect.any(Number),
        categoryName: expect.any(String),
        gender: expect.any(String),
        isFeatured: expect.any(Boolean),
        slug: expect.any(String),
      })
    })
  })
})
```

---

## Phase 5: Component Tests - UI Components (Days 6-7)

**Coverage Target: 85%**

### `src/components/ui/__tests__/button.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply variant styles', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
  })

  it('should apply size styles', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should render as child component', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    expect(screen.getByRole('link')).toHaveTextContent('Link Button')
  })
})
```

### `src/components/ui/__tests__/input.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should handle value changes', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('should support different types', () => {
    const { rerender } = render(<Input type="text" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })
})
```

### `src/components/ui/__tests__/card.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../card'

describe('Card', () => {
  it('should render card with all sections', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('should apply custom className to card', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    expect(container.firstChild).toHaveClass('custom-card')
  })
})
```

**Similar tests needed for:**
- `badge.test.tsx`
- `select.test.tsx`
- `slider.test.tsx`
- `toggle.test.tsx`
- `separator.test.tsx`

---

## Phase 6: Component Tests - Feature Components (Days 8-10)

**Coverage Target: 80%**

### `src/components/features/product-catalog/__tests__/product-card.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '../product-card'
import { Product } from '@/lib/types'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  basePrice: 99.99,
  categoryName: 'Electronics',
  gender: 'UNISEX',
  isFeatured: true,
  images: ['https://via.placeholder.com/400'],
  slug: 'test-product',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('should display featured badge for featured products', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/featured/i)).toBeInTheDocument()
  })

  it('should not display featured badge for non-featured products', () => {
    const nonFeaturedProduct = { ...mockProduct, isFeatured: false }
    render(<ProductCard product={nonFeaturedProduct} />)
    expect(screen.queryByText(/featured/i)).not.toBeInTheDocument()
  })

  it('should call onFavoriteClick when favorite button is clicked', async () => {
    const handleFavorite = vi.fn()
    render(<ProductCard product={mockProduct} onFavoriteClick={handleFavorite} />)

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    await userEvent.click(favoriteButton)

    expect(handleFavorite).toHaveBeenCalledWith('1')
  })

  it('should render image with correct src', () => {
    render(<ProductCard product={mockProduct} />)
    const image = screen.getByAltText('Test Product')
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/400')
  })

  it('should render fallback image when no images provided', () => {
    const noImageProduct = { ...mockProduct, images: [] }
    render(<ProductCard product={noImageProduct} />)
    const image = screen.getByAltText('Test Product')
    expect(image).toHaveAttribute('src')
  })

  it('should render WhatsApp contact link', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link).toHaveAttribute('href')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should display gender badge', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Unisex')).toBeInTheDocument()
  })
})
```

### `src/components/features/product-catalog/__tests__/product-grid.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductGrid } from '../product-grid'
import { Product } from '@/lib/types'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    basePrice: 99.99,
    categoryName: 'Category 1',
    gender: 'MALE',
    isFeatured: true,
    images: [],
    slug: 'product-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    basePrice: 149.99,
    categoryName: 'Category 2',
    gender: 'FEMALE',
    isFeatured: false,
    images: [],
    slug: 'product-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

describe('ProductGrid', () => {
  it('should render all products', () => {
    render(<ProductGrid products={mockProducts} dense={false} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('should apply dense layout styles', () => {
    const { container } = render(<ProductGrid products={mockProducts} dense={true} />)
    // Check for dense grid classes
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })

  it('should handle empty products array', () => {
    const { container } = render(<ProductGrid products={[]} dense={false} />)
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })

  it('should pass onFavoriteClick to ProductCard', () => {
    const handleFavorite = vi.fn()
    render(<ProductGrid products={mockProducts} dense={false} onFavoriteClick={handleFavorite} />)

    // This would need to actually click a favorite button
    // Just verify the grid renders correctly
    expect(screen.getAllByRole('button', { name: /favorite/i })).toHaveLength(2)
  })
})
```

### `src/components/features/search/__tests__/SearchBar.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../SearchBar'

describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('should display current value', () => {
    render(<SearchBar value="test query" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveValue('test query')
  })

  it('should call onChange when typing', async () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} />)

    const input = screen.getByRole('searchbox')
    await userEvent.type(input, 'laptop')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should have search placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
```

### `src/components/features/filters/__tests__/filter-panel.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from '../filter-panel'

describe('FilterPanel', () => {
  const defaultProps = {
    category: 'all',
    gender: 'all',
    maxPrice: 1000,
    dense: false,
    categories: ['Electronics', 'Clothing'],
    onCategoryChange: vi.fn(),
    onGenderChange: vi.fn(),
    onMaxPriceChange: vi.fn(),
    onDenseChange: vi.fn(),
    onFiltersClick: vi.fn(),
  }

  it('should render all filter controls', () => {
    render(<FilterPanel {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /gender/i })).toBeInTheDocument()
  })

  it('should call onCategoryChange when category changes', async () => {
    render(<FilterPanel {...defaultProps} />)

    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await userEvent.click(categorySelect)

    const option = await screen.findByRole('option', { name: 'Electronics' })
    await userEvent.click(option)

    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('Electronics')
  })

  it('should display current selections', () => {
    render(<FilterPanel {...defaultProps} category="Electronics" gender="Male" />)

    expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent('Electronics')
    expect(screen.getByRole('combobox', { name: /gender/i })).toHaveTextContent('Male')
  })
})
```

**Similar tests needed for:**
- `category-filter.test.tsx`
- `gender-filter.test.tsx`
- `price-filter.test.tsx`
- `view-controls.test.tsx`

### `src/components/layout/__tests__/header.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../header'

describe('Header', () => {
  it('should render application title', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render navigation elements', () => {
    render(<Header />)
    // Test based on your actual header implementation
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
```

**Similar tests needed for:**
- `footer.test.tsx`
- `loading-states.test.tsx`
- `empty-states.test.tsx`

---

## Phase 7: Integration Tests - Pages (Days 11-12)

**Coverage Target: 75%**

### `src/app/__tests__/page.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '../page'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('Product Catalog Page', () => {
  it('should display loading state initially', () => {
    render(<Page />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should display products after loading', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument()
    })
  })

  it('should display error state on API failure', async () => {
    server.use(
      http.get('*/api/products', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<Page />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('should filter products by search query', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('searchbox')
    await userEvent.type(searchInput, 'headphones')

    await waitFor(() => {
      expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument()
      expect(screen.queryByText(/running shoes/i)).not.toBeInTheDocument()
    })
  })

  it('should filter products by category', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
    })

    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await userEvent.click(categorySelect)

    const electronicsOption = await screen.findByRole('option', { name: 'Electronics' })
    await userEvent.click(electronicsOption)

    await waitFor(() => {
      expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument()
      expect(screen.queryByText(/yoga mat/i)).not.toBeInTheDocument()
    })
  })

  it('should filter products by gender', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /gender/i })).toBeInTheDocument()
    })

    const genderSelect = screen.getByRole('combobox', { name: /gender/i })
    await userEvent.click(genderSelect)

    const maleOption = await screen.findByRole('option', { name: 'Male' })
    await userEvent.click(maleOption)

    await waitFor(() => {
      expect(screen.getByText(/running shoes/i)).toBeInTheDocument()
      expect(screen.queryByText(/yoga mat/i)).not.toBeInTheDocument()
    })
  })

  it('should filter products by price', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    // Price filtering test based on your implementation
    // This will depend on how the price filter component works
  })

  it('should display empty state when no products match filters', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('searchbox')
    await userEvent.type(searchInput, 'nonexistent product xyz123')

    await waitFor(() => {
      expect(screen.getByText(/no results/i)).toBeInTheDocument()
    })
  })

  it('should clear filters when clear button clicked', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    // Apply filter
    const searchInput = screen.getByRole('searchbox')
    await userEvent.type(searchInput, 'headphones')

    // Clear filter
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await userEvent.click(clearButton)

    await waitFor(() => {
      expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument()
      expect(screen.getByText(/running shoes/i)).toBeInTheDocument()
    })
  })

  it('should toggle dense view', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /dense/i })).toBeInTheDocument()
    })

    const denseToggle = screen.getByRole('button', { name: /dense/i })
    await userEvent.click(denseToggle)

    // Verify grid layout changed
    // This depends on your implementation
  })
})
```

---

## Phase 8: Custom Hooks Tests (Day 13)

**Coverage Target: 90%**

### `src/lib/i18n/__tests__/useTranslation.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranslation } from '../useTranslation'

describe('useTranslation', () => {
  it('should return translation function and messages', () => {
    const { result } = renderHook(() => useTranslation())

    expect(result.current).toHaveProperty('t')
    expect(result.current).toHaveProperty('messages')
    expect(typeof result.current.t).toBe('function')
  })

  it('should translate keys correctly', () => {
    const { result } = renderHook(() => useTranslation())

    const translation = result.current.t('ui.buttons.contactWhatsApp')
    expect(typeof translation).toBe('string')
    expect(translation.length).toBeGreaterThan(0)
  })

  it('should return messages object with expected structure', () => {
    const { result } = renderHook(() => useTranslation())

    expect(result.current.messages).toHaveProperty('ui')
    expect(result.current.messages).toHaveProperty('states')
  })
})
```

---

## Phase 9: E2E Tests (Days 14-15)

**Coverage: Critical User Journeys**

### `e2e/product-catalog.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Product Catalog E2E', () => {
  test('should load and display products', async ({ page }) => {
    await page.goto('/')

    // Wait for products to load
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Check that product cards are displayed
    const productCards = page.locator('[data-testid="product-card"]').or(page.locator('article'))
    await expect(productCards.first()).toBeVisible()
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Search for a product
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('headphones')

    // Verify search results
    await expect(page.getByText(/headphones/i).first()).toBeVisible()
  })

  test('should filter by category', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open category filter
    const categorySelect = page.getByRole('combobox', { name: /category/i })
    await categorySelect.click()

    // Select a category
    const electronicsOption = page.getByRole('option', { name: 'Electronics' })
    await electronicsOption.click()

    // Verify filtered results
    await expect(page.getByText('Electronics').first()).toBeVisible()
  })

  test('should filter by gender', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open gender filter
    const genderSelect = page.getByRole('combobox', { name: /gender/i })
    await genderSelect.click()

    // Select a gender
    const maleOption = page.getByRole('option', { name: 'Male' })
    await maleOption.click()

    // Verify badge displays
    await expect(page.getByText('Male').first()).toBeVisible()
  })

  test('should adjust price filter', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find and adjust price slider
    const priceSlider = page.getByRole('slider')
    const sliderBounds = await priceSlider.boundingBox()

    if (sliderBounds) {
      // Click in the middle of the slider
      await page.mouse.click(
        sliderBounds.x + sliderBounds.width / 2,
        sliderBounds.y + sliderBounds.height / 2
      )
    }

    // Products should still be visible
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('should toggle dense view', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find dense view toggle
    const denseToggle = page.getByRole('button', { name: /dense/i })
    await denseToggle.click()

    // Grid should still be visible
    await expect(page.locator('.grid').first()).toBeVisible()
  })

  test('should handle favorite click', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click favorite button on first product
    const favoriteButton = page.getByRole('button', { name: /favorite/i }).first()
    await favoriteButton.click()

    // Console log should be visible (in development)
    // In production, you'd verify actual behavior
  })

  test('should open WhatsApp link', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get WhatsApp contact link
    const whatsappLink = page.getByRole('link', { name: /whatsapp/i }).first()

    // Verify it's configured correctly
    await expect(whatsappLink).toHaveAttribute('target', '_blank')
    await expect(whatsappLink).toHaveAttribute('href', /wa.me/)
  })

  test('should display no results message for empty search', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Search for nonexistent product
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('zyxnonexistent12345')

    // Verify no results message
    await expect(page.getByText(/no results/i)).toBeVisible()
  })

  test('should clear search', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Perform search
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('headphones')

    // Clear search
    await searchInput.clear()

    // All products should be visible again
    await expect(page.locator('article')).not.toHaveCount(0)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify mobile layout
    await expect(page.locator('article').first()).toBeVisible()

    // Grid should adapt to mobile
    const grid = page.locator('.grid').first()
    await expect(grid).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('article').first()).toBeVisible()
  })
})
```

### `e2e/error-handling.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Error Handling', () => {
  test('should display error state when API fails', async ({ page }) => {
    // Intercept API and return error
    await page.route('**/api/products', route => {
      route.fulfill({ status: 500, body: 'Server Error' })
    })

    await page.goto('/')

    // Verify error message is displayed
    await expect(page.getByText(/error/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
  })

  test('should retry when retry button clicked', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/products', route => {
      requestCount++
      if (requestCount === 1) {
        route.fulfill({ status: 500, body: 'Server Error' })
      } else {
        route.continue()
      }
    })

    await page.goto('/')

    // Click retry
    const retryButton = page.getByRole('button', { name: /retry/i })
    await retryButton.click()

    // Products should load
    await expect(page.locator('article').first()).toBeVisible()
  })
})
```

---

## Phase 10: Coverage Analysis & Optimization (Days 16-17)

### Run Coverage Report

```bash
npm run test:coverage
```

### Review Coverage Report

1. Open `coverage/index.html` in browser
2. Identify uncovered lines
3. Add missing tests
4. Focus on:
   - Error handling paths
   - Edge cases
   - Conditional logic branches

### Coverage Goals by Directory

| Directory | Target | Priority |
|-----------|--------|----------|
| `src/lib/utils` | 100% | High |
| `src/services` | 90% | High |
| `src/components/ui` | 85% | High |
| `src/components/features` | 80% | Medium |
| `src/components/layout` | 75% | Medium |
| `src/app` | 75% | High |
| `src/lib/i18n` | 85% | Medium |

---

## Coverage Badge Setup

### Option 1: GitHub Actions + Codecov (Recommended)

**1. Create GitHub workflow:**

`.github/workflows/test-coverage.yml`:
```yaml
name: Test Coverage

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
```

**2. Sign up for Codecov:**
- Go to https://codecov.io
- Connect your GitHub repository
- Get the CODECOV_TOKEN
- Add to GitHub repository secrets

**3. Add badge to README:**

```markdown
[![Coverage](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
```

### Option 2: Local Badge Generation

**Install badge generator:**

```bash
npm install -D istanbul-badges-readme
```

**Add to `package.json`:**

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "test:badges": "npm run test:coverage && npx istanbul-badges-readme"
  }
}
```

**Create `README.md` marker:**

```markdown
![Statements](#statements# "Make me better!")
![Branches](#branches# "Make me better!")
![Functions](#functions# "Make me better!")
![Lines](#lines# "Make me better!")
```

### Option 3: Shields.io Dynamic Badge

```markdown
![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)
```

---

## Testing Checklist

### Setup Phase
- [ ] Install all dependencies
- [ ] Configure Vitest
- [ ] Configure Playwright
- [ ] Set up MSW
- [ ] Add npm scripts
- [ ] Update .gitignore

### Unit Tests
- [ ] Test all utility functions
- [ ] Test constants
- [ ] Test formatters
- [ ] Test API client
- [ ] Test product service
- [ ] Test custom hooks

### Component Tests
- [ ] Test all UI components
- [ ] Test feature components
- [ ] Test layout components
- [ ] Test loading states
- [ ] Test error states
- [ ] Test empty states

### Integration Tests
- [ ] Test main page component
- [ ] Test filtering logic
- [ ] Test search functionality
- [ ] Test state management
- [ ] Test API integration

### E2E Tests
- [ ] Test product browsing
- [ ] Test search flow
- [ ] Test filtering flow
- [ ] Test error scenarios
- [ ] Test responsive layouts

### Coverage
- [ ] Achieve 80%+ overall coverage
- [ ] 100% utility coverage
- [ ] 90% service coverage
- [ ] 85% component coverage
- [ ] Set up coverage badge
- [ ] Configure CI/CD

---

## Metrics & Success Criteria

### Coverage Thresholds

```typescript
// vitest.config.ts
coverage: {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
}
```

### Testing Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Overall Coverage | 80% | TBD |
| Unit Test Coverage | 90% | TBD |
| Integration Coverage | 75% | TBD |
| E2E Test Count | 15+ | TBD |
| Test Execution Time | <30s | TBD |

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Setup | 2 days | All tools configured |
| 2. API Mocking | 1 day | MSW handlers ready |
| 3. Utils Tests | 1 day | 100% utils coverage |
| 4. Service Tests | 1 day | 90% service coverage |
| 5. UI Components | 2 days | 85% UI coverage |
| 6. Features | 3 days | 80% feature coverage |
| 7. Integration | 2 days | 75% page coverage |
| 8. Hooks | 1 day | 90% hooks coverage |
| 9. E2E | 2 days | Critical flows covered |
| 10. Optimization | 2 days | 80%+ overall |
| **Total** | **17 days** | **80% Coverage** |

---

## Maintenance & Best Practices

### Ongoing Tasks

1. **Update tests with new features**
   - Write tests before implementing features (TDD)
   - Ensure coverage doesn't drop below 80%

2. **Review coverage reports weekly**
   - Identify gaps
   - Add missing tests

3. **Run tests in CI/CD**
   - Block PRs with <80% coverage
   - Require all tests to pass

4. **Keep dependencies updated**
   - Update testing libraries monthly
   - Review breaking changes

### Testing Guidelines

1. **Write meaningful tests**
   - Test behavior, not implementation
   - Focus on user interactions
   - Cover edge cases

2. **Keep tests fast**
   - Mock external dependencies
   - Avoid unnecessary waits
   - Run tests in parallel

3. **Make tests maintainable**
   - Use descriptive test names
   - Follow AAA pattern
   - Avoid duplication

4. **Document complex tests**
   - Add comments for complex logic
   - Explain test scenarios
   - Document mock data

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Document Version**: 1.0
**Last Updated**: October 18, 2025
**Target Completion**: 17 working days
**Goal**: 80% Code Coverage
