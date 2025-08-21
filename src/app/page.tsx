"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Grid3X3, Grid, Heart, Search, SlidersHorizontal } from "lucide-react";
import { genderLabel } from "@/lib/utils/formatters";

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  gender: number;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  images: string[];
  categoryName: string;
}


export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [gender, setGender] = useState<string | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [dense, setDense] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5182/api/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
        console.error("Error ffetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    <div className="min-h-screen w-full px-4 py-6 md:px-8 lg:px-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Catalog
          </h1>
          <p className="text-sm text-muted-foreground">
            Lingerie and pajamas – redirect to WhatsApp.
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
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Select value={category} onValueChange={(v) => setCategory(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={gender} onValueChange={(v) => setGender(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>

          <div className="px-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Max price</span>
              <span>$ {maxPrice.toFixed(0)}</span>
            </div>
            <Slider
              value={[maxPrice]}
              min={10}
              max={300}
              step={5}
              onValueChange={([v]) => setMaxPrice(v)}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Toggle
              pressed={dense}
              onPressedChange={setDense}
              aria-label="Density"
            >
              {dense ? (
                <Grid3X3 className="h-4 w-4" />
              ) : (
                <Grid className="h-4 w-4" />
              )}
            </Toggle>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading products...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mx-auto mt-24 max-w-md text-center">
          <p className="text-lg font-semibold text-destructive">
            Error loading products
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div
          className={
            dense
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
              : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }
        >
          {filtered.map((p) => (
            <Card key={p.id} className="group overflow-hidden border-muted/50">
              <CardHeader className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      p.images?.[0] ?? "https://picsum.photos/seed/p/800/600"
                    }
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-2 top-2 flex gap-2">
                    {p.isFeatured && <Badge>Featured</Badge>}
                    <Badge variant="secondary">{p.categoryName}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
                    {p.name}
                  </h3>
                  <button
                    className="rounded-full p-1 hover:bg-muted transition"
                    aria-label="Favorite"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
                  {p.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-bold md:text-lg">
                    $ {p.basePrice.toFixed(2)}
                  </span>
                  <Badge variant="outline" className="text-[10px] md:text-xs">
                    {genderLabel(p.gender)}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" asChild>
                  <a
                    href={`https://wa.me/5581999999999?text=${encodeURIComponent(
                      `Hi! I'm interested in the product ${p.name} (slug: ${p.slug}). Could you give me more details?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact on WhatsApp
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="mx-auto mt-24 max-w-md text-center">
          <p className="text-lg font-semibold">Nothing found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting the filters or search.
          </p>
        </div>
      )}
    </div>
  );
}
