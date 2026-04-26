import { Switch, Route, Redirect } from 'wouter';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import { Lock, Loader2 } from 'lucide-react';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Propiedades from './pages/Propiedades';
import Portales from './pages/Portales'; // <-- NUEVA IMPORTACIÓN DE PORTALES
import Agenda from './pages/Agenda';
import Historico from './pages/Historico';
import Informes from './pages/Informes';
import Inversion from './pages/Inversion';
import IAPredictor from './pages/IAPredictor';
import Perfil from './pages/Perfil';
import AdminPanel from './pages/AdminPanel';
import PublicProfile from './pages/PublicProfile';
import FichaPropiedad from './pages/FichaPropiedad';
import CatalogoPublico from './pages/CatalogoPublico';

// --- EL ESCUDO DEFINITIVO ---
function AgencyGuard({ children }: { children: React.ReactNode }) {
  const { perfil, loading: authLoading } = useAuth();
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (authLoading) return;
      
      // 1. Si es Admin, vía libre total
      if (perfil?.rol === 'admin') {
        setIsBlocked(false);
        setChecking(false);
        return;
      }

      // 2. Si no hay agencia_id (caso raro), bloqueamos por precaución
      if (!perfil?.agencia_id) {
        setIsBlocked(false);
        setChecking(false);
        return;
      }

      // 3. Consultamos el estado real de la agencia en la tabla 'agencias'
      const { data, error } = await supabase
        .from('agencias')
        .select('bloqueada')
        .eq('id', perfil.agencia_id)
        .single();

      if (!error && data) {
        setIsBlocked(data.bloqueada);
      } else {
        setIsBlocked(false); // Si hay error en la consulta, permitimos por defecto
      }
      setChecking(false);
    }

    checkStatus();
  }, [perfil, authLoading]);

  // Mientras se comprueba el estado, pantalla de carga neutra
  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center text-brand-400 gap-4">
        <Loader2 size={24} className="animate-spin" />
        <div className="text-[10px] font-black uppercase tracking-[0.2em]">Verificando licencia...</div>
      </div>
    );
  }

  // SI LA AGENCIA ESTÁ BLOQUEADA: PANTALLA ROJA DE SUSPENSIÓN
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <Lock size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Acceso Suspendido</h1>
        <p className="text-white/50 max-w-sm mx-auto mb-8 text-xs leading-relaxed">
          Su usuario ha sido temporalmente bloqueado. <br />
          Consulte con el Admin sobre las posibles causas.
        </p>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Si todo está ok, renderizamos el contenido (Dashboard, Propiedades, etc)
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Redirect to="/login" />;
  
  // Envolvemos TODA ruta protegida con el guardia de agencia
  return <AgencyGuard>{children}</AgencyGuard>;
}

function SmartDashboard() {
  const { perfil, session } = useAuth();
  if (session && !perfil) return null; 
  if (perfil?.rol === 'admin') return <Redirect to="/admin" />;
  return <Dashboard />;
}

export default function App() {
  return (
    <Switch>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/u/:slug" component={PublicProfile} />
      <Route path="/p/:id" component={FichaPropiedad} /> 
      <Route path="/a/:agencia_id" component={CatalogoPublico} />
      
      {/* RUTA ADMIN */}
      <Route path="/admin">
        <ProtectedRoute><AdminPanel /></ProtectedRoute>
      </Route>

      {/* RUTAS PROTEGIDAS (Todas vigiladas por el AgencyGuard) */}
      <Route path="/dashboard"><ProtectedRoute><SmartDashboard /></ProtectedRoute></Route>
      <Route path="/leads"><ProtectedRoute><Leads /></ProtectedRoute></Route>
      <Route path="/pipeline"><ProtectedRoute><Pipeline /></ProtectedRoute></Route>
      <Route path="/propiedades"><ProtectedRoute><Propiedades /></ProtectedRoute></Route>
      
      {/* <-- LA NUEVA RUTA DE PORTALES PROTEGIDA --> */}
      <Route path="/portales"><ProtectedRoute><Portales /></ProtectedRoute></Route>
      
      <Route path="/agenda"><ProtectedRoute><Agenda /></ProtectedRoute></Route>
      <Route path="/historico"><ProtectedRoute><Historico /></ProtectedRoute></Route>
      <Route path="/informes"><ProtectedRoute><Informes /></ProtectedRoute></Route>
      <Route path="/inversion"><ProtectedRoute><Inversion /></ProtectedRoute></Route>
      <Route path="/ia-predictor"><ProtectedRoute><IAPredictor /></ProtectedRoute></Route>
      <Route path="/perfil"><ProtectedRoute><Perfil /></ProtectedRoute></Route>
      
      {/* REDIRECCIÓN POR DEFECTO */}
      <Route>
        <ProtectedRoute><SmartDashboard /></ProtectedRoute>
      </Route>
    </Switch>
  );
}