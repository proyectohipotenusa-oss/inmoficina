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
    
    setResetMsg("Por razones de seguridad, debe enviar un correo al Administrador del CRM desde su correo personal notificando el nombre de usuario que ha olvidado su contraseña. El tiempo de respuesta puede ser de 24 horas. Se abrirá una ventana de correo.");
    setCountdown(15);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-900/20 via-ink-950 to-ink-950"></div>
      
      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 relative z-10 items-center">
        
        {/* COLUMNA IZQUIERDA: Marketing */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-6"><Logo size={60} /></div>
          
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white mb-5 leading-[1.1] tracking-tight">
            Inmoficina, el CRM inmobiliario de lujo para agencias en España.
          </h1>
          <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-lg">
            Acceso privado, panel compartido por agencia, seguimiento comercial y una base visual lista para crecer con leads, propiedades, tareas, histórico y predictor IA.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors">
              <ShieldCheck className="text-brand-400 mb-2" size={20} />
              <h3 className="text-xs font-bold text-white mb-1">Login privado</h3>
              <p className="text-[10px] text-white/40">Sin registro público.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors">
              <Building2 className="text-brand-400 mb-2" size={20} />
              <h3 className="text-xs font-bold text-white mb-1">Multiagencia</h3>
              <p className="text-[10px] text-white/40">Base lista para filtrar.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors">
              <Sparkles className="text-brand-400 mb-2" size={20} />
              <h3 className="text-xs font-bold text-white mb-1">UX premium</h3>
              <p className="text-[10px] text-white/40">Optimizada para móvil.</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Login */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="w-full max-w-[360px] bg-ink-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 rounded-xl bg-ink-950 flex items-center justify-center border border-white/5"><Logo size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Inmoficina</h2>
                <p className="text-[10px] text-white/40">Acceso para agencias y admin</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-white/70 ml-1">Correo</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="ejemplo@inmoficina.es"
                    className="peer input-login w-full pl-9 text-sm focus:pl-3 [&:not(:placeholder-shown)]:pl-3 transition-all duration-200" 
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-opacity duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 peer-autofill:opacity-0" size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-medium text-white/70">Contraseña</label>
                  <button type="button" onClick={handleForgotPassword} className="text-[10px] text-brand-400 hover:text-brand-300">¿Olvidaste la tuya?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="peer input-login w-full pr-10 pl-9 text-sm focus:pl-3 [&:not(:placeholder-shown)]:pl-3 transition-all duration-200" 
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-opacity duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 peer-autofill:opacity-0" size={16} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 z-10">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] animate-fade-in">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              {resetMsg && (
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[10px] animate-fade-in">
                  <div className="flex gap-2">
                    <Info size={16} className="shrink-0" />
                    <p className="leading-relaxed">{resetMsg}</p>
                  </div>
                  {countdown !== null && (
                    <div className="flex items-center gap-1.5 bg-brand-500/20 px-2.5 py-1.5 rounded-lg self-end mt-1">
                      <Clock size={10} className="animate-pulse" />
                      <span className="font-bold">Abriendo en {countdown}s...</span>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading || countdown !== null} className="w-full bg-[#6366f1] hover:bg-[#5254d8] text-white text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Entrar al CRM'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-[10px] text-white/40 text-center">Registro público desactivado.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}