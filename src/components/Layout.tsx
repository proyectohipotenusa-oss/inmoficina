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

  // Cargamos el plan de la agencia
  useEffect(() => {
    if (perfil?.agencia_id) {
      supabase.from('agencias').select('plan').eq('id', perfil.agencia_id).single()
        .then(({ data }) => {
          if (data) setPlanAgencia(data.plan as any);
        });
    }
  }, [perfil?.agencia_id]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setLocation('/login');
    }
  };

  const NavItem = ({ href, icon: Icon, label, isBottom = false, premium = false }: { href: string, icon: any, label: string, isBottom?: boolean, premium?: boolean }) => {
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
          } ${isBottom ? 'mt-auto border-t border-white/5 pt-4' : ''} ${isLocked ? 'cursor-default' : ''}`}
        >
          <Icon size={16} className={active ? 'text-brand-400' : 'text-white/40'} />
          <span className="font-medium text-[13px]">{label}</span>
          
          {isLocked && (
            <div className="ml-auto relative flex items-center">
              <Lock size={12} className="text-amber-500/50 group-hover:text-amber-500 transition-colors" />
              {/* TOOLTIP: El mensajito al pasar el cursor */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-amber-600 text-[10px] text-white font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                Funcionalidad Premium
              </div>
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
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-center border-b border-white/5 shrink-0 pt-2 pb-2">
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
            
            <div className="mt-auto pt-4 pb-1 space-y-0.5">
              <NavItem href="/perfil" icon={UserCircle} label="Perfil" />
              <a href="mailto:admin@inmoficina.es" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/5 hover:text-white">
                <LifeBuoy size={16} className="text-white/40" />
                <span className="font-medium text-[13px]">Soporte Técnico</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-64 max-w-full overflow-x-hidden">
        <header className="h-16 bg-ink-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 border-b border-white/5">
          <button className="lg:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(true)}><Menu size={20}/></button>
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-xl font-bold tracking-tight flex items-baseline gap-2">
              <span className="text-white">Inmoficina</span>
              <span className="text-brand-400 text-xs tracking-widest uppercase font-semibold">Luxury CRM</span>
            </h1>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">{children}</div>
      </main>

      {/* MODAL DE MEJORA (UPGRADE) */}
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
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-500 transition-all"
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