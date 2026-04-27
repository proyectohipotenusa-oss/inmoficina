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
  contacto_nombre?: string; contacto_email?: string; contacto_telefono?: string; created_at: string; bloqueada?: boolean;
}

interface Solicitud {
  id: string; estado: string; nombre_agencia: string; direccion: string; ciudad: string;
  codigo_postal: string; contacto_nombre: string; telefono: string; email: string; created_at: string;
}

interface MensajeContacto {
  id: string; nombre: string; email: string; telefono?: string; mensaje: string; leido: boolean; created_at: string;
}

interface Agente { id: string; email: string; nombre: string; }
interface CreatedUser { email: string; password: string; }
interface CreatedResult { agencia: Agencia; usuarios: CreatedUser[]; }

function slugify(raw: string) {
  if (!raw) return '';
  return String(raw).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
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
  const [result, setResult] = useState<CreatedResult | null>(null);

  const loadData = async () => {
    setLoading(true);
    const { data: ags } = await supabase.from('agencias').select('*').order('created_at', { ascending: false });
    if (ags) setAgencias(ags as Agencia[]);

    const { data: sols } = await supabase.from('solicitudes_registro').select('*').order('created_at', { ascending: false });
    setSolicitudes((sols as Solicitud[]) || []);

    const { data: msgs } = await supabase.from('mensajes_contacto').select('*').order('created_at', { ascending: false });
    setMensajes((msgs as MensajeContacto[]) || []);

    const { data: perfiles } = await supabase.from('perfiles').select('rol');
    const totalAgencias = ags ? ags.filter(a => !a.bloqueada).length : 0;
    
    setStats({ total: perfiles?.length || 0, ingresos: totalAgencias * 49, agencias: totalAgencias });
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await supabase.from('solicitudes_registro').update({ estado: nuevoEstado }).eq('id', id);
    loadData();
  };

  const marcarMensajeLeido = async (id: string, estadoLeido: boolean) => {
    await supabase.from('mensajes_contacto').update({ leido: estadoLeido }).eq('id', id);
    loadData();
  };

  // BANDEJA UNIFICADA DE ENTRADA (Leads + Mensajes nuevos)
  const pendingTrials = solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'rechazado').map(s => ({ ...s, incomingType: 'trial', sortDate: new Date(s.created_at).getTime() }));
  const pendingMessages = mensajes.filter(m => !m.leido).map(m => ({ ...m, incomingType: 'message', sortDate: new Date(m.created_at).getTime() }));
  const unifiedInbox = [...pendingTrials, ...pendingMessages].sort((a, b) => b.sortDate - a.sortDate);

  const activeTrials = solicitudes.filter(s => s.estado === 'procesado').map(s => {
      const created = new Date(s.created_at);
      const expires = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000); 
      const daysLeft = Math.ceil((expires.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return { ...s, expires, daysLeft };
  }).sort((a, b) => a.daysLeft - b.daysLeft); 

  const readMessages = mensajes.filter(m => m.leido);

  return (
    <Layout title="Panel Admin">
      <PageHeader
        title="SuperAdmin"
        subtitle="Centro de mando: embudo de ventas, agenda de trials, mensajes web y gestión de agencias."
        actions={<button type="button" className="btn-primary py-1.5 px-3 text-[10px]" onClick={() => setSelectedAgencia('new')}><Plus size={12} /> Nueva Agencia</button>}
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 bg-ink-900 border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 rounded-md bg-brand-500/10 flex items-center justify-center shrink-0"><Users size={14} className="text-brand-400"/></div>
           <div><p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Usuarios Activos</p><p className="text-lg font-black text-white leading-none mt-0.5">{stats.total}</p></div>
        </div>
        <div className="card p-3 bg-ink-900 border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0"><TrendingUp size={14} className="text-emerald-400"/></div>
           <div><p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">MRR (Mes)</p><p className="text-lg font-black text-emerald-400 leading-none mt-0.5">{stats.ingresos}€</p></div>
        </div>
        <div className="card p-3 bg-ink-900 border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center shrink-0"><Building2 size={14} className="text-indigo-400"/></div>
           <div><p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Agencias Activas</p><p className="text-lg font-black text-white leading-none mt-0.5">{stats.agencias}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        
        {/* COLUMNA 1: BANDEJA UNIFICADA DE ENTRADA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-1.5"><Users size={12}/> Bandeja de Entrada</h3>
            <button onClick={loadData} className="text-[8px] font-bold text-white/40 hover:text-white transition">Actualizar</button>
          </div>

          {loading ? <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-brand-400" size={16} /></div> : unifiedInbox.length === 0 ? <div className="card p-4 text-center bg-white/[0.01] text-white/20 text-[9px] font-bold uppercase tracking-widest border-dashed border border-white/10">Bandeja limpia</div> : (
            <div className="grid grid-cols-1 gap-2">
              {unifiedInbox.map((item: any) => {
                const isTrial = item.incomingType === 'trial';
                
                return (
                  <div key={`${item.incomingType}-${item.id}`} onClick={() => isTrial ? setSelectedSolicitud(item) : setSelectedMensaje(item)} className={`card p-3 bg-ink-900 border-white/5 flex flex-col gap-2 transition-all cursor-pointer hover:border-white/20 border-l-2 shadow-md ${isTrial ? (item.estado === 'rechazado' ? 'opacity-40 grayscale border-l-red-500' : 'border-l-brand-500') : 'border-l-purple-500'}`}>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-black text-white uppercase truncate">{isTrial ? item.nombre_agencia : item.nombre}</span>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-widest ${isTrial ? (item.estado === 'pendiente' ? 'bg-brand-500/20 text-brand-400' : 'bg-red-500/20 text-red-500') : 'bg-purple-500/20 text-purple-400'}`}>
                            {isTrial ? `TRIAL: ${item.estado}` : 'MENSAJE WEB'}
                          </span>
                        </div>
                        {isTrial ? (
                          <div className="text-[9px] text-white/50 flex items-center gap-1 truncate"><MapPin size={8} className="text-white/30 shrink-0" /> {item.ciudad} ({item.codigo_postal})</div>
                        ) : (
                          <div className="text-[9px] text-white/50 italic truncate">"{item.mensaje}"</div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                         <p className="text-[7px] text-white/20 uppercase font-black tracking-widest">Recibido</p>
                         <p className="text-[8px] font-bold text-white/50">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5 text-[9px] text-white/60 bg-white/[0.02] p-2 rounded-md border border-white/5">
                       {isTrial && <div className="flex items-center gap-1 truncate"><Users size={8} className="text-brand-400 shrink-0" /> {item.contacto_nombre}</div>}
                       {item.telefono && <div className="flex items-center gap-1 truncate"><Phone size={8} className="text-brand-400 shrink-0" /> {item.telefono}</div>}
                       <div className={`${isTrial || !item.telefono ? 'col-span-2' : ''} flex items-center gap-1 truncate`}><Mail size={8} className="text-brand-400 shrink-0" /> {item.email}</div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {isTrial ? (
                        item.estado === 'pendiente' ? (
                          <><button onClick={(e) => { e.stopPropagation(); actualizarEstado(item.id, 'procesado'); }} className="flex-1 py-1 rounded bg-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white transition text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1"><CheckCircle size={10}/> Activar Trial</button><button onClick={(e) => { e.stopPropagation(); actualizarEstado(item.id, 'rechazado'); }} className="py-1 px-2.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition text-[8px] font-black uppercase tracking-widest"><X size={10}/></button></>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); actualizarEstado(item.id, 'pendiente'); }} className="w-full py-1 rounded bg-white/5 text-white/40 hover:bg-white/10 transition text-[8px] font-black uppercase tracking-widest">Revertir a Pendiente</button>
                        )
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); marcarMensajeLeido(item.id, true); }} className="w-full py-1 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1"><CheckCircle size={10}/> Completar Mensaje</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMNA 2: AGENDA DE SEGUIMIENTO (TRIAL) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5"><CalendarDays size={12}/> Agenda de Trials</h3>
            <span className="text-[8px] font-bold text-emerald-400/50 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">{activeTrials.length} Activos</span>
          </div>

          {loading ? <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-emerald-400" size={16} /></div> : activeTrials.length === 0 ? <div className="card p-4 text-center bg-white/[0.01] text-white/20 text-[9px] font-bold uppercase tracking-widest border-dashed border border-white/10">No hay trials activos</div> : (
            <div className="grid grid-cols-1 gap-2">
              {activeTrials.map(t => {
                const isExpired = t.daysLeft <= 0;
                const isUrgent = !isExpired && t.daysLeft <= 3;
                const colorClass = isExpired ? 'text-red-400 bg-red-400/10 border-red-400/20' : isUrgent ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                return (
                  <div key={t.id} onClick={() => setSelectedSolicitud(t)} className="card p-2.5 bg-ink-900 border-white/5 flex items-center justify-between gap-3 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-white uppercase truncate mb-0.5">{t.nombre_agencia}</div>
                      <div className="text-[8px] text-white/50 flex items-center gap-1.5 truncate"><span><Users size={7} className="inline mr-0.5 opacity-50"/>{t.contacto_nombre}</span><span><Phone size={7} className="inline mr-0.5 opacity-50"/>{t.telefono}</span></div>
                    </div>
                    <div className={`shrink-0 flex items-center gap-2 px-2 py-1 rounded-md border ${colorClass}`}>
                      <Timer size={12} className={isExpired ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-emerald-400'} />
                      <div className="text-right"><div className="text-xs font-black leading-none">{isExpired ? '0' : t.daysLeft}</div><div className="text-[6px] uppercase tracking-widest font-bold opacity-80">{isExpired ? 'Caducado' : 'Días Rest.'}</div></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* COLUMNA 3: MENSAJES WEB PROCESADOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-1.5"><MessageSquare size={12}/> Mensajes Web</h3>
            <span className="text-[8px] font-bold text-purple-400/50 bg-purple-400/10 px-1.5 py-0.5 rounded-full">{readMessages.length} Leídos</span>
          </div>

          {loading ? <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-purple-400" size={16} /></div> : readMessages.length === 0 ? <div className="card p-4 text-center bg-white/[0.01] text-white/20 text-[9px] font-bold uppercase tracking-widest border-dashed border border-white/10">Bandeja limpia</div> : (
            <div className="grid grid-cols-1 gap-2">
              {readMessages.map(m => (
                <div key={m.id} onClick={() => setSelectedMensaje(m)} className="card p-3 bg-ink-900 border-white/5 flex flex-col gap-2 transition-all cursor-pointer hover:border-white/20 opacity-70 grayscale hover:grayscale-0 hover:opacity-100">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <div className="text-[11px] font-bold text-white truncate">{m.nombre}</div>
                      <a href={`mailto:${m.email}`} onClick={e => e.stopPropagation()} className="text-[9px] text-brand-400 hover:underline truncate">{m.email}</a>
                    </div>
                    <div className="text-[8px] text-white/40 shrink-0">{new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[10px] text-white/70 italic leading-relaxed p-2 bg-ink-950 rounded-md border border-white/5 break-words">
                    "{m.mensaje}"
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={(e) => { e.stopPropagation(); marcarMensajeLeido(m.id, false); }} className="w-full py-1 rounded bg-white/5 text-white/40 hover:bg-white/10 transition text-[8px] font-black uppercase tracking-widest">Revertir a Pendiente</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-2 flex items-center gap-1.5"><Building2 size={12}/> Base de Datos de Agencias</h3>
      <div className="card p-0 overflow-hidden shadow-xl border-white/5 bg-ink-900/50 mb-8">
        {loading ? (
          <div className="py-12 flex justify-center text-white/20"><Loader2 className="animate-spin" size={16} /></div>
        ) : agencias.length === 0 ? (
          <EmptyState icon={Shield} title="Todavía no has creado agencias" description="Crea una agencia para generar sus credenciales de acceso." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[8px] uppercase tracking-[0.15em] text-white/30 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-3 py-2 font-bold">Agencia</th><th className="px-3 py-2 font-bold">Estado</th><th className="px-3 py-2 font-bold">Slug ID</th><th className="px-3 py-2 font-bold">Contacto</th><th className="px-3 py-2 font-bold">Alta</th><th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agencias.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedAgencia(a)} className={`hover:bg-white/[0.03] transition-colors group cursor-pointer ${a.bloqueada ? 'bg-red-500/[0.02]' : ''}`}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${a.bloqueada ? 'bg-red-500/20 text-red-500' : 'bg-brand-500/20 text-brand-400'}`}>
                          {a.nombre ? a.nombre.slice(0, 1).toUpperCase() : 'A'}
                        </div>
                        <div className={`font-bold text-[10px] truncate max-w-[130px] ${a.bloqueada ? 'text-white/40 line-through' : 'text-white'}`}>{a.nombre}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                       {a.bloqueada ? <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[7px] font-black uppercase tracking-widest flex items-center gap-1 w-fit"><Lock size={8}/> Bloqueada</span> : <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-black uppercase tracking-widest flex items-center gap-1 w-fit"><CheckCircle size={8}/> Activa</span>}
                    </td>
                    <td className="px-3 py-2.5"><code className={`text-[8px] rounded px-1 py-0.5 font-mono ${a.bloqueada ? 'bg-transparent text-white/20' : 'bg-white/5 text-white/40'}`}>{a.id}</code></td>
                    <td className="px-3 py-2.5 text-[9px] truncate max-w-[100px] text-white/50">{a.contacto_nombre || '—'}</td>
                    <td className="px-3 py-2.5 text-white/30 text-[9px] font-medium">{new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                    <td className="px-3 py-2.5 text-right"><ChevronRight size={12} className="text-white/10 group-hover:text-white/30 ml-auto transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAgencia && <AgencyDialog agencia={selectedAgencia} onClose={() => setSelectedAgencia(null)} onSave={() => { setSelectedAgencia(null); loadData(); }} onCreated={(res) => { setSelectedAgencia(null); setResult(res); loadData(); }} />}
      {selectedSolicitud && <SolicitudDialog solicitud={selectedSolicitud} onClose={() => setSelectedSolicitud(null)} onSave={() => { setSelectedSolicitud(null); loadData(); }} />}
      {selectedMensaje && <MensajeDialog mensaje={selectedMensaje} onClose={() => setSelectedMensaje(null)} onSave={() => { setSelectedMensaje(null); loadData(); }} onDelete={() => borrarMensaje(selectedMensaje.id)} />}
      {result && <CredentialsDialog result={result} onClose={() => setResult(null)} />}
    </Layout>
  );
}

// MODAL PARA EDITAR SOLICITUDES / TRIALS
function SolicitudDialog({ solicitud, onClose, onSave }: { solicitud: Solicitud, onClose: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState({ ...solicitud });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await supabase.from('solicitudes_registro').update({
      nombre_agencia: formData.nombre_agencia,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      codigo_postal: formData.codigo_postal,
      contacto_nombre: formData.contacto_nombre,
      telefono: formData.telefono,
      email: formData.email,
      estado: formData.estado
    }).eq('id', solicitud.id);
    setSubmitting(false); onSave();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white">Detalles de Solicitud (Trial)</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={16}/></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Agencia</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} /></div>
            <div className="col-span-2"><label className="label">Dirección</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} /></div>
            <div><label className="label">Ciudad</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} /></div>
            <div><label className="label">C.P.</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.codigo_postal} onChange={e => setFormData({...formData, codigo_postal: e.target.value})} /></div>
            <div className="col-span-2"><label className="label">Contacto</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.contacto_nombre} onChange={e => setFormData({...formData, contacto_nombre: e.target.value})} /></div>
            <div><label className="label">Teléfono</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
            <div><label className="label">Email</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div className="col-span-2"><label className="label">Estado</label><select className="input bg-ink-950 border-white/10 text-sm" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}><option value="pendiente">Pendiente</option><option value="procesado">Procesado (Trial Activo)</option><option value="rechazado">Rechazado</option></select></div>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="btn-ghost border border-white/10 px-3 py-1.5 text-xs">Cancelar</button>
            <button type="submit" disabled={submitting} className="btn-primary px-4 py-1.5 text-xs flex items-center gap-2">{submitting ? <Loader2 size={14} className="animate-spin"/> : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MODAL PARA EDITAR MENSAJES WEB
function MensajeDialog({ mensaje, onClose, onSave, onDelete }: { mensaje: MensajeContacto, onClose: () => void, onSave: () => void, onDelete: () => void }) {
  const [formData, setFormData] = useState({ ...mensaje });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await supabase.from('mensajes_contacto').update({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      mensaje: formData.mensaje,
      leido: formData.leido
    }).eq('id', mensaje.id);
    setSubmitting(false); onSave();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white">Mensaje Web de Contacto</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={16}/></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Nombre</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
            <div><label className="label">Email</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div><label className="label">Teléfono</label><input className="input bg-ink-950 border-white/10 text-sm" value={formData.telefono || ''} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
            <div className="col-span-2"><label className="label">Mensaje</label><textarea rows={5} className="input bg-ink-950 border-white/10 text-sm resize-none" value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})} /></div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="leido" checked={formData.leido} onChange={e => setFormData({...formData, leido: e.target.checked})} className="rounded bg-ink-950 border-white/20 text-brand-500 focus:ring-brand-500 focus:ring-offset-ink-900 w-4 h-4" />
              <label htmlFor="leido" className="text-sm text-white/80 cursor-pointer">Marcar como leído / Procesado</label>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-4">
            <button type="button" onClick={() => { onDelete(); onClose(); }} className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"><Trash2 size={14}/> Borrar</button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-ghost border border-white/10 px-3 py-1.5 text-xs">Cancelar</button>
              <button type="submit" disabled={submitting} className="btn-primary px-4 py-1.5 text-xs flex items-center gap-2">{submitting ? <Loader2 size={14} className="animate-spin"/> : 'Guardar Cambios'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function AgencyDialog({ agencia, onClose, onSave, onCreated }: { agencia: Agencia | 'new', onClose: () => void, onSave: () => void, onCreated: (r: CreatedResult) => void }) {
  const isEdit = agencia !== 'new';
  const ag = isEdit ? (agencia as Agencia) : null;

  const [nombre, setNombre] = useState(ag?.nombre || '');
  const [direccion, setDireccion] = useState(ag?.direccion || '');
  const [ciudad, setCiudad] = useState(ag?.ciudad || '');
  const [cp, setCp] = useState(ag?.codigo_postal || '');
  const [cNombre, setCNombre] = useState(ag?.contacto_nombre || '');
  const [cEmail, setCEmail] = useState(ag?.contacto_email || '');
  const [cTel, setCTel] = useState(ag?.contacto_telefono || '');
  const [bloqueada, setBloqueada] = useState(ag?.bloqueada || false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentesDb, setAgentesDb] = useState<Agente[]>([]);

  const effectiveSlug = isEdit ? ag!.id : slugify(nombre);

  useEffect(() => {
    if (isEdit && ag) {
      supabase.from('perfiles').select('id, email, nombre').eq('agencia_id', ag.id).then(({ data }) => { if (data) setAgentesDb(data); });
    }
  }, [isEdit, ag]);

  const handleDelete = async () => {
    if (confirm(`¿Eliminar definitivamente "${ag!.nombre}"? Esta acción borra propiedades y perfiles.`)) {
      setSubmitting(true);
      try {
        const { error: deleteError } = await supabase.from('agencias').delete().eq('id', ag!.id);
        if (deleteError) throw deleteError;
        onSave(); 
      } catch (err) { setError((err as Error).message); setSubmitting(false); }
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setSubmitting(true);
    try {
      if (isEdit && ag) {
        const { error: updateError } = await supabase.from('agencias').update({
          nombre: nombre.trim(), direccion: direccion.trim(), ciudad: ciudad.trim(), codigo_postal: cp.trim(),
          contacto_nombre: cNombre.trim(), contacto_email: cEmail.trim(), contacto_telefono: cTel.trim(),
          bloqueada
        }).eq('id', ag.id);
        if (updateError) throw updateError;
        onSave();
      } else {
        const nuevaAgencia = {
          id: effectiveSlug, nombre: nombre.trim(), direccion: direccion.trim(), ciudad: ciudad.trim(), codigo_postal: cp.trim(),
          contacto_nombre: cNombre.trim(), contacto_email: cEmail.trim(), contacto_telefono: cTel.trim(),
          bloqueada: false
        };
        const { error: insertError } = await supabase.from('agencias').insert([nuevaAgencia]);
        if (insertError) throw insertError;

        const url = import.meta.env.VITE_SUPABASE_URL || (supabase as any).supabaseUrl;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY || (supabase as any).supabaseKey;
        if (!url || !key) throw new Error("Faltan credenciales del servidor.");

        const tempClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
        const usuariosCreados = [];
        
        for (let i = 1; i <= 3; i++) {
          const userEmail = `${effectiveSlug}-${i}@inmoficina.es`;
          const userPass = Math.random().toString(36).slice(-6) + Math.floor(Math.random()*100) + "A1!";
          const { data: authData, error: authError } = await tempClient.auth.signUp({ email: userEmail, password: userPass });
          if (authError) continue;
          if (authData?.user) {
            await supabase.from('perfiles').upsert({
              id: authData.user.id, email: userEmail, nombre: `Agente ${i} - ${nombre.trim()}`, rol: 'agente', agencia_id: effectiveSlug
            });
            usuariosCreados.push({ email: userEmail, password: userPass });
          }
        }
        if (usuariosCreados.length === 0) throw new Error("Fallo al generar agentes.");
        onCreated({ agencia: nuevaAgencia as Agencia, usuarios: usuariosCreados });
      }
    } catch (err) { setError((err as Error).message); } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-ink-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between px-5 py-4 border-b border-white/5 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`h-7 w-7 rounded-md ${bloqueada ? 'bg-red-500/10 border-red-500/20' : 'bg-brand-500/10 border-brand-500/20'} flex items-center justify-center border`}><Sparkles size={14} className={bloqueada ? 'text-red-400' : 'text-brand-400'} /></div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">{isEdit ? 'Ficha de Agencia' : 'Nueva Agencia'}{bloqueada && <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[7px] font-black uppercase tracking-widest">Temporalmente Suspendida</span>}</div>
              <div className="text-[9px] text-white/40 mt-0.5">{isEdit ? `ID: ${ag.id}` : 'Genera 3 licencias automáticas'}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={onSubmit} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-3">
                <h3 className="text-[8px] font-black text-brand-400 uppercase tracking-widest border-b border-white/5 pb-1.5">Sede Principal</h3>
                <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Nombre</label><input required autoFocus className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
                <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Slug ID</label><input className="w-full font-mono text-[9px] text-white/40 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 cursor-not-allowed" value={effectiveSlug} readOnly /></div>
                <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Dirección</label><input className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={direccion} onChange={e => setDireccion(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Ciudad</label><input className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={ciudad} onChange={e => setCiudad(e.target.value)} /></div>
                  <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">C.P.</label><input className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={cp} onChange={e => setCp(e.target.value)} /></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-[8px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-1.5">Contacto Principal</h3>
                <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Responsable</label><input className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={cNombre} onChange={e => setCNombre(e.target.value)} /></div>
                <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Teléfono</label><input className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={cTel} onChange={e => setCTel(e.target.value)} /></div>
                <div><label className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1 block">Email Corp.</label><input type="email" className="w-full bg-ink-950 border border-white/10 rounded-md px-2.5 py-1.5 text-[10px] text-white focus:border-brand-500 transition-colors" value={cEmail} onChange={e => setCEmail(e.target.value)} /></div>
              </div>

              {isEdit && (
                <div className="md:col-span-2 space-y-2 pt-3 border-t border-white/5">
                  <h3 className="text-[8px] font-black text-white/30 uppercase tracking-widest">Licencias de Uso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {agentesDb.map(agente => (
                      <div key={agente.id} className="bg-white/5 border border-white/10 rounded-md p-2 flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0"><Users size={10}/></div>
                        <div className="min-w-0"><div className="text-[9px] font-bold text-white truncate">{agente.nombre}</div><div className="text-[8px] text-white/50 font-mono truncate">{agente.email}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-3 mt-4 rounded-lg border ${bloqueada ? 'bg-red-500/10 border-red-500/30' : 'bg-white/[0.01] border-white/10'} flex items-center justify-between transition-colors`}>
                     <div>
                        <h4 className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${bloqueada ? 'text-red-400' : 'text-white/60'}`}>Control de Impagos / Acceso</h4>
                        <p className="text-[9px] text-white/40 max-w-xs leading-relaxed">{bloqueada ? 'Esta agencia tiene el acceso cortado. Sus usuarios no podrán usar el CRM.' : 'Si cortas el acceso, la agencia no podrá operar pero no perderá sus datos.'}</p>
                     </div>
                     <button type="button" onClick={() => setBloqueada(!bloqueada)} className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 ${bloqueada ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30' : 'bg-white/5 text-red-400 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30'}`}>
                        {bloqueada ? <><Unlock size={10}/> REACTIVAR ACCESO</> : <><Lock size={10}/> SUSPENDER AGENCIA</>}
                     </button>
                  </div>
                </div>
              )}
            </div>
            {error && <div className="text-[9px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-2 mt-4 font-mono">{error}</div>}

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
              <div>{isEdit && <button type="button" onClick={handleDelete} disabled={submitting} className="text-red-500/50 hover:text-red-400 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1"><Trash2 size={10} /> Purgar Datos</button>}</div>
              <div className="flex items-center gap-2">
                <button type="button" className="px-3 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition" onClick={onClose} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-4 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5" disabled={submitting || !nombre}>
                  {submitting ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />} {isEdit ? 'Guardar Cambios' : 'Generar Licencias'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CredentialsDialog({ result, onClose }: { result: CreatedResult, onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-sm bg-ink-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="px-5 py-4 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400"><Check size={12} /></div>
            <div><div className="text-xs font-bold text-white">Sede Creada</div><div className="text-[8px] text-emerald-400/80 font-medium uppercase tracking-widest">Copia estos datos ahora</div></div>
          </div>
        </div>
        <div className="p-5 space-y-2">
          {result?.usuarios?.map(u => (
            <div key={u.email} className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-6 w-6 rounded-md bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0"><KeyRound size={12} /></div>
                <div className="min-w-0"><div className="text-[10px] font-bold text-white/90 truncate">{u.email}</div><div className="text-[9px] text-white/40 font-mono truncate">{u.password}</div></div>
              </div>
              <button type="button" onClick={() => { navigator.clipboard.writeText(`${u.email} / ${u.password}`); setCopied(u.email); setTimeout(() => setCopied(null), 1500); }} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all shrink-0">
                {copied === u.email ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-3">
            <button type="button" className="flex-1 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-[8px] font-bold uppercase tracking-widest transition flex justify-center items-center gap-1.5" onClick={() => {
              const text = result?.usuarios?.map(u => `${u.email} / ${u.password}`).join('\n') || ''; navigator.clipboard.writeText(text); setCopied('all'); setTimeout(() => setCopied(null), 1500);
            }}>{copied === 'all' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />} Copiar todo</button>
            <button type="button" className="btn-primary flex-1 py-1.5 text-[8px] font-bold uppercase tracking-widest" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}