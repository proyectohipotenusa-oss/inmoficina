import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, Smartphone, Rss,
  ArrowRight, CheckCircle2, Star, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, 
  MousePointerClick, Mail, Phone, MapPin, Zap, Building2, ChevronDown, Users, QrCode, FileText
} from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const HERO_IMG_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/1777235529301-019dcb7d-a185-7894-8e9f-05d821ff0562.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const { error } = await supabase.from('mensajes_contacto').insert([{ ...contactData, telefono: contactData.telefono || null }]);
    if (error) setContactStatus('error'); 
    else { setContactStatus('success'); setContactData({ nombre: '', email: '', telefono: '', mensaje: '' }); }
  };

  const FAQS = [
    { q: "¿Tengo que introducir mi tarjeta de crédito para la prueba gratis?", a: "Absolutamente no. Queremos que pruebes todo el potencial de Inmoficina durante 14 días sin compromiso ni riesgo." },
    { q: "¿Es Inmoficina difícil de usar?", a: "Al contrario. Es intuitivo y minimalista. Si sabes usar WhatsApp, sabrás usar Inmoficina desde el primer minuto." },
    { q: "Tengo mi propia web, ¿puedo usar Inmoficina?", a: "Sí, nuestro sistema permite generar enlaces de Fichas VIP que puedes enviar por WhatsApp o enlazar directamente desde tu propia página web." },
    { q: "¿Cómo ayuda la Inteligencia Artificial a vender más?", a: "Nuestra IA analiza los datos de la propiedad y redacta memorias descriptivas aplicando técnicas de copywriting persuasivo orientadas a la venta emocional, no solo a listar características." },
    { q: "¿Qué impacto tiene el diseño inmersivo en mis ventas?", a: "Nuestras fichas VIP y dossiers retienen al cliente un 300% más de tiempo que un PDF estático, aumentando drásticamente la conversión." },
    { q: "¿Qué es exactamente el Dossier de Inversión?", a: "Es un reporte automático que calcula el ROI, Cash Flow y Yield Neto para inversores. Les habla en su idioma (números puros) en lugar de darles descripciones genéricas." },
    { q: "¿Puedo gestionar a mi equipo de agentes en el CRM?", a: "Por supuesto. El Plan Premium incluye 3 licencias para que tú y tu equipo trabajéis sobre la misma base de datos, compartiendo el Pipeline y la agenda." },
    { q: "¿Realmente cerraré más ventas con Inmoficina?", a: "Sí. No somos un archivador de propiedades, somos una herramienta de persuasión. Cada informe que envías está diseñado para generar autoridad inmediata." },
    { q: "¿Hay permanencia?", a: "No. Gánamos tu confianza mes a mes. Cancelas cuando quieras con un clic." },
    { q: "¿Están seguros mis datos?", a: "Cifrado de grado militar (Row Level Security). Tu información es privada y exclusiva de tu agencia." }
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap'); .font-sans { font-family: 'Inter', sans-serif; } .font-serif { font-family: 'Playfair Display', serif; } html { scroll-behavior: smooth; }`}</style>
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-1' : 'bg-transparent py-3'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group cursor-pointer">
            <img src={LOGO_URL} className="w-[42px] h-[42px] rounded-lg opacity-90 group-hover:opacity-100" />
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
            <Link href="/login" className="text-[11px] font-medium uppercase tracking-widest hover:text-brand-400 text-white/70">Acceso</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all">Probar Gratis</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative pt-32 pb-16 text-center w-full min-h-[85vh] flex flex-col justify-center items-center">
        <div className="max-w-3xl mx-auto z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/60 text-[9px] font-medium uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <Trophy size={12} className="text-brand-400/80" /> Digitaliza tu agencia inmobiliaria
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium leading-[1.1] mb-6">Vende Lujo, <span className="italic text-white/80">No Ladrillo.</span></h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed font-light">El CRM concebido para agencias inmobiliarias que entienden que la marca propia es su activo más valioso. Sin tarjeta de crédito.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-6 py-3 bg-brand-600 text-white rounded-lg font-medium uppercase tracking-widest text-[11px] hover:bg-brand-500 transition-all flex items-center justify-center gap-2">Comenzar 14 días gratis <ArrowRight size={14} /></button>
            <a href="#servicios" className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 text-white/70 font-medium uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all flex items-center justify-center">Ver Funcionalidades</a>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Arsenal para el Cierre de Propiedades</h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto font-light">Herramientas de vanguardia diseñadas para impresionar a tus clientes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: "Fichas VIP Inmersivas", desc: "Cálculo de hipoteca en tiempo real y branding 100% tuyo." },
              { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones de mercado justificadas con diseño editorial." },
              { icon: Landmark, title: "Dossiers de Inversión", desc: "Yield, Cash Flow y ROI calculados automáticamente." },
              { icon: Rss, title: "Multipublicación Portales", desc: "Sincroniza con Idealista, Fotocasa y Kyero en un clic." },
              { icon: Sparkles, title: "Copywriter IA", desc: "Redacción persuasiva basada en la ubicación del inmueble." },
              { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual de leads y detección de clientes fríos." }
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-ink-900/40 border border-white/5 hover:border-brand-500/20 transition-all">
                <s.icon className="text-brand-500 mb-5" size={20} />
                <h3 className="text-base font-medium mb-2 text-white/90">{s.title}</h3>
                <p className="text-white/40 text-xs font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ NOSOTROS (IMAGEN REDUCIDA EN 30%) */}
      <section id="por-que-nosotros" className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-[1.5rem] w-full max-w-[70%] mx-auto overflow-hidden border border-white/10 shadow-2xl bg-ink-900">
            <img src={HERO_IMG_URL} className="w-full h-full object-cover grayscale-[0.2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="p-4 bg-ink-950/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                <Star size={18} className="text-brand-400" />
                <p className="text-sm font-medium text-white/90">Tu identidad en el centro.</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight">La percepción lo es <span className="italic text-white/60">todo.</span></h2>
            <div className="space-y-6">
              {[
                { title: "Independencia Total", desc: "Tecnología propia sin robarte protagonismo." },
                { title: "Ahorro de Tiempo", desc: "Automatiza portales, redacción y cálculos." },
                { title: "Seguridad y Privacidad", desc: "Datos protegidos bajo cifrado de grado militar." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="text-brand-500 mt-0.5" size={18} />
                  <div><h4 className="text-sm font-medium mb-1 text-brand-500">{item.title}</h4><p className="text-white/40 text-xs font-light leading-relaxed">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRECIOS A DOS COLUMNAS - AJUSTADOS Y COLOR-CODED */}
      <section id="precios" className="py-24 bg-gradient-to-b from-brand-900/10 via-ink-900/40 to-ink-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 text-brand-500">Inversión Inteligente</h2>
          <p className="text-white/50 text-sm font-light">Escala las herramientas de tu agencia a medida que creces. Sin permanencia.</p>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* PLAN ESTÁNDAR */}
          <div className="bg-ink-900/40 border border-white/10 p-8 rounded-[2rem] relative shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-white/80 mb-2">Plan Estándar</h3>
                <div className="flex items-start justify-center gap-1">
                  <span className="text-xl font-medium text-white/40 mt-1">€</span>
                  <span className="text-5xl font-semibold text-white/90">29</span>
                  <span className="text-sm text-white/40 self-end mb-1.5">/mes</span>
                </div>
              </div>
              <div className="space-y-4 text-left mb-8">
                {PREMIUM_FEATURES.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 font-light text-xs ${item.isExclusive ? 'text-white/30 line-through' : 'text-white/80'}`}>
                    {item.isExclusive ? <X size={16} className="text-red-500/50 shrink-0"/> : <CheckCircle2 size={16} className="text-emerald-400 shrink-0"/>}
                    {item.isExclusive ? item.text : item.text.replace("3 usuarios", "1 usuario")}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-3 rounded-lg border border-white/10 text-white font-semibold text-[11px] uppercase tracking-[0.1em] hover:bg-white/5 transition-all mt-auto">Comenzar Prueba</button>
          </div>

          {/* PLAN PREMIUM */}
          <div className="bg-ink-950 border border-brand-500/30 p-8 rounded-[2rem] text-center relative shadow-[0_0_40px_rgba(99,102,241,0.15)] z-10 h-[105%] flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 py-1.5 bg-brand-600 border-b border-brand-500 text-[9px] font-semibold text-white uppercase tracking-[0.2em] rounded-t-[2rem]">
              Pack Agencia Premium
            </div>
            <div>
              <div className="mt-8 mb-8">
                <div className="flex items-start justify-center gap-1 mb-2">
                  <span className="text-xl font-medium text-brand-400/50 mt-1">€</span>
                  <span className="text-5xl font-semibold text-white/90">49</span>
                  <span className="text-sm text-brand-400/50 self-end mb-1.5">/mes</span>
                </div>
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
              <button onClick={() => setIsModalOpen(true)} className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
                Prueba 14 días gratis de este plan
              </button>
              <p className="mt-4 text-[9px] text-white/30 uppercase flex items-center justify-center gap-1"><CheckCircle2 size={10} className="text-emerald-400"/> Sin tarjeta de crédito</p>
            </div>
          </div>

        </div>
      </section>

      {/* Q&A */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-medium mb-4">Preguntas Frecuentes</h2>
            <p className="text-brand-500 text-sm font-light">Todo lo que necesitas saber antes de empezar.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-ink-900/40 border border-white/5 rounded-xl overflow-hidden transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition">
                  <span className="font-medium text-sm text-white/90">{faq.q}</span>
                  <ChevronDown size={16} className={`text-brand-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}><p className="text-xs text-white/50 leading-relaxed font-light">{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 px-4 bg-ink-900/20 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-brand-500">¿Hablamos?</h2>
            <p className="text-white/50 text-xs font-light leading-relaxed mb-8">Si tienes dudas, requerimientos especiales, volumen de agencia o necesitas un tutorial de uso, contáctanos.</p>
            <div className="space-y-5">
              <div className="flex items-center gap-4"><Mail className="text-brand-500" size={20} /><div><p className="text-[9px] uppercase tracking-widest text-white/40 font-medium">Email</p><p className="text-sm font-medium text-white/80">admin@inmoficina.es</p></div></div>
              <div className="flex items-center gap-4"><Phone className="text-brand-500" size={20} /><div><p className="text-[9px] uppercase tracking-widest text-white/40 font-medium">Teléfono</p><p className="text-sm font-medium text-white/80">+34 644 314 460</p></div></div>
            </div>
          </div>
          <div className="bg-ink-900/40 border border-white/5 p-6 rounded-2xl">
            {contactStatus === 'success' ? (
              <div className="text-center py-6 animate-fade-in"><CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={32} /><h3 className="text-lg font-medium text-white/90">Mensaje Recibido</h3><p className="text-white/40 text-xs mt-2">Te responderemos a la brevedad.</p><button onClick={() => setContactStatus('idle')} className="mt-6 px-4 py-1.5 border border-white/10 rounded-lg text-[10px] uppercase text-white/60">Enviar otro</button></div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div><label className="block text-[8px] uppercase tracking-[0.15em] font-medium text-white/50 mb-1.5 ml-1">Nombre *</label><input required className="input bg-ink-950 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={contactData.nombre} onChange={e => setContactData({...contactData, nombre: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[8px] uppercase tracking-[0.15em] font-medium text-white/50 mb-1.5 ml-1">Email *</label><input required type="email" className="input bg-ink-950 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} /></div>
                  <div><label className="block text-[8px] uppercase tracking-[0.15em] font-medium text-white/50 mb-1.5 ml-1">Teléfono</label><input type="tel" className="input bg-ink-950 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={contactData.telefono} onChange={e => setContactData({...contactData, telefono: e.target.value})} /></div>
                </div>
                <div><label className="block text-[8px] uppercase tracking-[0.15em] font-medium text-white/50 mb-1.5 ml-1">Mensaje *</label><textarea required rows={3} className="input bg-ink-950 border-white/5 text-xs px-3 py-2 w-full rounded-lg resize-none" value={contactData.mensaje} onChange={e => setContactData({...contactData, mensaje: e.target.value})} /></div>
                <button type="submit" disabled={contactStatus === 'loading'} className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium uppercase tracking-widest text-[10px] hover:bg-brand-500 transition-all flex justify-center items-center gap-2">
                  {contactStatus === 'loading' ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Enviar Mensaje</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="py-10 px-4 border-t border-white/5 bg-ink-950 w-full text-center sm:text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/5 pb-10">
          <div className="md:col-span-2">
            <img src={LOGO_URL} className="w-[48px] h-[48px] mb-4 opacity-80 mx-auto sm:mx-0" />
            <p className="text-white/40 text-xs font-light max-w-sm mx-auto sm:mx-0">CRM diseñado exclusivamente para profesionalizar más aún tu agencia inmobiliaria.</p>
          </div>
          <div><h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Menú</h4><div className="flex flex-col gap-2.5 text-white/40 text-xs"><a href="#servicios">Funcionalidades</a><a href="#por-que-nosotros">La Diferencia</a><a href="#precios">Inversión</a><a href="#faq">Q&A</a><a href="#contacto">Contacto</a></div></div>
          <div><h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Legal</h4><div className="flex flex-col gap-2.5 text-white/40 text-xs"><a href={TEMPORARY_LEGAL_URL}>Política de Cookies</a><a href={TEMPORARY_LEGAL_URL}>Privacidad</a><a href={TEMPORARY_LEGAL_URL}>Aviso Legal</a><a href={TEMPORARY_LEGAL_URL}>Condiciones de Uso</a><a href={TEMPORARY_LEGAL_URL}>Contratación</a></div></div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between text-[10px] text-white/30 font-medium">
          <p>© {new Date().getFullYear()} Inmoficina. Una marca de Hipotenusa Online.</p>
          <p className="uppercase tracking-widest mt-2 md:mt-0">Designed in Spain</p>
        </div>
      </footer>

      {/* MODAL TRIAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-up">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X size={18} /></button>
            {formStatus === 'success' ? (
              <div className="text-center py-4"><CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={32} /><h3 className="text-lg font-medium text-white">Solicitud Enviada</h3><p className="text-white/40 text-xs mt-3 leading-relaxed">Revisaremos tu agencia y crearemos tus credenciales VIP. Te avisaremos por email a la brevedad.</p><button onClick={() => setIsModalOpen(false)} className="mt-6 w-full py-2.5 bg-brand-600 rounded-lg text-xs font-bold text-white uppercase tracking-widest">Finalizar</button></div>
            ) : (
              <>
                <div className="text-center mb-6"><h3 className="text-lg font-medium text-white/90">Solicitar Acceso</h3><p className="text-[9px] text-white/50 uppercase tracking-widest font-medium">14 Días Gratis • Pack Premium</p></div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div><label className="label-xs">Inmobiliaria *</label><input required className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} /></div>
                  <div><label className="label-xs">Dirección *</label><input required className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label-xs">Ciudad *</label><input required className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} /></div>
                    <div><label className="label-xs">C.P. *</label><input required className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.codigo_postal} onChange={e => setFormData({...formData, codigo_postal: e.target.value})} /></div>
                  </div>
                  <div><label className="label-xs">Responsable *</label><input required className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="label-xs">Teléfono *</label><input required type="tel" className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
                    <div><label className="label-xs">Email *</label><input required type="email" className="input bg-ink-900 border-white/5 text-xs px-3 py-2 w-full rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  </div>
                  <button type="submit" disabled={formStatus === 'loading'} className="w-full py-3 mt-4 bg-brand-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest">{formStatus === 'loading' ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Solicitar Acceso VIP'}</button>
                  <p className="text-[9px] text-white/30 text-center uppercase tracking-widest flex items-center justify-center gap-1 mt-2"><CheckCircle2 size={10} className="text-emerald-400"/> Sin tarjeta de crédito</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}