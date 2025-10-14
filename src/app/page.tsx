"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types";
import {
  DEFAULT_MAX_PRICE,
  GRID_LAYOUTS,
} from "@/lib/utils/constants";
import { useTranslation } from "@/lib/i18n";
import { getProducts } from "@/services/products";
import { ApiException } from "@/lib/types/api";
import { ProductGrid } from "@/components/features/product-catalog";
import { genderLabel } from "@/lib/utils/formatters";
import { PageLoadingSkeleton, LoadingError, NoProductsFound, SearchNoResults, Header } from "@/components/layout";
import { SearchBar } from "@/components/features/search";
import { FilterPanel } from "@/components/features/filters";

export default function Page() {
  const { t, messages } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [gender, setGender] = useState<string | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [dense, setDense] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        if (err instanceof ApiException) {
          // Provide user-friendly messages based on error type
          let userMessage = err.message;
          if (err.status === 0) {
            userMessage = messages.states.error.networkError;
          } else if (err.status >= 500) {
            userMessage = messages.states.error.serverError;
          } else if (err.status === 408) {
            userMessage = messages.states.error.timeout;
          }
          setError(`${userMessage} (${err.status})`);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : messages.states.error.fetchFailed
          );
        }
        console.error(messages.dev.fetchError, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [messages]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.categoryName)));
    return unique;
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = query
        ? p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesCategory =
        category === "all" ? true : p.categoryName === category;
      const matchesGender =
        gender === "all" ? true : genderLabel(p.gender) === gender;
      const matchesPrice = p.basePrice <= maxPrice;
      return matchesQuery && matchesCategory && matchesGender && matchesPrice;
    });
  }, [products, query, category, gender, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Header />

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full md:w-auto">
          <SearchBar
            value={query}
            onChange={setQuery}
          />

          <FilterPanel
            category={category}
            gender={gender}
            maxPrice={maxPrice}
            dense={dense}
            categories={categories}
            onCategoryChange={setCategory}
            onGenderChange={setGender}
            onMaxPriceChange={setMaxPrice}
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
      {error && !loading && (
        <LoadingError 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
      )}

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
            <SearchNoResults 
              query={query} 
              onClearSearch={() => setQuery("")} 
            />
          ) : (
            <NoProductsFound 
              onClearFilters={() => {
                setCategory("all");
                setGender("all");
                setMaxPrice(DEFAULT_MAX_PRICE);
              }} 
            />
          )}
        </>
      )}
    </div>
  );
}
