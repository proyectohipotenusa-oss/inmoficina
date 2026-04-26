import { useEffect, useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Shield, Plus, Building2, Loader2, Copy, Check, X, Users, KeyRound, AlertCircle, Sparkles, ChevronRight, MapPin, Trash2,
  TrendingUp, CheckCircle, XCircle, Phone, Mail, CalendarDays, Timer, Lock
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { supabase } from '../lib/supabase';

interface Agencia {
  id: string;
  nombre: string;
  licencia: string;
  direccion?: string;
  contacto_nombre?: string;
  contacto_email?: string;
  contacto_telefono?: string;
  created_at: string;
  bloqueada?: boolean;
}

interface Agente {
  id: string;
  email: string;
  nombre: string;
}

interface CreatedUser {
  email: string;
  password: string;
}

interface CreatedResult {
  agencia: Agencia;
  usuarios: CreatedUser[];
}

function slugify(raw: string) {
  if (!raw) return '';
  return String(raw).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

export default function AdminPanel() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, ingresos: 0, agencias: 0 });
  const [selectedAgencia, setSelectedAgencia] = useState<Agencia | 'new' | null>(null);
  const [result, setResult] = useState<CreatedResult | null>(null);

  const loadData = async () => {
    setLoading(true);
    
    // 1. Cargar Agencias reales
    const { data: ags } = await supabase.from('agencias').select('*').order('created_at', { ascending: false });
    if (ags) setAgencias(ags as Agencia[]);

    // 2. Cargar Solicitudes de la Landing
    const { data: sols } = await supabase.from('solicitudes_registro').select('*').order('created_at', { ascending: false });
    setSolicitudes(sols || []);

    // 3. Cargar Estadísticas
    const { data: perfiles } = await supabase.from('perfiles').select('rol');
    const totalAgencias = ags ? ags.length : 0;
    
    setStats({
      total: perfiles?.length || 0,
      ingresos: totalAgencias * 49,
      agencias: totalAgencias
    });
    
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await supabase.from('solicitudes_registro').update({ estado: nuevoEstado }).eq('id', id);
    loadData();
  };

  const pendingLeads = solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'rechazado');
  
  const activeTrials = solicitudes
    .filter(s => s.estado === 'procesado')
    .map(s => {
      const created = new Date(s.created_at);
      const expires = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000); 
      const daysLeft = Math.ceil((expires.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return { ...s, expires, daysLeft };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft); 

  return (
    <Layout title="Panel Admin">
      <PageHeader
        title="SuperAdmin"
        subtitle="Centro de mando: embudo de ventas, agenda de trials y gestión de agencias."
        actions={
          <button type="button" className="btn-primary py-2 text-xs" onClick={() => setSelectedAgencia('new')}>
            <Plus size={14} /> Nueva Agencia
          </button>
        }
      />

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 bg-ink-900 border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0"><Users size={18} className="text-brand-400"/></div>
           <div><p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Usuarios Activos</p><p className="text-xl font-black text-white leading-none mt-1">{stats.total}</p></div>
        </div>
        <div className="card p-4 bg-ink-900 border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><TrendingUp size={18} className="text-emerald-400"/></div>
           <div><p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">MRR (Mes)</p><p className="text-xl font-black text-emerald-400 leading-none mt-1">{stats.ingresos}€</p></div>
        </div>
        <div className="card p-4 bg-ink-900 border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0"><Building2 size={18} className="text-indigo-400"/></div>
           <div><p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Agencias Clientes</p><p className="text-xl font-black text-white leading-none mt-1">{stats.agencias}</p></div>
        </div>
      </div>

      {/* ZONA DIVIDIDA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* COLUMNA IZQUIERDA: LEADS FRESCOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2"><Users size={14}/> Bandeja de Leads</h3>
            <button onClick={loadData} className="text-[9px] font-bold text-white/40 hover:text-white transition">Actualizar</button>
          </div>

          {loading ? <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-brand-400" size={20} /></div> : pendingLeads.length === 0 ? <div className="card p-6 text-center bg-white/[0.01] text-white/20 text-[10px] font-bold uppercase tracking-widest border-dashed border border-white/10">Bandeja limpia</div> : (
            <div className="grid grid-cols-1 gap-3">
              {pendingLeads.map(s => (
                <div key={s.id} className={`card p-4 bg-ink-900 border-white/5 flex flex-col gap-3 transition-all ${s.estado === 'rechazado' ? 'opacity-40 grayscale' : 'border-l-2 border-l-brand-500 shadow-lg'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white uppercase truncate">{s.nombre_agencia}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${s.estado === 'pendiente' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>{s.estado}</span>
                      </div>
                      <div className="text-[10px] text-white/50 flex items-center gap-1.5"><MapPin size={10} className="text-white/30" /> {s.direccion || 'Sin dirección'}</div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Recibida</p>
                       <p className="text-[9px] font-bold text-white/50">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-white/60 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                     <div className="flex items-center gap-1.5 truncate"><Users size={10} className="text-brand-400 shrink-0" /> {s.contacto_nombre}</div>
                     <div className="flex items-center gap-1.5 truncate"><Phone size={10} className="text-brand-400 shrink-0" /> {s.telefono}</div>
                     <div className="col-span-2 flex items-center gap-1.5 truncate"><Mail size={10} className="text-brand-400 shrink-0" /> {s.email}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {s.estado === 'pendiente' ? (
                      <>
                        <button onClick={() => actualizarEstado(s.id, 'procesado')} className="flex-1 py-1.5 rounded bg-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white transition text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"><CheckCircle size={12}/> Activar Trial</button>
                        <button onClick={() => actualizarEstado(s.id, 'rechazado')} className="py-1.5 px-3 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition text-[9px] font-black uppercase tracking-widest"><X size={12}/></button>
                      </>
                    ) : (
                      <button onClick={() => actualizarEstado(s.id, 'pendiente')} className="w-full py-1.5 rounded bg-white/5 text-white/40 hover:bg-white/10 transition text-[9px] font-black uppercase tracking-widest">Revertir a Pendiente</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: AGENDA DE FREE-TRIALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2"><CalendarDays size={14}/> Agenda de Seguimiento</h3>
            <span className="text-[9px] font-bold text-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 rounded-full">{activeTrials.length} Activos</span>
          </div>

          {loading ? <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-emerald-400" size={20} /></div> : activeTrials.length === 0 ? <div className="card p-6 text-center bg-white/[0.01] text-white/20 text-[10px] font-bold uppercase tracking-widest border-dashed border border-white/10">No hay trials activos</div> : (
            <div className="grid grid-cols-1 gap-3">
              {activeTrials.map(t => {
                const isExpired = t.daysLeft <= 0;
                const isUrgent = !isExpired && t.daysLeft <= 3;
                const colorClass = isExpired ? 'text-red-400 bg-red-400/10 border-red-400/20' : isUrgent ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                
                return (
                  <div key={t.id} className="card p-3 bg-ink-900 border-white/5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white uppercase truncate mb-0.5">{t.nombre_agencia}</div>
                      <div className="text-[9px] text-white/50 flex items-center gap-2 truncate">
                        <span><Users size={8} className="inline mr-1 opacity-50"/>{t.contacto_nombre}</span>
                        <span><Phone size={8} className="inline mr-1 opacity-50"/>{t.telefono}</span>
                      </div>
                    </div>
                    
                    <div className={`shrink-0 flex items-center gap-3 px-3 py-1.5 rounded-lg border ${colorClass}`}>
                      <Timer size={16} className={isExpired ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-emerald-400'} />
                      <div className="text-right">
                        <div className="text-sm font-black leading-none">{isExpired ? '0' : t.daysLeft}</div>
                        <div className="text-[7px] uppercase tracking-widest font-bold opacity-80">{isExpired ? 'Caducado' : 'Días Rest.'}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. TABLA DE AGENCIAS REALES COMPACTADA */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-3 flex items-center gap-2"><Building2 size={14}/> Base de Datos de Agencias</h3>
      <div className="card p-0 overflow-hidden shadow-2xl border-white/5 bg-ink-900/50 mb-10">
        
        {loading ? (
          <div className="py-16 flex justify-center text-white/20"><Loader2 className="animate-spin" size={20} /></div>
        ) : agencias.length === 0 ? (
          <EmptyState icon={Shield} title="Todavía no has creado agencias" description="Crea una agencia para generar sus credenciales de acceso." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] uppercase tracking-[0.15em] text-white/30 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-4 py-3 font-bold">Agencia</th>
                  <th className="px-4 py-3 font-bold">Slug ID</th>
                  <th className="px-4 py-3 font-bold">Contacto</th>
                  <th className="px-4 py-3 font-bold">Licencia</th>
                  <th className="px-4 py-3 font-bold">Alta</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agencias.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedAgencia(a)} className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${a.bloqueada ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-md ${a.bloqueada ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-brand-500/20 text-brand-400 border-brand-500/30'} flex items-center justify-center text-xs font-black shrink-0`}>
                          {a.bloqueada ? <Lock size={12} /> : (a.nombre ? a.nombre.slice(0, 1).toUpperCase() : 'A')}
                        </div>
                        <div className="min-w-0 flex items-center gap-2">
                           <div className="font-bold text-white text-[11px] group-hover:text-brand-400 transition-colors truncate max-w-[150px]">{a.nombre}</div>
                           {a.bloqueada && <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[7px] font-black uppercase tracking-widest shrink-0">Bloqueada</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><code className="text-[9px] text-white/40 bg-white/5 rounded px-1.5 py-0.5 font-mono">{a.id}</code></td>
                    <td className="px-4 py-3 text-white/60 text-[10px] truncate max-w-[120px]">{a.contacto_nombre || '—'}</td>
                    <td className="px-4 py-3 text-white/40 font-mono text-[9px] tracking-tight">{a.licencia || '—'}</td>
                    <td className="px-4 py-3 text-white/40 text-[10px] font-medium">
                      {new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-right"><ChevronRight size={14} className="text-white/10 group-hover:text-white/40 ml-auto transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAgencia && (
        <AgencyDialog 
          agencia={selectedAgencia} 
          onClose={() => setSelectedAgencia(null)} 
          onSave={() => { setSelectedAgencia(null); loadData(); }}
          onCreated={(res) => { setSelectedAgencia(null); setResult(res); loadData(); }} 
        />
      )}
      
      {result && <CredentialsDialog result={result} onClose={() => setResult(null)} />}
    </Layout>
  );
}

function AgencyDialog({ agencia, onClose, onSave, onCreated }: { agencia: Agencia | 'new', onClose: () => void, onSave: () => void, onCreated: (r: CreatedResult) => void }) {
  const isEdit = agencia !== 'new';
  const ag = isEdit ? (agencia as Agencia) : null;

  const [nombre, setNombre] = useState(ag?.nombre || '');
  const [licencia, setLicencia] = useState(ag?.licencia || '');
  const [direccion, setDireccion] = useState(ag?.direccion || '');
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
    if (confirm(`¿Eliminar definitivamente "${ag!.nombre}"?`)) {
      setSubmitting(true);
      try {
        const { error: deleteError } = await supabase.from('agencias').delete().eq('id', ag!.id);
        if (deleteError) throw deleteError;
        onSave(); 
      } catch (err: any) { setError(err.message); setSubmitting(false); }
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setSubmitting(true);
    try {
      if (isEdit && ag) {
        const { error: updateError } = await supabase.from('agencias').update({
          nombre: nombre.trim(), licencia: licencia.trim(), direccion: direccion.trim(),
          contacto_nombre: cNombre.trim(), contacto_email: cEmail.trim(), contacto_telefono: cTel.trim(),
          bloqueada
        }).eq('id', ag.id);
        if (updateError) throw updateError;
        onSave();
      } else {
        const nuevaAgencia = {
          id: effectiveSlug, nombre: nombre.trim(), licencia: licencia.trim(), direccion: direccion.trim(),
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
      <div className="relative w-full max-w-3xl bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg ${bloqueada ? 'bg-red-500/15 border-red-500/20' : 'bg-brand-500/15 border-brand-500/20'} flex items-center justify-center border`}><Sparkles size={16} className={bloqueada ? 'text-red-400' : 'text-brand-400'} /></div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                 {isEdit ? 'Editar Agencia' : 'Nueva Agencia'}
                 {bloqueada && <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest">Bloqueada</span>}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">{isEdit ? `ID: ${ag.id}` : 'Genera 3 licencias automáticas'}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={onSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="space-y-4">
                <h3 className="text-[9px] font-black text-brand-400 uppercase tracking-widest border-b border-white/5 pb-2">Sede Principal</h3>
                <div><label className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Nombre</label><input required autoFocus className="w-full bg-ink-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
                <div>
                  <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Slug ID</label>
                  <input className="w-full font-mono text-[10px] text-white/40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 cursor-not-allowed" value={effectiveSlug} readOnly />
                </div>
                <div><label className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Dirección</label><input className="w-full bg-ink-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors" value={direccion} onChange={e => setDireccion(e.target.value)} /></div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[9px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Contacto</h3>
                <div><label className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Responsable</label><input className="w-full bg-ink-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors" value={cNombre} onChange={e => setCNombre(e.target.value)} /></div>
                <div><label className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Teléfono</label><input className="w-full bg-ink-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors" value={cTel} onChange={e => setCTel(e.target.value)} /></div>
                <div><label className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Email</label><input type="email" className="w-full bg-ink-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 transition-colors" value={cEmail} onChange={e => setCEmail(e.target.value)} /></div>
              </div>

              {isEdit && (
                <div className="md:col-span-2 space-y-3 pt-4 border-t border-white/5">
                  <h3 className="text-[9px] font-black text-white/30 uppercase tracking-widest">Usuarios Activos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {agentesDb.map(agente => (
                      <div key={agente.id} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0"><Users size={12}/></div>
                        <div className="min-w-0"><div className="text-[10px] font-bold text-white truncate">{agente.nombre}</div><div className="text-[9px] text-white/50 font-mono truncate">{agente.email}</div></div>
                      </div>
                    ))}
                  </div>

                  {/* CONTROLES DE BLOQUEO (SÓLO ADMIN) */}
                  <div className={`p-4 mt-4 rounded-xl border ${bloqueada ? 'bg-red-500/10 border-red-500/20' : 'bg-white/[0.02] border-white/5'} flex items-center justify-between transition-colors`}>
                     <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${bloqueada ? 'text-red-400' : 'text-white/60'}`}>Control de Acceso</h4>
                        <p className="text-[10px] text-white/40 max-w-sm leading-relaxed">
                           Si suspendes esta agencia, podrás programar más adelante que sus agentes sean expulsados del sistema temporalmente.
                        </p>
                     </div>
                     <button type="button" onClick={() => setBloqueada(!bloqueada)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${bloqueada ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                        {bloqueada ? <><Lock size={12}/> SUSPENDIDA</> : 'Suspender Acceso'}
                     </button>
                  </div>
                </div>
              )}
            </div>

            {error && <div className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-6 font-mono">{error}</div>}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
              <div>{isEdit && <button type="button" onClick={handleDelete} disabled={submitting} className="text-red-500/70 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Trash2 size={12} /> Eliminar</button>}</div>
              <div className="flex items-center gap-2">
                <button type="button" className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition" onClick={onClose} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn-primary py-2 px-6 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2" disabled={submitting || !nombre}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} {isEdit ? 'Guardar Cambios' : 'Crear Sede'}
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
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="px-6 py-5 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400"><Check size={16} /></div>
            <div><div className="text-sm font-bold text-white">Sede Creada</div><div className="text-[9px] text-emerald-400/80 font-medium uppercase tracking-widest">Copia estos datos ahora</div></div>
          </div>
        </div>
        <div className="p-6 space-y-2">
          {result?.usuarios?.map(u => (
            <div key={u.email} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0"><KeyRound size={14} /></div>
                <div className="min-w-0"><div className="text-[11px] font-bold text-white/90 truncate">{u.email}</div><div className="text-[10px] text-white/40 font-mono truncate">{u.password}</div></div>
              </div>
              <button type="button" onClick={() => { navigator.clipboard.writeText(`${u.email} / ${u.password}`); setCopied(u.email); setTimeout(() => setCopied(null), 1500); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all shrink-0">
                {copied === u.email ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
          <div className="flex items-center gap-3 pt-4">
            <button type="button" className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition flex justify-center items-center gap-2" onClick={() => {
              const text = result?.usuarios?.map(u => `${u.email} / ${u.password}`).join('\n') || ''; navigator.clipboard.writeText(text); setCopied('all'); setTimeout(() => setCopied(null), 1500);
            }}>{copied === 'all' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />} Copiar todo</button>
            <button type="button" className="btn-primary flex-1 py-2 text-[10px] font-bold uppercase tracking-widest" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}