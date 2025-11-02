'use client';

import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/hooks';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao painel administrativo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <div className="space-y-2">
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Admin:</strong> {user?.isAdmin ? 'Sim' : 'Não'}</p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎉 Sistema de Autenticação Configurado!
          </h3>
          <p className="text-blue-800">
            Esta é uma página protegida que só pode ser acessada por administradores autenticados.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
