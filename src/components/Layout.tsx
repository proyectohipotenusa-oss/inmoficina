import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { 
  LayoutDashboard, Users, KanbanSquare, Building2, 
  Calendar, LineChart, Sparkles, UserCircle, LogOut, 
  Menu, X, FileText, TrendingUp, LifeBuoy, Rss
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { perfil } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // CIERRE DE SESIÓN SUAVE (Sin parpadeo cutre)
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      // Limpiamos la caché del navegador para no dejar rastros
      localStorage.clear();
      sessionStorage.clear();
      // Usamos el enrutador nativo de React para un deslizamiento limpio al Login
      setLocation('/login');
    }
  };

  const NavItem = ({ href, icon: Icon, label, isBottom = false }: { href: string, icon: any, label: string, isBottom?: boolean }) => {
    const active = location === href;
    return (
      <Link href={href}>
        <a onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          active ? 'bg-brand-500/10 text-brand-400' : 'text-white/50 hover:bg-white/5 hover:text-white'
        } ${isBottom ? 'mt-auto border-t border-white/5 pt-4' : ''}`}>
          <Icon size={18} className={active ? 'text-brand-400' : 'text-white/40'} />
          <span className="font-medium text-sm">{label}</span>
          {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
        </a>
      </Link>
    );
  };

  const isAdmin = perfil?.rol === 'admin';

  return (
    <div className="min-h-screen bg-ink-950 flex font-sans selection:bg-brand-500/30">
      <button className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-ink-900 border border-white/10 flex items-center justify-center text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-center border-b border-white/5 shrink-0 pt-2 pb-2">
          <Logo size={60} />
        </div>

        <div className="flex-1 flex flex-col px-4 py-6 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4 px-4">
            {isAdmin ? 'ADMINISTRACIÓN' : 'AGENCIA'}
          </div>
          
          <div className="flex flex-col flex-1 gap-1">
            {isAdmin ? (
              <NavItem href="/admin" icon={LayoutDashboard} label="Panel Admin" />
            ) : (
              <>
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem href="/leads" icon={Users} label="Leads" />
                <NavItem href="/pipeline" icon={KanbanSquare} label="Pipeline" />
                <NavItem href="/propiedades" icon={Building2} label="Propiedades" />
                <NavItem href="/portales" icon={Rss} label="Sincronización Portales" />
                <NavItem href="/agenda" icon={Calendar} label="Agenda" />
                <NavItem href="/historico" icon={LineChart} label="Ventas" />
                <NavItem href="/informes" icon={FileText} label="Informes CMA" />
                <NavItem href="/inversion" icon={TrendingUp} label="Dossier Inversionista" />
                <NavItem href="/ia-predictor" icon={Sparkles} label="IA Predictor" />
              </>
            )}
            
            {/* Sección Inferior de Cuenta y Soporte */}
            <div className="mt-auto pt-6 pb-2 space-y-1">
              <NavItem href="/perfil" icon={UserCircle} label="Perfil" />
              <a 
                href="mailto:admin@inmoficina.es?subject=Necesito%20ayuda%20con..." 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <LifeBuoy size={18} className="text-white/40" />
                <span className="font-medium text-sm">Soporte Técnico</span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 shrink-0 bg-ink-900">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-400 font-bold shrink-0 overflow-hidden">
              {perfil?.avatar_url ? <img src={perfil.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : (perfil?.nombre || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{perfil?.nombre}</div>
              <div className="text-[10px] text-white/40 truncate">{perfil?.email}</div>
            </div>
            <button onClick={handleSignOut} className="h-8 w-8 flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition shrink-0" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-64`}>
        <header className="h-20 bg-ink-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight hidden md:flex items-baseline gap-2">
              <span className="text-white">Inmoficina</span>
              <span className="text-brand-400 text-sm tracking-widest uppercase font-semibold">Luxury CRM</span>
            </h1>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </div>
  );
}