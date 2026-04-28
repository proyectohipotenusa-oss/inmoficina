import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, Smartphone, Rss,
  ArrowRight, CheckCircle2, Star, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, 
  MousePointerClick, Mail, Phone, MapPin, Zap, Building2, ChevronDown, Users, QrCode, FileText, UserCircle, TrendingUp
} from 'lucide-react';
// IMPORTACIÓN CORRECTA PARA EVITAR EL ERROR
import { formatEUR } from '../lib/format';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const HERO_IMG_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/1777235529301-019dcb7d-a185-7894-8e9f-05d821ff0562.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ESTADO PARA EL DESCUENTO ANUAL
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nombre_agencia: '', direccion: '', ciudad: '', codigo_postal: '', contacto_nombre: '', telefono: '', email: ''
  });

  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactData, setContactData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    const { error } = await supabase.from('solicitudes_registro').insert([formData]);
    if (error) setFormStatus('error'); else setFormStatus('success');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    const payload = {
      nombre: contactData.nombre,
      email: contactData.email,
      telefono: contactData.telefono || null,
      mensaje: contactData.mensaje
    };

    const { error } = await supabase.from('mensajes_contacto').insert([payload]);
    if (error) setContactStatus('error'); 
    else { 
      setContactStatus('success'); 
      setContactData({ nombre: '', email: '', telefono: '', mensaje: '' }); 
    }
  };

  const FAQS = [
    { q: "¿Tengo que introducir mi tarjeta de crédito para la prueba gratis?", a: "Absolutamente no. Queremos que pruebes todo el potencial de Inmoficina durante 14 días sin compromiso ni riesgo." },
    { q: "¿Es Inmoficina difícil de usar?", a: "Al contrario. Es intuitivo y minimalista. Si sabes usar WhatsApp, sabrás usar Inmoficina desde el primer minuto." },
    { q: "¿Qué sucede al finalizar los 14 días de prueba?", a: "Tú decides. Si te encanta, puedes elegir el plan que mejor se adapte a ti. Si no, tu cuenta se pausará sin ningún cargo automático." },
    { q: "¿Cómo ayuda la Inteligencia Artificial a vender más?", a: "Nuestra IA analiza los datos de la propiedad y redacta memorias descriptivas aplicando técnicas de copywriting persuasivo." },
    { q: "¿Hay permanencia?", a: "No. Gánamos tu confianza mes a mes. Cancelas cuando quieras con un clic." }
  ];

  const PREMIUM_FEATURES = [
    { text: "Licencia para 3 usuarios", icon: Users, isExclusive: false },
    { text: "Fichas VIP Inmersivas", icon: Globe, isExclusive: false },
    { text: "Multipublicación Portales", icon: Rss, isExclusive: false },
    { text: "Pipeline y Gestión Leads", icon: MousePointerClick, isExclusive: false },
    { text: "Códigos QR Dinámicos", icon: QrCode, isExclusive: false },
    { text: "Compresión Fotos Nube", icon: Zap, isExclusive: false },
    { text: "Informes CMA Ilimitados", icon: FileText, isExclusive: true },
    { text: "Dossiers Inversión Pro", icon: Landmark, isExclusive: true },
    { text: "IA de Redacción Integrada", icon: Sparkles, isExclusive: true },
    { text: "Catálogo Público Digital", icon: LayoutDashboard, isExclusive: true }
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

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-1' : 'bg-transparent py-3'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group cursor-pointer">
            <img src={LOGO_URL} alt="Logo" className="w-[42px] h-[42px] rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90 hidden sm:block">INMOFICINA</span>
          </a>
          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-white/50">
            <a href="#servicios" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#por-que-nosotros" className="hover:text-white transition-colors">La Diferencia</a>
            <a href="#precios" className="hover:text-white transition-colors">Inversión</a>
            <a href="#faq" className="hover:text-white transition-colors">Q&A</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] font-medium uppercase tracking-widest hover:text-brand-400 text-white/70 transition-colors">Acceso</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative pt-32 pb-16 text-center w-full min-h-[85vh] flex flex-col justify-center items-center">
        <div className="max-w-3xl mx-auto z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/60 text-[9px] font-medium uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <Trophy size={12} className="text-brand-400/80" /> Digitaliza tu agencia inmobiliaria
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium leading-[1.1] mb-6">
            Vende Lujo, <span className="italic text-white/80">No Ladrillo.</span>
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            El CRM concebido para agencias inmobiliarias que entienden que la marca propia es su activo más valioso. Sin tarjeta de crédito.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium uppercase tracking-widest text-[11px] hover:bg-brand-500 transition-all flex items-center justify-center gap-2">
              Comenzar 14 días gratis <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* PRECIOS CON DESCUENTO ANUAL */}
      <section id="precios" className="py-24 bg-gradient-to-b from-brand-900/10 via-ink-900/40 to-ink-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 text-brand-500">Inversión Inteligente</h2>
          <p className="text-white/50 text-sm font-light mb-10">Escala las herramientas de tu agencia a medida que creces.</p>
          
          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 bg-ink-900/60 rounded-xl border border-white/10 mb-6">
            <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Mensual</button>
            <button onClick={() => setBillingCycle('annual')} className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white'}`}>
              Anual <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px]">-15%</span>
            </button>
          </div>
          {billingCycle === 'annual' && (
            <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest animate-fade-in flex items-center justify-center gap-2">
              <Sparkles size={12} /> Pago único anual con bonificación por fidelidad
            </p>
          )}
        </div>
        
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* PLAN ESTÁNDAR */}
          <div className="bg-ink-900/40 border border-white/10 p-8 rounded-[2rem] relative shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-white/80 mb-2">Plan Estándar</h3>
                <div className="flex items-start justify-center gap-1">
                  <span className="text-xl font-medium text-white/40 mt-1">€</span>
                  <span className="text-5xl font-semibold text-white/90">
                    {billingCycle === 'monthly' ? '29' : Math.floor(29 * 0.85)}
                  </span>
                  <span className="text-sm text-white/40 self-end mb-1.5">/mes</span>
                </div>
                {billingCycle === 'annual' && <p className="text-[10px] text-white/30 font-medium mt-3 uppercase tracking-widest">Total: {formatEUR(Math.floor(29 * 0.85) * 12)} / año</p>}
              </div>
              <div className="space-y-4 text-left mb-8">
                {PREMIUM_FEATURES.slice(0,6).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 font-light text-xs">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0"/>
                    {item.text.replace("3 usuarios", "1 usuario")}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-3 rounded-lg border border-white/10 text-white font-semibold text-[11px] uppercase tracking-[0.1em] hover:bg-white/5 transition-all">Comenzar Prueba</button>
          </div>

          {/* PLAN PREMIUM */}
          <div className="bg-ink-950 border border-brand-500/30 p-8 rounded-[2rem] text-center relative shadow-[0_0_40px_rgba(99,102,241,0.15)] md:scale-105 z-10 h-[105%] flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 py-1.5 bg-brand-600 border-b border-brand-500 text-[9px] font-semibold text-white uppercase tracking-[0.2em] rounded-t-[2rem]">Pack Agencia Premium</div>
            <div>
              <div className="mt-8 mb-8">
                <div className="flex items-start justify-center gap-1 mb-2">
                  <span className="text-xl font-medium text-brand-400/50 mt-1">€</span>
                  <span className="text-5xl font-semibold text-white/90">
                    {billingCycle === 'monthly' ? '49' : Math.floor(49 * 0.85)}
                  </span>
                  <span className="text-sm text-brand-400/50 self-end mb-1.5">/mes</span>
                </div>
                {billingCycle === 'annual' && <p className="text-[10px] text-brand-400/50 font-medium mt-3 uppercase tracking-widest">Total: {formatEUR(Math.floor(49 * 0.85) * 12)} / año</p>}
              </div>
              <div className="space-y-4 text-left mb-8">
                {PREMIUM_FEATURES.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90 font-light text-xs">
                    <CheckCircle2 size={16} className={`shrink-0 ${item.isExclusive ? 'text-brand-400' : 'text-emerald-400'}`} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <button onClick={() => setIsModalOpen(true)} className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all">Probar 14 días gratis</button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO, FAQ Y FOOTER (ORIGINALES) */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-medium mb-4">Preguntas Frecuentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-ink-900/40 border border-white/5 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition">
                  <span className="font-medium text-sm text-white/90">{faq.q}</span>
                  <ChevronDown size={16} className={`text-brand-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-xs text-white/50 leading-relaxed font-light">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL TRIAL (ORIGINAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X size={18} /></button>
            <div className="text-center mb-6">
               <h3 className="text-lg font-medium text-white/90">Solicitar Acceso</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Inmobiliaria *" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-brand-500" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} />
              <input required placeholder="Persona de Contacto *" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-brand-500" value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} />
              <input required type="tel" placeholder="Teléfono *" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-brand-500" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              <input required type="email" placeholder="Email *" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-brand-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <button type="submit" disabled={formStatus === 'loading'} className="w-full py-3 mt-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                {formStatus === 'loading' ? <Loader2 className="animate-spin" size={14} /> : 'Solicitar Acceso VIP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}