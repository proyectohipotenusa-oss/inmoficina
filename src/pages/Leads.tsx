import { useEffect, useState, FormEvent, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { 
  Users, Plus, Loader2, X, Phone, Mail, 
  MapPin, Home, Euro, BedDouble, Flame, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

interface Lead {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  estado: string;
  presupuesto_max?: number;
  habitaciones_min?: number;
  tipo_interes?: string;
  zona_interes?: string;
  ultimo_contacto?: string;
  created_at: string;
}

const ESTADOS = ['nuevo', 'contactado', 'visita', 'negociacion', 'cerrado', 'perdido'];
const TIPOS_PROPIEDAD = ['Cualquiera', 'piso', 'ático', 'dúplex', 'chalet', 'casa', 'estudio', 'loft', 'local', 'oficina', 'garaje', 'terreno', 'nave', 'trastero'];

export default function Leads() {
  const { perfil } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const loadData = useCallback(async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data: lData } = await supabase.from('leads').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
    setLeads((lData as Lead[]) || []);
    setLoading(false);
  }, [perfil?.agencia_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const touchLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date().toISOString();
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ultimo_contacto: now } : l)));
    await supabase.from('leads').update({ ultimo_contacto: now }).eq('id', id);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingLead(null);
    setIsDialogOpen(true);
  };

  return (
    <Layout title="Leads y Clientes">
      <PageHeader 
        title="Directorio de Leads" 
        subtitle="Gestiona tus contactos, sus preferencias y encuentra propiedades compatibles."
        actions={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo Lead</button>}
      />

      {loading ? (
        <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div>
      ) : leads.length === 0 ? (
        <EmptyState icon={Users} title="Sin contactos" description="Añade tu primer lead para empezar a gestionar clientes y sus preferencias." />
      ) : (
        <div className="card p-0 bg-ink-900 border-white/5 overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 font-bold">Contacto</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold">Interés Principal</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const numWhats = l.telefono ? String(l.telefono).replace(/\D/g, '') : '';
                  const lastAction = l.ultimo_contacto || l.created_at;
                  const isCold = lastAction && !['cerrado', 'perdido'].includes((l.estado || '').toLowerCase()) 
                    ? (new Date().getTime() - new Date(lastAction).getTime()) / (1000 * 3600 * 24) >= 3 : false;

                  return (
                    <tr key={l.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition group cursor-pointer ${isCold ? 'bg-red-500/5' : ''}`} onClick={() => openEdit(l)}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white/90 flex items-center gap-2">
                          {l.nombre}
                          {isCold && <Flame size={14} className="text-red-500 animate-pulse" title="Lead frío" />}
                        </div>
                        <div className="text-[11px] text-white/40 flex items-center gap-2 mt-1">
                          {l.telefono && <span>{l.telefono}</span>}
                          {l.telefono && l.email && <span>•</span>}
                          {l.email && <span>{l.email}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          l.estado === 'nuevo' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                          l.estado === 'contactado' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' :
                          l.estado === 'visita' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          l.estado === 'negociacion' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          l.estado === 'cerrado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {l.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-white/60">
                        {l.tipo_interes && l.tipo_interes !== 'Cualquiera' ? <span className="capitalize font-medium text-white/80">{l.tipo_interes}</span> : 'Propiedad'} 
                        {l.presupuesto_max ? ` hasta ${formatEUR(l.presupuesto_max)}` : ''}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => touchLead(l.id, e)} className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-white flex items-center justify-center text-amber-400 transition" title="Registrar contacto hoy">
                            <Zap size={14} />
                          </button>
                          {l.telefono && (
                            <a href={`https://wa.me/${numWhats}`} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white flex items-center justify-center text-[#25D366] transition" title="WhatsApp">
                              <WhatsAppIcon size={14} />
                            </a>
                          )}
                          {l.telefono && (
                            <a href={`tel:${numWhats}`} onClick={e => e.stopPropagation()} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition" title="Llamar">
                              <Phone size={14} />
                            </a>
                          )}
                          {l.email && (
                            <a href={`mailto:${l.email}`} onClick={e => e.stopPropagation()} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition" title="Enviar Email">
                              <Mail size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isDialogOpen && <LeadDialog lead={editingLead} onClose={() => setIsDialogOpen(false)} onSaved={loadData} />}
    </Layout>
  );
}

function LeadDialog({ lead, onClose, onSaved }: { lead?: Lead | null, onClose: () => void, onSaved: () => void }) {
  const { perfil } = useAuth();
  const isEditing = !!lead;
  
  const [nombre, setNombre] = useState(lead?.nombre || '');
  const [email, setEmail] = useState(lead?.email || '');
  const [telefono, setTelefono] = useState(lead?.telefono || '');
  const [estado, setEstado] = useState(lead?.estado || 'nuevo');
  
  const [presupuestoMax, setPresupuestoMax] = useState(lead?.presupuesto_max || '');
  const [habitacionesMin, setHabitacionesMin] = useState(lead?.habitaciones_min || '');
  const [tipoInteres, setTipoInteres] = useState(lead?.tipo_interes || 'Cualquiera');
  const [zonaInteres, setZonaInteres] = useState(lead?.zona_interes || '');
  
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = { 
      agencia_id: perfil?.agencia_id, 
      nombre, email, telefono, estado,
      presupuesto_max: presupuestoMax ? Number(presupuestoMax) : null,
      habitaciones_min: habitacionesMin ? Number(habitacionesMin) : null,
      tipo_interes: tipoInteres,
      zona_interes: zonaInteres,
      ultimo_contacto: new Date().toISOString()
    };

    if (isEditing && lead) {
      await supabase.from('leads').update(payload).eq('id', lead.id);
    } else {
      await supabase.from('leads').insert(payload);
    }
    
    setSubmitting(false);
    onSaved();
    onClose();
  };

  const onDelete = async () => {
    if (!lead || !confirm('¿Eliminar lead?')) return;
    setSubmitting(true);
    await supabase.from('leads').delete().eq('id', lead.id);
    onSaved(); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card p-0 overflow-hidden animate-slide-up bg-ink-950 border-white/10 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/5 shrink-0">
          <div>
            <div className="text-lg font-semibold text-white">{isEditing ? 'Ficha del Cliente' : 'Nuevo Contacto'}</div>
            <div className="text-[13px] text-white/50 mt-0.5">Datos personales y preferencias de búsqueda</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition"><X size={16}/></button>
        </div>
        
        <form id="lead-form" onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-400">Datos Personales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="label">Nombre completo *</label><input required className="input bg-ink-900 border-white/10" value={nombre} onChange={e => setNombre(e.target.value)} autoFocus /></div>
              <div><label className="label">Teléfono</label><input className="input bg-ink-900 border-white/10" value={telefono} onChange={e => setTelefono(e.target.value)} /></div>
              <div><label className="label">Email</label><input type="email" className="input bg-ink-900 border-white/10" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="sm:col-span-2">
                <label className="label">Estado en el Pipeline</label>
                <select className="input bg-ink-900 border-white/10 capitalize" value={estado} onChange={e => setEstado(e.target.value)}>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Criterios de Búsqueda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1.5"><Euro size={12}/> Presupuesto Máximo</label>
                <input type="number" className="input bg-ink-900 border-white/10 focus:border-indigo-500" placeholder="Ej. 250000" value={presupuestoMax} onChange={e => setPresupuestoMax(e.target.value)} />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><BedDouble size={12}/> Habitaciones (Mínimas)</label>
                <input type="number" className="input bg-ink-900 border-white/10 focus:border-indigo-500" placeholder="Ej. 3" value={habitacionesMin} onChange={e => setHabitacionesMin(e.target.value)} />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Home size={12}/> Tipo de Inmueble</label>
                <select className="input bg-ink-900 border-white/10 focus:border-indigo-500 capitalize" value={tipoInteres} onChange={e => setTipoInteres(e.target.value)}>
                  {TIPOS_PROPIEDAD.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><MapPin size={12}/> Zona / Ciudad</label>
                <input type="text" className="input bg-ink-900 border-white/10 focus:border-indigo-500" placeholder="Ej. Madrid Centro" value={zonaInteres} onChange={e => setZonaInteres(e.target.value)} />
              </div>
            </div>
          </div>
        </form>
        
        <div className="p-6 pt-5 border-t border-white/5 bg-ink-900 flex justify-between items-center shrink-0">
          {isEditing ? <button type="button" onClick={onDelete} className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1">Eliminar</button> : <div/>}
          <div className="flex gap-3">
            <button type="button" className="btn-ghost border border-white/10" onClick={onClose}>Cancelar</button>
            <button type="submit" form="lead-form" className="btn-primary" disabled={submitting}>{submitting ? <Loader2 className="animate-spin"/> : 'Guardar Cliente'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}