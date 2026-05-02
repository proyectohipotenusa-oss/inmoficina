import { LOGO_URL } from '../lib/supabase';

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 48, withText = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative overflow-hidden ring-1 ring-white/10 shadow-glow"
        style={{ width: size, height: size, borderRadius: '1.1rem' }}
      >
        <img
          src={LOGO_URL}
          alt="Inmoficina"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="text-white font-bold tracking-tight text-[17px]">
            Inmoficina
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-brand-400 font-bold mt-0.5">
            Luxury CRM
          </div>
        </div>
      )}
    </div>
  );
}