import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, Smartphone, Rss,
  ArrowRight, CheckCircle2, Star, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, 
  Mail, Phone, MapPin, Zap, Building2, ChevronDown
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
  const [contactData, setContactData] = useState({ nombre: '', email: '', mensaje: '' });

  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) link.href = LOGO_URL;
    else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = LOGO_URL;
      document.head.appendChild(newLink);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    const { error } = await supabase.from('solicitudes_registro').insert([formData]);
    if (error) { console.error(error); setFormStatus('error'); } 
    else { setFormStatus('success'); }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    const { error } = await supabase.from('mensajes_contacto').insert([contactData]);
    if (error) { console.error(error); setContactStatus('error'); } 
    else { setContactStatus('success'); setContactData({ nombre: '', email: '', mensaje: '' }); }
  };

  // FAQs AMPLIADAS Y OPTIMIZADAS
  const FAQS = [
    { q: "¿Tengo que introducir mi tarjeta de crédito para la prueba gratis?", a: "Absolutamente no. Queremos que pruebes todo el potencial de Inmoficina durante 14 días sin ningún tipo de compromiso ni riesgo." },
    { q: "¿Es Inmoficina difícil de usar?", a: "Al contrario. Hemos diseñado una interfaz intuitiva, limpia y minimalista. Si sabes usar WhatsApp o el correo electrónico, sabrás usar Inmoficina desde el primer minuto, sin curvas de aprendizaje frustrantes." },
    { q: "¿Puedo integrar o importar mis propiedades actuales al CRM?", a: "Sí. Contamos con herramientas y soporte dedicado para guiarte en una transición suave, de modo que no pierdas ni un solo dato importante de tu cartera." },
    { q: "¿En qué se diferencia Inmoficina de los CRM tradicionales?", a: "Mientras los CRM genéricos son bases de datos aburridas, Inmoficina es una herramienta orientada al Cierre y al Branding de lujo. Tus fichas públicas, informes CMA y dossiers parecen diseñados por una agencia de marketing de primer nivel." },
    { q: "¿Hay contratos de permanencia?", a: "No. Creemos en ganar tu confianza mes a mes. Puedes cancelar tu suscripción en cualquier momento con un solo clic, sin preguntas." },
    { q: "¿Tengo que instalar algún programa?", a: "No, Inmoficina es 100% en la nube (Cloud). Puedes acceder desde cualquier ordenador, tablet o móvil solo con tu navegador web." },
    { q: "¿El plan Premium incluye soporte técnico?", a: "Sí, tendrás acceso a soporte directo. Nuestro equipo está disponible para resolver tus dudas y asegurar que le sacas el máximo partido a cada herramienta." },
    { q: "¿Están seguros los datos de mis clientes?", a: "Tus datos están protegidos con encriptación de grado militar (Row Level Security) en servidores seguros. Nadie más que tu agencia tiene acceso a ellos." }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden w-full relative">
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* HEADER */}
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-1' : 'bg-transparent py-3'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <a href="#hero" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-lg overflow-hidden shrink-0 transition-transform duration-500 opacity-90 group-hover:opacity-100">
                <img src={LOGO_URL} alt="Logo Inmoficina" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90 group-hover:text-white transition-colors hidden sm:block">INMOFICINA</span>
            </a>

            <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-white/50">
              <a href="#servicios" className="hover:text-white transition-colors">Funcionalidades</a>
              <a href="#por-que-nosotros" className="hover:text-white transition-colors">La Diferencia</a>
              <a href="#precios" className="hover:text-white transition-colors">Inversión</a>
              <a href="#faq" className="hover:text-white transition-colors">Q&A</a>
              <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[11px] font-medium uppercase tracking-widest hover:text-brand-400 transition text-white/70">Acceso</Link>
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all duration-300">
                Probar Gratis
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section id="hero" className="relative pt-32 pb-16 px-4 sm:px-6 lg:pt-40 lg:pb-24 text-center w-full min-h-[85vh] flex flex-col justify-center items-center">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/60 text-[9px] font-medium uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              <Trophy size={12} className="text-brand-400/80" /> Digitaliza tu agencia inmobiliaria
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
              Vende Lujo,<br />
              <span className="text-white italic">No Ladrillo.</span>
            </h1>
            
            <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed font-light px-4">
              El CRM concebido para agencias inmobiliarias que entienden que la marca propia es su activo más valioso. Eleva la percepción de tu cartera con tecnología inmersiva.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <div className="w-full sm:w-auto flex flex-col items-center">
                <button onClick={() => setIsModalOpen(true)} className="w-full group relative px-6 py-3 bg-brand-600 text-white rounded-lg font-medium uppercase tracking-widest text-[11px] hover:bg-brand-500 transition-all duration-300 flex items-center justify-center gap-2">
                  Comenzar 14 días gratis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform opacity-70" />
                </button>
                <span className="text-[9px] text-white/40 mt-2 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-400"/> Sin tarjeta de crédito</span>
              </div>
              <a href="#servicios" className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 text-white/70 font-medium uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all flex items-center justify-center sm:-mt-5">
                Ver Funcionalidades
              </a>
            </div>
          </div>
        </section>

        {/* PRUEBA SOCIAL */}
        <section id="prueba-social" className="py-10 border-y border-white/5 bg-white/[0.01] w-full overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/30 mb-6">Sincronización directa con los líderes del mercado</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-medium text-lg tracking-tight"><Building2 size={20}/> IDEALISTA</div>
              <div className="flex items-center gap-2 font-medium text-lg tracking-tight"><Building2 size={20}/> FOTOCASA</div>
              <div className="flex items-center gap-2 font-medium text-lg tracking-tight"><Building2 size={20}/> HABITACLIA</div>
              <div className="flex items-center gap-2 font-medium text-lg tracking-tight"><Building2 size={20}/> KYERO</div>
              <div className="flex items-center gap-2 font-medium text-lg tracking-tight"><Building2 size={20}/> PISOS.COM</div>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="py-20 sm:py-24 px-4 sm:px-6 w-full relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Arsenal para el Cierre de Propiedades</h2>
              <p className="text-white/50 text-sm max-w-xl mx-auto font-light leading-relaxed">
                Herramientas de vanguardia diseñadas para agilizar tu flujo de trabajo, impresionar a tus clientes e incrementar tu conversión.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Globe, title: "Fichas VIP Inmersivas", desc: "Enlaces web con calculadoras de hipoteca en tiempo real mientras el cliente explora la galería. Branding 100% tuyo." },
                { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones de mercado justificadas con datos de las 52 provincias y maquetadas con diseño editorial." },
                { icon: Landmark, title: "Dossiers de Inversión", desc: "Habla el idioma del inversor: ROI, Yield Neto y Cash Flow calculados automáticamente en PDFs de un folio." },
                { icon: Rss, title: "Multipublicación Portales", desc: "Sincroniza tus propiedades con Idealista, Fotocasa y la red Kyero. Adiós a la doble entrada de datos manual." },
                { icon: Sparkles, title: "Copywriter IA", desc: "Inteligencia Artificial que redacta memorias descriptivas persuasivas basándose en la ubicación y características." },
                { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual absoluto de tus leads. Arrastra, suelta y detecta qué clientes requieren atención urgente." }
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-2xl bg-ink-900/40 border border-white/5 hover:border-brand-500/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                    <s.icon className="text-brand-500" size={18} />
                  </div>
                  <h3 className="text-base font-medium mb-2 tracking-tight text-white/90">{s.title}</h3>
                  <p className="text-white/40 text-xs font-light leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POR QUÉ NOSOTROS */}
        <section id="por-que-nosotros" className="py-20 sm:py-24 px-4 sm:px-6 bg-ink-900/20 border-y border-white/5 w-full">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl bg-ink-900">
                <img src={HERO_IMG_URL} alt="Real Estate Luxury" className="w-full h-full object-cover grayscale-[0.2]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 bg-ink-950/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <Star size={18} className="text-white/80" />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-0.5">Blindaje de Marca</p>
                      <p className="text-xs font-medium text-white/90">Tu identidad en el centro de todo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-4">
                  La percepción lo es <span className="italic text-white/60">todo.</span>
                </h2>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  El cliente premium no solo compra propiedades, compra estatus y profesionalidad. Una presentación impecable marca la diferencia antes de la primera visita.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Independencia Total", desc: "Te damos la tecnología para que tu agencia brille con luz propia, sin robarte protagonismo." },
                  { title: "Ahorro de Tiempo", desc: "Automatiza la subida a portales, la redacción de textos y el cálculo de honorarios." },
                  { title: "Seguridad y Privacidad", desc: "Tus datos y los de tus clientes bajo cifrado de grado militar y bases de datos aisladas." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-0.5"><CheckCircle2 className="text-white/40" size={18} /></div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-brand-500">{item.title}</h4>
                      <p className="text-white/40 text-xs font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" className="py-20 sm:py-24 px-4 sm:px-6 w-full relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 text-brand-500">Inversión Inteligente</h2>
            <p className="text-white/50 text-sm font-light">Software de nivel empresarial, sin comisiones ocultas ni permanencia.</p>
          </div>

          <div className="max-w-sm mx-auto bg-ink-900/40 border border-white/10 p-8 rounded-[2rem] text-center relative">
            <div className="absolute top-0 left-0 right-0 py-1.5 bg-brand-600 border-b border-brand-500 text-[9px] font-semibold text-white uppercase tracking-[0.2em]">
              Pack Agencia Premium
            </div>
            
            <div className="mt-6 mb-8">
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-xl font-medium text-white/40 mt-1">€</span>
                <span className="text-5xl font-semibold tracking-tight text-white/90">49</span>
                <span className="text-sm text-white/40 self-end mb-1.5">/mes</span>
              </div>
            </div>

            <div className="space-y-3 text-left mb-8">
              {[ 
                "Licencia para 3 usuarios", 
                "Fichas VIP Inmersivas Ilimitadas", 
                "Informes CMA Ilimitados", 
                "Multipublicación a Portales", 
                "Dossiers de Inversión Pro",
                "IA de Redacción Integrada", 
                "Catálogo Público Digital",
                "Pipeline y Gestión de Leads",
                "Códigos QR Dinámicos",
                "Compresión Fotos en la Nube"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-white/60 font-light text-xs">
                  <CheckCircle2 className="text-white/20 shrink-0" size={14} /> {item}
                </div>
              ))}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="w-full py-3 rounded-lg bg-brand-600 text-white font-semibold text-[11px] uppercase tracking-[0.1em] hover:bg-brand-500 transition-all">
              Comenzar Prueba Gratuita
            </button>
            <p className="mt-3 text-[9px] text-white/30 uppercase tracking-widest flex items-center justify-center gap-1"><CheckCircle2 size={10} className="text-emerald-400"/> Sin tarjeta de crédito</p>
          </div>
        </section>

        {/* Q&A / FAQ */}
        <section id="faq" className="py-20 sm:py-24 px-4 sm:px-6 bg-ink-900/20 border-t border-white/5 w-full">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Preguntas Frecuentes</h2>
              <p className="text-brand-500 text-sm font-light">Todo lo que necesitas saber antes de empezar.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-ink-900/40 border border-white/5 rounded-xl overflow-hidden transition-all">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left text-white/90 hover:text-white transition">
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ChevronDown size={16} className={`text-brand-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-xs text-white/50 leading-relaxed font-light">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="py-20 px-4 sm:px-6 bg-ink-900/30 border-t border-white/5 w-full">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">¿Hablamos?</h2>
              <p className="text-white/50 text-xs font-light leading-relaxed mb-8">
                Si tienes dudas, requerimientos especiales, volumen de agencia o necesitas un tutorial de uso, contáctanos.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center border border-brand-500/20"><Mail className="text-brand-500" size={16} /></div>
                  <div><p className="text-[9px] uppercase tracking-widest text-white/40 font-medium mb-0.5">Email</p><a href="mailto:admin@inmoficina.es" className="text-sm font-medium hover:text-white transition-colors text-white/80">admin@inmoficina.es</a></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center border border-brand-500/20"><Phone className="text-brand-500" size={16} /></div>
                  <div><p className="text-[9px] uppercase tracking-widest text-white/40 font-medium mb-0.5">Teléfono</p><p className="text-sm font-medium text-white/80">+34 644 314 460</p></div>
                </div>
              </div>
            </div>

            <div className="bg-ink-900/40 border border-white/5 p-6 rounded-2xl">
              {contactStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 animate-fade-in">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="text-white/80" size={24} /></div>
                  <h3 className="text-lg font-medium mb-2">Mensaje Recibido</h3>
                  <p className="text-white/40 text-xs">Te responderemos a la brevedad.</p>
                  <button onClick={() => setContactStatus('idle')} className="mt-6 px-4 py-1.5 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest hover:bg-white/5 transition text-white/60">Enviar otro</button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div><label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1.5 ml-1">Nombre</label><input required type="text" className="w-full bg-ink-950 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-brand-500 transition outline-none" value={contactData.nombre} onChange={e => setContactData({...contactData, nombre: e.target.value})} /></div>
                  <div><label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1.5 ml-1">Email</label><input required type="email" className="w-full bg-ink-950 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-brand-500 transition outline-none" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} /></div>
                  <div><label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1.5 ml-1">Mensaje</label><textarea required rows={3} className="w-full bg-ink-950 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-brand-500 transition outline-none resize-none" value={contactData.mensaje} onChange={e => setContactData({...contactData, mensaje: e.target.value})} /></div>
                  <button type="submit" disabled={contactStatus === 'loading'} className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                    {contactStatus === 'loading' ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Enviar Mensaje</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="footer" className="py-10 px-4 sm:px-6 border-t border-white/5 bg-ink-950 w-full text-center sm:text-left">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/5 pb-10">
            <div className="md:col-span-2 flex flex-col items-center sm:items-start">
              <div className="w-[48px] h-[48px] mb-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={LOGO_URL} alt="Logo Inmoficina" className="w-full h-full object-contain grayscale hover:grayscale-0" />
              </div>
              <p className="text-white/40 text-xs font-light max-w-sm leading-relaxed">CRM diseñado exclusivamente para profesionalizar más aún tu agencia inmobiliaria.</p>
            </div>
            
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-[9px] font-semibold uppercase tracking-widest text-white/60 mb-4">Menú</h4>
              <a href="#servicios" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Funcionalidades</a>
              <a href="#por-que-nosotros" className="text-white/40 hover:text-white text-xs mb-2.5 transition">La Diferencia</a>
              <a href="#precios" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Inversión</a>
              <a href="#faq" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Q&A</a>
              <a href="#contacto" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Contacto</a>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-[9px] font-semibold uppercase tracking-widest text-white/60 mb-4">Legal</h4>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Política de Cookies</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Política de Privacidad</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Aviso Legal</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-xs mb-2.5 transition">Condiciones de Uso</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-xs transition">Condiciones de Contratación</a>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">© {new Date().getFullYear()} Inmoficina. Todos los derechos reservados. Inmoficina es una marca de Hipotenusa Online.</p>
            <p className="text-[9px] text-white/20 uppercase tracking-widest flex items-center justify-center gap-1 font-medium">Designed in Spain</p>
          </div>
        </footer>

        {/* MODAL DE REGISTRO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto font-sans">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
            <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up my-auto">
              <div className="p-6 sm:p-8">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white transition"><X size={18} /></button>
                {formStatus === 'success' ? (
                  <div className="text-center py-4 animate-fade-in">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10"><Send size={20} className="text-white/80" /></div>
                    <h3 className="text-lg font-medium mb-2 text-white/90">Solicitud Enviada</h3>
                    <p className="text-white/40 text-xs leading-relaxed font-light mb-6">Revisaremos tu agencia y crearemos tus credenciales VIP. Te avisaremos por email a la brevedad.</p>
                    <button onClick={() => setIsModalOpen(false)} className="w-full py-2.5 bg-white/10 rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:bg-white/20 transition text-white">Finalizar</button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 text-center">
                      <h3 className="text-lg font-medium text-white/90 mb-1">Solicitar Acceso</h3>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest font-medium">14 Días Gratis • Agencia Premium</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">Inmobiliaria *</label><input required className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} /></div>
                      <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">Dirección *</label><input required className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">Ciudad *</label><input required className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} /></div>
                        <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">C.P. *</label><input required className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.codigo_postal} onChange={e => setFormData({...formData, codigo_postal: e.target.value})} /></div>
                      </div>
                      <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">Responsable *</label><input required className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">Teléfono *</label><input required type="tel" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
                        <div><label className="block text-[9px] font-medium text-white/40 uppercase tracking-widest mb-1 ml-1">Email *</label><input required type="email" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white/20 transition-all outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                      </div>
                      <button type="submit" disabled={formStatus === 'loading'} className="w-full py-3 mt-4 rounded-lg bg-white/10 text-white font-semibold text-[10px] uppercase tracking-widest hover:bg-white/20 transition flex items-center justify-center gap-2">
                        {formStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Solicitar Acceso VIP'}
                      </button>
                      <p className="text-[9px] text-white/30 text-center uppercase tracking-widest flex items-center justify-center gap-1 mt-2"><CheckCircle2 size={10} className="text-emerald-400"/> Sin tarjeta de crédito</p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}