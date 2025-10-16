---
title: Glossary
last_updated: 2025-10-15
source: created
---

# Glossary

> _Technical terms and concepts used in the Product Catalog Frontend._

## Purpose

This glossary defines frontend-specific terminology, frameworks, and patterns used in the Product Catalog Frontend project.

## Next.js Terms

### App Router
Next.js 13+ routing system based on file system conventions, replacing the Pages Router.

### Server Components
React components that render on the server, reducing client-side JavaScript and enabling direct data access.

### Client Components
React components marked with 'use client' that run in the browser and support interactivity.

### Route Segment
A portion of a URL path corresponding to a folder in the app directory.

### Layout
A UI component that wraps multiple pages, preserving state across navigation.

### Loading UI
Special file (loading.tsx) that shows while a route segment loads.

### Error Boundary
Special file (error.tsx) that catches and handles errors in route segments.

## React Terms

### Component
Reusable UI building block that encapsulates markup, styling, and behavior.

### Hook
React function that lets you use state and lifecycle features in function components.

### Props
Arguments passed to React components, similar to function parameters.

### State
Data that changes over time and triggers re-renders when updated.

### JSX/TSX
JavaScript/TypeScript syntax extension for writing HTML-like markup.

## Styling Terms

### Tailwind CSS
Utility-first CSS framework used for styling components.

### Responsive Design
Design approach ensuring the UI works well on all device sizes.

### Mobile-First
Design strategy starting with mobile layout, then expanding to larger screens.

## Performance Terms

### Core Web Vitals
Google's metrics for measuring user experience (LCP, FID, CLS).

### Hydration
Process of adding interactivity to server-rendered HTML in the browser.

### Code Splitting
Dividing JavaScript bundles into smaller chunks for faster loading.

### Lazy Loading
Deferring loading of non-critical resources until needed.

## TypeScript Terms

### Type Safety
Compile-time checking to prevent type-related errors.

### Interface
TypeScript contract defining the shape of an object.

### Generic
Type that works with multiple types while maintaining type safety.

## Domain Terms

### Product
Catalog item displayed in the grid with details and variants.

### Variant
Specific combination of product attributes (color, size).

### Category
Product classification for organization and filtering.

### Featured Product
Product highlighted in special sections or with badges.

### WhatsApp Integration
Direct link generation for customer communication via WhatsApp.

## Acronyms

- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation
- **ISR**: Incremental Static Regeneration
- **CSR**: Client-Side Rendering
- **SPA**: Single Page Application
- **PWA**: Progressive Web App
- **SEO**: Search Engine Optimization
- **WCAG**: Web Content Accessibility Guidelines
- **API**: Application Programming Interface
- **UI**: User Interface
- **UX**: User Experience

## Related Documentation

- [Vision](./Vision.md)
- [UI Architecture](../01-Architecture/UIStructure.md)
- [Best Practices](../02-Development/BestPractices.md)
