import { useLocation } from 'wouter';
import { Logo } from '../components/Logo';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-950 text-white px-6">
      <Logo size={48} />
      <div className="mt-8 text-6xl font-semibold tracking-tight bg-brand-gradient bg-clip-text text-transparent">
        404
      </div>
      <p className="mt-2 text-white/50 text-sm">La página que buscas no existe.</p>
      <button onClick={() => setLocation('/dashboard')} className="btn-primary mt-8">
        Volver al dashboard
      </button>
    </div>
  );
}