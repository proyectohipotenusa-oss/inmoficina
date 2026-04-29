import { useEffect, useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useLocation } from 'wouter';
import {
  Shield, Plus, Building2, Loader2, Copy, Check, X, Users, Sparkles, ChevronRight, MapPin, Trash2,
  TrendingUp, CheckCircle, Phone, CalendarDays, MessageSquare, LogOut
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { supabase } from '../lib/supabase';

interface Agencia {
  id: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  licencia?: string;
  contacto_nombre?: string;
  contacto_email?: string;
  contacto_telefono?: string;
  created_at: string;
  bloqueada?: boolean;
  plan?: string;
}

interface Solicitud {
  id: string;
  estado: string;
  nombre_agencia: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  contacto_nombre: string;
  telefono: string;
  email: string;
  created_at: string;
}

interface MensajeContacto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

interface CreatedResult {
  agencia: Agencia;
  usuarios: { email: string; password: string }[];
}

function slugify(raw: string) {
  if (!raw) return '';
  return String(raw).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
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
    
    setStats({
      total: perfiles?.length || 0,
      ingresos: totalAgencias * 49,
      agencias: totalAgencias
    });
    
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setLocation('/login');
    }
  };

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

  const pendingTrials = solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'rechazado').map(s => ({ ...s, tipoEntrada: 'trial', sortDate: new Date(s.created_at).getTime() }));
  const pendingMessages = mensajes.filter(m => !m.leido).map(m => ({ ...m, tipoEntrada: 'mensaje', sortDate: new Date(m.created_at).getTime() }));
  const bandejaEntrada = [...pendingTrials, ...pendingMessages].sort((a, b) => b.sortDate - a.sortDate);

  const activeTrials = solicitudes
    .filter(s => s.estado === 'procesado')
    .map(s => {
      const created = new Date(s.created_at);
      const expires = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000); 
      const daysLeft = Math.ceil((expires.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return { ...s, expires, daysLeft };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const historialMensajes = mensajes.filter(m => m.leido);

  return (
    <Layout title="Panel Admin">
      <PageHeader
        title="SÚPER ADMINISTRADOR"
        titleClassName="text-[14px] md:text-[18px] uppercase tracking-tighter"
        subtitle="Centro de mando unificado para agencias, solicitudes y mensajes web."
        actions={
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedAgencia('new')} className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
              <Plus size={14} /> Nueva Agencia
            </button>
            <button onClick={handleSignOut} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 bg-ink-900 border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20"><Users size={18} className="text-brand-400"/></div>
           <div><p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Usuarios</p><p className="text-2xl font-black text-white leading-none">{stats.total}</p></div>
        </div>
        <div className="card p-4 bg-ink-900 border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20"><TrendingUp size={18} className="text-emerald-400"/></div>
           <div><p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">MRR (Mes)</p><p className="text-2xl font-black text-emerald-400 leading-none">{stats.ingresos}€</p></div>
        </div>
        <div className="card p-4 bg-ink-900 border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20"><Building2 size={18} className="text-indigo-400"/></div>
           <div><p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Agencias</p><p className="text-2xl font-black text-white leading-none">{stats.agencias}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-1.5"><Users size={14}/> Bandeja de Entrada</h3>
            <button onClick={loadData} className="text-[9px] font-bold text-white/40 hover:text-white transition uppercase tracking-widest">Actualizar</button>
          </div>
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-brand-400" size={20} /></div>
          ) : bandejaEntrada.length === 0 ? (
            <div className="card p-6 text-center bg-white/[0.01] text-white/20 text-[10px] font-bold uppercase tracking-widest border-dashed border border-white/10">Bandeja limpia</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {bandejaEntrada.map((item: any) => {
                const isTrial = item.tipoEntrada === 'trial';
                return (
                  <div key={`${item.tipoEntrada}-${item.id}`} onClick={() => isTrial ? setSelectedSolicitud(item) : setSelectedMensaje(item)} className={`card p-4 bg-ink-900 border-white/5 flex flex-col gap-3 transition-all cursor-pointer hover:border-white/20 border-l-2 shadow-md ${isTrial ? (item.estado === 'rechazado' ? 'opacity-40 grayscale border-l-red-500' : 'border-l-brand-500 shadow-brand-500/10') : 'border-l-purple-500 shadow-purple-500/10 bg-white/[0.01]'}`}>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-3">
                        <div className="text-xs font-bold text-white truncate uppercase mb-1">{isTrial ? item.nombre_agencia : item.nombre}</div>
                        <div className={`text-[8px] font-black px-2 py-0.5 rounded w-fit uppercase tracking-widest ${isTrial ? 'bg-brand-500/20 text-brand-400' : 'bg-purple-500/20 text-purple-400'}`}>{isTrial ? `Trial: ${item.estado}` : 'Mensaje Web'}</div>
                      </div>
                      <div className="text-[9px] font-medium text-white/40 shrink-0">{new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                    {isTrial ? (
                      <div className="text-[10px] text-white/50 flex items-center gap-1.5 truncate"><MapPin size={10} className="text-white/30 shrink-0" /> {item.ciudad}</div>
                    ) : (
                      <div className="text-[10px] text-white/60 italic truncate leading-relaxed">"{item.mensaje}"</div>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      {isTrial ? (
                        item.estado === 'pendiente' ? (
                          <><button onClick={(e) => { e.stopPropagation(); actualizarEstadoTrial(item.id, 'procesado'); }} className="flex-1 py-1.5 rounded-lg bg-brand-500/20 text-brand-400 text-[9px] font-bold hover:bg-brand-500 hover:text-white transition uppercase flex items-center justify-center gap-1"><CheckCircle size={12}/> Activar</button><button onClick={(e) => { e.stopPropagation(); actualizarEstadoTrial(item.id, 'rechazado'); }} className="py-1.5 px-3 rounded-lg bg-red-500/10 text-red-400 text-[9px] font-bold hover:bg-red-500 hover:text-white transition uppercase"><X size={12}/></button></>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); actualizarEstadoTrial(item.id, 'pendiente'); }} className="w-full py-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition text-[9px] font-bold uppercase tracking-widest">Revertir a Pendiente</button>
                        )
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); marcarMensajeLeido(item.id, true); }} className="w-full py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-[9px] font-bold hover:bg-purple-500 hover:text-white transition uppercase tracking-widest flex items-center justify-center gap-1"><CheckCircle size={12}/> Marcar Leído</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5"><CalendarDays size={14}/> Agenda de Trials</h3>
              <span className="text-[9px] font-bold text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-md">{activeTrials.length} Activos</span>
            </div>
            {loading ? (
              <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-emerald-400" size={20} /></div>
            ) : activeTrials.length === 0 ? (
              <div className="card p-6 text-center bg-white/[0.01] text-white/20 text-[10px] font-bold uppercase tracking-widest border-dashed border border-white/10">No hay trials activos</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {activeTrials.map(t => {
                  const isExpired = t.daysLeft <= 0;
                  const isUrgent = !isExpired && t.daysLeft <= 3;
                  const colorClass = isExpired ? 'text-red-400 bg-red-400/10 border-red-400/20' : isUrgent ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                  return (
                    <div key={t.id} onClick={() => setSelectedSolicitud(t)} className="card p-3 bg-ink-900 border-white/5 flex items-center justify-between gap-4 cursor-pointer hover:border-white/20 transition-colors shadow-sm">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white uppercase truncate mb-1">{t.nombre_agencia}</div>
                        <div className="text-[9px] text-white/50 flex flex-col gap-0.5 truncate">
                          <span><Users size={10} className="inline mr-1 opacity-50"/>{t.contacto_nombre}</span>
                          <span><Phone size={10} className="inline mr-1 opacity-50"/>{t.telefono}</span>
                        </div>
                      </div>
                      <div className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl border ${colorClass}`}>
                        <div className="text-xl font-black leading-none mb-0.5">{isExpired ? '0' : t.daysLeft}</div>
                        <div className="text-[7px] uppercase tracking-widest font-bold opacity-80">{isExpired ? 'Caducado' : 'Días'}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-1.5"><MessageSquare size={14}/> Mensajes Web</h3>
            <span className="text-[9px] font-bold text-purple-400/80 bg-purple-400/10 px-2 py-0.5 rounded-md">{historialMensajes.length} Leídos</span>
          </div>
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-purple-400" size={20} /></div>
          ) : historialMensajes.length === 0 ? (
            <div className="card p-6 text-center bg-white/[0.01] text-white/20 text-[10px] font-bold uppercase tracking-widest border-dashed border border-white/10">Historial vacío</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {historialMensajes.map(m => (
                <div key={m.id} onClick={() => setSelectedMensaje(m)} className="card p-4 bg-ink-900 border-white/5 opacity-60 hover:opacity-100 cursor-pointer transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-white truncate pr-2">{m.nombre}</div>
                    <div className="text-[9px] text-white/40 shrink-0 mt-0.5">{new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[10px] text-white/50 italic truncate leading-relaxed">"{m.mensaje}"</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-4 mt-12"><Building2 size={16} className="inline mr-2"/> Base de Datos de Agencias</h3>
      <div className="card p-0 overflow-hidden shadow-xl border-white/5 bg-ink-900/50 mb-12">
        {loading ? (
          <div className="py-16 flex justify-center text-white/20"><Loader2 className="animate-spin" size={24} /></div>
        ) : agencias.length === 0 ? (
          <EmptyState icon={Shield} title="Todavía no has creado agencias" description="Crea una agencia para generar sus credenciales de acceso." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10 bg-white/[0.02]">
                  <th className="px-5 py-4 font-bold">Agencia</th>
                  <th className="px-5 py-4 font-bold">Plan</th>
                  <th className="px-5 py-4 font-bold">Slug ID</th>
                  <th className="px-5 py-4 font-bold">Contacto</th>
                  <th className="px-5 py-4 font-bold">Alta</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agencias.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedAgencia(a)} className={`hover:bg-white/[0.03] transition-colors group cursor-pointer ${a.bloqueada ? 'bg-red-500/[0.02]' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${a.bloqueada ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-brand-500/10 border-brand-500/20 text-brand-400'}`}>
                          {a.nombre ? a.nombre.slice(0, 1).toUpperCase() : 'A'}
                        </div>
                        <div className={`font-bold text-[13px] truncate max-w-[200px] ${a.bloqueada ? 'text-white/40 line-through' : 'text-white'}`}>{a.nombre}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className={`text-[9px] font-bold px-2 py-1 rounded-md w-fit uppercase tracking-widest border ${a.plan === 'premium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/5 border-white/10 text-white/60'}`}>{a.plan || 'ESTÁNDAR'}</div></td>
                    <td className="px-5 py-4"><code className="text-xs text-white/40 font-mono px-2 py-1 bg-white/5 rounded-md border border-white/5">{a.id}</code></td>
                    <td className="px-5 py-4 text-xs text-white/50">{a.contacto_nombre || '—'}</td>
                    <td className="px-5 py-4 text-white/40 text-[11px] font-medium">{new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-right"><ChevronRight size={16} className="text-white/10 group-hover:text-white/40 ml-auto transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAgencia && <AgencyDialog agencia={selectedAgencia} onClose={() => setSelectedAgencia(null)} onSave={() => { setSelectedAgencia(null); loadData(); }} onCreated={(res: CreatedResult) => { setSelectedAgencia(null); setResult(res); loadData(); }} />}
      {selectedSolicitud && <SolicitudDialog solicitud={selectedSolicitud} onClose={() => setSelectedSolicitud(null)} onSave={() => { setSelectedSolicitud(null); loadData(); }} />}
      {selectedMensaje && <MensajeDialog mensaje={selectedMensaje} onClose={() => setSelectedMensaje(null)} onSave={() => { setSelectedMensaje(null); loadData(); }} onDelete={() => borrarMensaje(selectedMensaje.id)} />}
      {result && <CredentialsDialog result={result} onClose={() => setResult(null)} />}
    </Layout>
  );
}

// ---------------------------
// DIALOGOS (AGENCIA / MENSAJES / SOLICITUD)
// ---------------------------
function AgencyDialog({ agencia, onClose, onSave, onCreated }: any) {
  const isEdit = agencia !== 'new';
  const ag = isEdit ? agencia : null;
  const [nombre, setNombre] = useState(ag?.nombre || '');
  const [direccion, setDireccion] = useState(ag?.direccion || '');
  const [ciudad, setCiudad] = useState(ag?.ciudad || '');
  const [cp, setCp] = useState(ag?.codigo_postal || '');
  const [licencia, setLicencia] = useState(ag?.licencia || '');
  const [plan, setPlan] = useState(ag?.plan || 'premium');
  const [cNombre, setCNombre] = useState(ag?.contacto_nombre || '');
  const [cEmail, setCEmail] = useState(ag?.contacto_email || '');
  const [cTel, setCTel] = useState(ag?.contacto_telefono || '');
  const [bloqueada, setBloqueada] = useState(ag?.bloqueada || false);
  const [submitting, setSubmitting] = useState(false);

  const effectiveSlug = isEdit ? ag.id : slugify(nombre);

  const handleDelete = async () => {
    if (confirm(`¿Eliminar definitivamente "${ag!.nombre}"? Esta acción borra propiedades y perfiles.`)) {
      setSubmitting(true);
      await supabase.from('agencias').delete().eq('id', ag!.id);
      onSave(); 
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const payload = { 
      id: effectiveSlug, nombre: nombre.trim(), direccion: direccion.trim(), ciudad: ciudad.trim(), 
      codigo_postal: cp.trim(), licencia: licencia.trim(), plan, contacto_nombre: cNombre.trim(), 
      contacto_email: cEmail.trim(), contacto_telefono: cTel.trim(), bloqueada 
    };
    if (isEdit) { await supabase.from('agencias').update(payload).eq('id', ag.id); } 
    else {
      await supabase.from('agencias').insert([payload]);
      const url = import.meta.env.VITE_SUPABASE_URL || (supabase as any).supabaseUrl;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY || (supabase as any).supabaseKey;
      const tempClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const creds = [];
      const numUsers = plan === 'estandar' ? 1 : 3;
      for (let i = 1; i <= numUsers; i++) {
        const email = `${effectiveSlug}-${i}@inmoficina.es`; 
        const pass = Math.random().toString(36).slice(-8) + "!";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center"><Sparkles className="text-brand-400" size={20} /></div><div><h2 className="text-lg font-bold text-white tracking-tight">{isEdit ? 'Editar Agencia' : 'Nueva agencia'}</h2></div></div>
          <button type="button" onClick={onClose} className="p-2 text-white/40 hover:text-white"><X size={20} /></button>
        </div>
        <form id="agency-form" onSubmit={onSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
           <div className="space-y-2"><label className="text-[11px] font-bold uppercase tracking-widest text-white/60">Nombre de la agencia *</label><input required className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
           <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[11px] font-bold uppercase tracking-widest text-white/60">Slug / ID</label><input className="w-full bg-ink-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/40 font-mono cursor-not-allowed" value={effectiveSlug} readOnly /></div><div className="space-y-2"><label className="text-[11px] font-bold uppercase tracking-widest text-white/60">Nº de licencia</label><input className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={licencia} onChange={e => setLicencia(e.target.value)} /></div></div>
           <div className="pt-4 border-t border-white/5"><div className="grid grid-cols-3 gap-4"><div className="space-y-2 col-span-1"><label className="text-[11px] font-bold uppercase tracking-widest text-white/60">Plan Contratado</label><select className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={plan} onChange={e => setPlan(e.target.value)}><option value="estandar">Estándar (29€)</option><option value="premium">Premium (49€)</option></select></div></div></div>
           {isEdit && (<div className="pt-4 border-t border-white/5"><label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-red-500/20 bg-red-500/5"><input type="checkbox" checked={bloqueada} onChange={e => setBloqueada(e.target.checked)} className="w-5 h-5 rounded bg-ink-950 text-red-500" /><div><span className="text-sm font-bold text-red-400">Suspender acceso</span></div></label></div>)}
        </form>
        <div className="px-6 py-4 border-t border-white/5 bg-ink-950 flex items-center justify-between shrink-0">
           {isEdit ? <button type="button" onClick={handleDelete} className="text-red-400 text-xs font-bold uppercase"><Trash2 size={16} className="inline mr-2"/> Eliminar</button> : <div/>}
           <div className="flex gap-3"><button type="button" onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase text-white/50">Cancelar</button><button type="submit" form="agency-form" className="px-8 py-3 rounded-xl bg-brand-600 text-white text-xs font-bold uppercase">Guardar</button></div>
        </div>
      </div>
    </div>
  );
}

function SolicitudDialog({ solicitud, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ ...solicitud });
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: FormEvent) => { e.preventDefault(); setSubmitting(true); await supabase.from('solicitudes_registro').update(formData).eq('id', solicitud.id); setSubmitting(false); onSave(); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"><div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-up"><div className="flex justify-between items-center mb-6"><h3 className="text-sm font-bold text-white uppercase">Editar Solicitud</h3><button onClick={onClose} className="text-white/40 hover:text-white"><X size={20}/></button></div><form onSubmit={onSubmit} className="space-y-4"><input className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={formData.nombre_agencia} onChange={e => setFormData({...formData, nombre_agencia: e.target.value})} /><button type="submit" className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold uppercase text-xs">Guardar Cambios</button></form></div></div>
  );
}

function MensajeDialog({ mensaje, onClose, onSave, onDelete }: any) {
  const [formData, setFormData] = useState({ ...mensaje });
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: FormEvent) => { e.preventDefault(); setSubmitting(true); await supabase.from('mensajes_contacto').update(formData).eq('id', mensaje.id); setSubmitting(false); onSave(); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"><div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-up"><div className="flex justify-between items-center mb-6"><h3 className="text-sm font-bold text-white uppercase">Mensaje Contacto</h3><button onClick={onClose} className="text-white/40 hover:text-white"><X size={20}/></button></div><form onSubmit={onSubmit} className="space-y-4"><input className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /><textarea rows={5} className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})} /><label className="flex items-center gap-3"><input type="checkbox" checked={formData.leido} onChange={e => setFormData({...formData, leido: e.target.checked})} className="w-5 h-5 rounded bg-ink-950 text-brand-500" /><span className="text-sm text-white">Marcar como procesado</span></label><div className="flex gap-3"><button type="button" onClick={() => { onDelete(); onClose(); }} className="px-6 py-3.5 bg-red-500/10 text-red-400 rounded-xl font-bold uppercase text-xs">Borrar</button><button type="submit" className="flex-1 py-3.5 bg-brand-600 text-white rounded-xl font-bold uppercase text-xs">Guardar Cambios</button></div></form></div></div>
  );
}

function CredentialsDialog({ result, onClose }: any) {
  const [copied, setCopied] = useState<any>(null);
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink-950/90 backdrop-blur-sm animate-fade-in"><div className="relative w-full max-w-sm bg-ink-900 border border-white/10 rounded-2xl p-8 shadow-2xl text-center animate-slide-up"><h3 className="text-xl font-bold text-white mb-2">Agencia Creada</h3><div className="space-y-3 mb-8">{result.usuarios.map((u: any, i: number) => (<div key={i} className="p-4 bg-ink-950 border border-white/10 rounded-xl flex justify-between items-center"><div className="text-left"><div className="text-[11px] font-bold text-white mb-0.5">{u.email}</div><div className="text-[10px] text-white/40">{u.password}</div></div><button onClick={() => { navigator.clipboard.writeText(`${u.email} / ${u.password}`); setCopied(i); setTimeout(() => setCopied(null), 1500); }} className="p-2 text-white/40">{copied === i ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}</button></div>))}</div><button onClick={onClose} className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold uppercase text-xs">Entendido</button></div></div>
  );
}