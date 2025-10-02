import { APP_CONFIG } from '@/lib/utils/constants';

export default function Header() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {APP_CONFIG.NAME}
        </h1>
        <p className="text-sm text-muted-foreground">
          {APP_CONFIG.DESCRIPTION}
        </p>
      </div>
    </div>
  );
}