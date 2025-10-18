---
title: Testing Strategy
last_updated: 2025-10-18
source: updated
---

# Testing Strategy

## Overview

This document provides a comprehensive guide to testing in the Product Catalog Frontend. Our testing strategy follows a three-layer pyramid approach to ensure code quality, reliability, and maintainability while achieving >70% code coverage.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Testing Layers](#testing-layers)
- [Setup & Configuration](#setup--configuration)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

---

## Testing Philosophy

### The Testing Pyramid

```
    ┌──────────────┐
    │  E2E Tests   │  ← Few, critical user flows (10-15%)
    │ (Playwright) │
    ├──────────────┤
    │ Integration  │  ← API + Component interactions (25-30%)
    │    Tests     │
    ├──────────────┤
    │ Unit Tests   │  ← Hooks, utils, formatters (55-65%)
    │   (Vitest)   │
    └──────────────┘
```

**Principles:**
- **Fast Feedback**: Unit tests run in milliseconds
- **Reliable**: Tests should not be flaky
- **Maintainable**: Tests should be easy to understand and update
- **Comprehensive**: Cover critical paths and edge cases
- **Accessible**: All components tested for WCAG 2.1 AA compliance

---

## Testing Stack

Our recommended testing stack for Next.js 15 + React 19:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit/Component** | Vitest + React Testing Library | Fast, modern test runner with component testing |
| **E2E Testing** | Playwright | Multi-browser end-to-end testing |
| **API Mocking** | MSW (Mock Service Worker) | Network-level API mocking |
| **Accessibility** | axe-core + vitest-axe | Automated accessibility testing |
| **Coverage** | Vitest c8 | Code coverage reporting |

### Why This Stack?

#### Vitest ⭐
- **2-5x faster** than Jest
- **Native ESM support** - Works seamlessly with Next.js 15
- **Built-in TypeScript** - No extra configuration
- **Jest-compatible API** - Easy to learn
- **UI mode** - Visual test runner
- **Lightning-fast watch mode**

#### Playwright ⭐
- **Multi-browser testing** - Chromium, Firefox, WebKit
- **Auto-waiting** - Smart element detection (no flaky tests)
- **Built-in screenshots/videos** - Visual debugging
- **Parallel execution** - Fast test runs
- **Codegen tool** - Generate tests by recording

#### MSW
- **Network-level mocking** - Intercepts actual requests
- **Works everywhere** - Tests, dev, and browser
- **Realistic mocks** - No import stubbing
- **Type-safe** - Full TypeScript support

---

## Testing Layers

### 1. Unit Tests (55-65% of tests)

**What to test:**
- ✅ Custom hooks (`useProducts`, `useFilters`, `useSearch`, `useDebounce`)
- ✅ Utility functions (`formatters.ts`, `utils.ts`)
- ✅ API client functions (error handling, retry logic)
- ✅ Type guards and validators

**File structure:**
```
src/hooks/__tests__/
  ├── use-products.test.ts
  ├── use-filters.test.ts
  ├── use-search.test.ts
  └── use-debounce.test.ts

src/lib/utils/__tests__/
  ├── formatters.test.ts
  └── utils.test.ts

src/services/__tests__/
  ├── api.test.ts
  └── products.test.ts
```

**Example: Testing a custom hook**
```typescript
// src/hooks/__tests__/use-debounce.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still initial

    await waitFor(() => expect(result.current).toBe('updated'), {
      timeout: 600,
    });
  });
});
```

---

### 2. Component Tests (25-30% of tests)

**What to test:**
- ✅ Component rendering
- ✅ User interactions (clicks, inputs)
- ✅ Accessibility (a11y)
- ✅ Conditional rendering
- ✅ Props handling

**File structure:**
```
src/components/features/product-catalog/__tests__/
  ├── product-card.test.tsx
  └── product-grid.test.tsx

src/components/features/filters/__tests__/
  ├── filter-panel.test.tsx
  ├── category-filter.test.tsx
  ├── gender-filter.test.tsx
  └── price-filter.test.tsx

src/components/ui/__tests__/
  ├── button.test.tsx
  └── card.test.tsx
```

**Example: Testing a component**
```typescript
// src/components/features/product-catalog/__tests__/product-card.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { ProductCard } from '../product-card';

expect.extend(toHaveNoViolations);

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    basePrice: 99.99,
    gender: 'Female',
    categoryName: 'Lingerie',
    isFeatured: true,
    images: ['test.jpg'],
    slug: 'test-product',
  };

  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should show featured badge when product is featured', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

### 3. Integration Tests (10-15% of tests)

**What to test:**
- ✅ Page-level interactions (hooks + components)
- ✅ API calls with mocked responses
- ✅ Search + filtering together
- ✅ Error handling flows

**File structure:**
```
src/app/__tests__/
  └── page.integration.test.tsx
```

**Example: Integration test with MSW**
```typescript
// src/app/__tests__/page.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ProductCatalogPage from '../page';

const server = setupServer(
  http.get('http://localhost:5182/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Product 1', basePrice: 50 },
      { id: '2', name: 'Product 2', basePrice: 100 },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Product Catalog Page', () => {
  it('should load and display products', async () => {
    render(<ProductCatalogPage />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });
});
```

---

### 4. E2E Tests (10-15% of tests)

**What to test:**
- ✅ Critical user flows
- ✅ Multi-step interactions
- ✅ Cross-browser compatibility
- ✅ Responsive layouts

**File structure:**
```
e2e/
  ├── product-catalog.spec.ts
  ├── search-and-filter.spec.ts
  ├── responsive-layout.spec.ts
  └── whatsapp-integration.spec.ts
```

**Example: E2E test**
```typescript
// e2e/product-catalog.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('should display products and allow filtering', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();

    // Test search
    await page.fill('[data-testid="search-input"]', 'lingerie');
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(5);

    // Test category filter
    await page.selectOption('[data-testid="category-filter"]', 'Pajamas');
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3);

    // Test WhatsApp button
    const whatsappLink = page.locator('[href*="wa.me"]').first();
    await expect(whatsappLink).toHaveAttribute('href', /wa\.me/);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });
});
```

---

## Setup & Configuration

### Installation

```bash
# Install unit/component testing dependencies
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest-axe axe-core

# Install E2E testing
npm install -D @playwright/test
npx playwright install

# Install API mocking
npm install -D msw
```

### Configuration Files

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.config.{js,ts}',
        '**/types/**',
        '**/index.ts',
        '**/__tests__/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### `vitest.setup.ts`
```typescript
import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

#### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

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
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Running Tests

### NPM Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

### Commands

```bash
# Run unit tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Run all tests
npm run test:all
```

---

## Coverage Requirements

### Minimum Thresholds

- **Statements**: 70%
- **Branches**: 60%
- **Functions**: 70%
- **Lines**: 70%

### Coverage Exclusions

Files excluded from coverage:
- Configuration files (`*.config.ts`)
- Type definitions (`**/types/**`)
- Barrel exports (`**/index.ts`)
- Test files themselves (`**/__tests__/**`)

### Coverage Reports

Coverage reports are generated in:
- **HTML**: `coverage/index.html` (open in browser)
- **JSON**: `coverage/coverage-final.json`
- **Text**: Console output

---

## Best Practices

### Testing Guidelines

#### ✅ DO:
- Test behavior, not implementation
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility in every component
- Mock API calls with MSW
- Use data-testid sparingly (prefer semantic queries)
- Write descriptive test names
- Test error states and edge cases
- Keep tests isolated and independent

#### ❌ DON'T:
- Test implementation details
- Use `.toMatchSnapshot()` excessively
- Test third-party libraries
- Duplicate tests across layers
- Mock everything (test real interactions when possible)
- Write tests that depend on execution order
- Ignore accessibility violations

### Query Priority (React Testing Library)

1. **Accessible to everyone**: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic queries**: `getByAltText`, `getByTitle`
3. **Test IDs**: `getByTestId` (last resort)

### Naming Conventions

```typescript
// ✅ Good: Descriptive, behavior-focused
it('should display error message when API call fails', () => {});

// ❌ Bad: Implementation-focused
it('should set error state to true', () => {});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:coverage && npm run lint"
    }
  }
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests timeout
- **Solution**: Increase timeout in test or check for unresolved promises

**Issue**: "Cannot find module '@/...'"
- **Solution**: Check `vitest.config.ts` alias configuration

**Issue**: Flaky E2E tests
- **Solution**: Use Playwright's auto-waiting, avoid hardcoded sleeps

**Issue**: Low coverage despite many tests
- **Solution**: Check coverage exclusions and test actual branches

---

## Learning Resources

### Documentation
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [MSW](https://mswjs.io/)

### Tutorials
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Stop Mocking Fetch](https://kentcdodds.com/blog/stop-mocking-fetch)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

## Related Documentation

- [Best Practices](./BestPractices.md)
- [Components](./Components.md)
- [Code Style](../03-Governance/CodeStyle.md)
- [Roadmap - Phase 1: Testing & Quality](../03-Governance/Roadmap.md#phase-1-testing--quality-current-priority)

---

**Last Updated**: 2025-10-18
**Status**: Complete testing infrastructure setup
**Next Steps**: Begin writing tests for custom hooks (Phase 1)
