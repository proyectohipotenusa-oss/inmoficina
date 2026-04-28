import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, Smartphone, Rss,
  ArrowRight, CheckCircle2, Star, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, 
  MousePointerClick, Mail, Phone, MapPin, Zap, Building2, ChevronDown, Users, QrCode, FileText, UserCircle
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      const { error } = await supabase.from('solicitudes_registro').insert([formData]);
      if (error) throw error;
      setFormStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormStatus('idle');
        setFormData({ nombre_agencia: '', direccion: '', ciudad: '', codigo_postal: '', contacto_nombre: '', telefono: '', email: '' });
      }, 4000);
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 font-sans selection:bg-brand-500/30 text-white overflow-x-hidden">
      
      <nav className="fixed w-full z-50 bg-ink-950/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Inmoficina Logo" className="w-8 h-8 rounded-xl object-contain bg-white/5 p-1 border border-white/10 shadow-lg" />
            <span className="text-xl font-black tracking-tighter text-white">Inmoficina <span className="text-brand-400 font-bold tracking-widest text-[10px] uppercase ml-1">Luxury</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/60">
            <a href="#soluciones" className="hover:text-brand-400 transition-colors">Soluciones</a>
            <a href="#exclusividad" className="hover:text-brand-400 transition-colors">Exclusividad</a>
            <a href="#planes" className="hover:text-brand-400 transition-colors">Inversión</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors hidden sm:block">Acceso VIP</Link>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-[10px] sm:text-xs py-2.5 px-6 shadow-xl shadow-brand-500/20">Solicitar Demo</button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest animate-fade-in">
              <Sparkles size={12} /> La evolución del sector inmobiliario
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] animate-slide-up" style={{ animationDelay: '100ms' }}>
              Vende Más. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Trabaja Menos.</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
              El CRM definitivo diseñado exclusivamente para agencias inmobiliarias de alto rendimiento. Automatiza tu captación, impresiona a tus clientes y cierra ventas a una velocidad sin precedentes.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                Descubrir Inmoficina <ArrowRight size={16} />
              </button>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center text-center">
                Ya soy miembro
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-8 border-t border-white/5 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-ink-950 bg-ink-900 flex items-center justify-center overflow-hidden">
                    <UserCircle size={20} className="text-white/20"/>
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                </div>
                <span className="text-white/40 font-medium">Confiado por +50 agencias top en España</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in lg:block hidden" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-[2.5rem] blur-3xl transform rotate-6" />
            <div className="relative rounded-[2rem] border border-white/10 bg-ink-900/50 p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
               <img src={HERO_IMG_URL} alt="Inmoficina App Interface" className="w-full h-auto rounded-[1.5rem] border border-white/5 shadow-inner" />
               
               <div className="absolute -left-6 top-1/4 bg-ink-900 border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
                 <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20"><TrendingUp size={18} className="text-emerald-400"/></div>
                 <div>
                   <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Nuevo Cierre</div>
                   <div className="text-sm font-black text-white">+12,500€</div>
                 </div>
               </div>

               <div className="absolute -right-6 bottom-1/4 bg-ink-900 border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                 <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20"><Users size={18} className="text-purple-400"/></div>
                 <div>
                   <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Captación Web</div>
                   <div className="text-sm font-black text-white">Lead Caliente</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="soluciones" className="py-24 px-6 border-y border-white/5 bg-ink-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-4">Ecosistema Completo</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6">Todo lo que necesitas, <br/>en una sola plataforma.</h3>
            <p className="text-white/50 text-sm leading-relaxed">Olvídate de usar 5 herramientas distintas. Inmoficina unifica la gestión de clientes, inmuebles, marketing y análisis financiero en un entorno diseñado para la alta productividad.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutDashboard, title: "Pipeline de Ventas UI", desc: "Visualiza todo tu embudo de ventas en un tablero Kanban intuitivo. Arrastra, suelta y cierra tratos más rápido." },
              { icon: Rss, title: "Sincronización Portales", desc: "Publica en Idealista, Fotocasa y Habitaclia con un solo clic. Tus propiedades en todas partes al instante." },
              { icon: FileText, title: "Informes CMA Pro", desc: "Genera análisis comparativos de mercado en PDF que dejarán a los propietarios sin palabras." },
              { icon: Sparkles, title: "IA Predictor de Valor", desc: "Nuestra inteligencia artificial analiza +11.000 códigos postales para darte el valor real de mercado al instante." },
              { icon: QrCode, title: "Escaparate Interactivo", desc: "Fichas VIP públicas con códigos QR para tus escaparates. Que tus clientes interactúen desde la calle." },
              { icon: Landmark, title: "Dossier Inversionista", desc: "Calculadoras hipotecarias y de rentabilidad integradas para convencer a inversores con números claros." }
            ].map((f, i) => (
              <div key={i} className="card p-8 bg-ink-900/50 hover:bg-ink-900 border-white/5 hover:border-brand-500/30 transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-500/10 transition-colors border border-white/5 group-hover:border-brand-500/20">
                  <f.icon size={24} className="text-white/40 group-hover:text-brand-400 transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">{f.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="exclusividad" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Diseñado para verse <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">espectacular</span> en cualquier dispositivo.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Tus agentes no están siempre en la oficina. Inmoficina es 100% responsivo, permitiendo gestionar leads, firmar documentos y consultar la agenda desde un smartphone mientras están enseñando una propiedad.
            </p>
            <ul className="space-y-4">
              {[
                "Interfaz Dark Mode de alto contraste y nula fatiga visual.",
                "Fichas de propiedad adaptadas para enviar por WhatsApp.",
                "Gestión de agenda táctil y ultra rápida."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="w-[300px] h-[600px] border-[8px] border-ink-900 rounded-[3rem] bg-ink-950 relative shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="absolute top-0 inset-x-0 h-6 bg-ink-900 rounded-b-xl w-32 mx-auto" />
              <img src={HERO_IMG_URL} alt="Mobile App" className="w-full h-full object-cover object-left-top opacity-80" />
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="py-24 px-6 border-t border-white/5 bg-ink-900/30 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Inversión Transparente.</h2>
            <p className="text-white/50 text-sm mb-6 max-w-2xl mx-auto">
              Sin costes de instalación, sin permanencia oculta. Un precio simple que crece con el éxito de tu agencia.
            </p>
            <div className="inline-flex flex-col items-center">
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-2 flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <Sparkles size={12} /> Ahorra un 15% con pago anual
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Paga el año por adelantado y obtén un 15% de descuento directo en cualquier plan.</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
            <div className="card p-8 bg-ink-950 border-white/5 hover:border-white/10 transition-colors flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Plan Estándar</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">29€</span>
                  <span className="text-xs text-white/40 font-bold uppercase tracking-widest">/mes</span>
                </div>
                <p className="text-[11px] text-white/40 mt-3 h-8">Ideal para agentes independientes que quieren digitalizar su gestión.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "1 Usuario Agente",
                  "Gestión de Leads Ilimitada",
                  "Pipeline de Ventas (Kanban)",
                  "Cartera de Propiedades Ilimitada",
                  "Sincronización a Portales Básicos",
                  "Agenda y Tareas",
                  "Fichas VIP sin marca blanca"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/60">
                    <CheckCircle2 size={14} className="text-white/20 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-3.5 rounded-xl border border-white/10 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-colors">
                Solicitar Acceso
              </button>
            </div>

            <div className="card p-8 bg-ink-900 border-brand-500/30 relative flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.1)] transform md:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-400 to-purple-500" />
              <div className="absolute -top-3 right-6 bg-brand-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                Más Popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-brand-400 mb-2">Plan Premium Luxury</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">49€</span>
                  <span className="text-xs text-white/40 font-bold uppercase tracking-widest">/mes</span>
                </div>
                <p className="text-[11px] text-white/50 mt-3 h-8">Para agencias consolidadas que buscan herramientas de cierre avanzadas.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Hasta 3 Usuarios Agentes",
                  "Todo lo incluido en Estándar",
                  "Fichas VIP con Marca Blanca (Tu Logo)",
                  "Informes de Valoración CMA en PDF",
                  "Dossier para Inversores en PDF",
                  "IA Predictor de Valor de Mercado",
                  "Soporte Prioritario 24/7"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/80 font-medium">
                    <CheckCircle2 size={14} className="text-brand-400 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-brand-500/20 transition-all">
                Obtener Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/5 bg-ink-950 relative text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6">Pásate a la élite inmobiliaria.</h2>
          <p className="text-white/50 mb-8 text-sm">Empieza a usar Inmoficina hoy y descubre por qué las agencias que facturan más de 1M€ confían en plataformas de alto rendimiento.</p>
          <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-white text-ink-950 rounded-xl font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 mx-auto">
            <Zap size={16} /> Quiero mi cuenta VIP
          </button>
        </div>
      </section>

      <footer className="py-8 border-t border-white/5 text-center text-[10px] text-white/30 uppercase tracking-widest font-bold bg-ink-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; {new Date().getFullYear()} Inmoficina CRM. Todos los derechos reservados.</div>
          <div className="flex gap-4">
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Términos Legales</a>
            <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-ink-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up my-8">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">Solicitud de Acceso VIP</h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-400 font-bold mt-1">Plazas limitadas mensuales</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Solicitud Recibida</h4>
                  <p className="text-sm text-white/50">Nuestro equipo revisará tu perfil de agencia y se pondrá en contacto contigo en menos de 24 horas.</p>
                </div>
              ) : formStatus === 'error' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <X size={32} className="text-red-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Error de conexión</h4>
                  <p className="text-sm text-white/50">Ha habido un problema al enviar tu solicitud. Inténtalo de nuevo más tarde o escríbenos directamente.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-white/50 mb-6 leading-relaxed">Debido a la alta demanda y para garantizar el rendimiento de nuestros servidores, el registro está sujeto a aprobación manual.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1 ml-1">Nombre de la Agencia *</label>
                      <input required type="text" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors outline-none" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1 ml-1">Ciudad *</label>
                        <input required type="text" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors outline-none" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1 ml-1">C.P. *</label>
                        <input required type="text" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors outline-none" value={formData.codigo_postal} onChange={e => setFormData({...formData, codigo_postal: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1 ml-1">Persona de Contacto *</label>
                      <input required type="text" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors outline-none" value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1 ml-1">Teléfono Móvil *</label>
                      <input required type="tel" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[9px] font-medium uppercase tracking-widest text-white/40 mb-1 ml-1">Email *</label>
                      <input required type="email" className="w-full bg-ink-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white text-white focus:border-brand-500 transition-colors outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  
                    <button type="submit" disabled={formStatus === 'loading'} className="w-full py-3 mt-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20">
                      {formStatus === 'loading' ? <Loader2 className="animate-spin" size={14} /> : 'Solicitar Acceso VIP'}
                    </button>
                    <p className="text-[9px] text-white/30 text-center uppercase tracking-widest flex items-center justify-center gap-1 mt-3">
                      <CheckCircle2 size={10} className="text-emerald-400"/> Sin tarjeta de crédito
                    </p>
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