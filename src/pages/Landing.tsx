import { useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  Globe, BarChart3, Sparkles, QrCode, Smartphone, 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Zap, X, Loader2,
  Trophy, Landmark, LayoutDashboard, Send, MousePointerClick
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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-[40px] h-[40px] rounded-lg overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-500">
              <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase group-hover:text-brand-400 transition-colors">INMOFICINA<span className="text-brand-400">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
            <a href="#experiencia" className="hover:text-white transition-all">Filosofía</a>
            <a href="#arsenal" className="hover:text-white transition-all">Tecnología</a>
            <a href="#tarifa" className="hover:text-white transition-all">Inversión</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-400 transition hidden sm:block text-white/20">Acceso Agentes</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-400 transition shadow-[0_0_20px_rgba(59,130,246,0.2)] active:scale-95">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-52 lg:pb-32 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-[9px] font-black uppercase tracking-[0.3em] mb-10 animate-fade-in">
            <Trophy size={12} className="animate-pulse" /> El Estándar de la Nueva Generación
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
            Vende Lujo,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-brand-500">No Ladrillo.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed font-light tracking-wide">
            Inmoficina es el CRM diseñado para la agencia que entiende que <span className="text-white/80">la marca propia es el activo más valioso.</span> Tecnología inmersiva que cierra ventas.
          </p>
          <div className="flex flex-col items-center gap-8">
            <button onClick={() => setIsModalOpen(true)} className="group relative px-10 py-5 bg-brand-500 rounded-2xl text-white font-black uppercase tracking-widest text-sm hover:bg-brand-400 transition shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] active:scale-95 flex items-center gap-3">
              Solicitar Mi Prueba Gratuita <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-10 opacity-30 grayscale pointer-events-none">
               <span className="text-[10px] font-black uppercase tracking-widest">IA Real</span>
               <span className="text-[10px] font-black uppercase tracking-widest">CMA Reports</span>
               <span className="text-[10px] font-black uppercase tracking-widest">Fichas VIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN IMAGEN Y DIFERENCIACIÓN */}
      <section id="experiencia" className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
             <div className="relative group">
                <div className="absolute -inset-4 bg-brand-500/10 rounded-[3rem] blur-2xl group-hover:bg-brand-500/20 transition duration-1000" />
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb81?q=80&w=1200&auto=format&fit=crop" 
                    alt="Agente Inmobiliario Exitoso" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-10 left-10 right-10">
                     <div className="p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center border border-brand-500/30">
                           <Smartphone size={24} className="text-brand-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Tecnología Móvil</p>
                           <p className="text-sm font-bold text-white/90">Tu agencia en la palma de tu mano.</p>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.95] tracking-tighter">La marca <br/><span className="text-white/20 font-light italic">es el mensaje.</span></h2>
            <div className="space-y-8">
              {[
                { icon: Star, title: "Doble Blindaje de Marca", desc: "No permitas que tu nombre desaparezca. Inyectamos tu logo e identidad en cada pixel que ve el cliente." },
                { icon: Sparkles, title: "Inteligencia que Redacta", desc: "Se acabó el bloqueo creativo. Nuestra IA redacta memorias de alto impacto técnico y comercial." },
                { icon: MousePointerClick, title: "Ventas a un solo clic", desc: "Reports de valoración y dossiers financieros con diseño editorial. El poder de los datos, con elegancia." }
              ].map((item, i) => (
                <div key={i} className="group flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-brand-500/50 group-hover:bg-brand-500/5 transition-all">
                    <item.icon className="text-brand-400 group-hover:scale-110 transition-transform" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2">{item.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="text-[11px] font-black uppercase tracking-widest border-b-2 border-brand-500 pb-1 hover:text-brand-400 transition-colors">Solicitar Acceso VIP</button>
          </div>
        </div>
      </section>

      {/* ARSENAL GRID */}
      <section id="arsenal" className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Arsenal para el Cierre</h2>
          <div className="w-20 h-1 bg-brand-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { icon: Globe, title: "Fichas VIP", desc: "Enlaces inmersivos que calculan la hipoteca en tiempo real mientras el cliente se enamora de la casa." },
            { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones de mercado precisas justificadas con datos oficiales y diseño de lujo." },
            { icon: Landmark, title: "Inversión Pro", desc: "Habla el idioma del inversor: ROI, Yield y Cash Flow calculados en segundos." },
            { icon: QrCode, title: "QR Dinámicos", desc: "Puente instantáneo entre tu escaparate y el WhatsApp del cliente. Eficacia total." },
            { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual absoluto de tus leads. No permitas que ni una oportunidad se escape." },
            { icon: Zap, title: "IA Predictor", desc: "Algoritmos que analizan el potencial de cierre de cada propiedad de tu inventario." }
          ].map((f, i) => (
            <div key={i} className="group p-10 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-brand-500/20 hover:bg-white/[0.03] transition-all duration-500">
              <f.icon className="text-white/20 group-hover:text-brand-400 mb-8 transition-colors duration-500" size={32} />
              <h3 className="text-sm font-black mb-3 uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">{f.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/60 transition-colors duration-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TARIFA */}
      <section id="tarifa" className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto bg-ink-950 border border-brand-500/20 p-12 md:p-20 rounded-[3rem] text-center shadow-[0_0_100px_rgba(59,130,246,0.1)]">
          <div className="text-[120px] font-black leading-none tracking-tighter text-white mb-6">49<span className="text-3xl text-brand-400">€/mes</span></div>
          <p className="text-white/30 font-bold uppercase tracking-widest text-[11px] mb-12">Pack Agencia Premium • Sin permanencia</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-left mb-16 border-t border-white/5 pt-12">
            {[
              "3 Licencias de Usuario", "Fichas VIP Ilimitadas", "CMA Reports Ilimitados", 
              "Sin costes por asiento extra", "IA de Redacción Pro", "Compresión Fotos HD", 
              "Soporte VIP Directo", "Códigos QR Dinámicos", "Pipeline de Ventas", "Análisis Financiero"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/50 font-bold text-[10px] uppercase tracking-wider">
                <CheckCircle2 className="text-brand-400 shrink-0" size={14} /> {item}
              </div>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full py-6 rounded-2xl bg-white text-ink-950 font-black text-sm uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all scale-105 hover:scale-110 shadow-2xl active:scale-95">
            Comenzar Free-Trial de 14 días
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 text-center bg-black/20">
        <div className="w-[45px] h-[45px] mx-auto mb-8 opacity-20 hover:opacity-100 transition-all duration-700 cursor-pointer hover:scale-110">
          <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain grayscale" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-2">Elevando el estándar inmobiliario</p>
        <p className="text-[8px] font-medium text-white/5 uppercase tracking-[0.1em]">© {new Date().getFullYear()} Inmoficina. All Rights Reserved.</p>
      </footer>

      {/* MODAL DE REGISTRO (Todos los campos obligatorios) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition"><X size={20} /></button>

              {formStatus === 'success' ? (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                    <Send size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black mb-3 uppercase tracking-tighter">Solicitud Enviada</h3>
                  <p className="text-white/40 text-[11px] leading-relaxed font-medium mb-10">Revisaremos tu agencia y crearemos tus credenciales VIP. Te avisaremos por email.</p>
                  <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition">Finalizar</button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center">
                    <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">Solicitud VIP</h3>
                    <p className="text-[9px] text-brand-400 uppercase tracking-[0.3em] font-black">Prueba de 14 Días • Acceso Manual</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Inmobiliaria *</label>
                      <input required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="Nombre de la agencia" 
                        value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Dirección Física *</label>
                      <input required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="Calle, Ciudad..." 
                        value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Responsable *</label>
                      <input required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="Nombre completo" 
                        value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Teléfono *</label>
                        <input required type="tel" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="+34..." 
                          value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email *</label>
                        <input required type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="hola@..." 
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <button type="submit" disabled={formStatus === 'loading'} className="w-full py-5 mt-6 rounded-xl bg-brand-500 text-white font-black text-xs uppercase tracking-widest hover:bg-brand-400 transition flex items-center justify-center gap-3 group">
                      {formStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <>Solicitar Mi Entorno <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></>}
                    </button>
                    {formStatus === 'error' && <p className="text-[9px] text-red-400 text-center font-bold uppercase tracking-widest mt-3">Error al conectar. Reinténtalo.</p>}
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