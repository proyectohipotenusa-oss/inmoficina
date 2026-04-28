import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  LifeBuoy, Loader2, X, Send, CheckCircle2, 
  Building2, IdCard, User, Mail, Phone, MessageSquare, ShieldCheck
} from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Soporte() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Estados del Header/Footer
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Campos del Formulario
  const [formData, setFormData] = useState({
    nombre_agencia: '',
    licencia: '',
    nombre_usuario: '',
    email_plataforma: '',
    email_personal: '',
    telefono: '',
    motivo: '',
    mensaje: ''
  });

  // Captcha simple (Suma de números)
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, total: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  useEffect(() => {
    // Generar captcha al cargar
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, total: a + b });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica de Scroll para anclas #
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => { element.scrollIntoView({ behavior: 'smooth' }); }, 150);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (parseInt(captchaInput) !== captcha.total) {
      setError('El resultado del captcha es incorrecto.');
      return;
    }

    setLoading(true);
    
    const { error: dbError } = await supabase
      .from('tickets_soporte') // Asumiendo que creas esta tabla o la guardas en mensajes_contacto
      .insert([formData]);

    if (dbError) {
      setError('Hubo un error al enviar el ticket. Por favor, inténtalo de nuevo.');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const motivosSoporte = [
    "Error en Sincronización con Portales (Idealista/Fotocasa)",
    "Fallo en IA Predictor de Valor",
    "Problema con Informe CMA / Dossier Inversionista",
    "Error en el Pipeline Kanban (Mover tarjetas)",
    "Incidencia en la Agenda o Calendario",
    "Problemas de visualización en Ficha VIP / Catálogo",
    "Gestión de Usuarios o Licencias",
    "Error de Acceso / Sesión",
    "Facturación y Pagos",
    "Otro problema técnico"
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden w-full relative flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap'); 
        .font-sans { font-family: 'Inter', sans-serif; } 
        .font-serif { font-family: 'Playfair Display', serif; } 
        html { scroll-behavior: smooth; }
      `}</style>
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* NAVBAR (IDÉNTICA A LANDING) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-1' : 'bg-transparent py-3'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/"><a className="flex items-center gap-3 group cursor-pointer">
            <img src={LOGO_URL} alt="Logo" className="w-[42px] h-[42px] rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90 hidden sm:block">INMOFICINA</span>
          </a></Link>
          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-white/50">
            <a href="/#servicios" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="/#por-que-nosotros" className="hover:text-white transition-colors">La Diferencia</a>
            <a href="/#precios" className="hover:text-white transition-colors">Inversión</a>
            <a href="/#faq" className="hover:text-white transition-colors">Q&A</a>
            <a href="/#contacto" className="hover:text-white transition-colors">Contacto</a>
            <Link href="/tutorial"><a className="hover:text-white transition-colors">Tutorial</a></Link>
            <Link href="/soporte"><a className="text-brand-400 border-b-2 border-brand-500 pb-1 cursor-default font-black">Soporte</a></Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"><a className="hidden sm:block text-[11px] font-medium uppercase tracking-widest hover:text-brand-400 text-white/70 transition-colors">Acceso</a></Link>
            <Link href="/"><a className="hidden sm:block px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all text-center">Probar Gratis</a></Link>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-brand-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="4" width="24" height="2.5" rx="1.25" fill="currentColor"/><rect y="10.75" width="24" height="2.5" rx="1.25" fill="currentColor"/><rect y="17.5" width="24" height="2.5" rx="1.25" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-ink-950 h-full border-l border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-5 text-xs uppercase tracking-widest font-medium text-white/70">
              <a href="/#servicios" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400">Funcionalidades</a>
              <a href="/#por-que-nosotros" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400">La Diferencia</a>
              <a href="/#precios" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400">Inversión</a>
              <Link href="/tutorial" onClick={() => setIsMobileMenuOpen(false)}><a>Tutorial</a></Link>
              <div className="text-brand-400 font-black italic">Soporte</div>
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4 mt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><a className="text-brand-400 text-center">Acceso</a></Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO DE SOPORTE CENTRADO */}
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4 relative z-10">
        <div className="w-full max-w-2xl">
          {success ? (
            <div className="card p-12 bg-ink-900 border border-brand-500/20 shadow-2xl rounded-[2rem] text-center animate-fade-in">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 size={48} className="text-emerald-400" />
              </div>
              <h2 className="font-serif text-3xl font-medium text-white mb-4">Solicitud Recibida</h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-8">
                Tu ticket de soporte ha sido enviado con éxito. Nuestro equipo técnico revisará tu caso y te contactará en un plazo máximo de 2 a 4 horas laborales.
              </p>
              <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <div className="card p-8 md:p-10 bg-ink-900 border border-white/10 shadow-2xl relative overflow-hidden rounded-[2rem]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-bl-full blur-3xl -z-10" />
              
              <div className="text-center mb-10">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <LifeBuoy className="text-brand-400" size={32} />
                </div>
                <h2 className="font-serif text-3xl font-medium text-white mb-2">Asistencia Técnica</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Canal exclusivo para agencias Inmoficina Luxury</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* AGENCIA */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                      <Building2 size={12}/> Agencia
                    </label>
                    <input required className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all" 
                      placeholder="Nombre de tu Agencia" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} />
                  </div>
                  {/* LICENCIA */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                      <IdCard size={12}/> Licencia
                    </label>
                    <input required className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all" 
                      placeholder="ID de Licencia Asignada" value={formData.licencia} onChange={e => setFormData({...formData, licencia: e.target.value})} />
                  </div>
                  {/* NOMBRE USUARIO */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                      <User size={12}/> Tu Nombre
                    </label>
                    <input required className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all" 
                      placeholder="Nombre completo" value={formData.nombre_usuario} onChange={e => setFormData({...formData, nombre_usuario: e.target.value})} />
                  </div>
                  {/* TELÉFONO */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                      <Phone size={12}/> Teléfono
                    </label>
                    <input required type="tel" className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all" 
                      placeholder="+34..." value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                  </div>
                  {/* EMAIL PLATAFORMA */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                      <Mail size={12}/> Email Inmoficina
                    </label>
                    <input required type="email" className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all" 
                      placeholder="usuario@inmoficina.es" value={formData.email_plataforma} onChange={e => setFormData({...formData, email_plataforma: e.target.value})} />
                  </div>
                  {/* EMAIL PERSONAL */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                      <Mail size={12}/> Email Personal
                    </label>
                    <input required type="email" className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all" 
                      placeholder="tucorreo@gmail.com" value={formData.email_personal} onChange={e => setFormData({...formData, email_personal: e.target.value})} />
                  </div>
                </div>

                {/* MOTIVO DE SOPORTE */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">¿En qué podemos ayudarte?</label>
                  <select required className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.motivo} onChange={e => setFormData({...formData, motivo: e.target.value})}>
                    <option value="" disabled>Selecciona un motivo...</option>
                    {motivosSoporte.map((m, i) => <option key={i} value={m} className="bg-ink-900">{m}</option>)}
                  </select>
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                  <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2 ml-1">
                    <MessageSquare size={12}/> Descripción del Problema
                  </label>
                  <textarea required rows={4} className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none transition-all resize-none leading-relaxed" 
                    placeholder="Detalla qué ha sucedido y, si es posible, los pasos para reproducir el error..." 
                    value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})} />
                </div>

                {/* CAPTCHA SIMPLE */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span className="text-sm font-bold text-white/70">¿Cuánto es {captcha.a} + {captcha.b}?</span>
                  </div>
                  <input required type="number" className="w-full sm:w-24 bg-ink-950 border border-white/10 rounded-xl px-4 py-2.5 text-center text-sm text-brand-400 font-bold outline-none focus:border-brand-500" 
                    placeholder="?" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Enviar Reporte Técnico</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER (IDÉNTICO A LANDING) */}
      <footer id="footer" className="py-10 px-4 border-t border-white/5 bg-ink-950 w-full text-center sm:text-left mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/5 pb-10">
          <div className="md:col-span-2">
            <img src={LOGO_URL} className="w-[48px] h-[48px] mb-4 opacity-80 mx-auto sm:mx-0" alt="Logo Footer" />
            <p className="text-white/40 text-xs font-light max-w-sm mx-auto sm:mx-0 leading-relaxed italic">
              "Donde la alta tecnología se encuentra con el Real Estate."
            </p>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Menú</h4>
            <div className="flex flex-col gap-2.5 text-white/40 text-xs">
              <a href="/#servicios" className="hover:text-white transition-colors text-white/40">Funcionalidades</a>
              <a href="/#por-que-nosotros" className="hover:text-white transition-colors text-white/40">La Diferencia</a>
              <a href="/#precios" className="hover:text-white transition-colors text-white/40">Inversión</a>
              <Link href="/tutorial"><a className="hover:text-white transition-colors">Tutorial</a></Link>
              <Link href="/soporte"><a className="text-brand-400 font-bold">Soporte Técnico</a></Link>
            </div>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4 tracking-widest">Legal</h4>
            <div className="flex flex-col gap-2.5 text-white/40 text-xs">
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white">Privacidad</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white">Aviso Legal</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 font-medium">
          <p>© {new Date().getFullYear()} Inmoficina Luxury. Una marca de Hipotenusa Online.</p>
          <p className="uppercase tracking-widest mt-2 md:mt-0">Designed in Spain</p>
        </div>
      </footer>
    </div>
  );
}