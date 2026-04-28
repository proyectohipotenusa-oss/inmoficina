import { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, perfil, loading } = useAuth();
  const [location] = useLocation();

  if (loading || (user && !perfil)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <Loader2 className="text-brand-400 animate-spin" size={28} />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;

  if (requireAdmin && perfil?.rol !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  // REGLA 2: Si la vista es de Agente y el usuario es Admin -> Expulsado al panel de agencias
  // EXCEPCIÓN: El admin sí puede acceder a la ruta /perfil
  if (!requireAdmin && perfil?.rol === 'admin' && location !== '/perfil') {
    return <Redirect to="/admin" />;
  }

  return <>{children}</>;
}