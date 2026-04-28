import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { 
  LayoutDashboard, Users, KanbanSquare, Building2, 
  Calendar, LineChart, Sparkles, UserCircle, LogOut, 
  Menu, X, FileText, TrendingUp, LifeBuoy, Rss, Lock
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { perfil } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [planAgencia, setPlanAgencia] = useState<'estandar' | 'premium'>('premium');

  useEffect(() => {
    if (perfil?.agencia_id) {
      supabase.from('agencias').select('plan').eq('id', perfil.agencia_id).single()
        .then(({ data }) => {
          if (data) setPlanAgencia(data.plan as any);
        });
    }
  }, [perfil?.agencia_id]);

  // CIERRE DE SESIÓN SUAVE
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setLocation('/login');
    }
  };

  const NavItem = ({ href, icon: Icon, label, premium = false }: { href: string, icon: any, label: string, premium?: boolean }) => {
    const active = location === href;
    const isLocked = premium && planAgencia === 'estandar';

    const handleClick = (e: React.MouseEvent) => {
      if (isLocked) {
        e.preventDefault();
        setShowUpgradeModal(true);
      } else {
        setIsMobileMenuOpen(false);
      }
    };

    return (
      <Link href={isLocked ? '#' : href}>
        <a 
          onClick={handleClick}
          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            active ? 'bg-brand-500/10 text-brand-400' : 'text-white/50 hover:bg-white/5 hover:text-white'
          } ${isLocked ? 'cursor-default' : ''}`}
        >
          <Icon size={16} className={active ? 'text-brand-400' : 'text-white/40'} />
          <span className="font-medium text-[13px]">{label}</span>
          
          {isLocked && (
            <div className="ml-auto relative flex items-center">
              <Lock size={12} className="text-amber-500/50 group-hover:text-amber-500 transition-colors" />
            </div>
          )}
          
          {active && !isLocked && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
        </a>
      </Link>
    );
  };

  const isAdmin = perfil?.rol === 'admin';

  return (
    <div className="min-h-screen bg-ink-950 flex font-sans selection:bg-brand-500/30 overflow-x-hidden w-full">
      <button className="lg:hidden fixed top-3 left-3 z-50 h-10 w-10 rounded-xl bg-ink-900 border border-white/10 flex items-center justify-center text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-center border-b border-white/5 shrink-0">
          <Logo size={48} />
        </div>

        <div className="flex-1 flex flex-col px-3 py-4 overflow-y-auto custom-scrollbar">
          <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-3 px-3">
            {isAdmin ? 'ADMINISTRACIÓN' : 'AGENCIA'}
          </div>
          
          <div className="flex flex-col flex-1 gap-0.5">
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
                <NavItem href="/informes" icon={FileText} label="Informes CMA" premium />
                <NavItem href="/inversion" icon={TrendingUp} label="Dossier Inversionista" premium />
                <NavItem href="/ia-predictor" icon={Sparkles} label="IA Predictor" premium />
              </>
            )}
            
            <div className="mt-auto pt-4 border-t border-white/5 mt-4 space-y-0.5">
              <NavItem href="/perfil" icon={UserCircle} label="Perfil" />
              {/* ENLACE INTELIGENTE DE SOPORTE */}
              <Link href={isAdmin ? "/admin" : "/soporte"}>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/5 hover:text-white">
                  <LifeBuoy size={16} className="text-white/40" />
                  <span className="font-medium text-[13px]">{isAdmin ? 'Ver Tickets' : 'Soporte Técnico'}</span>
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/5 shrink-0 bg-ink-950/30">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-400 font-bold shrink-0 overflow-hidden">
              {perfil?.avatar_url ? <img src={perfil.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : (perfil?.nombre || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-white truncate leading-tight">{perfil?.nombre}</div>
              <div className="text-[9px] text-white/40 truncate mt-0.5">{perfil?.email}</div>
            </div>
            <button onClick={handleSignOut} className="h-8 w-8 flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-64 max-w-full overflow-x-hidden">
        <header className="h-16 bg-ink-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-xl font-bold tracking-tight hidden md:flex items-baseline gap-2 pl-12 lg:pl-0">
              <span className="text-white">Inmoficina</span>
              <span className="text-brand-400 text-xs tracking-widest uppercase font-semibold">Luxury CRM</span>
            </h1>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-ink-900 border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl animate-slide-up">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <Sparkles size={32} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pásate a Premium</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Esta función está reservada para el plan Premium. Mejora tu cuenta para desbloquear informes inteligentes, dossiers de inversión y más.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = 'mailto:admin@inmoficina.es?subject=Mejorar%20mi%20plan%20a%20Premium'}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20"
              >
                Hablar con soporte
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Ahora no, gracias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}