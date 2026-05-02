import { Switch, Route } from 'wouter';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import { Lock, Loader2, Sparkles } from 'lucide-react';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Propiedades from './pages/Propiedades';
import Portales from './pages/Portales';
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
import Tutorial from './pages/Tutorial';
import Soporte from './pages/Soporte';
import { ProtectedRoute } from './components/ProtectedRoute';

function PlanGuard({ children, premium = false }: { children: React.ReactNode, premium?: boolean }) {
  const { perfil, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<{ blocked: boolean, plan: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      if (authLoading || !perfil?.agencia_id) {
        if (!authLoading && perfil?.rol === 'admin') setChecking(false);
        return;
      }
      const { data } = await supabase.from('agencias').select('bloqueada, plan').eq('id', perfil.agencia_id).single();
      setStatus({ blocked: !!data?.bloqueada, plan: data?.plan || 'estandar' });
      setChecking(false);
    }
    check();
  }, [authLoading, perfil]);

  if (authLoading || checking) return <div className="min-h-screen bg-ink-950 flex items-center justify-center"><Loader2 className="animate-spin text-brand-400" /></div>;

  if (perfil?.rol === 'admin') return <>{children}</>;
  
  if (status?.blocked) return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 text-center">
      <Lock size={48} className="text-red-500 mb-4"/>
      <h1 className="text-2xl font-bold text-white">Acceso Suspendido</h1>
      <p className="text-white/50 mt-2">Contacta con administración para reactivar tu cuenta.</p>
    </div>
  );

  if (premium && status?.plan === 'estandar') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-ink-950">
        <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mb-6 border border-brand-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <Sparkles size={40} className="text-brand-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Zona Premium</h1>
        <p className="text-white/50 max-w-sm mb-8">Esta herramienta es exclusiva para usuarios con el Plan Premium de Inmoficina.</p>
        <button onClick={() => window.location.href = '/dashboard'} className="btn-primary px-8 py-2.5 text-xs">Volver al inicio</button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/u/:slug" component={PublicProfile} />
      <Route path="/p/:id" component={FichaPropiedad} /> 
      <Route path="/a/:agencia_id" component={CatalogoPublico} />
      <Route path="/tutorial" component={Tutorial} />
      <Route path="/soporte" component={Soporte} />

      <Route path="/admin"><ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute></Route>
      
      <Route path="/dashboard"><ProtectedRoute><PlanGuard><Dashboard /></PlanGuard></ProtectedRoute></Route>
      <Route path="/leads"><ProtectedRoute><PlanGuard><Leads /></PlanGuard></ProtectedRoute></Route>
      <Route path="/pipeline"><ProtectedRoute><PlanGuard><Pipeline /></PlanGuard></ProtectedRoute></Route>
      <Route path="/propiedades"><ProtectedRoute><PlanGuard><Propiedades /></PlanGuard></ProtectedRoute></Route>
      
      <Route path="/portales"><ProtectedRoute><PlanGuard><Portales /></PlanGuard></ProtectedRoute></Route>
      <Route path="/informes"><ProtectedRoute><PlanGuard premium><Informes /></PlanGuard></ProtectedRoute></Route>
      <Route path="/inversion"><ProtectedRoute><PlanGuard premium><Inversion /></PlanGuard></ProtectedRoute></Route>
      <Route path="/ia-predictor"><ProtectedRoute><PlanGuard premium><IAPredictor /></PlanGuard></ProtectedRoute></Route>

      <Route path="/agenda"><ProtectedRoute><PlanGuard><Agenda /></PlanGuard></ProtectedRoute></Route>
      <Route path="/historico"><ProtectedRoute><PlanGuard><Historico /></PlanGuard></ProtectedRoute></Route>
      
      <Route path="/perfil"><ProtectedRoute><Perfil /></ProtectedRoute></Route>
      
      <Route><ProtectedRoute><PlanGuard><Dashboard /></PlanGuard></ProtectedRoute></Route>
    </Switch>
  );
}