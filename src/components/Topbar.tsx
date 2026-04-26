import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  title?: string;
  onMenuClick: () => void;
}

export function Topbar({ title, onMenuClick }: Props) {
  const { perfil } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 bg-ink-900/80 backdrop-blur-md border-b border-white/5 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="text-lg font-semibold tracking-tight text-white/90 hidden sm:block whitespace-nowrap">
            {title}
          </h1>
        )}
      </div>

      <div className="flex-1 max-w-md px-4 hidden md:block ml-4 mr-auto">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Buscar leads, propiedades..." 
            className="w-full bg-ink-800 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/10 outline-none transition ring-1 ring-white/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-9 w-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition relative">
          <Bell size={18} />
        </button>
        
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-semibold text-white shadow-glow">
            {(perfil?.nombre || perfil?.email || 'U').slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}