import { useState, FormEvent, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, 
  ShieldCheck, Building2, Sparkles, AlertCircle, Info, Clock
} from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const { session } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la recuperación de contraseña
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  if (session) {
    setLocation('/dashboard');
    return null;
  }

  // Lógica del temporizador para abrir el correo
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Cuando el contador llega a 0, abrimos el mailto
      const subject = encodeURIComponent("Recuperación de Contraseña - Inmoficina");
      const body = encodeURIComponent(`Por razones de seguridad, notifico que he olvidado mi contraseña.\n\nNombre de usuario / Email: ${email || '[Escriba aquí su email registrado]'}\n\nEntiendo que el tiempo de respuesta es de 24 horas. Gracias.`);
      window.location.href = `mailto:admin@inmoficina.es?subject=${subject}&body=${body}`;
      setCountdown(null);
    }
  }, [countdown, email]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
    } else {
      setLocation('/dashboard');
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    // Establecemos el mensaje exacto solicitado
    setResetMsg("Por razones de seguridad, debe enviar un correo al Administrador del CRM desde su correo personal notificando el nombre de usuario que ha olvidado su contraseña. El tiempo de respuesta puede ser de 24 horas. Se abrirá una ventana de correo.");
    // Iniciamos la cuenta atrás de 15 segundos
    setCountdown(15);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-900/20 via-ink-950 to-ink-950"></div>
      
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 items-center">
        
        {/* COLUMNA IZQUIERDA: Marketing */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-8"><Logo size={80} /></div>
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Inmoficina, el CRM inmobiliario de lujo para agencias en España.
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl">
            Acceso privado, panel compartido por agencia, seguimiento comercial y una base visual lista para crecer con leads, propiedades, tareas, histórico y predictor IA.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors">
              <ShieldCheck className="text-brand-400 mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">Login privado</h3>
              <p className="text-xs text-white/40">Sin registro público.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors">
              <Building2 className="text-brand-400 mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">Multiagencia</h3>
              <p className="text-xs text-white/40">Base lista para filtrar por agencia.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors">
              <Sparkles className="text-brand-400 mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">UX premium</h3>
              <p className="text-xs text-white/40">Optimizada para móvil.</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Login */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="w-full max-w-[440px] bg-ink-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-xl bg-ink-950 flex items-center justify-center border border-white/5"><Logo size={32} /></div>
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">Inmoficina</h2>
                <p className="text-xs text-white/40">Acceso privado para agencias y superadmin</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-white/70 ml-1">Correo</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="ejemplo@inmoficina.es"
                    className="peer input-login w-full pl-10 focus:pl-4 [&:not(:placeholder-shown)]:pl-4 transition-all duration-200" 
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-opacity duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 peer-autofill:opacity-0" size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[13px] font-medium text-white/70">Contraseña</label>
                  <button type="button" onClick={handleForgotPassword} className="text-[11px] text-brand-400 hover:text-brand-300">¿Olvidaste la tuya?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="peer input-login w-full pr-12 pl-10 focus:pl-4 [&:not(:placeholder-shown)]:pl-4 transition-all duration-200" 
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-opacity duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 peer-autofill:opacity-0" size={18} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 z-10">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fade-in">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              {resetMsg && (
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs animate-fade-in">
                  <div className="flex gap-2">
                    <Info size={18} className="shrink-0" />
                    <p className="leading-relaxed">{resetMsg}</p>
                  </div>
                  {countdown !== null && (
                    <div className="flex items-center gap-2 bg-brand-500/20 px-3 py-2 rounded-lg self-end">
                      <Clock size={12} className="animate-pulse" />
                      <span className="font-bold">Abriendo en {countdown}s...</span>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading || countdown !== null} className="w-full bg-[#6366f1] hover:bg-[#5254d8] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar al CRM'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[11px] text-white/40 text-center">Registro público desactivado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}