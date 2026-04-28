import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, Building2, Euro, ArrowUpRight, ChevronRight, 
  KanbanSquare, Flame, CheckCircle2, Calendar, Clock,
  Home, Phone, Mail, PenTool, Circle, StickyNote, AlertCircle
} from 'lucide-react';
import { formatEUR } from '../lib/format';

interface LeadDash { id: string; estado: string; ultimo_contacto: string; created_at: string; nombre: string; }
interface PropDash { id: string; transaccion: string; }
interface TareaDash { id: string; tipo: string; titulo: string; hora: string; completada: boolean; fecha: string; }

const TIPO_ICONO: Record<string, any> = {
  'Visita': Home, 'Llamada': Phone, 'Correo': Mail, 'Reunión': Users, 'Firma': PenTool, 'Otro': Circle
};

export default function Dashboard() {
  const { perfil } = useAuth();
  const [, setLocation] = useLocation();
  const nombreUsuario = perfil?.nombre?.split(' ')[0] || 'Inmo';

  const [leads, setLeads] = useState<LeadDash[]>([]);
  const [propiedades, setPropiedades] = useState<PropDash[]>([]);
  const [tareasHoy, setTareasHoy] = useState<TareaDash[]>([]);
  const [tareasAtrasadas, setTareasAtrasadas] = useState<TareaDash[]>([]);
  const [notas, setNotas] = useState('');
  const [guardandoNotas, setGuardandoNotas] = useState(false);

  useEffect(() => {
    if (!perfil?.agencia_id) return;
    const load = async () => {
      // Usamos .catch para evitar que una tabla faltante rompa el Promise.all
      const [l, p, t] = await Promise.all([
        supabase.from('leads').select('*').eq('agencia_id', perfil.agencia_id).catch(() => ({ data: [] })),
        supabase.from('propiedades').select('id, transaccion').eq('agencia_id', perfil.agencia_id).catch(() => ({ data: [] })),
        supabase.from('agenda').select('*').eq('agencia_id', perfil.agencia_id).catch(() => ({ data: [] }))
      ]);
      
      if (l && l.data) setLeads(l.data as LeadDash[]);
      if (p && p.data) setPropiedades(p.data as PropDash[]);
      
      if (t && t.data && Array.isArray(t.data)) {
        const hoyStr = new Date().toISOString().split('T')[0];
        const ahoraDate = new Date();
        
        setTareasHoy(t.data
          .filter(x => x.fecha === hoyStr && !x.completada)
          .sort((a, b) => (a.hora || '').localeCompare(b.hora || '')));

        const atrasadas = t.data.filter(x => {
          if (x.completada) return false;
          const tareaDate = new Date(`${x.fecha}T${x.hora || '23:59'}:00`);
          return tareaDate < ahoraDate;
        });
        
        setTareasAtrasadas(atrasadas.sort((a, b) => new Date(`${a.fecha}T${a.hora || '00:00'}`).getTime() - new Date(`${b.fecha}T${b.hora || '00:00'}`).getTime()));
      }

      const notaKey = `notas_${perfil.agencia_id}_${perfil.id}`;
      setNotas(localStorage.getItem(notaKey) || '');
    };
    load();
  }, [perfil]);

  const handleNotas = (val: string) => {
    setNotas(val); setGuardandoNotas(true);
    localStorage.setItem(`notas_${perfil?.agencia_id}_${perfil?.id}`, val);
    setTimeout(() => setGuardandoNotas(false), 500);
  };

  const tresDiasAtras = new Date(); tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);
  const leadsCongelados = leads.filter(l => l.estado !== 'Cerrado' && l.estado !== 'Perdido' && new Date(l.ultimo_contacto || l.created_at) < tresDiasAtras);
  const conversiones = leads.filter(l => l.estado === 'Cerrado').length;
  const tasaConversion = leads.length > 0 ? Math.round((conversiones / leads.length) * 100) : 0;
  const pipelineActivo = leads.filter(l => l.estado !== 'Cerrado' && l.estado !== 'Perdido').length;

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 mt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Hola, {nombreUsuario} <span className="inline-block animate-wave origin-bottom-right">👋</span></h1>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-bold">Resumen de tu jornada</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[ 
          { title: "Pipeline", val: pipelineActivo, icon: KanbanSquare, color: "text-blue-400" },
          { title: "Propiedades", val: propiedades.length, icon: Building2, color: "text-indigo-400" },
          { title: "Leads Totales", val: leads.length, icon: Users, color: "text-brand-400" },
          { title: "Conversión", val: `${tasaConversion}%`, icon: ArrowUpRight, color: "text-emerald-400" }
        ].map((s, i) => (
          <div key={i} className="card p-4 bg-ink-900 border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity"><s.icon size={80}/></div>
            <div className="flex items-center gap-2 mb-3"><s.icon size={14} className={s.color}/><h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{s.title}</h3></div>
            <p className="text-3xl font-black text-white tracking-tighter">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
        <div className="card p-0 bg-ink-900 border-white/5 flex flex-col h-full overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full blur-xl" />
          <div className="p-4 pb-2 border-b border-white/5 shrink-0 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-red-400" />
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">Atención Urgente</h3>
            </div>
            <span className="text-[10px] font-black text-red-400/50 bg-red-500/10 px-2 py-0.5 rounded">{leadsCongelados.length + tareasAtrasadas.length}</span>
          </div>
          
          {(leadsCongelados.length === 0 && tareasAtrasadas.length === 0) ? (
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-white/20">
               <CheckCircle2 size={32} className="mb-3 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest text-center">Todo al día</p>
             </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 relative z-10">
              {tareasAtrasadas.map(t => (
                <div key={`tarea-${t.id}`} onClick={() => setLocation('/agenda')} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 cursor-pointer transition-colors group">
                  <div className="min-w-0 pr-2">
                    <div className="text-[12px] font-bold text-white truncate flex items-center gap-1.5">
                      <AlertCircle size={12} className="text-red-400 shrink-0" /> 
                      {t.titulo}
                    </div>
                    <div className="text-[9px] text-white/40 capitalize mt-0.5">{t.tipo}</div>
                  </div>
                  <div className="text-[9px] font-bold text-red-400 flex flex-col items-end gap-0.5 bg-red-500/10 px-2 py-1 rounded-md shrink-0">
                    <span>{new Date(t.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit'})}</span>
                    <span>{t.hora}</span>
                  </div>
                </div>
              ))}

              {leadsCongelados.map(l => (
                <div key={`lead-${l.id}`} onClick={() => setLocation('/pipeline')} className="flex items-center justify-between p-3 rounded-xl bg-ink-950/50 border border-white/5 hover:border-white/10 cursor-pointer transition-colors group">
                  <div className="min-w-0 pr-2">
                    <div className="text-[12px] font-bold text-white truncate">{l.nombre}</div>
                    <div className="text-[9px] text-white/40 capitalize mt-0.5">{l.estado}</div>
                  </div>
                  <div className="text-[9px] font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md shrink-0">
                    <Flame size={10}/> +3 días
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-0 bg-amber-500/5 border border-amber-500/20 flex flex-col h-full overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-xl opacity-50" />
          <div className="flex items-center gap-2 p-4 pb-2 shrink-0">
            <StickyNote size={14} className="text-amber-400/80" />
            <h3 className="text-xs font-bold text-amber-400/80 uppercase tracking-widest">Bloc de Notas</h3>
          </div>
          <textarea className="flex-1 w-full bg-transparent border-none resize-none p-4 pt-2 text-sm text-amber-100/90 placeholder:text-amber-500/30 focus:outline-none focus:ring-0 custom-scrollbar leading-relaxed" placeholder="Apuntes rápidos, ideas, teléfonos..." value={notas} onChange={(e) => handleNotas(e.target.value)} />
          <div className={`absolute bottom-3 right-3 text-[9px] font-bold uppercase tracking-widest text-amber-500/50 transition-opacity duration-300 ${guardandoNotas ? 'opacity-100' : 'opacity-0'}`}>Guardando...</div>
        </div>

        <div className="card p-0 bg-ink-900 border-white/5 flex flex-col h-full overflow-hidden">
          <div className="p-4 pb-2 border-b border-white/5 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2"><Calendar size={14} className="text-brand-400" /><h3 className="text-xs font-bold text-white uppercase tracking-widest">Agenda Hoy</h3></div>
             <button onClick={() => setLocation('/agenda')} className="text-white/30 hover:text-white transition"><ChevronRight size={16}/></button>
          </div>
          {tareasHoy.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-white/20"><Calendar size={32} className="mb-3 opacity-20" /><p className="text-xs font-bold uppercase tracking-widest text-center">Día Libre</p></div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {tareasHoy.map(t => {
                const Icon = TIPO_ICONO[t.tipo] || Circle;
                return (
                  <div key={t.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ink-950 flex items-center justify-center border border-white/5 shrink-0"><Icon size={14} className="text-brand-400" /></div>
                    <div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-white truncate">{t.titulo}</p><p className="text-[9px] text-white/40 uppercase tracking-wider">{t.tipo}</p></div>
                    <div className="text-[10px] font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-1 rounded shrink-0">{t.hora}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}