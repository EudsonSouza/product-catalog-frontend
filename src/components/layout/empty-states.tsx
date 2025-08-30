import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {Icon && (
          <div className="rounded-full bg-gray-100 p-3">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 max-w-md">{description}</p>
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function NoProductsFound({ onClearFilters }: { onClearFilters?: () => void }) {
  const { messages } = useTranslation();
  
  return (
    <EmptyState
      icon={Package}
      title={messages.states.empty.noProducts}
      description={messages.states.empty.noProductsDescription}
      action={
        onClearFilters
          ? {
              label: messages.ui.filters.clearFilters,
              onClick: onClearFilters,
            }
          : undefined
      }
    />
  );
}

export function SearchNoResults({ query, onClearSearch }: { query: string; onClearSearch?: () => void }) {
  const { messages } = useTranslation();
  
  return (
    <EmptyState
      icon={Search}
      title={`${messages.states.empty.noSearchResults} "${query}"`}
      description={messages.states.empty.noSearchResultsDescription}
      action={
        onClearSearch
          ? {
              label: messages.ui.filters.clearSearch,
              onClick: onClearSearch,
            }
          : undefined
      }
    />
  );
}

export function LoadingError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  const { messages } = useTranslation();
  
  return (
    <EmptyState
      icon={AlertCircle}
      title={messages.states.error.somethingWentWrong}
      description={error || messages.states.error.errorMessage}
      action={
        onRetry
          ? {
              label: messages.ui.buttons.tryAgain,
              onClick: onRetry,
            }
          : undefined
      }
      className="border-red-200 bg-red-50"
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  const { messages } = useTranslation();
  
  return (
    <EmptyState
      icon={RefreshCw}
      title={messages.states.error.connectionProblem}
      description={messages.states.error.connectionDescription}
      action={
        onRetry
          ? {
              label: messages.ui.buttons.retry,
              onClick: onRetry,
            }
          : undefined
      }
      className="border-orange-200 bg-orange-50"
    />
  );
}

export function EmptyCategory({ categoryName, onViewAll }: { categoryName: string; onViewAll?: () => void }) {
  const { messages } = useTranslation();
  
  return (
    <EmptyState
      icon={Package}
      title={`${messages.states.empty.noCategoryProducts} ${categoryName}`}
      description={messages.states.empty.noCategoryProductsDescription}
      action={
        onViewAll
          ? {
              label: messages.ui.buttons.viewAllProducts,
              onClick: onViewAll,
            }
          : undefined
      }
    />
  );
}