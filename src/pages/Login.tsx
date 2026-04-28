import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { LogIn, Loader2, X, Lock } from 'lucide-react';

const LOGO_URL = "https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png";
const TEMPORARY_LEGAL_URL = "https://www.ejemplo.com";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  // Estados copiados de la Landing para el Header/Footer
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Efecto para el color del header al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Efecto: Scroll automático a la sección si venimos de otra página con #
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales inválidas');
      setLoading(false);
    } else if (data.user) {
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', data.user.id)
        .single();

      if (perfil?.rol === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    }
  };

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
            <Link href="/soporte"><a className="hover:text-white transition-colors">Soporte</a></Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"><a className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-brand-400 border-b-2 border-brand-500 pb-1 cursor-default">Acceso</a></Link>
            <Link href="/"><a className="hidden sm:block px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all">
              Probar Gratis
            </a></Link>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-brand-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="4" width="24" height="2.5" rx="1.25" fill="currentColor"/>
                <rect y="10.75" width="24" height="2.5" rx="1.25" fill="currentColor"/>
                <rect y="17.5" width="24" height="2.5" rx="1.25" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU (IDÉNTICO A LANDING) */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-ink-950 h-full border-l border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-5 text-xs uppercase tracking-widest font-medium text-white/70">
              <a href="/#servicios" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Funcionalidades</a>
              <a href="/#por-que-nosotros" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">La Diferencia</a>
              <a href="/#precios" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Inversión</a>
              <a href="/#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Q&A</a>
              <a href="/#contacto" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-400 transition-colors">Contacto</a>
              <Link href="/tutorial" onClick={() => setIsMobileMenuOpen(false)}><a className="hover:text-brand-400 transition-colors">Tutorial</a></Link>
              <Link href="/soporte" onClick={() => setIsMobileMenuOpen(false)}><a className="hover:text-brand-400 transition-colors">Soporte</a></Link>
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4 mt-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-white hover:text-ink-950 transition-all text-center">
                  Probar Gratis
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><a className="text-brand-400 font-black text-center">Acceso</a></Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZONA CENTRAL DE LOGIN (El cuadro centrado) */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <div className="w-full max-w-sm">
          {/* Tarjeta de Login */}
          <div className="card p-8 bg-ink-900 border border-white/10 shadow-2xl relative overflow-hidden rounded-[2rem]">
            {/* Brillo sutil de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full blur-3xl -z-10" />
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
                <Lock className="text-brand-400" size={24} />
              </div>
              <h2 className="font-serif text-2xl font-medium text-white mb-1">Acceso VIP</h2>
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Identifícate como agente</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] font-bold text-white/50 mb-1.5 ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 transition-all outline-none"
                  placeholder="agencia@inmoficina.es"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] font-bold text-white/50 mb-1.5 ml-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <><LogIn size={16} /> Iniciar Sesión</>}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              ¿No tienes acceso? <Link href="/"><a className="text-brand-400 hover:text-white transition-colors font-bold">Solicita 14 días gratis</a></Link>
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER (IDÉNTICO A LANDING) */}
      <footer id="footer" className="py-10 px-4 border-t border-white/5 bg-ink-950 w-full text-center sm:text-left mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/5 pb-10">
          <div className="md:col-span-2">
            <img src={LOGO_URL} className="w-[48px] h-[48px] mb-4 opacity-80 mx-auto sm:mx-0" alt="Logo Footer" />
            <p className="text-white/40 text-xs font-light max-w-sm mx-auto sm:mx-0 leading-relaxed">
              CRM diseñado exclusivamente para profesionalizar más aún tu agencia inmobiliaria.
            </p>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Menú</h4>
            <div className="flex flex-col gap-2.5 text-white/40 text-xs">
              <a href="/#servicios" className="hover:text-white transition-colors">Funcionalidades</a>
              <a href="/#por-que-nosotros" className="hover:text-white transition-colors">La Diferencia</a>
              <a href="/#precios" className="hover:text-white transition-colors">Inversión</a>
              <a href="/#faq" className="hover:text-white transition-colors">Q&A</a>
              <a href="/#contacto" className="hover:text-white transition-colors">Contacto</a>
              <Link href="/tutorial"><a className="hover:text-white transition-colors">Tutorial</a></Link>
              <Link href="/soporte"><a className="hover:text-white transition-colors">Soporte</a></Link>
            </div>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold uppercase text-white/60 mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5 text-white/40 text-xs">
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Política de Cookies</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacidad</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Aviso Legal</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Condiciones de Uso</a>
              <a href={TEMPORARY_LEGAL_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Contratación</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 font-medium">
          <p>© {new Date().getFullYear()} Inmoficina. Una marca de Hipotenusa Online.</p>
          <p className="uppercase tracking-widest mt-2 md:mt-0">Designed in Spain</p>
        </div>
      </footer>
    </div>
  );
}