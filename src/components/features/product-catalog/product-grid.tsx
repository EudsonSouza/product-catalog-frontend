"use client";
import React from "react";
import { Product } from "@/lib/types";
import { GRID_LAYOUTS } from "@/lib/utils/constants";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  dense?: boolean;
  onFavoriteClick?: (productId: string) => void;
}

export function ProductGrid({
  products,
  dense = false,
  onFavoriteClick,
}: ProductGridProps) {
  return (
    <div className={dense ? GRID_LAYOUTS.DENSE : GRID_LAYOUTS.STANDARD}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onFavoriteClick={onFavoriteClick}
        />
      ))}
    </div>
  );
}
