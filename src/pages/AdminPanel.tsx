import { useEffect, useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Shield, Plus, Building2, Loader2, Copy, Check, X, Users, KeyRound, Sparkles, ChevronRight, MapPin, Trash2,
  TrendingUp, CheckCircle, Phone, Mail, CalendarDays, Timer, Lock, Unlock, MessageSquare
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { supabase } from '../lib/supabase';

interface Agencia {
  id: string; nombre: string; direccion?: string; ciudad?: string; codigo_postal?: string;
  contacto_nombre?: string; contacto_email?: string; contacto_telefono?: string; created_at: string; bloqueada?: boolean; plan?: string;
}

interface Solicitud {
  id: string; estado: string; nombre_agencia: string; direccion: string; ciudad: string;
  codigo_postal: string; contacto_nombre: string; telefono: string; email: string; created_at: string;
}

interface MensajeContacto {
  id: string; nombre: string; email: string; telefono?: string; mensaje: string; leido: boolean; created_at: string;
}

export default function AdminPanel() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, ingresos: 0, agencias: 0 });
  
  const [selectedAgencia, setSelectedAgencia] = useState<Agencia | 'new' | null>(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeContacto | null>(null);
  const [result, setResult] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const { data: ags } = await supabase.from('agencias').select('*').order('created_at', { ascending: false });
    if (ags) setAgencias(ags);

    const { data: sols } = await supabase.from('solicitudes_registro').select('*').order('created_at', { ascending: false });
    setSolicitudes(sols || []);

    const { data: msgs } = await supabase.from('mensajes_contacto').select('*').order('created_at', { ascending: false });
    setMensajes(msgs || []);

    const { data: perfiles } = await supabase.from('perfiles').select('rol');
    const totalAgencias = ags ? ags.filter(a => !a.bloqueada).length : 0;
    setStats({ total: perfiles?.length || 0, ingresos: totalAgencias * 49, agencias: totalAgencias });
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const actualizarEstadoTrial = async (id: string, nuevoEstado: string) => {
    await supabase.from('solicitudes_registro').update({ estado: nuevoEstado }).eq('id', id);
    loadData();
  };

  const marcarMensajeLeido = async (id: string, estadoLeido: boolean) => {
    await supabase.from('mensajes_contacto').update({ leido: estadoLeido }).eq('id', id);
    loadData();
  };

  const borrarMensaje = async (id: string) => {
    if(!confirm('¿Borrar este mensaje definitivamente?')) return;
    await supabase.from('mensajes_contacto').delete().eq('id', id);
    loadData();
  };

  // BANDEJA DE ENTRADA UNIFICADA (Nuevos registros y Mensajes no leídos)
  const pendingTrials = solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'rechazado').map(s => ({ ...s, tipoEntrada: 'trial', sortDate: new Date(s.created_at).getTime() }));
  const pendingMessages = mensajes.filter(m => !m.leido).map(m => ({ ...m, tipoEntrada: 'mensaje', sortDate: new Date(m.created_at).getTime() }));
  const bandejaEntrada = [...pendingTrials, ...pendingMessages].sort((a, b) => b.sortDate - a.sortDate);

  // TRIALS ACTIVOS PARA AGENDA
  const agendaTrials = solicitudes.filter(s => s.estado === 'procesado').map(s => {
    const expires = new Date(new Date(s.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((expires.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return { ...s, expires, daysLeft };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  // HISTORIAL DE MENSAJES LEÍDOS
  const historialMensajes = mensajes.filter(m => m.leido);

  return (
    <Layout title="Panel Admin">
      <PageHeader title="SuperAdmin" subtitle="Centro de mando unificado para agencias, solicitudes y mensajes web." actions={<button className="btn-primary py-1.5 px-3 text-[10px]" onClick={() => setSelectedAgencia('new')}><Plus size={12} /> Nueva Agencia</button>} />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 bg-ink-900 border-white/5 flex items-center gap-3"><Users size={14} className="text-brand-400"/><p className="text-white/40 text-[8px] font-bold uppercase">Usuarios: {stats.total}</p></div>
        <div className="card p-3 bg-ink-900 border-white/5 flex items-center gap-3"><TrendingUp size={14} className="text-emerald-400"/><p className="text-white/40 text-[8px] font-bold uppercase">MRR: {stats.ingresos}€</p></div>
        <div className="card p-3 bg-ink-900 border-white/5 flex items-center gap-3"><Building2 size={14} className="text-indigo-400"/><p className="text-white/40 text-[8px] font-bold uppercase">Agencias: {stats.agencias}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        
        {/* COLUMNA 1: BANDEJA DE ENTRADA UNIFICADA */}
        <div className="space-y-3">
          <h3 className="text-[9px] font-black uppercase text-white/60 flex items-center gap-1.5"><Users size={12}/> Bandeja de Entrada</h3>
          {loading ? <Loader2 className="animate-spin text-brand-400 mx-auto" size={16} /> : bandejaEntrada.length === 0 ? <div className="p-4 border-dashed border border-white/10 text-center text-[9px] text-white/20">Vacía</div> : (
            bandejaEntrada.map((item: any) => {
              const isTrial = item.tipoEntrada === 'trial';
              return (
                <div key={`${item.tipoEntrada}-${item.id}`} onClick={() => isTrial ? setSelectedSolicitud(item) : setSelectedMensaje(item)} className={`card p-3 bg-ink-900 border-white/5 flex flex-col gap-2 transition cursor-pointer hover:border-white/20 border-l-2 ${isTrial ? (item.estado === 'rechazado' ? 'opacity-40 grayscale border-l-red-500' : 'border-l-brand-500 shadow-brand-500/10 shadow-lg') : 'border-l-purple-500 shadow-purple-500/10 shadow-lg bg-white/[0.01]'}`}>
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <div className="text-[11px] font-bold text-white truncate uppercase">{isTrial ? item.nombre_agencia : item.nombre}</div>
                      <div className={`text-[7px] font-black px-1 py-0.5 rounded w-fit mt-1 uppercase ${isTrial ? 'bg-brand-500/20 text-brand-400' : 'bg-purple-500/20 text-purple-400'}`}>{isTrial ? `Trial: ${item.estado}` : 'Mensaje Web'}</div>
                    </div>
                    <div className="text-[8px] text-white/40 shrink-0">{new Date(item.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[9px] text-white/50 flex items-center gap-1 truncate"><Mail size={8} /> {item.email}</div>
                  <div className="flex gap-1.5 pt-1">
                    {isTrial ? <button onClick={(e) => { e.stopPropagation(); actualizarEstadoTrial(item.id, 'procesado'); }} className="flex-1 py-1 rounded bg-brand-500/20 text-brand-400 text-[8px] font-bold hover:bg-brand-500 hover:text-white transition uppercase">Activar Trial</button> : <button onClick={(e) => { e.stopPropagation(); marcarMensajeLeido(item.id, true); }} className="flex-1 py-1 rounded bg-purple-500/20 text-purple-400 text-[8px] font-bold hover:bg-purple-500 hover:text-white transition uppercase">Marcar Leído</button>}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* COLUMNA 2: AGENDA DE TRIALS */}
        <div className="space-y-3">
          <h3 className="text-[9px] font-black uppercase text-emerald-400 flex items-center gap-1.5"><CalendarDays size={12}/> Agenda de Trials</h3>
          {agendaTrials.map(t => (
            <div key={t.id} onClick={() => setSelectedSolicitud(t)} className="card p-2.5 bg-ink-900 border-white/5 flex items-center justify-between gap-3 cursor-pointer hover:border-white/20 transition">
              <div className="min-w-0 flex-1"><div className="text-[11px] font-bold text-white uppercase truncate">{t.nombre_agencia}</div><div className="text-[8px] text-white/50">{t.contacto_nombre}</div></div>
              <div className={`px-2 py-1 rounded-md border text-right ${t.daysLeft <= 3 ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'}`}><div className="text-xs font-black">{t.daysLeft < 0 ? 0 : t.daysLeft}</div><div className="text-[6px] uppercase font-bold">Días</div></div>
            </div>
          ))}
        </div>

        {/* COLUMNA 3: HISTORIAL MENSAJES WEB */}
        <div className="space-y-3">
          <h3 className="text-[9px] font-black uppercase text-purple-400 flex items-center gap-1.5"><MessageSquare size={12}/> Mensajes Web</h3>
          {historialMensajes.map(m => (
            <div key={m.id} onClick={() => setSelectedMensaje(m)} className="card p-2.5 bg-ink-900 border-white/5 opacity-60 hover:opacity-100 cursor-pointer transition">
              <div className="flex justify-between items-center mb-1"><div className="text-[11px] font-bold text-white truncate">{m.nombre}</div><div className="text-[8px] text-white/30">{new Date(m.created_at).toLocaleDateString()}</div></div>
              <div className="text-[9px] text-white/50 italic truncate">"{m.mensaje}"</div>
            </div>
          ))}
        </div>
      </div>

      {/* LISTA DE AGENCIAS */}
      <h3 className="text-[9px] font-black uppercase text-white/60 mb-2 flex items-center gap-1.5"><Building2 size={12}/> Base de Datos de Agencias</h3>
      <div className="card p-0 overflow-hidden bg-ink-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="text-[8px] uppercase tracking-widest text-white/30 border-b border-white/5 bg-white/[0.01]"><th className="px-3 py-2 font-bold">Agencia</th><th className="px-3 py-2 font-bold">Plan</th><th className="px-3 py-2 font-bold">Slug</th><th className="px-3 py-2 font-bold">Alta</th><th className="px-3 py-2"></th></tr></thead>
            <tbody>
              {agencias.map((a) => (
                <tr key={a.id} onClick={() => setSelectedAgencia(a)} className={`hover:bg-white/[0.03] transition-colors group cursor-pointer ${a.bloqueada ? 'bg-red-500/[0.02]' : ''}`}>
                  <td className="px-3 py-2.5"><div className="text-[10px] font-bold text-white uppercase">{a.nombre}</div></td>
                  <td className="px-3 py-2.5"><div className={`text-[8px] font-bold px-1.5 py-0.5 rounded w-fit uppercase ${a.plan === 'premium' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-white/40'}`}>{a.plan}</div></td>
                  <td className="px-3 py-2.5"><code className="text-[8px] text-white/40">{a.id}</code></td>
                  <td className="px-3 py-2.5 text-[9px] text-white/30">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2.5 text-right"><ChevronRight size={12} className="text-white/10 group-hover:text-white/30 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALES */}
      {selectedAgencia && <AgencyDialog agencia={selectedAgencia} onClose={() => setSelectedAgencia(null)} onSave={() => { setSelectedAgencia(null); loadData(); }} onCreated={(res) => { setSelectedAgencia(null); setResult(res); loadData(); }} />}
      {selectedSolicitud && <SolicitudDialog solicitud={selectedSolicitud} onClose={() => setSelectedSolicitud(null)} onSave={() => { setSelectedSolicitud(null); loadData(); }} />}
      {selectedMensaje && <MensajeDialog mensaje={selectedMensaje} onClose={() => setSelectedMensaje(null)} onSave={() => { setSelectedMensaje(null); loadData(); }} onDelete={() => borrarMensaje(selectedMensaje.id)} />}
      {result && <CredentialsDialog result={result} onClose={() => setResult(null)} />}
    </Layout>
  );
}

function AgencyDialog({ agencia, onClose, onSave, onCreated }: any) {
  const isEdit = agencia !== 'new';
  const ag = isEdit ? agencia : null;
  const [nombre, setNombre] = useState(ag?.nombre || '');
  const [direccion, setDireccion] = useState(ag?.direccion || '');
  const [ciudad, setCiudad] = useState(ag?.ciudad || '');
  const [cp, setCp] = useState(ag?.codigo_postal || '');
  const [plan, setPlan] = useState(ag?.plan || 'premium');
  const [bloqueada, setBloqueada] = useState(ag?.bloqueada || false);
  const [submitting, setSubmitting] = useState(false);

  const effectiveSlug = isEdit ? ag.id : slugify(nombre);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const payload = { id: effectiveSlug, nombre, direccion, ciudad, codigo_postal: cp, plan, bloqueada };
    if (isEdit) await supabase.from('agencias').update(payload).eq('id', ag.id);
    else {
      await supabase.from('agencias').insert([payload]);
      const url = import.meta.env.VITE_SUPABASE_URL || (supabase as any).supabaseUrl;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY || (supabase as any).supabaseKey;
      const tempClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const creds = [];
      for (let i = 1; i <= 3; i++) {
        const email = `${effectiveSlug}-${i}@inmoficina.es`; const pass = Math.random().toString(36).slice(-8) + "!";
        const { data } = await tempClient.auth.signUp({ email, password: pass });
        if (data.user) {
          await supabase.from('perfiles').upsert({ id: data.user.id, email, nombre: `Agente ${i}`, rol: 'agente', agencia_id: effectiveSlug });
          creds.push({ email, password: pass });
        }
      }
      onCreated({ agencia: payload, usuarios: creds });
      return;
    }
    setSubmitting(false); onSave();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-xl overflow-hidden animate-slide-up">
        <div className="p-5 border-b border-white/5 flex justify-between">
          <h3 className="text-sm font-bold text-white">{isEdit ? 'Ficha de Agencia' : 'Nueva Agencia'}</h3>
          <button onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div><label className="label">Nombre</label><input required className="input bg-ink-950 border-white/10 text-sm" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Ciudad</label><input className="input bg-ink-950 border-white/10 text-sm" value={ciudad} onChange={e => setCiudad(e.target.value)} /></div>
            <div><label className="label">Plan</label><select className="input bg-ink-950 border-white/10 text-sm" value={plan} onChange={e => setPlan(e.target.value)}><option value="estandar">Estándar (29€)</option><option value="premium">Premium (49€)</option></select></div>
          </div>
          <div className="flex items-center gap-2 pt-2"><input type="checkbox" checked={bloqueada} onChange={e => setBloqueada(e.target.checked)} /> <label className="text-xs text-white/60">Bloquear acceso (Suspender)</label></div>
          <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold uppercase mt-4" disabled={submitting}>{submitting ? <Loader2 className="animate-spin mx-auto" size={14}/> : 'Guardar Agencia'}</button>
        </form>
      </div>
    </div>
  );
}

function SolicitudDialog({ solicitud, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ ...solicitud });
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await supabase.from('solicitudes_registro').update(formData).eq('id', solicitud.id);
    setSubmitting(false); onSave();
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-xl p-5 shadow-2xl animate-slide-up">
      <div className="flex justify-between mb-4"><h3 className="text-sm font-bold">Editar Solicitud (Trial)</h3><button onClick={onClose}><X size={16}/></button></div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="label">Agencia</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} /></div>
          <div><label className="label">Ciudad</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} /></div>
          <div><label className="label">Teléfono</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
          <div className="col-span-2"><label className="label">Email</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        </div>
        <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold mt-4" disabled={submitting}>Guardar Cambios</button>
      </form>
    </div></div>
  );
}

function MensajeDialog({ mensaje, onClose, onSave, onDelete }: any) {
  const [formData, setFormData] = useState({ ...mensaje });
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await supabase.from('mensajes_contacto').update(formData).eq('id', mensaje.id);
    setSubmitting(false); onSave();
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-xl p-5 shadow-2xl animate-slide-up">
      <div className="flex justify-between mb-4"><h3 className="text-sm font-bold">Mensaje de Contacto</h3><button onClick={onClose}><X size={16}/></button></div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div><label className="label">Nombre</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Email</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><label className="label">Teléfono</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.telefono || ''} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
        </div>
        <div><label className="label">Mensaje</label><textarea rows={4} className="input bg-ink-950 border-white/10 text-sm resize-none" value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})} /></div>
        <div className="flex items-center gap-2"><input type="checkbox" checked={formData.leido} onChange={e => setFormData({...formData, leido: e.target.checked})} /> <label className="text-xs text-white/60">Marcar como procesado (leído)</label></div>
        <div className="flex gap-2 pt-4 border-t border-white/5"><button type="button" onClick={() => { onDelete(); onClose(); }} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition">Borrar</button><button type="submit" className="btn-primary flex-1 py-2.5 text-xs font-bold uppercase" disabled={submitting}>Guardar Cambios</button></div>
      </form>
    </div></div>
  );
}

function CredentialsDialog({ result, onClose }: any) {
  const [copied, setCopied] = useState<any>(null);
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"><div className="relative w-full max-w-sm bg-ink-900 border border-white/10 rounded-xl p-6 shadow-2xl animate-slide-up">
      <h3 className="text-base font-bold text-white mb-4">Sede Creada con Éxito</h3>
      <div className="space-y-2">{result.usuarios.map((u: any, i: number) => (<div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center"><div className="min-w-0"><div className="text-[10px] font-bold text-white truncate">{u.email}</div><div className="text-[9px] text-white/40 font-mono">{u.password}</div></div><button onClick={() => { navigator.clipboard.writeText(`${u.email} / ${u.password}`); setCopied(i); setTimeout(() => setCopied(null), 1500); }} className="text-white/40 hover:text-white">{copied === i ? <Check size={14} className="text-emerald-400"/> : <Copy size={14}/>}</button></div>))}</div>
      <button onClick={onClose} className="btn-primary w-full py-2.5 text-xs font-bold uppercase mt-6">Cerrar</button>
    </div></div>
  );
}