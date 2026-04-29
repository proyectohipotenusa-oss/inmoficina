import { useLocation } from 'wouter';
import { LayoutDashboard, Users, KanbanSquare, Building2, Calendar, LineChart, Sparkles, CircleUser as UserCircle, Shield, LogOut, X } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface Props { open: boolean; onClose: () => void; }

const agentNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/propiedades', label: 'Propiedades', icon: Building2 },
  { to: '/agenda', label: 'Agenda', icon: Calendar }, // AÑADIDO
  { to: '/historico', label: 'Ventas', icon: LineChart }, // CAMBIADO EL NOMBRE A "Ventas"
  { to: '/ia-predictor', label: 'IA Predictor', icon: Sparkles },
  { to: '/perfil', label: 'Perfil', icon: UserCircle },
];

export function Sidebar({ open, onClose }: Props) {
  const [location, setLocation] = useLocation();
  const { perfil, signOut } = useAuth();
  const isAdmin = perfil?.rol === 'admin';

  const handleNav = (path: string) => {
    setLocation(path);
    onClose();
  };

  return (
    <>
      <div className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[270px] flex flex-col bg-ink-900/90 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <Logo size={46} withText />
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><X size={18} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {isAdmin ? (
            <>
              <div className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Superadmin</div>
              <button onClick={() => handleNav('/admin')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${location.startsWith('/admin') ? 'bg-brand-500/15 text-white ring-1 ring-brand-500/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <Shield size={18} className={location.startsWith('/admin') ? 'text-brand-400' : ''} />
                <span>Gestión de Agencias</span>
                {location.startsWith('/admin') && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500 shadow-glow" />}
              </button>
              <p className="mt-5 px-3 text-[11px] leading-relaxed text-white/40">
                Como Superadmin solo gestionas el alta y administración de agencias. Las vistas de agente quedan reservadas a los usuarios vinculados a una agencia.
              </p>
            </>
          ) : (
            <>
              <div className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Agencia</div>
              {agentNav.map(({ to, label, icon: Icon }) => {
                const active = location === to || location.startsWith(to + '/');
                return (
                  <button key={to} onClick={() => handleNav(to)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-white/5 text-white ring-1 ring-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                    <Icon size={18} className={active ? 'text-brand-400' : ''} />
                    <span>{label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500 shadow-glow" />}
                  </button>
                );
              })}
            </>
          )}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-sm font-semibold shadow-glow">
              {(perfil?.nombre || perfil?.email || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white font-medium truncate">{perfil?.nombre || perfil?.email || 'Usuario'}</div>
              <div className="text-[11px] text-white/40 truncate">{isAdmin ? 'Superadmin' : (perfil?.agencia_id ? `@${perfil.agencia_id}` : 'sin agencia')}</div>
            </div>
            <button onClick={() => signOut()} className="p-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}