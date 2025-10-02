"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";

interface CategoryFilterProps {
  value: string;
  categories: string[];
  onChange: (value: string) => void;
  className?: string;
}

export default function CategoryFilter({
  value,
  categories,
  onChange,
  className = "",
}: CategoryFilterProps) {
  const { messages } = useTranslation();

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue
            placeholder={messages.ui.filters.category.placeholder}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {messages.ui.filters.category.all}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}