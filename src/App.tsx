import { Switch, Route, Redirect } from 'wouter';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing'; // <-- IMPORTAMOS LA LANDING PAGE
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Propiedades from './pages/Propiedades';
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

function SmartDashboard() {
  const { perfil, session } = useAuth();
  
  // EL FIX DEL FLASH: Si hay sesión pero aún no ha llegado el perfil de la base de datos, 
  // no renderizamos nada (pantalla de carga invisible) para que no haya parpadeo.
  if (session && !perfil) {
    return null; 
  }
  
  if (perfil?.rol === 'admin') {
    return <Redirect to="/admin" />;
  }
  
  return <Dashboard />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  
  if (loading) return null;
  if (!session) return <Redirect to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Switch>
      {/* LA NUEVA LANDING PAGE COMO RUTA PRINCIPAL PÚBLICA */}
      <Route path="/" component={Landing} />
      
      <Route path="/login" component={Login} />
      
      {/* RUTAS PÚBLICAS (Cualquier cliente las puede ver sin login) */}
      <Route path="/u/:slug" component={PublicProfile} />
      <Route path="/p/:id" component={FichaPropiedad} /> 
      <Route path="/a/:agencia_id" component={CatalogoPublico} />
      
      <Route path="/admin">
        <ProtectedRoute><AdminPanel /></ProtectedRoute>
      </Route>

      {/* EL DASHBOARD AHORA VIVE EN SU PROPIA RUTA */}
      <Route path="/dashboard">
        <ProtectedRoute><SmartDashboard /></ProtectedRoute>
      </Route>

      <Route path="/leads"><ProtectedRoute><Leads /></ProtectedRoute></Route>
      <Route path="/pipeline"><ProtectedRoute><Pipeline /></ProtectedRoute></Route>
      <Route path="/propiedades"><ProtectedRoute><Propiedades /></ProtectedRoute></Route>
      <Route path="/agenda"><ProtectedRoute><Agenda /></ProtectedRoute></Route>
      <Route path="/historico"><ProtectedRoute><Historico /></ProtectedRoute></Route>
      <Route path="/informes"><ProtectedRoute><Informes /></ProtectedRoute></Route>
      <Route path="/inversion"><ProtectedRoute><Inversion /></ProtectedRoute></Route>
      <Route path="/ia-predictor"><ProtectedRoute><IAPredictor /></ProtectedRoute></Route>
      <Route path="/perfil"><ProtectedRoute><Perfil /></ProtectedRoute></Route>
      
      <Route>
        <ProtectedRoute><SmartDashboard /></ProtectedRoute>
      </Route>
    </Switch>
  );
}