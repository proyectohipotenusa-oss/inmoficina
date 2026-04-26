import { useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, Smartphone, Rss,
  ArrowRight, CheckCircle2, Star, Zap, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, MousePointerClick, QrCode, BookOpen
} from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const HERO_IMG_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/1777235529301-019dcb7d-a185-7894-8e9f-05d821ff0562.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nombre_agencia: '', direccion: '', contacto_nombre: '', telefono: '', email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    
    const { error } = await supabase.from('solicitudes_registro').insert([formData]);
    
    if (error) {
      console.error(error);
      setFormStatus('error');
    } else {
      setFormStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden scroll-smooth">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-ink-950/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
              <img src={LOGO_URL} alt="Logo Inmoficina" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-bold tracking-tight uppercase group-hover:text-brand-400 transition-colors">INMOFICINA<span className="text-brand-400">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[9px] uppercase tracking-widest font-medium text-white/50">
            <a href="#experiencia" className="hover:text-white transition-colors">Filosofía</a>
            <a href="#arsenal" className="hover:text-white transition-colors">Tecnología</a>
            <a href="#tarifa" className="hover:text-white transition-colors">Inversión</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[10px] font-semibold uppercase tracking-widest hover:text-brand-400 transition hidden sm:block text-white/40">Acceso Agentes</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-1.5 rounded-md bg-brand-600 text-white text-[9px] font-semibold uppercase tracking-widest hover:bg-brand-500 transition shadow-lg shadow-brand-500/20 active:scale-95">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 px-6 lg:pt-36 lg:pb-24 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-white/70 text-[11px] font-medium uppercase tracking-[0.2em] mb-6 animate-fade-in backdrop-blur-md">
            <Trophy size={14} className="text-brand-400" /> Digitaliza tu agencia inmobiliaria
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
          Más tiempo para vender,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-emerald-400 font-extrabold">Menos para gestionar.</span>
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed font-light tracking-wide">
            Inmoficina es el CRM diseñado para la agencia inmobiliaria que entiende que la marca propia es su activo más valioso. Tecnología inmersiva, diseño exquisito y herramientas orientadas al cierre.
          </p>
          <div className="flex flex-col items-center gap-5">
            <button onClick={() => setIsModalOpen(true)} className="group relative px-6 py-3 bg-white text-ink-950 rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-brand-50 hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center gap-2">
              Solicitar Prueba Gratuita <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-6 opacity-40 grayscale pointer-events-none">
               <span className="text-[9px] font-medium uppercase tracking-widest">IA Generativa</span>
               <span className="text-[9px] font-medium uppercase tracking-widest">Multipublicación</span>
               <span className="text-[9px] font-medium uppercase tracking-widest">Fichas VIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN IMAGEN PREMIUM */}
      <section id="experiencia" className="py-20 px-6 bg-gradient-to-b from-white/[0.02] to-transparent border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
             <div className="relative group">
                <div className="absolute -inset-3 bg-brand-500/10 rounded-[2rem] blur-xl group-hover:bg-brand-500/15 transition duration-1000" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-ink-900">
                  <img 
                    src={HERO_IMG_URL} 
                    alt="Oficina Premium Real Estate" 
                    className="w-full h-full object-cover scale-[1.03] group-hover:scale-100 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="p-4 bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-500/20 rounded-md flex items-center justify-center border border-brand-500/30 shrink-0">
                           <Smartphone size={16} className="text-brand-300" />
                        </div>
                        <div>
                           <p className="text-[8px] font-bold text-brand-400 uppercase tracking-[0.2em] mb-0.5">Tecnología Móvil</p>
                           <p className="text-xs font-medium text-white/90">Tu agencia centralizada y en tu bolsillo.</p>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10">
            <h2 className="text-2xl md:text-3xl font-bold leading-[1.2] tracking-tight">
              La marca <br/><span className="text-white/40 font-light italic">es el mensaje.</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: Star, title: "Doble Blindaje de Marca", desc: "Inyectamos tu logo e identidad en cada pixel que ve el cliente." },
                { icon: Sparkles, title: "Inteligencia que Redacta", desc: "Nuestra IA redacta memorias de alto impacto técnico en segundos." },
                { icon: MousePointerClick, title: "Ventas a un solo clic", desc: "Reports de valoración y dossiers financieros con diseño editorial." }
              ].map((item, i) => (
                <div key={i} className="group flex gap-4">
                  <div className="w-8 h-8 rounded-md bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-brand-500/30 group-hover:bg-brand-500/10 transition-all">
                    <item.icon className="text-brand-400 group-hover:scale-110 transition-transform" size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/50 text-xs font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="text-[10px] font-semibold uppercase tracking-[0.15em] border-b border-brand-500 pb-0.5 hover:text-brand-400 transition-colors text-white/80">Solicitar Acceso VIP</button>
          </div>
        </div>
      </section>

      {/* ARSENAL GRID */}
      <section id="arsenal" className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">ARSENAL PARA EL CIERRE DE PROPIEDADES</h2>
          <p className="text-white/40 font-light text-xs max-w-lg mx-auto">Tecnología inmersiva diseñada para elevar la percepción de valor y multiplicar tus conversiones.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Globe, title: "Fichas VIP Inmersivas", desc: "Enlaces web que calculan la hipoteca en tiempo real mientras el cliente explora la galería." },
            { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones de mercado justificadas con datos de las 52 provincias y diseño de lujo." },
            { icon: Landmark, title: "Dossier de Inversión", desc: "Habla el idioma del inversor: ROI, Yield Neto y Cash Flow calculados automáticamente." },
            { icon: Rss, title: "Conexión a Portales", desc: "Sincroniza tus propiedades con Idealista, Fotocasa y más en 1 clic. Adiós al trabajo manual." },
            { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual absoluto de tus leads. Arrastra y suelta para gestionar tus negociaciones." },
            { icon: Zap, title: "IA Predictor", desc: "Analítica inteligente que evalúa el potencial de cierre de cada propiedad de tu cartera." }
          ].map((f, i) => (
            <div key={i} className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-500/20 transition-all duration-300">
              <f.icon className="text-brand-400/50 group-hover:text-brand-400 mb-4 transition-colors duration-300" size={20} />
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TARIFA: LISTA DE 10 FUNCIONALIDADES RECALIBRADA */}
      <section id="tarifa" className="py-20 px-6 relative">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-ink-900 to-ink-950 border border-white/10 p-8 md:p-12 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-[9px] font-bold uppercase tracking-widest rounded-b-md shadow-lg shadow-brand-500/20">
            Pack Agencia Premium
          </div>
          
          <div className="mb-8 pt-2">
            <div className="text-5xl md:text-6xl font-bold leading-none tracking-tighter text-white mb-3">49<span className="text-xl text-brand-400 font-medium">€/mes</span></div>
            <p className="text-white/40 font-medium uppercase tracking-widest text-[9px]">Sin permanencia. Todo incluido.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-left mb-10 border-t border-white/5 pt-8">
            {[
              "Licencia para 3 Usuarios", 
              "Fichas VIP Ilimitadas", 
              "Informes CMA Ilimitados", 
              "Multipublicación Portales", 
              "Dossiers de Inversión Pro",
              "IA de Redacción Integrada", 
              "Catálogo Público Digital",
              "Pipeline y Gestión de Leads",
              "Códigos QR Dinámicos",
              "Compresión Fotos en la Nube"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/60 font-light text-xs">
                <CheckCircle2 className="text-brand-400 shrink-0" size={14} /> {item}
              </div>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full py-3.5 rounded-lg bg-brand-600 text-white font-semibold text-xs uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
            Comenzar 14 días gratis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5 text-center bg-ink-950/50">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="w-[24px] h-[24px] mx-auto mb-4 opacity-30 hover:opacity-100 transition-all duration-500 cursor-pointer">
            <img src={LOGO_URL} alt="Logo Inmoficina" className="w-full h-full object-contain grayscale hover:grayscale-0" />
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/20 mb-6">Elevando el estándar inmobiliario</p>
          
          <div className="flex flex-row justify-center items-center gap-6 md:gap-8 text-[8px] text-white/30 uppercase font-medium mt-1 mb-4 flex-wrap">
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Política de cookies</a>
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Aviso Legal</a>
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Condiciones de Uso</a>
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Condiciones de contratación</a>
          </div>

          <p className="text-[8px] font-light text-white/10 uppercase tracking-widest pt-4 border-t border-white/5 w-full">© {new Date().getFullYear()} Inmoficina. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* MODAL DE REGISTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8 md:p-10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-white/30 hover:text-white transition"><X size={20} /></button>

              {formStatus === 'success' ? (
                <div className="text-center py-4 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <Send size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Solicitud Enviada</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light mb-6">Revisaremos tu agencia y crearemos tus credenciales VIP. Te avisaremos por email en breve.</p>
                  <button onClick={() => setIsModalOpen(false)} className="w-full py-2.5 bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-widest border border-white/10 hover:bg-white/10 transition">Finalizar</button>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-1">Solicitud de Acceso</h3>
                    <p className="text-[10px] text-brand-400 uppercase tracking-widest font-semibold">14 Días Gratis • Pack Agencia Premium</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-white/40 uppercase tracking-widest ml-1">Inmobiliaria *</label>
                      <input required className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="Nombre de la agencia" 
                        value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-white/40 uppercase tracking-widest ml-1">Dirección Física *</label>
                      <input required className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="Calle, Ciudad..." 
                        value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-white/40 uppercase tracking-widest ml-1">Responsable *</label>
                      <input required className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="Nombre completo" 
                        value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-white/40 uppercase tracking-widest ml-1">Teléfono *</label>
                        <input required type="tel" className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="+34..." 
                          value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-white/40 uppercase tracking-widest ml-1">Email *</label>
                        <input required type="email" className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="hola@..." 
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <button type="submit" disabled={formStatus === 'loading'} className="w-full py-3 mt-4 rounded-lg bg-brand-600 text-white font-semibold text-xs uppercase tracking-widest hover:bg-brand-500 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20">
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
  );
}