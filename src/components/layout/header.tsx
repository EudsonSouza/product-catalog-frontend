'use client';

import { APP_CONFIG } from '@/lib/utils/constants';
import { useAuth } from '@/hooks';
import { LoginButton, UserMenu } from '@/components/auth';

export default function Header() {
  const { isAuthenticated } = useAuth();

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
      <div className="flex items-center gap-4">
        {isAuthenticated ? <UserMenu /> : <LoginButton />}
      </div>
    </div>
  );
}