"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";

interface GenderFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function GenderFilter({
  value,
  onChange,
  className = "",
}: GenderFilterProps) {
  const { messages } = useTranslation();

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
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
    </div>
  );
}