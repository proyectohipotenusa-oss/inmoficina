import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Globe, BarChart3, Sparkles, QrCode, Smartphone, 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Zap, X, Loader2,
  Users, Trophy, Landmark, MousePointer2, Briefcase, Calculator, 
  Send, Database, LayoutDashboard
} from 'lucide-react';

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    // Simulación de envío elegante
    setTimeout(() => setFormStatus('success'), 2000);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* NAVBAR: MÁS DISCRETA */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-black tracking-tight hidden sm:block uppercase">INMOFICINA<span className="text-brand-400">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] font-bold text-white/40">
            <a href="#diferenciacion" className="hover:text-white transition">Diferenciación</a>
            <a href="#funcionalidades" className="hover:text-white transition">Arsenal</a>
            <a href="#precios" className="hover:text-white transition">Tarifa</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-400 transition hidden sm:block text-white/30">Login</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 rounded-lg bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-400 transition shadow-lg">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: REESCALADO A TAMAÑOS ELEGANTES */}
      <section className="relative pt-32 pb-16 px-6 lg:pt-40 lg:pb-24 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[9px] font-black uppercase tracking-[0.2em] mb-8">
            <Trophy size={12} className="text-brand-400" /> Vende Lujo, No Ladrillo
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-8">
            Tu Marca es <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Inmortal.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Inmoficina no es un archivador. Es una máquina de ventas estética diseñada para la agencia que entiende que la tecnología es el nuevo lujo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button onClick={() => setIsModalOpen(true)} className="group px-8 py-4 rounded-xl bg-brand-500 text-white font-black text-sm hover:bg-brand-400 transition shadow-xl flex items-center justify-center gap-2">
              SOLICITAR 14 DÍAS GRATIS <ArrowRight size={16} />
            </button>
            <div className="text-left border-l border-white/10 pl-5">
               <span className="text-[9px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1.5 mb-1"><ShieldCheck size={12} className="text-brand-400"/> Sin tarjeta de crédito</span>
               <span className="text-[9px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1.5"><Briefcase size={12} className="text-brand-400"/> Perfil de Agencia Exclusivo</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN EXPERIENCIA PREMIUM CON IMAGEN */}
      <section id="diferenciacion" className="py-20 px-6 bg-ink-900/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black leading-tight uppercase tracking-tighter">La Nueva Era <br/><span className="text-white/20">del Agente VIP.</span></h2>
              <div className="space-y-5">
                {[
                  { title: "Doble Blindaje de Marca", desc: "Inyectamos tu identidad en cada enlace. Tu agencia es la protagonista absoluta, siempre." },
                  { title: "Inteligencia de Redacción", desc: "IA entrenada para vender. Memorias descriptivas de alto impacto generadas en segundos." },
                  { title: "Simplicidad 'One-Click'", desc: "Informes CMA y Dossiers financieros de nivel editorial con un solo clic." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <CheckCircle2 className="text-brand-400 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* IMAGEN QUE VENDE */}
            <div className="relative group">
               <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/20 to-emerald-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
               <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1600880212340-02d956ea360c?auto=format&fit=crop&q=80&w=1200" 
                   alt="Experiencia Premium" 
                   className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-60" />
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 inline-flex items-center gap-3">
                       <Smartphone size={20} className="text-brand-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Control total desde cualquier lugar</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARSENAL: REAJUSTADO */}
      <section id="funcionalidades" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase">Arsenal para el Cierre</h2>
          <p className="text-white/30 max-w-xl mx-auto text-sm">Herramientas inmersivas diseñadas para convertir visitas en firmas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Fichas VIP", desc: "Enlaces inmersivos con calculadora hipotecaria dinámica." },
            { icon: BarChart3, title: "CMA Reports", desc: "Valoraciones precisas con diseño de alta costura." },
            { icon: Landmark, title: "Dossier Inversion", desc: "Rentabilidad neta y Cash Flow al instante." },
            { icon: QrCode, title: "QR Dinámicos", desc: "Puente directo del escaparate al móvil del cliente." },
            { icon: Sparkles, title: "Motor IA", desc: "Redacción creativa basada en datos técnicos." },
            { icon: LayoutDashboard, title: "Pipeline Kanban", desc: "Control visual absoluto de tu embudo de ventas." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-500/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-5 border border-brand-500/20">
                <f.icon className="text-brand-400" size={20} />
              </div>
              <h3 className="text-sm font-black mb-2 uppercase tracking-widest">{f.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TARIFAS: MÁS CONTENIDO Y DISEÑO COMPACTO */}
      <section id="precios" className="py-24 px-6 bg-ink-900/20">
        <div className="max-w-3xl mx-auto bg-ink-950 border border-brand-500/20 p-8 md:p-16 rounded-[2rem] text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-[9px] font-black uppercase tracking-widest rounded-b-lg">Pack Agencia Premium</div>
          
          <div className="mb-10">
            <div className="text-[80px] font-black leading-none tracking-tighter text-white mb-2">49<span className="text-2xl text-brand-400">€/mes</span></div>
            <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Sin costes ocultos. Sin límites.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-left mb-12">
            {[
              "3 Licencias de Usuario",
              "Fichas VIP Ilimitadas",
              "Informes CMA Ilimitados",
              "Sin costes por asiento extra",
              "Soporte Premium Directo",
              "Dossiers de Inversión Pro",
              "Compresión de Fotos en la Nube",
              "IA de Redacción Ilimitada",
              "CRM Mobile-First Real",
              "Panel de Control de Leads"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/50 font-bold text-[11px]">
                <CheckCircle2 className="text-brand-400 shrink-0" size={14} /> {item}
              </div>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full py-4 rounded-xl bg-white text-ink-950 font-black text-sm uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-xl">
            Empezar 14 días de prueba
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-white/5 text-center">
        <div className="w-[35px] h-[35px] mx-auto mb-6 opacity-30">
          <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain grayscale" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Elevando el estándar inmobiliario</p>
      </footer>

      {/* MODAL DE REGISTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-ink-950 border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8">
              
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-white/20 hover:text-white transition"><X size={20} /></button>

              {formStatus === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <Send size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black mb-3 uppercase tracking-tighter">Solicitud Enviada</h3>
                  <p className="text-white/40 text-xs leading-relaxed font-medium mb-8">Un consultor VIP revisará tu solicitud y creará tus credenciales de acceso. Nos vemos pronto.</p>
                  <button onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">Cerrar</button>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">Inicia el viaje</h3>
                    <p className="text-[10px] text-brand-400 uppercase tracking-widest font-black">Pack Agencia Premium • 14 Días</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Agencia</label>
                      <input required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="Nombre de la Inmobiliaria" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Dirección</label>
                      <input className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="Dirección física" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Contacto</label>
                      <input required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="Nombre completo" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Teléfono</label>
                        <input required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="+34..." />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email</label>
                        <input required type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-all" placeholder="hola@..." />
                      </div>
                    </div>

                    <button type="submit" disabled={formStatus === 'loading'} className="w-full py-4 mt-4 rounded-xl bg-brand-500 text-white font-black text-xs uppercase tracking-widest hover:bg-brand-400 transition flex items-center justify-center gap-2">
                      {formStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Solicitar Acceso'}
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