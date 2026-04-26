import { useEffect, useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Shield, Plus, Building2, Loader2, Copy, Check, X, Users, KeyRound, AlertCircle, Sparkles, ChevronRight, MapPin, Trash2
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
  const [loading, setLoading] = useState(true);
  const [selectedAgencia, setSelectedAgencia] = useState<Agencia | 'new' | null>(null);
  const [result, setResult] = useState<CreatedResult | null>(null);

  const loadAgencias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('agencias')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAgencias(data as Agencia[]);
    setLoading(false);
  };

  useEffect(() => { loadAgencias(); }, []);

  return (
    <Layout title="Panel Admin">
      <PageHeader
        title="Panel Admin"
        subtitle="Crea agencias y gestiona sus datos de contacto y usuarios."
        actions={
          <button type="button" className="btn-primary" onClick={() => setSelectedAgencia('new')}>
            <Plus size={16} /> Nueva agencia
          </button>
        }
      />

      <div className="card p-0 overflow-hidden shadow-2xl border-white/5 bg-ink-900/50">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 bg-white/[0.01]">
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-400">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Agencias registradas</div>
            <div className="text-[11px] text-white/40 uppercase tracking-widest font-bold">
              {loading ? 'Cargando...' : `${agencias.length} agencias`}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-20 flex justify-center text-white/20"><Loader2 className="animate-spin" size={24} /></div>
        ) : agencias.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="Todavía no has creado agencias"
            description="Al crear una agencia, se generarán automáticamente sus usuarios de acceso."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-white/20 border-b border-white/5">
                  <th className="px-6 py-4">Agencia</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Usuarios</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Licencia</th>
                  <th className="px-6 py-4">Creada</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agencias.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedAgencia(a)} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-brand-500/20 shrink-0">
                          {a.nombre ? a.nombre.slice(0, 1).toUpperCase() : 'A'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-brand-400 transition-colors truncate">{a.nombre}</div>
                          {a.direccion && <div className="text-[10px] text-white/30 truncate mt-0.5 flex items-center gap-1"><MapPin size={10}/> {a.direccion}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-[11px] text-white/40 bg-white/5 border border-white/10 rounded px-2 py-1 font-mono">{a.id}</code>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-400 w-fit">
                        <Users size={12} />
                        <span className="text-[12px] font-bold">3</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-white/60 text-[13px]">{a.contacto_nombre || '—'}</td>
                    <td className="px-6 py-5 text-white/40 font-mono text-[11px] tracking-tight">{a.licencia || '—'}</td>
                    <td className="px-6 py-5 text-white/30 text-xs font-medium">
                      {new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <ChevronRight size={18} className="text-white/10 group-hover:text-white/40 ml-auto transition-colors" />
                    </td>
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
          onSave={() => { setSelectedAgencia(null); loadAgencias(); }}
          onCreated={(res) => { setSelectedAgencia(null); setResult(res); loadAgencias(); }} 
        />
      )}
      
      {result && <CredentialsDialog result={result} onClose={() => setResult(null)} />}
    </Layout>
  );
}

function AgencyDialog({ 
  agencia, onClose, onSave, onCreated 
}: { 
  agencia: Agencia | 'new', onClose: () => void, onSave: () => void, onCreated: (r: CreatedResult) => void 
}) {
  const isEdit = agencia !== 'new';
  const ag = isEdit ? (agencia as Agencia) : null;

  const [nombre, setNombre] = useState(ag?.nombre || '');
  const [licencia, setLicencia] = useState(ag?.licencia || '');
  const [direccion, setDireccion] = useState(ag?.direccion || '');
  const [cNombre, setCNombre] = useState(ag?.contacto_nombre || '');
  const [cEmail, setCEmail] = useState(ag?.contacto_email || '');
  const [cTel, setCTel] = useState(ag?.contacto_telefono || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para guardar los agentes cargados desde la base de datos
  const [agentesDb, setAgentesDb] = useState<Agente[]>([]);

  const effectiveSlug = isEdit ? ag!.id : slugify(nombre);

  // Cargar usuarios cuando editamos
  useEffect(() => {
    if (isEdit && ag) {
      supabase.from('perfiles')
        .select('id, email, nombre')
        .eq('agencia_id', ag.id)
        .then(({ data }) => {
          if (data) setAgentesDb(data);
        });
    }
  }, [isEdit, ag]);

  // Función de ELIMINAR AGENCIA
  const handleDelete = async () => {
    if (confirm(`¿Estás completamente seguro de eliminar "${ag!.nombre}"? Esta acción no se puede deshacer.`)) {
      setSubmitting(true);
      try {
        const { error: deleteError } = await supabase.from('agencias').delete().eq('id', ag!.id);
        if (deleteError) throw deleteError;
        onSave(); // Cierra y recarga
      } catch (err: any) {
        setError(err.message);
        setSubmitting(false);
      }
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      if (isEdit && ag) {
        const { error: updateError } = await supabase.from('agencias').update({
          nombre: nombre.trim(),
          licencia: licencia.trim(),
          direccion: direccion.trim(),
          contacto_nombre: cNombre.trim(),
          contacto_email: cEmail.trim(),
          contacto_telefono: cTel.trim()
        }).eq('id', ag.id);

        if (updateError) throw updateError;
        onSave();

      } else {
        const nuevaAgencia = {
          id: effectiveSlug,
          nombre: nombre.trim(),
          licencia: licencia.trim(),
          direccion: direccion.trim(),
          contacto_nombre: cNombre.trim(),
          contacto_email: cEmail.trim(),
          contacto_telefono: cTel.trim()
        };

        const { error: insertError } = await supabase.from('agencias').insert([nuevaAgencia]);
        if (insertError) throw insertError;

        const url = import.meta.env.VITE_SUPABASE_URL || (supabase as any).supabaseUrl;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY || (supabase as any).supabaseKey;

        if (!url || !key) throw new Error("Faltan credenciales de conexión con el servidor.");

        const tempClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

        const usuariosCreados = [];
        for (let i = 1; i <= 3; i++) {
          const userEmail = `${effectiveSlug}-${i}@inmoficina.es`;
          const userPass = Math.random().toString(36).slice(-6) + Math.floor(Math.random()*100) + "A1!";
          
          const { data: authData, error: authError } = await tempClient.auth.signUp({ 
            email: userEmail, password: userPass 
          });

          if (authError) continue;

          if (authData?.user) {
            await supabase.from('perfiles').upsert({
              id: authData.user.id,
              email: userEmail,
              nombre: `Agente ${i} - ${nombre.trim()}`,
              rol: 'agente',
              agencia_id: effectiveSlug
            });
            usuariosCreados.push({ email: userEmail, password: userPass });
          }
        }

        if (usuariosCreados.length === 0) {
           throw new Error("La agencia se creó, pero falló la generación de agentes.");
        }

        onCreated({ agencia: nuevaAgencia as Agencia, usuarios: usuariosCreados });
      }
    } catch (err) { 
      setError((err as Error).message); 
    } finally { 
      setSubmitting(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-ink-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between px-8 py-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-500/15 flex items-center justify-center border border-brand-500/20">
              <Sparkles size={20} className="text-brand-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{isEdit ? 'Editar Agencia' : 'Nueva agencia'}</div>
              <div className="text-[12px] text-white/40 mt-1 font-medium">
                {isEdit ? `ID: ${ag.id}` : 'Se crearán 3 usuarios con acceso automático'}
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/20 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"><X size={24} /></button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={onSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              <div className="space-y-5">
                <h3 className="text-[11px] font-bold text-brand-400 uppercase tracking-widest border-b border-white/5 pb-3">Datos de la Sede</h3>
                
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Nombre de la agencia</label>
                  <input required autoFocus className="input h-12 bg-ink-950 border-white/10" placeholder="Inmobiliaria Centro Madrid" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Slug / ID (Automático)</label>
                  <input 
                    className="input h-12 font-mono text-white/40 bg-white/5 border-white/10 cursor-not-allowed select-none" 
                    placeholder="inmo-madrid" 
                    value={effectiveSlug} 
                    readOnly
                  />
                  {!isEdit && (
                    <div className="mt-2 text-[10px] text-white/30 italic font-medium leading-relaxed">
                      Creará: <span className="font-mono text-white/50">{effectiveSlug || 'slug'}-1@</span>, <span className="font-mono text-white/50">-2@</span> y <span className="font-mono text-white/50">-3@inmoficina.es</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Dirección Física</label>
                  <input className="input h-12 bg-ink-950 border-white/10" placeholder="C/ Gran Vía 12, Madrid" value={direccion} onChange={e => setDireccion(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Nº de licencia</label>
                  <input className="input h-12 bg-ink-950 border-white/10" placeholder="LIC-2025-00123" value={licencia} onChange={e => setLicencia(e.target.value)} />
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 pb-3">Contacto (Opcional)</h3>
                
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Nombre Completo</label>
                  <input className="input h-12 bg-ink-950 border-white/10" placeholder="Laura Martínez" value={cNombre} onChange={e => setCNombre(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Email Corporativo</label>
                  <input type="email" className="input h-12 bg-ink-950 border-white/10" placeholder="laura@inmo.com" value={cEmail} onChange={e => setCEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Teléfono Directo</label>
                  <input className="input h-12 bg-ink-950 border-white/10" placeholder="+34 600 000 000" value={cTel} onChange={e => setCTel(e.target.value)} />
                </div>
              </div>

              {/* LISTA DE USUARIOS (Solo visible al editar) */}
              {isEdit && (
                <div className="md:col-span-2 space-y-4 pt-6 border-t border-white/5">
                  <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Usuarios Activos de esta Sede</h3>
                  {agentesDb.length === 0 ? (
                    <p className="text-xs text-white/40 italic">No hay usuarios vinculados.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {agentesDb.map(agente => (
                        <div key={agente.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0"><Users size={14}/></div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{agente.nombre}</div>
                            <div className="text-[10px] text-white/50 font-mono truncate">{agente.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-brand-400/80 bg-brand-500/10 border border-brand-500/20 p-3 rounded-xl flex gap-2.5 items-start mt-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p className="leading-relaxed">Por seguridad y encriptación nativa de Supabase, las contraseñas originales no se pueden visualizar. Si un agente pierde el acceso, debe utilizar la opción <strong>"¿Olvidaste tu contraseña?"</strong> en la pantalla de inicio de sesión.</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-8">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="font-medium font-mono text-xs">{error}</div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
              {/* BOTÓN ELIMINAR (Solo visible al editar) */}
              <div>
                {isEdit && (
                  <button type="button" onClick={handleDelete} disabled={submitting} className="flex items-center gap-2 text-red-500/70 hover:text-red-400 font-bold px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-sm">
                    <Trash2 size={18} /> Eliminar Sede
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="btn-ghost px-8 py-3.5 font-bold" onClick={onClose} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary px-8 py-3.5 font-bold flex items-center gap-2" disabled={submitting || !nombre || !effectiveSlug}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {submitting ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear agencia y accesos')}
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
      <div className="relative w-full max-w-xl bg-ink-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="px-8 py-6 border-b border-white/5 bg-emerald-500/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
              <Check size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Agencia creada con éxito</div>
              <div className="text-[12px] text-emerald-400/80 font-medium mt-0.5">Guarda estas credenciales ahora. No volverán a mostrarse.</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/30 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-3">
          {result?.usuarios?.map(u => (
            <div key={u.email} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-brand-500/30 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/20 transition-colors shrink-0">
                  <KeyRound size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white/90 truncate">{u.email}</div>
                  <div className="text-[13px] text-white/40 font-mono mt-0.5 tracking-tight truncate">{u.password}</div>
                </div>
              </div>
              <button type="button" onClick={() => { navigator.clipboard.writeText(`${u.email} / ${u.password}`); setCopied(u.email); setTimeout(() => setCopied(null), 1500); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all shrink-0">
                {copied === u.email ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 pt-6">
            <button type="button" className="btn-ghost flex-1 py-3.5 font-bold" onClick={() => {
              const text = result?.usuarios?.map(u => `${u.email} / ${u.password}`).join('\n') || '';
              navigator.clipboard.writeText(text);
              setCopied('all'); setTimeout(() => setCopied(null), 1500);
            }}>
              {copied === 'all' ? <Check size={16} className="text-emerald-400 mr-2 inline" /> : <Copy size={16} className="mr-2 inline" />} Copiar todas
            </button>
            <button type="button" className="btn-primary flex-1 py-3.5 font-bold" onClick={onClose}>Entendido</button>
          </div>
        </div>
      </div>
    </div>
  );
}