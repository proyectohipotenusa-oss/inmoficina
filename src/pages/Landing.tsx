import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Globe, BarChart3, Sparkles, QrCode, Smartphone, 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Zap, X, Loader2,
  Users, Trophy, Landmark, Heart, MousePointer2
} from 'lucide-react';

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setTimeout(() => setFormStatus('success'), 2000);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Inmoficina Logo" className="w-full h-full object-contain bg-transparent" />
            </div>
            <span className="text-xl font-black tracking-tight hidden sm:block uppercase">INMOFICINA<span className="text-brand-400">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60 text-[11px] uppercase tracking-widest font-bold">
            <a href="#diferenciacion" className="hover:text-brand-400 transition">Por qué nosotros</a>
            <a href="#funcionalidades" className="hover:text-brand-400 transition">Arsenal</a>
            <a href="#precios" className="hover:text-brand-400 transition">Inversión</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-wider hover:text-brand-400 transition hidden sm:block text-white/40">Login</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 rounded-xl bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-brand-400 transition shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: IMPACTO TOTAL */}
      <section className="relative pt-40 pb-24 px-6 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in">
            <Trophy size={14} className="fill-brand-400" /> Vende Lujo, No Ladrillo
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-10">
            Tu Marca es <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-brand-500 animate-gradient">Inmortal.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Inmoficina no es un archivador digital. Es una <strong className="text-white">máquina de ventas estética</strong> que proyecta la imagen de una gran multinacional del lujo sobre tu agencia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={() => setIsModalOpen(true)} className="group w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-500 text-white font-black text-lg hover:bg-brand-400 transition shadow-[0_0_50px_rgba(59,130,246,0.4)] flex items-center justify-center gap-3">
              OBTENER 14 DÍAS GRATIS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-col items-start">
               <span className="text-[10px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-400"/> Sin tarjeta de crédito</span>
               <span className="text-[10px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-400"/> Acceso inmediato</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA: EL "DOLOR" VS LA SOLUCIÓN */}
      <section id="diferenciacion" className="py-24 px-6 bg-ink-900/30 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Adiós a los CRMs de los <span className="text-white/20">años 90.</span></h2>
              <div className="space-y-6">
                {[
                  { title: "Doble Blindaje de Marca Inmortal", desc: "A diferencia de otros donde los links fallan, Inmoficina inyecta tu nombre en el ADN de cada ficha. Tu marca brilla siempre, con o sin sesión iniciada." },
                  { title: "Inteligencia Artificial de Redacción", desc: "Genera memorias descriptivas profesionales en segundos. Ahorra horas de trabajo creativo y garantiza anuncios persuasivos desde el minuto uno." },
                  { title: "Simplicidad 'One-Click'", desc: "CMA Reports y Dossiers financieros con un clic. Diseño digno de revista de arquitectura sin exportar nada a Excel." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1"><CheckCircle2 className="text-brand-400" size={24} /></div>
                    <div>
                      <h4 className="font-black uppercase tracking-wider text-sm mb-1">{item.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-brand-500/10 blur-[100px] rounded-full" />
               <div className="relative card border-white/10 bg-ink-950 p-4 rounded-3xl rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                 <div className="aspect-video rounded-2xl bg-ink-900 border border-white/5 overflow-hidden flex items-center justify-center">
                    <Sparkles size={48} className="text-brand-400 animate-pulse" />
                    <span className="ml-4 font-black tracking-tighter text-2xl uppercase">Experiencia Premium</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARSENAL DE FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Arsenal para el Cierre</h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">Tecnología inmersiva que eleva la percepción de valor y se traduce directamente en comisiones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Globe, title: "Fichas Públicas VIP", desc: "El enlace mágico para WhatsApp. Webs interactivas con calculadora hipotecaria real que enamoran al comprador." },
            { icon: BarChart3, title: "Informes CMA Pro", desc: "Justifica el precio de captación con datos reales de las 52 provincias y diseño de alta costura." },
            { icon: Landmark, title: "Dossier Inversionista", desc: "Habla el idioma del dinero. Rentabilidad neta, Yield y Cash Flow calculados al instante para grandes capitales." },
            { icon: QrCode, title: "Conexión QR Dinámica", desc: "Puente real entre tu escaparate físico y el móvil del cliente. Generación automática para cada propiedad." },
            { icon: Zap, title: "IA Predictor", desc: "Anticípate al mercado. Sistema visual Kanban para que ningún lead se pierda por falta de seguimiento." },
            { icon: MousePointer2, title: "Todo Ilimitado", desc: "Sin límites de propiedades, fotos o informes. El CRM escala contigo sin cobrarte de más." }
          ].map((f, i) => (
            <div key={i} className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-500/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-8 border border-brand-500/20 group-hover:scale-110 transition-transform">
                <f.icon className="text-brand-400" size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{f.title}</h3>
              <p className="text-white/40 text-[15px] leading-relaxed group-hover:text-white/70 transition-colors">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PACK AGENCIA: EL PRECIO QUE DESTROZA EL MERCADO */}
      <section id="precios" className="py-32 px-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-fixed">
        <div className="max-w-4xl mx-auto text-center bg-brand-500/5 border border-brand-500/20 p-12 md:p-24 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
          
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter uppercase">Modelo Pack Agencia</h2>
          
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex items-center gap-4 text-brand-400 bg-brand-500/10 px-6 py-3 rounded-full border border-brand-500/30 font-black uppercase tracking-widest text-xs">
              <Users size={18} /> Incluye 3 Licencias de Usuario
            </div>
            <div className="text-[120px] font-black leading-none tracking-tighter text-white">49<span className="text-4xl text-brand-400">€/mes</span></div>
            <p className="text-white/50 font-bold uppercase tracking-widest text-sm">Tras tus 14 días de prueba gratuita</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto mb-16">
            {["Usuarios coordinados", "Soporte Premium Directo", "Fichas VIP Ilimitadas", "Sin costes por asiento extra"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70 font-bold text-sm">
                <CheckCircle2 className="text-brand-400" size={18} /> {item}
              </div>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full py-6 rounded-[2rem] bg-white text-ink-950 font-black text-2xl uppercase tracking-tighter hover:bg-brand-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-105 hover:scale-110">
            Empezar Free-Trial
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-ink-950 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-[60px] h-[60px] mb-8 opacity-40 hover:opacity-100 transition duration-700 cursor-pointer">
            <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Inmoficina Logo" className="w-full h-full object-contain bg-transparent" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Elevando el estándar inmobiliario</p>
          <div className="flex items-center justify-center gap-12 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-brand-400 transition">Legales</a>
            <a href="#" className="hover:text-brand-400 transition">Privacidad</a>
            <a href="#" className="hover:text-brand-400 transition">Soporte</a>
          </div>
        </div>
      </footer>

      {/* MODAL DE REGISTRO PREMIUM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-ink-950 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(59,130,246,0.2)] overflow-hidden animate-slide-up">
            <div className="p-8 sm:p-10">
              
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 text-white/20 hover:text-white transition"
              >
                <X size={24} />
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                    <CheckCircle2 size={40} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">¡Bienvenido a Bordo!</h3>
                  <p className="text-white/50 mb-8 leading-relaxed font-medium">Estamos preparando tu entorno de lujo. Un consultor VIP se pondrá en contacto contigo para activar tu acceso.</p>
                  <button onClick={() => setIsModalOpen(false)} className="btn-primary w-full py-4 uppercase font-black tracking-widest text-xs">Cerrar</button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
                      <Star size={24} className="text-brand-400 fill-brand-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter leading-none">Solicitud de Acceso</h3>
                    <p className="text-[11px] text-brand-400 uppercase tracking-widest font-black">14 Días • Pack Agencia Premium</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Nombre de la Agencia</label>
                      <input required type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:bg-white/[0.05] transition-all" placeholder="Ej. Inmobiliaria Monedita" />
                    </div>
                    
                    <div>
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Dirección Física</label>
                      <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:bg-white/[0.05] transition-all" placeholder="Ciudad, Calle..." />
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Persona de Contacto</label>
                      <input required type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:bg-white/[0.05] transition-all" placeholder="Tu nombre completo" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Teléfono</label>
                        <input required type="tel" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:bg-white/[0.05] transition-all" placeholder="+34..." />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Email Corp.</label>
                        <input required type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:bg-white/[0.05] transition-all" placeholder="hola@..." />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        type="submit" 
                        disabled={formStatus === 'loading'}
                        className="w-full py-5 rounded-2xl bg-brand-500 text-white font-black text-sm uppercase tracking-widest hover:bg-brand-400 transition shadow-[0_10px_30px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 group"
                      >
                        {formStatus === 'loading' ? <Loader2 size={20} className="animate-spin" /> : <>Solicitar Mi Espacio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                      <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-widest mt-6">Tu privacidad es un activo blindado por INMOFICINA.</p>
                    </div>
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