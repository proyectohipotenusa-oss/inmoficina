import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Users, LayoutDashboard, Building2, Rss, Calendar, 
  LineChart, FileText, TrendingUp, Sparkles, UserCircle,
  ArrowRight, CheckCircle2, Trophy, BookOpen, ChevronRight,
  Zap, Landmark, MousePointerClick
} from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Tutorial() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tutorialSections = [
    { id: "perfil", icon: UserCircle, title: "1. Perfil y Marca Blanca", desc: "Identidad Corporativa Automática.", content: "Configura tu foto y el logo de tu agencia. El sistema inyectará esta información en cada informe y ficha pública, garantizando un branding de marca blanca impecable.", accent: "from-blue-500/20" },
    { id: "dashboard", icon: LayoutDashboard, title: "2. Dashboard de Control", desc: "Tu pulso diario de negocio.", content: "Visualiza de un vistazo la salud de tu agencia. El sistema alerta con iconos de fuego (Flame) sobre leads fríos y destaca las tareas urgentes para que no se pierda ninguna oportunidad.", accent: "from-brand-500/20" },
    { id: "leads", icon: Users, title: "3. Gestión de Leads", desc: "Base de datos inteligente.", content: "Registra cada interesado y mantén un historial de interacciones. Clasifica tus prospectos para saber exactamente a quién llamar y cuándo.", accent: "from-indigo-500/20" },
    { id: "pipeline", icon: MousePointerClick, title: "4. Pipeline Kanban", desc: "El flujo de tus ventas.", content: "Arrastra y suelta tus clientes a través de las etapas del cierre. Desde el contacto inicial hasta la firma en notaría, controla el proceso visualmente.", accent: "from-purple-500/20" },
    { id: "propiedades", icon: Building2, title: "5. Catálogo y Fichas VIP", desc: "Presentaciones inmersivas.", content: "Convierte cada inmueble en una página web exclusiva. Envía links VIP por WhatsApp con galerías fluidas, mapas y calculadoras hipotecarias integradas.", accent: "from-emerald-500/20" },
    { id: "portales", icon: Rss, title: "6. Sincronización Portales", desc: "Visibilidad máxima sin trabajo manual.", content: "Publica en portales líderes con un clic. Actualiza precios o fotos en el CRM y el cambio se propagará automáticamente a todas partes.", accent: "from-orange-500/20" },
    { id: "agenda", icon: Calendar, title: "7. Agenda Inteligente", desc: "Tu asistente personal inmobiliario.", content: "Organiza visitas, llamadas y reuniones. Las tareas olvidadas se reportan al Dashboard para asegurar que nada caiga en el olvido.", accent: "from-pink-500/20" },
    { id: "ventas", icon: LineChart, title: "8. Histórico de Ventas", desc: "Análisis de rendimiento.", content: "Documenta tus éxitos y analiza los tiempos de cierre. Estos datos te permitirán demostrar autoridad ante futuros propietarios.", accent: "from-cyan-500/20" },
    { id: "informes", icon: FileText, title: "9. Informes CMA Pro", desc: "Análisis comparativo de mercado.", content: "Genera PDF profesionales para justificar el precio de mercado. Calcula el Neto Propietario restando gastos e impuestos de forma automática.", accent: "from-amber-500/20" },
    { id: "inversion", icon: Landmark, title: "10. Dossier Inversionista", desc: "El lenguaje de la rentabilidad.", content: "Habla con números: ROI, Yield y Cash Flow. Informes automáticos para clientes que buscan inversiones inmobiliarias sólidas.", accent: "from-blue-600/20" },
    { id: "ia-predictor", icon: Sparkles, title: "11. IA Predictor de Valor", desc: "Big Data a tu servicio.", content: "Tasación instantánea basada en 11.752 códigos postales. Demuestra precisión técnica delante del cliente desde la primera visita.", accent: "from-brand-400/20" }
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden w-full relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap'); 
        .font-sans { font-family: 'Inter', sans-serif; } 
        .font-serif { font-family: 'Playfair Display', serif; } 
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAVBAR REPLICADA */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-1' : 'bg-transparent py-3'}`}>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/"><a className="flex items-center gap-3 group cursor-pointer">
            <img src={LOGO_URL} alt="Logo" className="w-[42px] h-[42px] rounded-lg opacity-90" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90 hidden sm:block">INMOFICINA</span>
          </a></Link>
          <div className="hidden lg:flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] font-medium text-white/50">
            <Link href="/#servicios"><a className="hover:text-white transition-colors">Funcionalidades</a></Link>
            <Link href="/tutorial"><a className="hover:text-white transition-colors text-brand-400">Tutorial de Uso</a></Link>
            <Link href="/soporte"><a className="hover:text-white transition-colors">Soporte</a></Link>
            <Link href="/#precios"><a className="hover:text-white transition-colors">Inversión</a></Link>
            <Link href="/#contacto"><a className="hover:text-white transition-colors">Contacto</a></Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"><a className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all">Acceso</a></Link>
          </div>
        </div>
      </nav>

      {/* HERO TUTORIAL */}
      <section className="relative pt-48 pb-24 text-center w-full flex flex-col justify-center items-center px-4">
        <div className="max-w-3xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/60 text-[9px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            <BookOpen size={12} className="text-brand-400" /> Centro de Conocimiento VIP
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium leading-[1.1] mb-8">Manual Maestro <span className="italic text-white/80">Luxury CRM.</span></h1>
          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto mb-10 leading-relaxed font-light">Guía técnica y estratégica para dominar el ecosistema digital de Inmoficina.</p>
        </div>
      </section>

      {/* SECCIONES TUTORIAL */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 space-y-32">
          {tutorialSections.map((section, index) => (
            <div key={section.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.accent} to-transparent border border-white/10 flex items-center justify-center shadow-xl`}>
                  <section.icon className="text-brand-400" size={28} />
                </div>
                <h2 className="font-serif text-3xl font-medium text-white/90">{section.title}</h2>
                <h3 className="text-brand-400 text-xs font-bold uppercase tracking-widest">{section.desc}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-light text-justify">{section.content}</p>
              </div>
              <div className="relative group">
                <div className={`absolute -inset-4 bg-gradient-to-br ${section.accent} to-transparent rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                <div className="relative rounded-[1.5rem] border border-white/10 overflow-hidden shadow-2xl bg-ink-900 aspect-video flex items-center justify-center">
                   {/* AQUÍ REEMPLAZA ESTE DIV POR LA IMAGEN CUANDO LAS TENGAS */}
                   <div className="text-center p-8">
                     <section.icon className="mx-auto mb-4 text-white/5" size={64} />
                     <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Captura {section.id}</div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER REPLICADO */}
      <footer className="py-12 px-4 border-t border-white/5 bg-ink-950 w-full relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-12">
          <div className="md:col-span-2 text-center sm:text-left">
            <img src={LOGO_URL} className="w-[48px] h-[48px] mb-6 opacity-80 mx-auto sm:mx-0" alt="Logo" />
            <p className="text-white/30 text-[11px] font-light max-w-sm mx-auto sm:mx-0 italic">"La tecnología no sustituye al agente, lo hace extraordinario."</p>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-[9px] font-bold uppercase text-brand-400 tracking-[0.2em] mb-6">Navegación</h4>
            <div className="flex flex-col gap-3 text-white/50 text-[11px] font-medium uppercase tracking-widest">
              <Link href="/tutorial"><a className="text-white">Tutorial de Uso</a></Link>
              <Link href="/soporte"><a>Soporte Técnico</a></Link>
              <Link href="/#hero"><a>Landing Principal</a></Link>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-[9px] font-bold uppercase text-white/40 tracking-[0.2em] mb-6">Legal</h4>
            <div className="flex flex-col gap-3 text-white/40 text-[11px] font-light italic">
              <a href={TEMPORARY_LEGAL_URL}>Privacidad</a>
              <a href={TEMPORARY_LEGAL_URL}>Aviso Legal</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Inmoficina Luxury.</p>
          <p className="mt-4 md:mt-0">Ecosistema Inmobiliario de Alto Rendimiento</p>
        </div>
      </footer>
    </div>
  );
}