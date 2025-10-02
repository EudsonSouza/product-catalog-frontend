"use client";

import CategoryFilter from "./category-filter";
import GenderFilter from "./gender-filter";
import PriceFilter from "./price-filter";
import ViewControls from "./view-controls";

interface FilterPanelProps {
  // Filter values
  category: string;
  gender: string;
  maxPrice: number;
  dense: boolean;

  // Available options
  categories: string[];

  // Change handlers
  onCategoryChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onMaxPriceChange: (value: number) => void;
  onDenseChange: (value: boolean) => void;
  onFiltersClick?: () => void;

  className?: string;
}

export default function FilterPanel({
  category,
  gender,
  maxPrice,
  dense,
  categories,
  onCategoryChange,
  onGenderChange,
  onMaxPriceChange,
  onDenseChange,
  onFiltersClick,
  className = "",
}: FilterPanelProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full md:w-auto ${className}`}
    >
      <CategoryFilter
        value={category}
        categories={categories}
        onChange={onCategoryChange}
      />

      <GenderFilter value={gender} onChange={onGenderChange} />

      <PriceFilter value={maxPrice} onChange={onMaxPriceChange} />

      <ViewControls
        dense={dense}
        onDenseChange={onDenseChange}
        onFiltersClick={onFiltersClick}
      />
    </div>
  );
}
