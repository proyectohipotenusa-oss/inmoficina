import { useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, QrCode, Smartphone, 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Zap, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, MousePointerClick, Briefcase
} from 'lucide-react';

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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
              <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-bold tracking-tight uppercase group-hover:text-brand-400 transition-colors">INMOFICINA<span className="text-brand-400">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-medium text-white/50">
            <a href="#experiencia" className="hover:text-white transition-colors">Filosofía</a>
            <a href="#arsenal" className="hover:text-white transition-colors">Tecnología</a>
            <a href="#tarifa" className="hover:text-white transition-colors">Inversión</a>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[11px] font-semibold uppercase tracking-widest hover:text-brand-400 transition hidden sm:block text-white/40">Acceso Agentes</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 rounded-lg bg-brand-600 text-white text-[11px] font-semibold uppercase tracking-widest hover:bg-brand-500 transition shadow-lg shadow-brand-500/20 active:scale-95">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/70 text-[10px] font-medium uppercase tracking-[0.2em] mb-8 animate-fade-in backdrop-blur-md">
            <Trophy size={14} className="text-brand-400" /> El Estándar de la Nueva Generación
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-8">
            Vende Lujo,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-emerald-400 font-extrabold">No Ladrillo.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
            Inmoficina es el CRM diseñado para la agencia que entiende que la marca propia es su activo más valioso. Tecnología inmersiva, diseño exquisito y herramientas orientadas al cierre.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button onClick={() => setIsModalOpen(true)} className="group relative px-8 py-4 bg-white text-ink-950 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-50 hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center gap-3">
              Solicitar Prueba Gratuita <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-8 opacity-40 grayscale pointer-events-none">
               <span className="text-[10px] font-medium uppercase tracking-widest">IA Generativa</span>
               <span className="text-[10px] font-medium uppercase tracking-widest">CMA Reports</span>
               <span className="text-[10px] font-medium uppercase tracking-widest">Fichas VIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN IMAGEN Y DIFERENCIACIÓN */}
      <section id="experiencia" className="py-24 px-6 bg-gradient-to-b from-white/[0.02] to-transparent border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
             <div className="relative group">
                <div className="absolute -inset-4 bg-brand-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-brand-500/15 transition duration-1000" />
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-ink-900">
                  {/* IMAGEN ESTABLE Y PROFESIONAL INCRUSTADA */}
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200" 
                    alt="Agente Inmobiliario en oficina premium" 
                    className="w-full h-full object-cover scale-[1.03] group-hover:scale-100 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-8 left-8 right-8">
                     <div className="p-5 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center border border-brand-500/30 shrink-0">
                           <Smartphone size={20} className="text-brand-300" />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-brand-400 uppercase tracking-[0.2em] mb-1">Tecnología Móvil</p>
                           <p className="text-sm font-medium text-white/90">Tu agencia centralizada y en tu bolsillo.</p>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] tracking-tight">
              La marca <br/><span className="text-white/40 font-light italic">es el mensaje.</span>
            </h2>
            <div className="space-y-8">
              {[
                { icon: Star, title: "Doble Blindaje de Marca", desc: "No permitas que tu nombre desaparezca. Inyectamos tu logo e identidad en cada pixel que ve el cliente." },
                { icon: Sparkles, title: "Inteligencia que Redacta", desc: "Se acabó el bloqueo creativo. Nuestra IA redacta memorias de alto impacto técnico y comercial en segundos." },
                { icon: MousePointerClick, title: "Ventas a un solo clic", desc: "Reports de valoración y dossiers financieros con diseño editorial. El poder de los datos, envuelto en elegancia." }
              ].map((item, i) => (
                <div key={i} className="group flex gap-5">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-brand-500/30 group-hover:bg-brand-500/10 transition-all">
                    <item.icon className="text-brand-400 group-hover:scale-110 transition-transform" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/50 text-sm font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="text-[11px] font-semibold uppercase tracking-[0.15em] border-b border-brand-500 pb-1 hover:text-brand-400 transition-colors text-white/80">Solicitar Acceso VIP</button>
          </div>
        </div>
      </section>

      {/* ARSENAL GRID */}
      <section id="arsenal" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Arsenal para el Cierre</h2>
          <p className="text-white/40 font-light text-sm max-w-xl mx-auto">Tecnología inmersiva diseñada para elevar la percepción de valor y multiplicar tus conversiones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Fichas VIP Inmersivas", desc: "Enlaces web que calculan la hipoteca en tiempo real mientras el cliente explora la galería." },
            { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones de mercado justificadas con datos de las 52 provincias y diseño de lujo." },
            { icon: Landmark, title: "Dossier de Inversión", desc: "Habla el idioma del inversor: ROI, Yield Neto y Cash Flow calculados automáticamente." },
            { icon: QrCode, title: "Conexión QR Dinámica", desc: "Un puente instantáneo entre el cartel de tu escaparate y el smartphone del cliente." },
            { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual absoluto de tus leads. Arrastra y suelta para gestionar tus negociaciones." },
            { icon: Zap, title: "IA Predictor", desc: "Analítica inteligente que evalúa el potencial de cierre de cada propiedad de tu cartera." }
          ].map((f, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-500/20 transition-all duration-300">
              <f.icon className="text-brand-400/50 group-hover:text-brand-400 mb-6 transition-colors duration-300" size={28} />
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TARIFA */}
      <section id="tarifa" className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-ink-900 to-ink-950 border border-white/10 p-10 md:p-16 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand-500 text-[10px] font-bold uppercase tracking-widest rounded-b-xl shadow-lg shadow-brand-500/20">
            Pack Agencia Premium
          </div>
          
          <div className="mb-10 pt-4">
            <div className="text-6xl md:text-7xl font-bold leading-none tracking-tighter text-white mb-4">49<span className="text-2xl text-brand-400 font-medium">€/mes</span></div>
            <p className="text-white/40 font-medium uppercase tracking-widest text-[10px]">Sin permanencia. Todo incluido.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-left mb-12 border-t border-white/5 pt-10">
            {[
              "3 Licencias de Usuario", 
              "Fichas VIP Ilimitadas", 
              "Informes CMA Ilimitados", 
              "Sin costes por asiento extra", 
              "IA de Redacción Integrada", 
              "Compresión Fotos en la Nube", 
              "Códigos QR Dinámicos", 
              "Pipeline y Gestión de Leads"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/60 font-light text-sm">
                <CheckCircle2 className="text-brand-400 shrink-0" size={16} /> {item}
              </div>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full py-4 rounded-xl bg-brand-600 text-white font-semibold text-sm uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
            Comenzar 14 días gratis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-white/5 text-center bg-ink-950/50">
        <div className="w-[30px] h-[30px] mx-auto mb-6 opacity-30 hover:opacity-100 transition-all duration-500 cursor-pointer">
          <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain grayscale hover:grayscale-0" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20 mb-3">Elevando el estándar inmobiliario</p>
        <p className="text-[9px] font-light text-white/10 uppercase tracking-widest">© {new Date().getFullYear()} Inmoficina. Todos los derechos reservados.</p>
      </footer>

      {/* MODAL DE REGISTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-ink-950 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8 md:p-10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-white/30 hover:text-white transition"><X size={20} /></button>

              {formStatus === 'success' ? (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <Send size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Solicitud Enviada</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light mb-8">Revisaremos tu agencia y crearemos tus credenciales VIP. Te avisaremos por email en breve.</p>
                  <button onClick={() => setIsModalOpen(false)} className="w-full py-3.5 bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-widest border border-white/10 hover:bg-white/10 transition">Finalizar</button>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Solicitud de Acceso</h3>
                    <p className="text-[10px] text-brand-400 uppercase tracking-widest font-semibold">14 Días Gratis • Pack Agencia Premium</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest ml-1">Inmobiliaria *</label>
                      <input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="Nombre de la agencia" 
                        value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest ml-1">Dirección Física *</label>
                      <input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="Calle, Ciudad..." 
                        value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest ml-1">Responsable *</label>
                      <input required className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="Nombre completo" 
                        value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest ml-1">Teléfono *</label>
                        <input required type="tel" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="+34..." 
                          value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest ml-1">Email *</label>
                        <input required type="email" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all font-light" placeholder="hola@..." 
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <button type="submit" disabled={formStatus === 'loading'} className="w-full py-4 mt-6 rounded-xl bg-brand-600 text-white font-semibold text-xs uppercase tracking-widest hover:bg-brand-500 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20">
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