"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Grid3X3, Grid, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ViewControlsProps {
  dense: boolean;
  onDenseChange: (dense: boolean) => void;
  onFiltersClick?: () => void;
  className?: string;
}

export default function ViewControls({
  dense,
  onDenseChange,
  onFiltersClick,
  className = "",
}: ViewControlsProps) {
  const { messages } = useTranslation();

  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      <Toggle
        pressed={dense}
        onPressedChange={onDenseChange}
        aria-label={messages.ui.labels.density}
      >
        {dense ? (
          <Grid3X3 className="h-4 w-4" />
        ) : (
          <Grid className="h-4 w-4" />
        )}
      </Toggle>
      
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={onFiltersClick}
      >
        <SlidersHorizontal className="h-4 w-4" />
        {messages.ui.filters.button}
      </Button>
    </div>
  );
}