'use client';

import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const { login, isLoading } = useAuth();

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      variant="default"
      size="lg"
    >
      {isLoading ? 'Carregando...' : 'Entrar com Google'}
    </Button>
  );
}
