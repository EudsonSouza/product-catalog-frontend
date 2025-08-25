# Next.js & React Development Best Practices

A comprehensive guide to modern Next.js and React development patterns, conventions, and best practices.

## Table of Contents

1. [Project Structure & Organization](#project-structure--organization)
2. [Next.js App Router Best Practices](#nextjs-app-router-best-practices)
3. [React Component Patterns](#react-component-patterns)
4. [State Management](#state-management)
5. [Data Fetching](#data-fetching)
6. [Performance Optimization](#performance-optimization)
7. [Routing & Navigation](#routing--navigation)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Code Quality & Conventions](#code-quality--conventions)

## Project Structure & Organization

### App Router File Conventions

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error UI
├── not-found.tsx       # 404 page
├── global-error.tsx    # Global error UI
├── blog/
│   ├── layout.tsx      # Blog layout
│   ├── page.tsx        # Blog index
│   ├── loading.tsx     # Blog loading
│   └── [slug]/
│       └── page.tsx    # Dynamic blog post
├── api/
│   └── route.ts        # API endpoint
└── _components/        # Private components (not routes)
    └── web-vitals.tsx
```

### Component Organization

```
components/
├── ui/                 # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
├── features/           # Feature-specific components
│   ├── auth/
│   ├── blog/
│   └── dashboard/
└── layout/            # Layout components
    ├── header.tsx
    ├── footer.tsx
    └── sidebar.tsx
```

## Next.js App Router Best Practices

### 1. Server vs Client Components

**Server Components (Default)**
- Use for data fetching close to the source
- Keep API keys and secrets secure
- Reduce client-side JavaScript bundle

```tsx
// Server Component - Default behavior
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

**Client Components**
- Use for interactivity, event handlers, browser APIs
- Mark with `'use client'` directive

```tsx
'use client';

import { useState } from 'react';

export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes);

  return (
    <button onClick={() => setCount(count + 1)}>
      👍 {count}
    </button>
  );
}
```

### 2. Data Fetching Strategies

**Static Data (SSG equivalent)**
```tsx
export default async function Page() {
  // Cached until manually invalidated
  const staticData = await fetch('https://api.example.com/data', { 
    cache: 'force-cache' 
  });

  return <div>{/* render data */}</div>;
}
```

**Dynamic Data (SSR equivalent)**
```tsx
export default async function Page() {
  // Refetched on every request
  const dynamicData = await fetch('https://api.example.com/data', { 
    cache: 'no-store' 
  });

  return <div>{/* render data */}</div>;
}
```

**ISR (Incremental Static Regeneration)**
```tsx
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 10 }
  });

  return <div>{/* render data */}</div>;
}
```

### 3. Layouts and Nested Layouts

**Root Layout**
```tsx
import { WebVitals } from './_components/web-vitals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

**Nested Layout with Context Provider**
```tsx
import ThemeProvider from './theme-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="dashboard">
        <nav>{/* navigation */}</nav>
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}
```

### 4. Dynamic Routes and Static Generation

```tsx
// Generate static params for dynamic routes
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

## React Component Patterns

### 1. Component Composition

**Compound Components Pattern**
```tsx
// Modal compound component
const Modal = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal">{children}</div>;
};

const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return <header className="modal-header">{children}</header>;
};

const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-body">{children}</div>;
};

// Usage
<Modal>
  <Modal.Header>
    <h2>Confirm Action</h2>
  </Modal.Header>
  <Modal.Body>
    <p>Are you sure you want to delete this item?</p>
  </Modal.Body>
</Modal>
```

### 2. Custom Hooks

```tsx
// Custom hook for data fetching
function usePost(id: string) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  return { post, loading, error };
}

// Usage in component
function PostDetail({ id }: { id: string }) {
  const { post, loading, error } = usePost(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{post?.title}</div>;
}
```

## State Management

### 1. Local State with useState

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 2. Complex State with useReducer

```tsx
interface State {
  count: number;
  loading: boolean;
}

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setLoading'; payload: boolean };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'reset':
      return { ...state, count: 0 };
    case 'setLoading':
      return { ...state, loading: action.payload };
    default:
      throw new Error('Unknown action type');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { 
    count: 0, 
    loading: false 
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### 3. Global State with Context

```tsx
// Create context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

// Provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={`header ${theme}`}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}
```

## Data Fetching

### 1. Server Component Data Fetching

```tsx
interface Post {
  id: string;
  title: string;
  content: string;
}

// Parallel data fetching
async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

async function getCategories() {
  const res = await fetch('https://api.example.com/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export default async function BlogPage() {
  // Fetch data in parallel
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  return (
    <div>
      <aside>
        <h2>Categories</h2>
        {categories.map(cat => <div key={cat.id}>{cat.name}</div>)}
      </aside>
      <main>
        {posts.map(post => <Article key={post.id} post={post} />)}
      </main>
    </div>
  );
}
```

### 2. Client-Side Data Fetching

```tsx
'use client';

function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

function PostList() {
  const { data: posts, loading, error } = useApi<Post[]>('/api/posts');

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!posts) return <div>No posts found</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Performance Optimization

### 1. Memoization

**useMemo for expensive calculations**
```tsx
function ExpensiveComponent({ items }: { items: Item[] }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);

  return <div>Total: {expensiveValue}</div>;
}
```

**useCallback for stable function references**
```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  const [filter, setFilter] = useState('all');

  const handleToggle = useCallback((id: string) => {
    // Toggle todo logic
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return true;
    });
  }, [todos, filter]);

  return (
    <div>
      {filteredTodos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={handleToggle} 
        />
      ))}
    </div>
  );
}
```

### 2. Code Splitting and Lazy Loading

```tsx
import { Suspense, lazy } from 'react';

// Lazy load heavy components
const Chart = lazy(() => import('./Chart'));
const DataTable = lazy(() => import('./DataTable'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<div>Loading chart...</div>}>
        <Chart />
      </Suspense>
      
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable />
      </Suspense>
    </div>
  );
}
```

### 3. Image Optimization

```tsx
import Image from 'next/image';

function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <h3>{product.name}</h3>
    </div>
  );
}
```

## Routing & Navigation

### 1. Link Component Best Practices

```tsx
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      {/* Basic navigation */}
      <Link href="/about">About</Link>
      
      {/* Dynamic routes */}
      <Link href={`/posts/${post.slug}`}>
        {post.title}
      </Link>
      
      {/* Prefetching control */}
      <Link href="/heavy-page" prefetch={false}>
        Heavy Page (no prefetch)
      </Link>
      
      {/* External links */}
      <Link href="https://example.com" target="_blank" rel="noopener">
        External Link
      </Link>
    </nav>
  );
}
```

### 2. Programmatic Navigation

```tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSubmit(query: string) {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit(formData.get('query') as string);
    }}>
      <input name="query" type="search" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### 3. Route Handlers (API Routes)

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    
    const posts = await fetchPosts(parseInt(page));
    
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPost = await createPost(body);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
```

## Error Handling

### 1. Error Boundaries

```tsx
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>
        Try again
      </button>
    </div>
  );
}
```

### 2. Custom Error Pages

```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Not Found</h2>
      <p>Could not find the requested resource</p>
      <Link href="/">
        Return Home
      </Link>
    </div>
  );
}
```

### 3. Global Error Handler

```tsx
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

## Testing

### 1. Component Testing

```tsx
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
```

### 2. Custom Hook Testing

```tsx
// __tests__/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  test('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });

  test('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## Code Quality & Conventions

### 1. TypeScript Best Practices

**Proper typing for components**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children,
  onClick 
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**Utility types for API responses**
```tsx
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;

// Partial updates
type UpdateUserData = Partial<Pick<User, 'name' | 'email'>>;
```

### 2. ESLint and Prettier Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/jsx-key": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 3. File and Component Naming

```
// Files
kebab-case.tsx         ✅ Good
PascalCase.tsx         ❌ Avoid
camelCase.tsx         ❌ Avoid

// Components
function UserProfile() {} ✅ Good (PascalCase)
function userProfile() {} ❌ Avoid (camelCase)

// Hooks
function useUserData() {} ✅ Good (camelCase with 'use' prefix)
function UserData() {}    ❌ Avoid (not starting with 'use')

// Constants
const API_BASE_URL = ''; ✅ Good (SCREAMING_SNAKE_CASE)
const apiBaseUrl = '';   ✅ Acceptable (camelCase)
```

### 4. Import Organization

```tsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import clsx from 'clsx';
import { format } from 'date-fns';

// 3. Next.js specific imports
import Link from 'next/link';
import Image from 'next/image';

// 4. Internal imports (absolute paths)
import { Button } from '@/components/ui/Button';
import { useUserData } from '@/hooks/useUserData';
import { formatCurrency } from '@/utils/formatters';

// 5. Relative imports
import './Component.css';
```

## Key Principles Summary

### 1. **Server-First Architecture**
- Prefer Server Components for data fetching and rendering
- Use Client Components only when needed for interactivity
- Keep sensitive operations on the server

### 2. **Performance by Default**
- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Lazy load non-critical components
- Minimize client-side JavaScript

### 3. **Type Safety**
- Use TypeScript for better developer experience
- Define proper interfaces for props and API responses
- Leverage utility types for flexibility

### 4. **Developer Experience**
- Use consistent naming conventions
- Organize files logically
- Write comprehensive tests
- Document complex logic

### 5. **Accessibility & SEO**
- Use semantic HTML
- Provide proper alt texts for images
- Implement proper meta tags
- Ensure keyboard navigation works

This guide provides a solid foundation for building modern, performant, and maintainable Next.js and React applications. Remember to adapt these patterns to your specific project needs and team conventions.