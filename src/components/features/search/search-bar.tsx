"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
  className = "",
}: SearchBarProps) {
  const { messages } = useTranslation();

  const defaultPlaceholder = placeholder || messages.ui.search.placeholder;

  return (
    <div className={`col-span-2 lg:col-span-2 ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          aria-hidden
        />
        <Input
          type="text"
          placeholder={defaultPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
          aria-label={messages.ui.search.search}
        />
      </div>
    </div>
  );
}