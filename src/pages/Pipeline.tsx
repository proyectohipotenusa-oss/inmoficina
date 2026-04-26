import { useEffect, useMemo, useState, DragEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, Phone, Mail, Globe, Handshake, Sparkles, Building2, GripVertical, Flame, Zap } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

interface Column { key: string; label: string; ring: string; dot: string; accent: string; }

const columns: Column[] = [
  { key: 'nuevo', label: 'Nuevo', ring: 'ring-sky-500/25', dot: 'bg-sky-400', accent: 'from-sky-500/20' },
  { key: 'contactado', label: 'Contactado', ring: 'ring-brand-500/25', dot: 'bg-brand-400', accent: 'from-brand-500/20' },
  { key: 'visita', label: 'Visita', ring: 'ring-amber-500/25', dot: 'bg-amber-400', accent: 'from-amber-500/20' },
  { key: 'negociacion', label: 'Negociacion', ring: 'ring-purple-500/25', dot: 'bg-purple-400', accent: 'from-purple-500/20' },
  { key: 'cerrado', label: 'Cerrado', ring: 'ring-emerald-500/25', dot: 'bg-emerald-400', accent: 'from-emerald-500/20' },
  { key: 'perdido', label: 'Perdido', ring: 'ring-red-500/25', dot: 'bg-red-400', accent: 'from-red-500/20' },
];

const ORIGEN_ICON: Record<string, typeof Globe> = {
  Web: Globe, WhatsApp: Phone, Portal: Building2, Recomendado: Handshake, Otros: Sparkles,
};

function sanitizeWa(raw: string) { return raw.replace(/[^\d]/g, ''); }

export default function Pipeline() {
  const { perfil } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverCol, setHoverCol] = useState<string | null>(null);

  const load = async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [perfil?.agencia_id]);

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = { nuevo: [], contactado: [], visita: [], negociacion: [], cerrado: [], perdido: [] };
    leads.forEach((l) => { const estado = l.estado?.toLowerCase() || 'nuevo'; (map[estado] ?? map.nuevo).push(l); });
    return map;
  }, [leads]);

  const moveLead = async (id: string, estado: string) => {
    const current = leads.find((l) => l.id === id);
    if (!current || current.estado === estado) return;
    const now = new Date().toISOString();
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado, ultimo_contacto: now } : l)));
    const { error } = await supabase.from('leads').update({ estado, ultimo_contacto: now }).eq('id', id);
    if (error) { alert(error.message); load(); }
  };

  const touchLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date().toISOString();
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ultimo_contacto: now } : l)));
    await supabase.from('leads').update({ ultimo_contacto: now }).eq('id', id);
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id);
  };

  const onDragEnd = () => { setDraggingId(null); setHoverCol(null); };
  const onDragOver = (e: DragEvent<HTMLDivElement>, col: string) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (hoverCol !== col) setHoverCol(col); };
  const onDrop = (e: DragEvent<HTMLDivElement>, col: string) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain') || draggingId; if (id) moveLead(id, col); setHoverCol(null); setDraggingId(null); };

  return (
    <Layout title="Pipeline">
      <PageHeader title="Pipeline Comercial" subtitle="Arrastra y suelta tus negociaciones hacia el cierre." />
      {loading ? <div className="card py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={22} /></div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 xl:gap-3 h-[calc(100vh-140px)] min-h-[500px] pb-4 w-full">
          {columns.map((col) => {
            const items = grouped[col.key] || [];
            const isHover = hoverCol === col.key;
            return (
              <div key={col.key} onDragOver={(e) => onDragOver(e, col.key)} onDragLeave={() => setHoverCol((c) => (c === col.key ? null : c))} onDrop={(e) => onDrop(e, col.key)} className={`relative flex flex-col h-full rounded-2xl border border-white/5 bg-ink-800 transition overflow-hidden min-w-0 ${isHover ? `ring-2 ${col.ring}` : ''}`}>
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-gradient-to-b ${col.accent} to-transparent opacity-60`} />
                <div className="relative flex items-center justify-between px-3 pt-3 pb-2 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0"><span className={`h-1.5 w-1.5 rounded-full ${col.dot} shrink-0`} /><h3 className="text-[12px] font-semibold truncate">{col.label}</h3></div>
                  <span className="text-[9px] font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded-md shrink-0 ml-1">{items.length}</span>
                </div>
                <div className="relative flex-1 px-2 pb-2 space-y-2 overflow-y-auto custom-scrollbar">
                  {items.length === 0 ? <div className="h-16 rounded-xl bg-white/[0.015] border border-white/5 border-dashed flex items-center justify-center text-[10px] text-white/30">{isHover ? 'Suelta aquí' : 'Sin leads'}</div> : (
                    items.map((lead) => <KanbanCard key={lead.id} lead={lead} dragging={draggingId === lead.id} onDragStart={(e) => onDragStart(e, lead.id)} onDragEnd={onDragEnd} touchLead={touchLead} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

function KanbanCard({ lead, dragging, onDragStart, onDragEnd, touchLead }: any) {
  const Icon = ORIGEN_ICON[lead.origen] ?? Sparkles;
  const lastAction = lead.ultimo_contacto || lead.created_at;
  const isCold = lastAction && !['cerrado', 'perdido'].includes((lead.estado || '').toLowerCase()) ? (new Date().getTime() - new Date(lastAction).getTime()) / (1000 * 3600 * 24) >= 3 : false;

  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} className={`group relative bg-ink-900 rounded-xl border p-2.5 cursor-grab active:cursor-grabbing transition shadow-sm ${dragging ? 'opacity-40' : ''} ${isCold ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-white/5 hover:border-white/15'}`}>
      <div className="flex items-start gap-1.5">
        <GripVertical size={12} className="text-white/20 mt-0.5 shrink-0 group-hover:text-white/40 transition" />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-white flex items-center gap-1.5 truncate"><span className="truncate leading-tight">{lead.nombre || 'Sin nombre'}</span>{isCold && <Flame size={10} className="text-red-500 shrink-0" title="Lead enfriándose (+3 días)" />}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[9px] text-white/50"><Icon size={9} /><span className="truncate">{lead.origen || 'Sin origen'}</span>{lead.presupuesto_max && <span className="ml-auto bg-white/5 px-1 rounded text-white/60">{(lead.presupuesto_max / 1000).toFixed(0)}k</span>}</div>
        </div>
      </div>
      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5">
        <button onClick={(e) => touchLead(lead.id, e)} className="inline-flex items-center justify-center h-6 w-6 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition shrink-0" title="Registrar contacto/seguimiento hoy"><Zap size={10} /></button>
        {lead.telefono && (
          <><a href={`https://wa.me/${sanitizeWa(lead.telefono)}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center h-6 w-6 rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition shrink-0" title="WhatsApp"><WhatsAppIcon size={10} /></a>
          <a href={`tel:${sanitizeWa(lead.telefono)}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center h-6 w-6 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition shrink-0" title="Llamar"><Phone size={10} /></a></>
        )}
        {lead.email && <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center h-6 w-6 rounded border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition shrink-0" title="Email"><Mail size={10} /></a>}
      </div>
    </div>
  );
}