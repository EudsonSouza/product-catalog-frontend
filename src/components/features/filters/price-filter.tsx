"use client";

import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/lib/i18n";
import { PRICE_RANGE } from "@/lib/utils/constants";

interface PriceFilterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function PriceFilter({
  value,
  onChange,
  min = PRICE_RANGE.MIN,
  max = PRICE_RANGE.MAX,
  step = PRICE_RANGE.STEP,
  className = "",
}: PriceFilterProps) {
  const { messages } = useTranslation();

  return (
    <div className={`px-2 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{messages.ui.search.maxPrice}</span>
        <span>$ {value.toFixed(0)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="mt-2"
      />
    </div>
  );
}