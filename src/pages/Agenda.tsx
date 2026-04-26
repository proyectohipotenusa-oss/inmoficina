import { useEffect, useState, FormEvent, useMemo, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { 
  Calendar as CalendarIcon, Plus, Loader2, X, AlertCircle, 
  CheckCircle2, Circle, Trash2, Clock, Edit2, 
  Home, Phone, Mail, Users, PenTool, Building2, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Tarea {
  id: string;
  tipo: string;
  titulo: string;
  fecha: string;
  hora: string;
  estado_tarea: string;
  completada: boolean;
  descripcion?: string;
  lead_id?: string;
  propiedad_id?: string;
}

interface LeadAgenda {
  id: string;
  nombre: string;
}

interface PropiedadAgenda {
  id: string;
  titulo: string;
  referencia: string;
}

const TIPOS_TAREA = [
  { id: 'Visita', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'Llamada', icon: Phone, color: 'text-brand-400', bg: 'bg-brand-500/10' },
  { id: 'Correo', icon: Mail, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { id: 'Reunión', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'Firma', icon: PenTool, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'Otro', icon: Circle, color: 'text-white/60', bg: 'bg-white/5' }
];

export default function Agenda() {
  const { perfil } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [leads, setLeads] = useState<LeadAgenda[]>([]);
  const [propiedades, setPropiedades] = useState<PropiedadAgenda[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Tarea | null>(null);

  const hoyISO = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(hoyISO);

  const load = useCallback(async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    
    const [resTareas, resLeads, resProps] = await Promise.all([
      supabase.from('tareas').select('*').eq('agencia_id', perfil.agencia_id).order('hora', { ascending: true }),
      supabase.from('leads').select('id, nombre').eq('agencia_id', perfil.agencia_id),
      supabase.from('propiedades').select('id, titulo, referencia').eq('agencia_id', perfil.agencia_id)
    ]);

    setTareas((resTareas.data as Tarea[]) || []);
    setLeads((resLeads.data as LeadAgenda[]) || []);
    setPropiedades((resProps.data as PropiedadAgenda[]) || []);
    setLoading(false);
  }, [perfil?.agencia_id]);

  useEffect(() => { load(); }, [load]);

  const toggleCompletada = async (tarea: Tarea, e: React.MouseEvent) => {
    e.stopPropagation();
    const nuevoEstado = tarea.estado_tarea === 'Completada' ? 'Pendiente' : 'Completada';
    const completada = nuevoEstado === 'Completada';
    setTareas(prev => prev.map(t => t.id === tarea.id ? { ...t, completada, estado_tarea: nuevoEstado } : t));
    await supabase.from('tareas').update({ completada, estado_tarea: nuevoEstado }).eq('id', tarea.id);
  };

  const stripDays = useMemo(() => {
    const days = [];
    const d = new Date();
    d.setDate(d.getDate() - 3); 
    for(let i=0; i<14; i++) {
      days.push({
        iso: d.toISOString().split('T')[0],
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
        isToday: d.toISOString().split('T')[0] === hoyISO
      });
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [hoyISO]);

  const tareasSeleccionadas = tareas.filter(t => t.fecha === selectedDate);
  const tareasAtrasadas = tareas.filter(t => !t.completada && t.fecha < hoyISO);

  return (
    <Layout title="Agenda">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <PageHeader title="Agenda & Productividad" subtitle="Planifica tu día y vincula eventos a tus clientes." />
        </div>
        <button className="btn-primary shrink-0 -mt-6" onClick={() => setIsCreating(true)}>
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6">
        {stripDays.map(day => {
          const isSelected = day.iso === selectedDate;
          return (
            <button 
              key={day.iso} 
              onClick={() => setSelectedDate(day.iso)}
              className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border ${
                isSelected ? 'bg-brand-500 border-brand-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white scale-105' : day.isToday ? 'bg-white/10 border-white/20 text-white hover:bg-white/15' : 'bg-ink-900 border-white/5 text-white/50 hover:bg-ink-800 hover:text-white/80'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-white/80' : ''}`}>{day.dayName}</span>
              <span className="text-xl font-black">{day.dayNum}</span>
              {day.isToday && !isSelected && <span className="h-1 w-1 rounded-full bg-brand-400 mt-1" />}
            </button>
          );
        })}
      </div>

      {loading ? <div className="card py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={22} /></div> : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <CalendarIcon size={16} className="text-brand-400" /> 
                {selectedDate === hoyISO ? 'Tareas de Hoy' : `Tareas del ${selectedDate.split('-').reverse().join('/')}`}
              </h3>
              <span className="text-[11px] text-white/40 font-medium">{tareasSeleccionadas.length} eventos</span>
            </div>

            {tareasSeleccionadas.length === 0 ? (
               <div className="card p-10 flex flex-col items-center justify-center text-center border-dashed bg-transparent">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3"><CalendarIcon size={20} className="text-white/20"/></div>
                  <div className="text-sm font-bold text-white/60 mb-1">Día despejado</div>
                  <div className="text-[11px] text-white/30">No hay eventos programados para esta fecha.</div>
               </div>
            ) : (
              tareasSeleccionadas.map(t => <TaskCard key={t.id} t={t} leads={leads} props={propiedades} onEdit={() => setEditingTask(t)} onToggle={(e) => toggleCompletada(t, e)} />)
            )}
          </div>

          <div className="space-y-6">
            {tareasAtrasadas.length > 0 && (
              <div className="card p-5 border-red-500/20 bg-red-500/5">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <AlertCircle size={14} /> Atrasadas ({tareasAtrasadas.length})
                </h3>
                <div className="space-y-3">
                  {tareasAtrasadas.map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-ink-950 border border-red-500/20 cursor-pointer hover:border-red-500/40 transition" onClick={() => setEditingTask(t)}>
                      <div className="text-[12px] font-bold text-white/90 truncate">{t.titulo}</div>
                      <div className="text-[10px] text-red-400 font-medium mt-1 flex items-center gap-1"><Clock size={10}/> Del {t.fecha.split('-').reverse().join('/')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="card p-5 border-white/5 bg-ink-900">
               <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <CheckCircle2 size={14} /> Resumen del Día
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[12px]"><span className="text-white/60">Completadas hoy</span><span className="font-bold text-emerald-400">{tareasSeleccionadas.filter(t=>t.completada).length}</span></div>
                  <div className="flex justify-between items-center text-[12px]"><span className="text-white/60">Pendientes hoy</span><span className="font-bold text-brand-400">{tareasSeleccionadas.filter(t=>!t.completada).length}</span></div>
                </div>
            </div>
          </div>
        </div>
      )}

      {(isCreating || editingTask) && <TareaDialog tarea={editingTask} leads={leads} propiedades={propiedades} onClose={() => { setIsCreating(false); setEditingTask(null); }} onSaved={load} selectedDate={selectedDate} />}
    </Layout>
  );
}

function TaskCard({ t, leads, props, onEdit, onToggle }: { t: Tarea, leads: LeadAgenda[], props: PropiedadAgenda[], onEdit: () => void, onToggle: (e: React.MouseEvent) => void }) {
  const tipoInfo = TIPOS_TAREA.find(x => x.id === t.tipo) || TIPOS_TAREA[5];
  const lead = leads.find(l => l.id === t.lead_id);
  const propiedad = props.find(p => p.id === t.propiedad_id);

  return (
    <div className={`card p-4 flex items-start gap-4 group border-white/5 hover:border-white/10 transition cursor-pointer ${t.completada ? 'opacity-50 grayscale-[0.5]' : ''}`} onClick={onEdit}>
      <button onClick={onToggle} className={`mt-1 shrink-0 ${t.completada ? 'text-emerald-400' : 'text-white/20 hover:text-brand-400 transition'}`}>
        {t.completada ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${tipoInfo.bg} ${tipoInfo.color}`}>{t.tipo}</span>
          <span className="text-[11px] text-white/50 font-medium flex items-center gap-1"><Clock size={11} /> {t.hora || 'Todo el día'}</span>
        </div>
        <div className={`text-sm font-bold truncate mb-2 ${t.completada ? 'text-white/60 line-through' : 'text-white'}`}>{t.titulo}</div>
        
        {(lead || propiedad) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {lead && <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/70"><User size={10} className="text-brand-400"/> <span className="truncate max-w-[120px]">{lead.nombre}</span></div>}
            {propiedad && <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/70"><Building2 size={10} className="text-amber-400"/> <span className="truncate max-w-[120px]">{propiedad.referencia || 'Propiedad'}</span></div>}
          </div>
        )}
      </div>
      <Edit2 size={14} className="text-white/10 group-hover:text-white/40 transition shrink-0" />
    </div>
  );
}

function TareaDialog({ tarea, leads, propiedades, onClose, onSaved, selectedDate }: { tarea?: Tarea | null, leads: LeadAgenda[], propiedades: PropiedadAgenda[], onClose: () => void, onSaved: () => void, selectedDate: string }) {
  const { perfil } = useAuth();
  const isEditing = !!tarea;
  
  const [tipo, setTipo] = useState(tarea?.tipo || 'Visita');
  const [titulo, setTitulo] = useState(tarea?.titulo || '');
  const [fecha, setFecha] = useState(tarea?.fecha || selectedDate);
  const [hora, setHora] = useState(tarea?.hora || '10:00');
  const [estado, setEstado] = useState(tarea?.estado_tarea || 'Pendiente');
  const [descripcion, setDescripcion] = useState(tarea?.descripcion || '');
  const [leadId, setLeadId] = useState(tarea?.lead_id || '');
  const [propId, setPropId] = useState(tarea?.propiedad_id || '');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const completada = estado === 'Completada';
    const payload = { agencia_id: perfil?.agencia_id, asignado_a: perfil?.id, tipo, titulo, fecha, hora, estado_tarea: estado, descripcion, completada, lead_id: leadId || null, propiedad_id: propId || null };
    const res = isEditing && tarea ? await supabase.from('tareas').update(payload).eq('id', tarea.id) : await supabase.from('tareas').insert(payload);
    setSubmitting(false);
    if (res.error) setError(res.error.message); else { onSaved(); onClose(); }
  };

  const onDelete = async () => {
    if(!tarea || !confirm('¿Eliminar tarea?')) return;
    setSubmitting(true);
    await supabase.from('tareas').delete().eq('id', tarea.id);
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-0 overflow-hidden animate-slide-up bg-ink-950 border-white/10 shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <div><div className="text-base font-semibold text-white">{isEditing ? 'Editar tarea' : 'Nueva tarea'}</div><div className="text-[12px] text-white/50">Programa y vincula eventos</div></div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:text-white transition text-white/40"><X size={16}/></button>
        </div>
        <form id="tarea-form" onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div>
            <label className="label">Clasificación</label>
            <div className="grid grid-cols-6 gap-2 mt-1">
              {TIPOS_TAREA.map((t) => (
                <button key={t.id} type="button" onClick={() => setTipo(t.id)} className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${tipo === t.id ? `bg-brand-500/20 border-brand-500 ${t.color}` : 'bg-ink-900 border-white/5 text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <t.icon size={16} /><span className="text-[9px] font-bold uppercase tracking-wider">{t.id}</span>
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Título *</label><input required className="input bg-ink-900 border-white/10 focus:border-brand-500 text-sm" placeholder="Ej. Visita Piso Centro con Ana" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Cliente Asociado (Opcional)</label><select className="input bg-ink-900 border-white/10 text-sm" value={leadId} onChange={e => setLeadId(e.target.value)}><option value="">Sin vincular</option>{leads.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}</select></div>
            <div><label className="label">Propiedad (Opcional)</label><select className="input bg-ink-900 border-white/10 text-sm" value={propId} onChange={e => setPropId(e.target.value)}><option value="">Sin vincular</option>{propiedades.map(p => <option key={p.id} value={p.id}>{p.referencia || 'Propiedad'} - {p.titulo.substring(0,20)}...</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><label className="label">Fecha *</label><input required type="date" className="input bg-ink-900 border-white/10 text-sm" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
            <div><label className="label">Hora</label><input type="time" className="input bg-ink-900 border-white/10 text-sm" value={hora} onChange={(e) => setHora(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Estado</label><select className="input bg-ink-900 border-white/10 text-sm" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="Pendiente">Pendiente</option><option value="En proceso">En proceso</option><option value="Completada">Completada</option><option value="Cancelada">Cancelada</option></select></div>
          </div>
          <div><label className="label">Notas adicionales</label><textarea rows={3} className="input bg-ink-900 border-white/10 resize-none text-sm" placeholder="Detalles, códigos de acceso..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
          {error && <div className="flex items-start gap-2 text-[11px] text-red-400 bg-red-500/10 p-3 rounded-lg"><AlertCircle size={14}/>{error}</div>}
        </form>
        <div className="pt-4 p-6 flex justify-between items-center border-t border-white/5 bg-ink-950/80">
          {isEditing ? <button type="button" onClick={onDelete} className="text-red-400 text-xs font-bold uppercase tracking-widest hover:text-red-300 flex items-center gap-1"><Trash2 size={14}/> Eliminar</button> : <div/>}
          <div className="flex gap-3"><button type="button" className="btn-ghost border border-white/10 text-xs" onClick={onClose}>Cancelar</button><button type="submit" form="tarea-form" className="btn-primary text-xs" disabled={submitting}>{submitting ? <Loader2 className="animate-spin" /> : (isEditing ? 'Actualizar Evento' : 'Crear Evento')}</button></div>
        </div>
      </div>
    </div>
  );
}