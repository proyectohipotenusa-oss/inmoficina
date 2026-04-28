import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, Building2, Euro, ArrowUpRight, ChevronRight, 
  KanbanSquare, Flame, CheckCircle2, Calendar, Clock,
  Home, Phone, Mail, PenTool, Circle, StickyNote
} from 'lucide-react';
import { formatEUR } from '../lib/format';

interface LeadDash { id: string; estado: string; ultimo_contacto: string; created_at: string; nombre: string; }
interface PropDash { id: string; transaccion: string; }
interface TareaDash { id: string; tipo: string; titulo: string; hora: string; completada: boolean; }

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
  const [ventasMes, setVentasMes] = useState(0);
  const [cantidadVentasMes, setCantidadVentasMes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notaRapida, setNotaRapida] = useState('');

  useEffect(() => {
    const savedNote = localStorage.getItem('inmo_postit');
    if (savedNote) setNotaRapida(savedNote);
  }, []);

  const handleNotaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotaRapida(e.target.value);
    localStorage.setItem('inmo_postit', e.target.value);
  };

  useEffect(() => {
    if (!perfil?.agencia_id) return;
    const fetchData = async () => {
      setLoading(true);
      const hoyISO = new Date().toISOString().split('T')[0];

      const [resLeads, resProps, resVentas, resTareas] = await Promise.all([
        supabase.from('leads').select('id, estado, ultimo_contacto, created_at, nombre').eq('agencia_id', perfil.agencia_id),
        supabase.from('propiedades').select('id, transaccion').eq('agencia_id', perfil.agencia_id),
        supabase.from('ventas').select('importe, fecha').eq('agencia_id', perfil.agencia_id),
        supabase.from('tareas').select('id, tipo, titulo, hora, completada').eq('agencia_id', perfil.agencia_id).eq('fecha', hoyISO).order('hora', { ascending: true })
      ]);

      setLeads((resLeads.data as LeadDash[]) || []);
      setPropiedades((resProps.data as PropDash[]) || []);
      setTareasHoy((resTareas.data as TareaDash[]) || []);

      if (resVentas.data) {
        const hoy = new Date();
        const curMonth = hoy.getMonth() + 1; 
        const curYear = hoy.getFullYear();
        const ventasDelMes = resVentas.data.filter(v => {
          if (!v.fecha) return false;
          const [vYear, vMonth] = v.fecha.split('-');
          return parseInt(vYear, 10) === curYear && parseInt(vMonth, 10) === curMonth;
        });
        setVentasMes(ventasDelMes.reduce((acc, v) => acc + Number(v.importe), 0));
        setCantidadVentasMes(ventasDelMes.length);
      }
      setLoading(false);
    };
    fetchData();
  }, [perfil?.agencia_id]);

  const leadsActivos = leads.filter(l => !['cerrado', 'perdido'].includes((l.estado || '').toLowerCase())).length;
  const propsActivas = propiedades.filter(p => !['Vendida', 'Alquilada'].includes(p.transaccion));
  
  const leadsFrios = leads.filter(l => {
    if (['cerrado', 'perdido'].includes((l.estado || '').toLowerCase())) return false;
    const lastAction = l.ultimo_contacto || l.created_at;
    if (!lastAction) return false;
    const days = (new Date().getTime() - new Date(lastAction).getTime()) / (1000 * 3600 * 24);
    return days >= 3;
  }).sort((a, b) => new Date(a.ultimo_contacto || a.created_at).getTime() - new Date(b.ultimo_contacto || b.created_at).getTime());

  const embudo = [
    { label: 'Nuevo', count: leads.filter(l => (l.estado?.toLowerCase() || 'nuevo') === 'nuevo').length, color: 'bg-sky-400' },
    { label: 'Contactado', count: leads.filter(l => l.estado?.toLowerCase() === 'contactado').length, color: 'bg-brand-400' },
    { label: 'Visita', count: leads.filter(l => l.estado?.toLowerCase() === 'visita').length, color: 'bg-amber-400' },
    { label: 'Negociación', count: leads.filter(l => l.estado?.toLowerCase() === 'negociacion').length, color: 'bg-purple-400' },
    { label: 'Cerrado', count: leads.filter(l => l.estado?.toLowerCase() === 'cerrado').length, color: 'bg-emerald-400' },
    { label: 'Perdido', count: leads.filter(l => l.estado?.toLowerCase() === 'perdido').length, color: 'bg-red-400' },
  ];
  const maxEmbudo = Math.max(...embudo.map(e => e.count), 1);

  return (
    <Layout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Hola, {nombreUsuario}</h1>
        <p className="mt-1 text-[13px] text-white/50">Resumen ejecutivo con lo que ocurre hoy en tu agencia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="card p-5 relative overflow-hidden bg-ink-900 border-white/5 hover:border-white/10 transition cursor-pointer" onClick={() => setLocation('/leads')}>
          <div className="absolute top-4 right-4 text-white/20"><ArrowUpRight size={18} /></div>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4"><Users size={18} className="text-brand-400" /></div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Leads activos</div>
          <div className="text-3xl font-semibold text-white">{loading ? '...' : leadsActivos}</div>
          <div className="text-[11px] text-white/40 mt-1">de {loading ? '...' : leads.length} totales</div>
        </div>

        <div className="card p-5 relative overflow-hidden bg-ink-900 border-white/5 hover:border-white/10 transition cursor-pointer" onClick={() => setLocation('/propiedades')}>
          <div className="absolute top-4 right-4 text-white/20"><ArrowUpRight size={18} /></div>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4"><Building2 size={18} className="text-brand-400" /></div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Propiedades activas</div>
          <div className="text-3xl font-semibold text-white">{loading ? '...' : propsActivas.length}</div>
          <div className="text-[11px] text-white/40 mt-1">en catálogo público</div>
        </div>

        <div className="card p-5 relative overflow-hidden bg-ink-900 border-white/5 hover:border-white/10 transition cursor-pointer" onClick={() => setLocation('/historico')}>
          <div className="absolute top-4 right-4 text-white/20"><ArrowUpRight size={18} /></div>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4"><Euro size={18} className="text-brand-400" /></div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Ventas este mes</div>
          <div className="text-3xl font-semibold text-white">{loading ? '...' : formatEUR(ventasMes)}</div>
          <div className="text-[11px] text-white/40 mt-1">{loading ? '...' : cantidadVentasMes} operaciones</div>
        </div>
      </div>

      <div className={`grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="card p-6 xl:col-span-2 bg-ink-900 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><KanbanSquare size={16} className="text-brand-400" /></div><h3 className="text-sm font-semibold text-white">Embudo de leads</h3></div>
            <button onClick={() => setLocation('/pipeline')} className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5">Ver Pipeline <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-4">
            {embudo.map((step) => (
              <div key={step.label} className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 w-32"><span className={`h-2 w-2 rounded-full ${step.color}`} /><span className="text-[12px] text-white/70 font-medium">{step.label}</span></div>
                <div className="flex-1 mx-4"><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${step.color} opacity-80 transition-all duration-1000`} style={{ width: `${(step.count / maxEmbudo) * 100}%` }} /></div></div>
                <div className="text-[12px] font-medium text-white w-4 text-right">{step.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 bg-ink-900 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><Calendar size={16} className="text-brand-400" /></div>
              <h3 className="text-sm font-semibold text-white">Agenda</h3>
            </div>
            <button onClick={() => setLocation('/agenda')} className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5">Ver Agenda <ChevronRight size={12} /></button>
          </div>
          
          <div className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold mb-6 ${tareasHoy.length > 0 ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
            {tareasHoy.length} {tareasHoy.length === 1 ? 'tarea' : 'tareas'} hoy
          </div>

          <div className="space-y-4">
            {tareasHoy.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-32 text-white/30 text-[12px]">
                <CheckCircle2 size={24} className="mb-2 text-emerald-500/20" />
                No tienes tareas pendientes para hoy.
              </div>
            ) : (
              tareasHoy.slice(0, 3).map(t => {
                const Icono = TIPO_ICONO[t.tipo] || Circle;
                return (
                  <div key={t.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => setLocation('/agenda')}>
                    <div className="mt-1 h-2 w-2 rounded-full bg-brand-500 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <div className={`text-[13px] font-medium truncate ${t.completada ? 'text-white/30 line-through' : 'text-white/80'}`}>
                        {t.titulo}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Icono size={10} className="text-white/20" />
                        <span className="text-[10px] text-white/40 font-medium flex items-center gap-1">
                          <Clock size={10} /> {t.hora || 'Todo el día'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {tareasHoy.length > 3 && (
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <button onClick={() => setLocation('/agenda')} className="text-[11px] text-brand-400 font-bold hover:text-brand-300 transition">
                + ver {tareasHoy.length - 3} más
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <div className="card p-6 bg-ink-900 border-white/5 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center"><Flame size={16} className="text-red-400" /></div>
              <h3 className="text-sm font-bold text-white">Atención Urgente</h3>
            </div>
            <button onClick={() => setLocation('/pipeline')} className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5">Ir a Pipeline <ChevronRight size={12} /></button>
          </div>
          
          {leadsFrios.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-24 text-white/40 text-[12px]">
              <div className="font-bold text-white/80 mb-1">¡Todo bajo control!</div>
              Ningún cliente requiere atención inmediata.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {leadsFrios.slice(0, 3).map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition cursor-pointer group" onClick={() => setLocation('/pipeline')}>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-white truncate">{l.nombre}</div>
                    <div className="text-[10px] text-white/40 capitalize">{l.estado}</div>
                  </div>
                  <div className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
                    <Flame size={12}/> +3 días
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-0 bg-amber-500/5 border border-amber-500/20 flex flex-col h-full overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-xl opacity-50" />
          <div className="flex items-center gap-2 p-4 pb-2">
            <StickyNote size={14} className="text-amber-400/80" />
            <h3 className="text-xs font-bold text-amber-400/80 uppercase tracking-widest">Bloc de Notas</h3>
          </div>
          <textarea 
            className="flex-1 w-full bg-transparent border-none resize-none p-4 pt-2 text-sm text-amber-100/90 placeholder:text-amber-500/30 focus:ring-0 outline-none custom-scrollbar leading-relaxed"
            placeholder="Apunta aquí llamadas rápidas, recados o ideas brillantes. Se guarda solo. ✨"
            value={notaRapida}
            onChange={handleNotaChange}
          />
        </div>
      </div>
    </Layout>
  );
}