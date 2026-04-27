import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, Smartphone, Rss,
  ArrowRight, CheckCircle2, Star, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, 
  MousePointerClick, Mail, Phone, MapPin, Zap, Building2
} from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const HERO_IMG_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/1777235529301-019dcb7d-a185-7894-8e9f-05d821ff0562.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Landing() {
  // Estados para el Modal de Registro (Prueba Gratis)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nombre_agencia: '', direccion: '', ciudad: '', codigo_postal: '', contacto_nombre: '', telefono: '', email: ''
  });

  // Estado para el formulario de Contacto
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Control del scroll para el Navbar (Efecto Glassmorphism al bajar)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inyección de Favicon dinámico
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

  // Handler Registro Trial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    const { error } = await supabase.from('solicitudes_registro').insert([formData]);
    if (error) { console.error(error); setFormStatus('error'); } 
    else { setFormStatus('success'); }
  };

  // Handler Formulario Contacto
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    setTimeout(() => setContactStatus('success'), 1500); // Simulación de envío
  };

  return (
    <>
      {/* TIPOGRAFÍAS PREMIUM */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        .font-sans { font-family: 'Outfit', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden w-full relative">
        
        {/* EFECTOS DE LUZ DE FONDO (Blobs) */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* =========================================
            HEADER / NAVBAR
        ============================================= */}
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/5 py-2' : 'bg-transparent py-4'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-lg overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <img src={LOGO_URL} alt="Logo Inmoficina" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase group-hover:text-brand-400 transition-colors hidden sm:block">INMOFICINA<span className="text-brand-400">.</span></span>
            </a>

            {/* Enlaces de anclaje (Desktop) */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-semibold text-white/60">
              <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
              <a href="#por-que-nosotros" className="hover:text-white transition-colors">Por Qué Elegirnos</a>
              <a href="#precios" className="hover:text-white transition-colors">Inversión</a>
              <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
            </div>

            {/* Botones de Acción (Login visible en móvil) */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:text-brand-400 transition text-white/80">Login</Link>
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-white text-ink-950 text-[10px] font-extrabold uppercase tracking-widest hover:bg-brand-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 whitespace-nowrap">
                Probar Gratis
              </button>
            </div>
          </div>
        </nav>

        {/* =========================================
            1. HERO SECTION
        ============================================= */}
        <section id="hero" className="relative pt-40 pb-20 px-4 sm:px-6 lg:pt-48 lg:pb-32 text-center w-full min-h-[90vh] flex flex-col justify-center items-center">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/80 text-[10px] font-semibold uppercase tracking-[0.2em] mb-8 backdrop-blur-md animate-fade-in shadow-xl shadow-black/50">
              <Trophy size={13} className="text-brand-400" /> Digitaliza tu agencia inmobiliaria
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight mb-8">
              Vende Lujo,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-emerald-400 italic font-bold">No Ladrillo.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide px-4">
              El único Luxury CRM diseñado para la agencia inmobiliaria que entiende que la marca propia es su activo más valioso. Eleva la percepción de tu cartera con tecnología inmersiva.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
              <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto group relative px-8 py-4 bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[12px] hover:bg-brand-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-3">
                Comenzar 14 días gratis <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <a href="#servicios" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 text-white/80 font-bold uppercase tracking-widest text-[12px] hover:bg-white/5 transition-all flex items-center justify-center">
                Descubrir el Arsenal
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            2. PRUEBA SOCIAL
        ============================================= */}
        <section id="prueba-social" className="py-12 border-y border-white/5 bg-white/[0.01] w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">Conexión directa con los líderes del mercado</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Building2 size={24}/> IDEALISTA</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Building2 size={24}/> FOTOCASA</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Building2 size={24}/> HABITACLIA</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Building2 size={24}/> KYERO</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Building2 size={24}/> PISOS.COM</div>
            </div>
          </div>
        </section>

        {/* =========================================
            3. SERVICIOS / BENEFICIOS
        ============================================= */}
        <section id="servicios" className="py-24 sm:py-32 px-4 sm:px-6 w-full relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 sm:mb-24">
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">Arsenal para el Cierre de Propiedades</h2>
              <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
                Herramientas de vanguardia diseñadas para agilizar tu flujo de trabajo, impresionar a tus clientes e incrementar tu tasa de conversión dramáticamente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: Globe, title: "Fichas VIP Inmersivas", desc: "Enlaces web que calculan la hipoteca en tiempo real mientras el cliente explora la galería. Branding 100% tuyo." },
                { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones de mercado justificadas con datos estadísticos de las 52 provincias y maquetadas con diseño editorial." },
                { icon: Landmark, title: "Dossier de Inversión", desc: "Habla el idioma del inversor: ROI, Yield Neto y Cash Flow calculados automáticamente en PDFs de un folio." },
                { icon: Rss, title: "Multipublicación PUSH", desc: "Sincroniza tus propiedades con Idealista, Fotocasa y la red Kyero en 1 clic. Adiós a la doble entrada de datos manual." },
                { icon: Sparkles, title: "Copywriter IA", desc: "Nuestra Inteligencia Artificial redacta memorias descriptivas persuasivas basándose en la ubicación y características del inmueble." },
                { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual absoluto de tus leads. Arrastra, suelta y detecta al instante qué clientes se están enfriando." }
              ].map((s, i) => (
                <div key={i} className="group p-8 rounded-[2rem] bg-ink-900/50 border border-white/5 hover:border-brand-500/30 hover:bg-white/[0.02] transition-all duration-500 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <s.icon className="text-brand-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{s.title}</h3>
                    <p className="text-white/50 text-sm font-light leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            4. POR QUÉ ELEGIRNOS
        ============================================= */}
        <section id="por-que-nosotros" className="py-24 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-white/[0.01] to-ink-950 border-y border-white/5 w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Imagen Izquierda */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 to-emerald-500/20 rounded-[3rem] blur-2xl group-hover:opacity-70 opacity-40 transition duration-1000" />
              <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-ink-900">
                <img src={HERO_IMG_URL} alt="Real Estate Luxury" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
                
                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="p-5 bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                    <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center border border-brand-500/30 shrink-0">
                      <Star size={20} className="text-brand-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em] mb-1">Doble Blindaje</p>
                      <p className="text-sm font-medium text-white/90">Tu marca por encima de todo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto Derecha */}
            <div className="order-1 lg:order-2 space-y-10">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-6">
                  La percepción lo es <span className="text-brand-400 italic">todo.</span>
                </h2>
                <p className="text-white/60 text-base font-light leading-relaxed">
                  El cliente de alto poder adquisitivo no compra casas, compra estilos de vida. Si tus presentaciones, informes y comunicación parecen del año 2010, estás perdiendo ventas antes de hacer la primera visita.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Independencia Total", desc: "No somos una franquicia. Te damos la tecnología para que tu agencia brille con luz propia, sin robarte protagonismo." },
                  { title: "Ahorro de 15h semanales", desc: "Automatiza la subida a portales, la redacción de textos y el cálculo de honorarios e impuestos." },
                  { title: "Seguridad Bancaria", desc: "Tus datos y los de tus clientes bajo cifrado de grado militar con Row Level Security." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="mt-1"><CheckCircle2 className="text-emerald-400" size={24} /></div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-white/90">{item.title}</h4>
                      <p className="text-white/50 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            8. PRECIOS (Inversión)
        ============================================= */}
        <section id="precios" className="py-24 sm:py-32 px-4 sm:px-6 w-full relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">Una Inversión Inteligente</h2>
            <p className="text-white/50 text-sm md:text-base font-light">Sin letras pequeñas, sin comisiones ocultas. Todo el potencial liberado desde el primer segundo.</p>
          </div>

          <div className="max-w-md mx-auto bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-8 sm:p-12 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-sm">
            {/* Etiqueta superior */}
            <div className="absolute top-0 left-0 right-0 py-2 bg-brand-600 text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg">
              Pack Agencia Premium
            </div>
            
            <div className="mt-8 mb-10">
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-2xl font-bold text-white/60 mt-2">€</span>
                <span className="text-7xl font-bold tracking-tighter text-white">49</span>
                <span className="text-lg text-white/40 self-end mb-2">/mes</span>
              </div>
              <p className="text-brand-400 font-bold uppercase tracking-widest text-[10px] bg-brand-500/10 inline-block px-3 py-1 rounded-full border border-brand-500/20">Sin permanencia</p>
            </div>

            <div className="space-y-4 text-left mb-10">
              {[ 
                "Licencia para 3 usuarios / agentes", 
                "Fichas VIP Inmersivas Ilimitadas", 
                "Informes CMA & Dossiers Inversión", 
                "Multipublicación Portales", 
                "IA de Redacción Integrada", 
                "Pipeline y Gestión de Leads",
                "Soporte Técnico Prioritario"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 font-light text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <CheckCircle2 className="text-brand-400 shrink-0" size={18} /> {item}
                </div>
              ))}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="w-full py-4 rounded-xl bg-white text-ink-950 font-extrabold text-[12px] uppercase tracking-[0.15em] hover:bg-brand-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Comenzar Prueba Gratuita
            </button>
            <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest">14 días gratis • Cancelas cuando quieras</p>
          </div>
        </section>

        {/* =========================================
            6. CONTACTO
        ============================================= */}
        <section id="contacto" className="py-24 sm:py-32 px-4 sm:px-6 bg-ink-900/30 border-y border-white/5 w-full">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">¿Hablamos?</h2>
              <p className="text-white/50 text-sm font-light leading-relaxed mb-10">
                Si tienes requerimientos especiales, una agencia de gran volumen o simplemente quieres ver una demostración en vivo, nuestro equipo está a tu disposición.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Mail className="text-brand-400" size={20} /></div>
                  <div><p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Email Directo</p><a href="mailto:hola@inmoficina.es" className="text-lg font-medium hover:text-brand-400 transition-colors">hola@inmoficina.es</a></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Phone className="text-brand-400" size={20} /></div>
                  <div><p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Soporte</p><p className="text-lg font-medium text-white/80">+34 900 000 000</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><MapPin className="text-brand-400" size={20} /></div>
                  <div><p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Sede</p><p className="text-lg font-medium text-white/80">Valencia, España</p></div>
                </div>
              </div>
            </div>

            {/* Formulario Visual */}
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem]">
              {contactStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="text-emerald-400" size={32} /></div>
                  <h3 className="text-2xl font-bold mb-2">Mensaje Recibido</h3>
                  <p className="text-white/50">Nos pondremos en contacto contigo en menos de 24h.</p>
                  <button onClick={() => setContactStatus('idle')} className="mt-8 px-6 py-2 border border-white/10 rounded-lg text-xs uppercase tracking-widest hover:bg-white/5 transition">Enviar otro</button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div><label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Nombre</label><input required type="text" className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition outline-none" placeholder="Tu nombre" /></div>
                  <div><label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Email</label><input required type="email" className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition outline-none" placeholder="tu@email.com" /></div>
                  <div><label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Mensaje</label><textarea required rows={4} className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition outline-none resize-none" placeholder="¿En qué podemos ayudarte?" /></div>
                  <button type="submit" disabled={contactStatus === 'loading'} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2">
                    {contactStatus === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Enviar Mensaje</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            5. CTA FINAL
        ============================================= */}
        <section id="cta" className="py-24 px-4 text-center w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-600 opacity-[0.03]" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">El momento de elevar tu estándar es ahora.</h2>
            <p className="text-white/50 text-base mb-10 font-light">Únete a las agencias que ya están facturando más trabajando de forma más inteligente.</p>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-white text-ink-950 rounded-xl font-extrabold uppercase tracking-widest text-[12px] hover:bg-brand-50 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] inline-flex items-center gap-3">
              Crear mi Agencia (Prueba Gratis) <Zap size={16} className="text-brand-500" />
            </button>
          </div>
        </section>

        {/* =========================================
            7. FOOTER
        ============================================= */}
        <footer id="footer" className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5 bg-ink-950 w-full text-center sm:text-left">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 border-b border-white/5 pb-12">
            <div className="md:col-span-2 flex flex-col items-center sm:items-start">
              <div className="w-[48px] h-[48px] mb-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={LOGO_URL} alt="Logo Inmoficina" className="w-full h-full object-contain grayscale hover:grayscale-0" />
              </div>
              <p className="text-white/40 text-sm font-light max-w-sm leading-relaxed mb-6">El CRM diseñado exclusivamente para el sector inmobiliario premium. Tecnología, diseño y conversión en un solo lugar.</p>
              <div className="flex items-center gap-4 text-white/30">
                <a href="#" className="hover:text-white transition"><Globe size={20}/></a>
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-5">Producto</h4>
              <a href="#servicios" className="text-white/40 hover:text-brand-400 text-sm mb-3 transition">Funcionalidades</a>
              <a href="#precios" className="text-white/40 hover:text-brand-400 text-sm mb-3 transition">Precios y Planes</a>
              <Link href="/login" className="text-white/40 hover:text-brand-400 text-sm transition">Acceso Clientes</Link>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-5">Legal</h4>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-sm mb-3 transition">Aviso Legal</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-sm mb-3 transition">Política de Privacidad</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-sm transition">Cookies</a>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">© {new Date().getFullYear()} Inmoficina. Todos los derechos reservados.</p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-1">Designed with <Star size={10}/> in Spain</p>
          </div>
        </footer>

        {/* =========================================
            MODAL DE REGISTRO
        ============================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto font-sans">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
            <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up my-auto">
              <div className="p-6 sm:p-8">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-white/30 hover:text-white transition"><X size={20} /></button>
                {formStatus === 'success' ? (
                  <div className="text-center py-4 animate-fade-in">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/20"><Send size={24} className="text-emerald-400" /></div>
                    <h3 className="text-xl font-bold mb-2">Solicitud Enviada</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-light mb-8">Revisaremos tu agencia y crearemos tus credenciales VIP. Te avisaremos por email en breve.</p>
                    <button onClick={() => setIsModalOpen(false)} className="w-full py-3.5 bg-white/5 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10 transition">Finalizar</button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 text-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Solicitar Acceso</h3>
                      <p className="text-[9px] sm:text-[10px] text-brand-400 uppercase tracking-widest font-bold">14 Días Gratis • Pack Agencia Premium</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Inmobiliaria *</label><input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} /></div>
                      <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Dirección *</label><input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Ciudad *</label><input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} /></div>
                        <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">C.P. *</label><input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.codigo_postal} onChange={e => setFormData({...formData, codigo_postal: e.target.value})} /></div>
                      </div>
                      <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Responsable *</label><input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Teléfono *</label><input required type="tel" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
                        <div><label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Email *</label><input required type="email" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:border-brand-500 transition-all outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                      </div>
                      <button type="submit" disabled={formStatus === 'loading'} className="w-full py-4 mt-6 rounded-xl bg-brand-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-brand-500 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-95">
                        {formStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Solicitar Acceso VIP'}
                      </button>
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