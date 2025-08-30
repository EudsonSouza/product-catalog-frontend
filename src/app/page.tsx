"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Grid3X3, Grid, Search, SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";
import {
  DEFAULT_MAX_PRICE,
  PRICE_RANGE,
  GRID_LAYOUTS,
  APP_CONFIG,
} from "@/lib/utils/constants";
import { useTranslation } from "@/lib/i18n";
import { getProducts } from "@/services/products";
import { ApiException } from "@/lib/types/api";
import { ProductCard } from "@/components/features/product-catalog";
import { genderLabel } from "@/lib/utils/formatters";
import { PageLoadingSkeleton } from "@/components/layout";

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
      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {APP_CONFIG.NAME}
          </h1>
          <p className="text-sm text-muted-foreground">
            {APP_CONFIG.DESCRIPTION}
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full md:w-auto">
          <div className="col-span-2 lg:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                aria-hidden
              />
              <Input
                placeholder={messages.ui.search.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Select value={category} onValueChange={(v) => setCategory(v as any)}>
            <SelectTrigger>
              <SelectValue
                placeholder={messages.ui.filters.category.placeholder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {messages.ui.filters.category.all}
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={gender} onValueChange={(v) => setGender(v as any)}>
            <SelectTrigger>
              <SelectValue
                placeholder={messages.ui.filters.gender.placeholder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {messages.ui.filters.gender.all}
              </SelectItem>
              <SelectItem value="Female">
                {messages.ui.filters.gender.female}
              </SelectItem>
              <SelectItem value="Male">
                {messages.ui.filters.gender.male}
              </SelectItem>
              <SelectItem value="Unisex">
                {messages.ui.filters.gender.unisex}
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="px-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{messages.ui.search.maxPrice}</span>
              <span>$ {maxPrice.toFixed(0)}</span>
            </div>
            <Slider
              value={[maxPrice]}
              min={PRICE_RANGE.MIN}
              max={PRICE_RANGE.MAX}
              step={PRICE_RANGE.STEP}
              onValueChange={([v]) => setMaxPrice(v)}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Toggle
              pressed={dense}
              onPressedChange={setDense}
              aria-label={messages.ui.labels.density}
            >
              {dense ? (
                <Grid3X3 className="h-4 w-4" />
              ) : (
                <Grid className="h-4 w-4" />
              )}
            </Toggle>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />{" "}
              {messages.ui.filters.button}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Loading state */}
      {loading && <PageLoadingSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="mx-auto mt-24 max-w-md text-center">
          <p className="text-lg font-semibold text-destructive">
            {messages.states.error.title}
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {messages.ui.buttons.tryAgain}
          </Button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className={dense ? GRID_LAYOUTS.DENSE : GRID_LAYOUTS.STANDARD}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFavoriteClick={(productId) => {
                console.log("Favorite clicked for product:", productId);
                // TODO: Implement favorite functionality in future phase
              }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="mx-auto mt-24 max-w-md text-center">
          <p className="text-lg font-semibold">{messages.states.empty.title}</p>
          <p className="text-sm text-muted-foreground">
            {messages.states.empty.description}
          </p>
        </div>
      )}
    </div>
  );
}
