import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Product, FALLBACK_IMAGE } from "@/lib/types";
import { genderLabel, formatPrice, generateWhatsAppURL } from "@/lib/utils/formatters";
import { useTranslation } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  className?: string;
  onFavoriteClick?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
  onFavoriteClick,
}) => {
  const { messages } = useTranslation();

  const handleFavoriteClick = () => {
    onFavoriteClick?.(product.id);
  };

  return (
    <Card className={`group overflow-hidden border-muted/50 ${className}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images?.[0] ?? FALLBACK_IMAGE}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-2 top-2 flex gap-2">
            {product.isFeatured && (
              <Badge>{messages.ui.labels.featured}</Badge>
            )}
            <Badge variant="secondary">{product.categoryName}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
            {product.name}
          </h3>
          <button
            className="rounded-full p-1 hover:bg-muted transition"
            aria-label={messages.ui.labels.favorite}
            onClick={handleFavoriteClick}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        
        <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold md:text-lg">
            {formatPrice(product.basePrice)}
          </span>
          <Badge variant="outline" className="text-[10px] md:text-xs">
            {genderLabel(product.gender)}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild>
          <a
            href={generateWhatsAppURL(product.name, product.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.ui.buttons.contactWhatsApp}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};