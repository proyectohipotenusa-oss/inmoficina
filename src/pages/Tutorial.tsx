import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Users, LayoutDashboard, Building2, Rss, Calendar, 
  LineChart, FileText, TrendingUp, Sparkles, UserCircle,
  ArrowRight, CheckCircle2, Star, Trophy, Mail, Phone,
  ChevronRight, BookOpen, MousePointerClick, Zap, Landmark, X
} from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const HERO_IMG_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/1777235529301-019dcb7d-a185-7894-8e9f-05d821ff0562.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Tutorial() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tutorialSections = [
    {
      id: "perfil",
      icon: UserCircle,
      title: "1. Perfil y Marca Blanca",
      desc: "El corazón de tu identidad corporativa.",
      content: "Antes de cualquier operación, completa tu perfil. Aquí subes el logo de tu agencia y tus datos de contacto. El sistema inyectará esta información automáticamente en cada informe, dossier y ficha pública, garantizando que el cliente siempre vea tu marca, no la nuestra.",
      accent: "from-blue-500/20"
    },
    {
      id: "dashboard",
      icon: LayoutDashboard,
      title: "2. Dashboard de Control",
      desc: "Gestión por excepción y urgencia.",
      content: "Tu centro de mando. El sistema analiza tus leads y tareas en tiempo real. Si ves un icono de fuego (Flame), significa que un cliente lleva más de 3 días sin atención. Las tareas atrasadas de la agenda aparecerán aquí en rojo. Si el Dashboard está limpio, tu negocio está sano.",
      accent: "from-brand-500/20"
    },
    {
      id: "leads",
      icon: Users,
      title: "3. Gestión de Leads",
      desc: "Tu base de datos de compradores y vendedores.",
      content: "Registra cada contacto. Inmoficina te permite ver el historial completo de interacciones. No es solo una lista de nombres; es una herramienta para entender qué busca el cliente y cuándo es el momento perfecto para volver a llamarlo.",
      accent: "from-indigo-500/20"
    },
    {
      id: "pipeline",
      icon: MousePointerClick,
      title: "4. Pipeline Kanban",
      desc: "Visualiza el flujo del dinero.",
      content: "Arrastra y suelta tus leads a través de las etapas: Contacto, Visita, Negociación y Cierre. Este tablero te permite identificar cuellos de botella al instante. Si la columna de 'Visitas' está llena pero la de 'Negociación' vacía, ya sabes dónde debes mejorar hoy.",
      accent: "from-purple-500/20"
    },
    {
      id: "propiedades",
      icon: Building2,
      title: "5. Catálogo y Fichas VIP",
      desc: "Presentaciones que venden por sí solas.",
      content: "Al subir una propiedad, generas una web inmersiva única. Olvida los PDFs estáticos; envía el link VIP por WhatsApp para que el cliente navegue por la galería, vea el mapa y calcule su hipoteca en tiempo real con una interfaz de lujo.",
      accent: "from-emerald-500/20"
    },
    {
      id: "portales",
      icon: Rss,
      title: "6. Sincronización de Portales",
      desc: "Multiplica tu visibilidad sin esfuerzo.",
      content: "Conecta tu catálogo con Idealista, Fotocasa y más. Publica o actualiza precios una sola vez en el CRM y el cambio se propagará a todas las plataformas automáticamente, ahorrándote horas de trabajo administrativo a la semana.",
      accent: "from-orange-500/20"
    },
    {
      id: "agenda",
      icon: Calendar,
      title: "7. Agenda Inteligente",
      desc: "Organización total del agente.",
      content: "Visitas, llamadas y firmas centralizadas. Cada tarea está vinculada a un inmueble o a un lead. El sistema te recordará tus compromisos y marcará como 'atrasado' cualquier evento que no cierres, reportándolo directamente al Dashboard.",
      accent: "from-pink-500/20"
    },
    {
      id: "ventas",
      icon: LineChart,
      title: "8. Histórico de Ventas",
      desc: "El registro de tu éxito.",
      content: "Documenta cada cierre exitoso. Guardar el precio final de venta y los plazos de cierre genera las métricas de rendimiento de tu agencia, permitiéndote demostrar a futuros propietarios que eres el que más y mejor vende en la zona.",
      accent: "from-cyan-500/20"
    },
    {
      id: "informes",
      icon: FileText,
      title: "9. Informes CMA Pro",
      desc: "La herramienta definitiva para captar en exclusiva.",
      content: "Genera análisis comparativos de mercado con diseño editorial. El informe calcula el 'Neto Propietario', restando impuestos y comisiones del precio de venta. Es la forma más profesional de justificar una valoración y cerrar la exclusiva.",
      accent: "from-amber-500/20"
    },
    {
      id: "inversion",
      icon: Landmark,
      title: "10. Dossier Inversionista",
      desc: "Habla el idioma de los grandes capitales.",
      content: "Reportes automáticos que calculan ROI, Cash Flow y Yield Neto. Diseñado para inversores que necesitan ver rentabilidad antes que ladrillos. Incluye un QR dinámico que conecta el papel con la ficha digital interactiva.",
      accent: "from-blue-600/20"
    },
    {
      id: "ia-predictor",
      icon: Sparkles,
      title: "11. IA Predictor de Valor",
      desc: "Tasación de precisión en segundos.",
      content: "Nuestra IA analiza datos de 11.752 códigos postales en España. Introduce los metros, el estado y el CP para obtener una valoración técnica instantánea. Úsalo delante del cliente para ganar autoridad inmediata basada en Big Data.",
      accent: "from-brand-400/20"
    }
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden w-full relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap'); 
        .font-sans { font-family: 'Inter', sans-serif; } 
        .font-serif { font-family: 'Playfair Display', serif; } 
        html { scroll-behavior: smooth; }
      `}</style>
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* NAVBAR IDÉNTICA A LANDING */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-1' : 'bg-transparent py-3'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/"><a className="flex items-center gap-3 group cursor-pointer">
            <img src={LOGO_URL} alt="Logo" className="w-[42px] h-[42px] rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90 hidden sm:block">INMOFICINA</span>
          </a></Link>
          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-white/50">
            <Link href="/#servicios"><a className="hover:text-white transition-colors">Funcionalidades</a></Link>
            <Link href="/#por-que-nosotros"><a className="hover:text-white transition-colors">La Diferencia</a></Link>
            <Link href="/#precios"><a className="hover:text-white transition-colors">Inversión</a></Link>
            <Link href="/#faq"><a className="hover:text-white transition-colors">Q&A</a></Link>
            <Link href="/#contacto"><a className="hover:text-white transition-colors">Contacto</a></Link>
            <Link href="/tutorial"><a className="text-brand-400 border-b-2 border-brand-500 pb-1 font-black cursor-default">Tutorial</a></Link>
            <Link href="/soporte"><a className="hover:text-white transition-colors">Soporte</a></Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"><a className="hidden sm:block text-[11px] font-medium uppercase tracking-widest hover:text-brand-400 text-white/70 transition-colors">Acceso</a></Link>
            <Link href="/"><a className="hidden sm:block px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all">
              Probar Gratis
            </a></Link>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-brand-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="4" width="24" height="2.5" rx="1.25" fill="currentColor"/>
                <rect y="10.75" width="24" height="2.5" rx="1.25" fill="currentColor"/>
                <rect y="17.5" width="24" height="2.5" rx="1.25" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU IDÉNTICO A LANDING (FUERA DEL HEADER) */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-ink-950 h-full border-l border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-5 text-xs uppercase tracking-widest font-medium text-white/70">
              <Link href="/#servicios"><a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Funcionalidades</a></Link>
              <Link href="/#por-que-nosotros"><a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">La Diferencia</a></Link>
              <Link href="/#precios"><a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Inversión</a></Link>
              <Link href="/#faq"><a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Q&A</a></Link>
              <Link href="/#contacto"><a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Contacto</a></Link>
              <Link href="/tutorial"><a onClick={() => setIsMobileMenuOpen(false)} className="text-brand-400 font-black">Tutorial</a></Link>
              <Link href="/soporte"><a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Soporte</a></Link>
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4 mt-2">
                <Link href="/"><a onClick={() => setIsMobileMenuOpen(false)} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all text-center">
                  Probar Gratis
                </a></Link>
                <Link href="/login"><a onClick={() => setIsMobileMenuOpen(false)} className="text-brand-400 hover:text-white transition-colors">Acceso</a></Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO TUTORIAL (TU CONTENIDO ORIGINAL) */}
      <section className="relative pt-48 pb-24 text-center w-full flex flex-col justify-center items-center px-4">
        <div className="max-w-3xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/60 text-[9px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            <BookOpen size={12} className="text-brand-400" /> Centro de Conocimiento VIP
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium leading-[1.1] mb-8">
            Domina <span className="italic text-white/80">Inmoficina.</span> <br/>
            Escala tu <span className="italic text-white/80">Agencia.</span>
          </h1>
          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Guía paso a paso para exprimir cada herramienta del CRM y convertirlas en argumentos de venta imbatibles.
          </p>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto animate-bounce text-white/20">
            <ChevronRight size={24} className="rotate-90" />
          </div>
        </div>
      </section>

      {/* CONTENIDO DEL TUTORIAL (TU CONTENIDO ORIGINAL) */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 space-y-32">
          {tutorialSections.map((section, index) => (
            <div key={section.id} id={section.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-6 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.accent} to-transparent border border-white/10 flex items-center justify-center shadow-xl`}>
                  <section.icon className="text-brand-400" size={28} />
                </div>
                <h2 className="font-serif text-3xl font-medium text-white/90">{section.title}</h2>
                <h3 className="text-brand-400 text-xs font-bold uppercase tracking-widest">{section.desc}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-light text-justify">
                  {section.content}
                </p>
                <div className="pt-4 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/20">
                  <CheckCircle2 size={14} className="text-emerald-500/40" /> Herramienta Certificada Luxury
                </div>
              </div>
              
              <div className={`relative group ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className={`absolute -inset-4 bg-gradient-to-br ${section.accent} to-transparent rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                <div className="relative rounded-[1.5rem] border border-white/10 overflow-hidden shadow-2xl bg-ink-900 aspect-video flex items-center justify-center">
                   {/* Aquí iría un screenshot o vídeo de la sección */}
                   <div className="text-center p-8">
                     <section.icon className="mx-auto mb-4 text-white/5" size={64} />
                     <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Vista Previa del Módulo</div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL (TU CONTENIDO ORIGINAL) */}
      <section className="py-32 px-4 text-center border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-2xl mx-auto">
          <Zap size={40} className="text-brand-400 mx-auto mb-8 animate-pulse" />
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">¿Listo para empezar?</h2>
          <p className="text-white/40 text-sm mb-10 font-light">Accede ahora a tu panel y pon en práctica todo lo aprendido.</p>
          <Link href="/login"><a className="px-10 py-4 bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 inline-flex items-center gap-3">
            Entrar al CRM <ArrowRight size={16} />
          </a></Link>
        </div>
      </section>

      {/* FOOTER IDÉNTICO A LANDING */}
      <footer id="footer" className="py-10 px-4 border-t border-white/5 bg-ink-950 w-full text-center sm:text-left relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/5 pb-10">
          <div className="md:col-span-2">
            <img src={LOGO_URL} className="w-[48px] h-[48px] mb-4 opacity-80 mx-auto sm:mx-0" alt="Logo Footer" />
            <p className="text-white/40 text-xs font-light max-w-sm mx-auto sm:mx-0 leading-relaxed">
              CRM diseñado exclusivamente para profesionalizar más aún tu agencia inmobiliaria.
            </p>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Menú</h4>
            <div className="flex flex-col gap-2.5 text-white/40 text-xs uppercase tracking-widest">
              <Link href="/#servicios"><a className="hover:text-white transition-colors">Funcionalidades</a></Link>
              <Link href="/#por-que-nosotros"><a className="hover:text-white transition-colors">La Diferencia</a></Link>
              <Link href="/#precios"><a className="hover:text-white transition-colors">Inversión</a></Link>
              <Link href="/#faq"><a className="hover:text-white transition-colors">Q&A</a></Link>
              <Link href="/#contacto"><a className="hover:text-white transition-colors">Contacto</a></Link>
              <Link href="/tutorial"><a className="text-brand-400 font-bold">Tutorial</a></Link>
              <Link href="/soporte"><a className="hover:text-white transition-colors">Soporte</a></Link>
            </div>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5 text-white/40 text-xs">
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Política de Cookies</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacidad</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Aviso Legal</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Condiciones de Uso</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Contratación</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 font-medium">
          <p>© {new Date().getFullYear()} Inmoficina. Una marca de Hipotenusa Online.</p>
          <p className="uppercase tracking-widest mt-2 md:mt-0">Designed in Spain</p>
        </div>
      </footer>
    </div>
  );
}