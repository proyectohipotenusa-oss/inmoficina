import { useEffect, useCallback, useState, DragEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, Phone, Mail, Sparkles, Building2, GripVertical, Flame, Zap } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

interface Column { key: string; label: string; ring: string; dot: string; accent: string; }
interface LeadPipe { id: string; nombre: string; estado: string; telefono?: string; email?: string; presupuesto_max?: number; ultimo_contacto?: string; created_at: string; }

const columns: Column[] = [
  { key: 'nuevo', label: 'Nuevo', ring: 'ring-sky-500/25', dot: 'bg-sky-400', accent: 'from-sky-500/20' },
  { key: 'contactado', label: 'Contactado', ring: 'ring-brand-500/25', dot: 'bg-brand-400', accent: 'from-brand-500/20' },
  { key: 'visita', label: 'Visita', ring: 'ring-amber-500/25', dot: 'bg-amber-400', accent: 'from-amber-500/20' },
  { key: 'negociacion', label: 'Negociacion', ring: 'ring-purple-500/25', dot: 'bg-purple-400', accent: 'from-purple-500/20' },
  { key: 'cerrado', label: 'Cerrado', ring: 'ring-emerald-500/25', dot: 'bg-emerald-400', accent: 'from-emerald-500/20' },
  { key: 'perdido', label: 'Perdido', ring: 'ring-red-500/25', dot: 'bg-red-400', accent: 'from-red-500/20' },
];

export default function Pipeline() {
  const { perfil } = useAuth();
  const [leads, setLeads] = useState<LeadPipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').eq('agencia_id', perfil.agencia_id);
    setLeads((data as LeadPipe[]) || []);
    setLoading(false);
  }, [perfil?.agencia_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const touchLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date().toISOString();
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ultimo_contacto: now } : l)));
    await supabase.from('leads').update({ ultimo_contacto: now }).eq('id', id);
  };

  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: DragEvent, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id || !newStatus) return;
    const now = new Date().toISOString();
    setLeads(prev => prev.map(l => l.id === id ? { ...l, estado: newStatus, ultimo_contacto: now } : l));
    await supabase.from('leads').update({ estado: newStatus, ultimo_contacto: now }).eq('id', id);
    setDraggedId(null);
  };

  const sanitizeWa = (t: string) => t.replace(/\D/g, '');

  if (loading) return <div className="min-h-screen bg-ink-950 flex justify-center pt-20"><Loader2 className="animate-spin text-brand-400" size={32}/></div>;

  return (
    <Layout title="Pipeline">
      <PageHeader title="Pipeline Comercial" subtitle="Arrastra y suelta tus negociaciones hacia el cierre." />
      <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar min-h-[70vh] snap-x">
        {columns.map(col => {
          const colLeads = leads.filter(l => (l.estado || 'nuevo') === col.key);
          return (
            <div key={col.key} className={`w-[280px] shrink-0 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col snap-start transition-all ${draggedId ? 'border-dashed border-white/20 bg-white/[0.04]' : ''}`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.key)}>
              <div className={`p-4 border-b border-white/5 bg-gradient-to-b ${col.accent} to-transparent rounded-t-2xl flex items-center justify-between`}>
                <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${col.dot} shadow-[0_0_8px_rgba(255,255,255,0.5)]`} /><h3 className="text-sm font-bold text-white tracking-wide">{col.label}</h3></div>
                <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{colLeads.length}</span>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                {colLeads.map(lead => {
                  const lastAction = lead.ultimo_contacto || lead.created_at;
                  const isCold = lastAction && !['cerrado', 'perdido'].includes(col.key) ? (new Date().getTime() - new Date(lastAction).getTime()) / (1000 * 3600 * 24) >= 3 : false;
                  return (
                    <div key={lead.id} draggable onDragStart={(e) => handleDragStart(e, lead.id)} className={`group relative p-3 rounded-xl bg-ink-900 border border-white/5 shadow-lg cursor-grab active:cursor-grabbing hover:border-brand-500/30 transition-all ${isCold ? 'border-l-2 border-l-red-500 bg-red-500/5' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-[13px] text-white/90 flex items-center gap-1.5"><GripVertical size={12} className="text-white/20 group-hover:text-white/40"/>{lead.nombre} {isCold && <Flame size={12} className="text-red-500 animate-pulse"/>}</div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-white/40 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5">{lead.presupuesto_max ? `${(lead.presupuesto_max / 1000).toFixed(0)}k €` : 'Sin presup.'}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex gap-1">
                          <button onClick={(e) => touchLead(lead.id, e)} className="h-7 w-7 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition flex items-center justify-center"><Zap size={12}/></button>
                          {lead.telefono && <a href={`https://wa.me/${sanitizeWa(lead.telefono)}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="h-7 w-7 rounded-md bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition"><WhatsAppIcon size={12}/></a>}
                          {lead.telefono && <a href={`tel:${sanitizeWa(lead.telefono)}`} onClick={e=>e.stopPropagation()} className="h-7 w-7 rounded-md bg-brand-500/10 text-brand-400 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><Phone size={12}/></a>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  );
}