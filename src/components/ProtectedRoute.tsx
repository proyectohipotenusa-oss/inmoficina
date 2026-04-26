import { ReactNode } from 'react';
import { Redirect } from 'wouter';
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

  // CORRECCIÓN: Si hay usuario pero aún no se ha descargado el perfil, ESPERAMOS.
  // Así evitamos que te mande al Dashboard por error en ese milisegundo de carga.
  if (loading || (user && !perfil)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <Loader2 className="text-brand-400 animate-spin" size={28} />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;

  // REGLA 1: Si la vista es de Admin y el usuario es un Agente -> Expulsado al dashboard
  if (requireAdmin && perfil?.rol !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  // REGLA 2: Si la vista es de Agente y el usuario es Admin -> Expulsado al panel de agencias
  if (!requireAdmin && perfil?.rol === 'admin') {
    return <Redirect to="/admin" />;
  }

  return <>{children}</>;
}