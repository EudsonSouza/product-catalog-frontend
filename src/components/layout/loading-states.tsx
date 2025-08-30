import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-9 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and filters skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse flex-1 max-w-md" />
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="h-px bg-gray-200" />
      </div>

      {/* Products grid skeleton */}
      <ProductGridSkeleton />
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message, className }: LoadingOverlayProps) {
  const { messages } = useTranslation();
  const displayMessage = message || messages.states.loadingMessage;
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
    >
      <Card className="p-6 max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600 text-center">{displayMessage}</p>
        </div>
      </Card>
    </div>
  );
}