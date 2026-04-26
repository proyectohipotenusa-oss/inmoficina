import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Globe, BarChart3, Sparkles, QrCode, Smartphone, 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Zap, X, Loader2
} from 'lucide-react';

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    // Simulamos un envío elegante. Aquí en el futuro se conectaría con Supabase para crear la "cuenta en revisión".
    setTimeout(() => setFormStatus('success'), 2000);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* EL LOGO CUADRADO EXACTAMENTE COMO LO PEDISTE (50x50) */}
            <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Inmoficina Logo" className="w-full h-full object-contain bg-transparent" />
            </div>
            <span className="text-xl font-black tracking-tight hidden sm:block">INMOFICINA<span className="text-brand-400">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#caracteristicas" className="hover:text-white transition">Características</a>
            <a href="#precios" className="hover:text-white transition">Precios</a>
            <a href="#faq" className="hover:text-white transition">Preguntas Frecuentes</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-brand-400 transition hidden sm:block">Iniciar Sesión</Link>
            <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-400 transition shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Probar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Star size={12} className="fill-brand-400" /> El CRM de la Nueva Generación
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            No gestiones propiedades.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Diseña Experiencias de Lujo.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            El único CRM Inmobiliario que convierte cada casa en una obra maestra digital. Fichas públicas interactivas, Informes CMA automáticos y redacción con Inteligencia Artificial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 text-white font-bold text-lg hover:bg-brand-400 transition shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2">
              Comienza tus 14 días gratis <ArrowRight size={20} />
            </button>
            <span className="text-sm text-white/40 flex items-center gap-1.5"><ShieldCheck size={16}/> Sin tarjeta de crédito</span>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="caracteristicas" className="py-24 px-6 bg-ink-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Herramientas que Cierran Ventas</h2>
            <p className="text-white/50 max-w-xl mx-auto">Olvídate de los CRMs que parecen hojas de cálculo de 1998. Hemos creado un ecosistema diseñado para enamorar a tus clientes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Fichas Públicas VIP", desc: "Comparte propiedades por WhatsApp con un enlace mágico. El cliente verá un diseño inmersivo con tu logo y tu contacto directo." },
              { icon: BarChart3, title: "Informes de Valoración CMA", desc: "Genera estudios de mercado precisos y estéticos en 1 clic. Justifica tus precios con datos y diseño de alta costura." },
              { icon: Sparkles, title: "Motor de IA Integrado", desc: "Se acabó el bloqueo del escritor. Nuestra Inteligencia Artificial redacta memorias descriptivas persuasivas en segundos." },
              { icon: QrCode, title: "Conexión Físico-Digital", desc: "Genera Códigos QR automáticos para tus escaparates. Al escanearlos, el cliente entra a tu Ficha VIP al instante." },
              { icon: Zap, title: "Dossier para Inversores", desc: "Calcula el ROI, Cash Flow y Yield Neto automáticamente. Presenta PDFs financieros que convencen a los grandes capitales." },
              { icon: Smartphone, title: "Mobile-First Real", desc: "Gestiona tu agencia desde cualquier lugar. Diseño fluido, modo oscuro premium y experiencia nativa en tu móvil." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 border border-brand-500/20">
                  <f.icon className="text-brand-400" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="precios" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Un Precio. Todo Incluido.</h2>
          <p className="text-white/50 max-w-xl mx-auto mb-16">Sin costes ocultos por módulos extras ni sorpresas. Todo el lujo y la potencia del CRM desde el primer minuto.</p>

          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-brand-500/30 to-transparent max-w-md mx-auto">
            <div className="p-8 md:p-12 rounded-[22px] bg-ink-950 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 py-1.5 bg-brand-500 text-[10px] font-black uppercase tracking-widest text-center">
                Oferta de Lanzamiento
              </div>
              
              <div className="mt-6 mb-8">
                <div className="text-white/40 font-medium mb-2">Prueba gratuita</div>
                <div className="text-5xl font-black text-white mb-2">14 días <span className="text-xl text-brand-400">gratis</span></div>
                <div className="text-sm text-white/50">Sin tarjeta de crédito. Cancela cuando quieras.</div>
              </div>

              <div className="space-y-4 mb-10 text-left">
                {[
                  "Fichas Públicas VIP Ilimitadas",
                  "Informes CMA y Dossiers PDF",
                  "Generador de Textos con IA",
                  "Códigos QR para Escaparates",
                  "Gestión de Pipeline y Leads",
                  "Soporte Premium Directo"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-400 shrink-0" size={20} />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-8 text-left">
                <div className="text-sm text-white/60 mb-1">Tras la prueba gratuita:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">49€</span><span className="text-white/40">/mes</span>
                  <span className="text-xs text-brand-400 font-bold ml-2">(Los primeros 2 meses)</span>
                </div>
                <div className="text-xs text-white/40 mt-2">A partir del tercer mes: 59€/mes.</div>
              </div>

              <button onClick={() => setIsModalOpen(true)} className="block w-full py-4 rounded-xl bg-white text-ink-950 font-black hover:bg-brand-50 transition">
                Empezar Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-ink-900/30 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Preguntas Frecuentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "¿Necesito tarjeta de crédito para la prueba de 14 días?", a: "No. Queremos que te enamores del CRM por su valor, no por obligarte a registrar una tarjeta. Al terminar tus 14 días, tú decides si quieres suscribirte." },
              { q: "¿Los Informes CMA y PDF tienen límite?", a: "Absolutamente no. Puedes generar todos los análisis comparativos de mercado y dossiers de inversión que necesites para tus clientes." },
              { q: "¿Cómo funcionan las Fichas Públicas y el WhatsApp?", a: "Cuando creas una propiedad, el sistema genera una web VIP pública. Al darle a compartir, se abre tu WhatsApp automáticamente con un texto elegante y el enlace listo para enviar a tu cliente." },
              { q: "¿Están seguros los datos de mis clientes y propiedades?", a: "Tus datos están blindados. Utilizamos infraestructura de bases de datos de nivel mundial con encriptación de extremo a extremo y políticas de seguridad (RLS) estrictas." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="text-lg font-bold mb-2 flex items-start gap-3">
                  <span className="text-brand-400 mt-1">Q.</span> {faq.q}
                </h4>
                <p className="text-white/60 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5 bg-ink-950 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-[40px] h-[40px] mb-4 opacity-50 grayscale hover:grayscale-0 transition duration-500">
            <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Inmoficina Logo" className="w-full h-full object-contain bg-transparent" />
          </div>
          <p className="text-sm text-white/40 mb-6">El software que redefine la venta inmobiliaria. Diseñado con precisión y elegancia.</p>
          <div className="flex items-center justify-center gap-6 text-xs font-bold text-white/30 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Términos Legales</a>
            <a href="#" className="hover:text-white transition">Privacidad</a>
            <a href="#" className="hover:text-white transition">Soporte</a>
          </div>
        </div>
      </footer>

      {/* MODAL DE REGISTRO PREMIUM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => formStatus !== 'loading' && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-ink-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 sm:p-8">
              
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={formStatus === 'loading'}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition bg-white/5 rounded-full p-2"
              >
                <X size={20} />
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">¡Solicitud Recibida!</h3>
                  <p className="text-white/60 mb-6">Estamos preparando tu entorno de agencia. Nos pondremos en contacto contigo en breve para darte acceso a tus 14 días gratuitos.</p>
                  <button onClick={() => setIsModalOpen(false)} className="btn-primary w-full py-3">Cerrar</button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-white mb-2">Comienza tu viaje.</h3>
                    <p className="text-sm text-white/50">Déjanos los datos de tu agencia y prepararemos tu espacio exclusivo en Inmoficina.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Nombre de la Agencia *</label>
                      <input required type="text" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="Ej. Inmobiliaria Monedita" />
                    </div>
                    
                    <div>
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Dirección Física</label>
                      <input type="text" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="Calle, Ciudad, Código Postal..." />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Persona de Contacto *</label>
                      <input required type="text" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="Tu nombre completo" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Teléfono *</label>
                        <input required type="tel" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="+34 600..." />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Email *</label>
                        <input required type="email" className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="hola@agencia.com" />
                      </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-white/5">
                      <button 
                        type="submit" 
                        disabled={formStatus === 'loading'}
                        className="w-full py-4 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 transition shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2"
                      >
                        {formStatus === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Procesando solicitud...</> : 'Solicitar Acceso Gratuito'}
                      </button>
                      <p className="text-[10px] text-center text-white/30 mt-4">Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad.</p>
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