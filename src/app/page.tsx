"use client";
import React, { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types";
import { DEFAULT_MAX_PRICE } from "@/lib/utils/constants";
import { useProducts, useFilters, useSearch } from "@/hooks";
import { ProductGrid } from "@/components/features/product-catalog";
import { genderLabel } from "@/lib/utils/formatters";
import {
  PageLoadingSkeleton,
  LoadingError,
  NoProductsFound,
  SearchNoResults,
  Header,
} from "@/components/layout";
import { SearchBar } from "@/components/features/search";
import { FilterPanel } from "@/components/features/filters";

export default function Page() {
  const [dense, setDense] = useState(false);

  // Use custom hooks for data fetching and filtering
  const { products, loading, error, refetch } = useProducts();
  const { filters, setFilter, clearFilters } = useFilters({
    category: undefined,
    gender: undefined,
    maxPrice: DEFAULT_MAX_PRICE,
  });

  // Search functionality with debouncing
  const {
    query,
    setQuery,
    filteredItems: searchedProducts,
  } = useSearch<Product>(
    products,
    (product, searchQuery) =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery)
  );

  // Extract categories from products
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.categoryName)));
    return unique;
  }, [products]);

  // Apply filters to searched products
  const filtered = useMemo(() => {
    return searchedProducts.filter((p) => {
      const matchesCategory =
        !filters.category || p.categoryName === filters.category;
      const matchesGender =
        !filters.gender || genderLabel(p.gender) === filters.gender;
      const matchesPrice = !filters.maxPrice || p.basePrice <= filters.maxPrice;
      return matchesCategory && matchesGender && matchesPrice;
    });
  }, [searchedProducts, filters]);

  // Convert filters to display values (filters use undefined, UI uses "all")
  const displayCategory = filters.category || "all";
  const displayGender = filters.gender || "all";
  const displayMaxPrice = filters.maxPrice || DEFAULT_MAX_PRICE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Header />

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full md:w-auto">
          <SearchBar value={query} onChange={setQuery} />

          <FilterPanel
            category={displayCategory}
            gender={displayGender}
            maxPrice={displayMaxPrice}
            dense={dense}
            categories={categories}
            onCategoryChange={(value) =>
              setFilter("category", value === "all" ? undefined : value)
            }
            onGenderChange={(value) =>
              setFilter("gender", value === "all" ? undefined : value)
            }
            onMaxPriceChange={(value) => setFilter("maxPrice", value)}
            onDenseChange={setDense}
            onFiltersClick={() => console.log("Filters clicked")}
            className="col-span-full lg:col-span-4"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Loading state */}
      {loading && <PageLoadingSkeleton />}

      {/* Error state */}
      {error && !loading && <LoadingError error={error} onRetry={refetch} />}

      {/* Grid */}
      {!loading && !error && (
        <ProductGrid
          products={filtered}
          dense={dense}
          onFavoriteClick={(productId) => {
            console.log("Favorite clicked for product:", productId);
            // TODO: Implement favorite functionality in future phase
          }}
        />
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <>
          {query ? (
            <SearchNoResults query={query} onClearSearch={() => setQuery("")} />
          ) : (
            <NoProductsFound
              onClearFilters={() => {
                clearFilters();
                setQuery("");
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
