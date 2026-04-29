import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { 
  MessageSquare, Loader2, CheckCircle, Trash2, X, 
  Mail, Phone, User, Clock 
} from 'lucide-react';

interface MensajeContacto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export default function MessagesAdmin() {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeContacto | null>(null);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mensajes_contacto')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMensajes(data as MensajeContacto[]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const marcarLeido = async (id: string, estado: boolean) => {
    await supabase.from('mensajes_contacto').update({ leido: estado }).eq('id', id);
    loadData();
    if (selectedMensaje?.id === id) setSelectedMensaje(null);
  };

  const borrarMensaje = async (id: string) => {
    if(!confirm('¿Borrar este mensaje definitivamente?')) return;
    await supabase.from('mensajes_contacto').delete().eq('id', id);
    setSelectedMensaje(null);
    loadData();
  };

  const nuevos = mensajes.filter(m => !m.leido);
  const leidos = mensajes.filter(m => m.leido);

  return (
    <Layout title="Mensajes Web">
      <PageHeader
        title="MENSAJES DE CONTACTO"
        titleClassName="text-[14px] md:text-[18px] uppercase tracking-tighter"
        subtitle="Consultas recibidas a través del formulario de la landing page."
        actions={
          <button onClick={loadData} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            Actualizar
          </button>
        }
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-purple-400" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUMNA: NUEVOS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-2">
                <MessageSquare size={16}/> Bandeja de Entrada
              </h3>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-md">
                {nuevos.length} Nuevos
              </span>
            </div>

            {nuevos.length === 0 ? (
              <div className="card p-8 text-center bg-white/[0.01] border-dashed border border-white/10 text-white/30 text-[11px] font-bold uppercase">
                No hay mensajes nuevos.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {nuevos.map(m => (
                  <div key={m.id} onClick={() => setSelectedMensaje(m)} className="card p-5 bg-ink-900 border-white/5 border-l-4 border-l-purple-500 hover:border-white/20 cursor-pointer transition-all shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-bold text-white uppercase truncate">{m.nombre}</div>
                      <div className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded">
                        {new Date(m.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-[11px] text-white/50 line-clamp-2 italic leading-relaxed">
                      "{m.mensaje}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA: ARCHIVADOS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                <CheckCircle size={16}/> Mensajes Leídos
              </h3>
              <span className="text-[10px] font-bold bg-white/5 text-white/40 px-2.5 py-1 rounded-md">
                {leidos.length} Archivados
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
              {leidos.map(m => (
                <div key={m.id} onClick={() => setSelectedMensaje(m)} className="card p-4 bg-ink-900 border-white/5 opacity-60 hover:opacity-100 cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-bold text-white truncate uppercase">{m.nombre}</div>
                    <div className="text-[9px] text-white/30">{new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[10px] text-white/50 truncate italic">"{m.mensaje}"</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {selectedMensaje && (
        <MensajeDialog 
          mensaje={selectedMensaje} 
          onClose={() => setSelectedMensaje(null)} 
          onMarcarLeido={(estado: boolean) => marcarLeido(selectedMensaje.id, estado)}
          onDelete={() => borrarMensaje(selectedMensaje.id)} 
        />
      )}
    </Layout>
  );
}

function MensajeDialog({ mensaje, onClose, onMarcarLeido, onDelete }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2"><Mail size={16} className="text-purple-400"/> Mensaje Web</h3>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors bg-white/5 rounded-lg"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><User size={12}/> Remitente</label>
              <div className="text-sm font-bold text-white bg-ink-950 border border-white/5 px-3 py-2.5 rounded-xl">{mensaje.nombre}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><Mail size={12}/> Email</label>
                <div className="text-xs text-brand-400 bg-brand-500/5 border border-brand-500/10 px-3 py-2.5 rounded-xl truncate">{mensaje.email}</div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><Phone size={12}/> Teléfono</label>
                <div className="text-xs text-white/80 bg-ink-950 border border-white/5 px-3 py-2.5 rounded-xl">{mensaje.telefono || 'No indicado'}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 block">Mensaje Completo</label>
            <div className="text-sm text-white/80 bg-ink-950 border border-white/5 px-5 py-4 rounded-xl leading-relaxed whitespace-pre-wrap italic">
              "{mensaje.mensaje}"
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-white/5">
            <button onClick={onDelete} className="px-6 py-3.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Trash2 size={16}/> Borrar
            </button>
            <button 
              onClick={() => onMarcarLeido(!mensaje.leido)} 
              className={`flex-1 py-3.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mensaje.leido ? 'bg-white/10 hover:bg-white/20' : 'bg-purple-600 hover:bg-purple-500'}`}
            >
              <CheckCircle size={16}/> {mensaje.leido ? 'Marcar como pendiente' : 'Marcar como leído'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}