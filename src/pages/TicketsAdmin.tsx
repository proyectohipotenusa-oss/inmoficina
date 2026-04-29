import { useEffect, useState, FormEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { 
  LifeBuoy, Loader2, CheckCircle, Trash2, X, MessageSquare, 
  Clock, Users, Mail, Phone, Building2 
} from 'lucide-react';

interface TicketSoporte {
  id: string;
  nombre_agencia: string;
  licencia: string;
  nombre_usuario: string;
  email_plataforma: string;
  email_personal: string;
  telefono: string;
  motivo: string;
  mensaje: string;
  estado: string;
  created_at: string;
}

export default function TicketsAdmin() {
  const [tickets, setTickets] = useState<TicketSoporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketSoporte | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tickets_soporte')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTickets(data as TicketSoporte[]);
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, []);

  const borrarTicket = async (id: string) => {
    if(!confirm('¿Estás seguro de borrar este ticket de soporte permanentemente?')) return;
    await supabase.from('tickets_soporte').delete().eq('id', id);
    if (selectedTicket?.id === id) setSelectedTicket(null);
    loadTickets();
  };

  const pendientes = tickets.filter(t => t.estado === 'pendiente');
  const resueltos = tickets.filter(t => t.estado === 'resuelto');

  return (
    <Layout title="Tickets Soporte">
      <PageHeader
        title="SOPORTE TÉCNICO"
        titleClassName="text-[14px] md:text-[18px] uppercase tracking-tighter"
        subtitle="Gestión centralizada de incidencias y consultas de las agencias."
        actions={
          <button onClick={loadTickets} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            Actualizar
          </button>
        }
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-orange-400" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* COLUMNA: TICKETS PENDIENTES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 flex items-center gap-2">
                <Clock size={16}/> Pendientes de revisar
              </h3>
              <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2.5 py-1 rounded-md">
                {pendientes.length} Nuevos
              </span>
            </div>

            {pendientes.length === 0 ? (
              <div className="card p-8 text-center bg-white/[0.01] border-dashed border border-white/10 text-white/30 text-[11px] font-bold uppercase tracking-widest">
                <CheckCircle size={24} className="mx-auto mb-3 opacity-50" />
                No hay tickets pendientes. ¡Buen trabajo!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {pendientes.map(t => (
                  <div key={t.id} onClick={() => setSelectedTicket(t)} className="card p-5 bg-ink-900 border-white/5 border-l-4 border-l-orange-500 hover:border-white/20 cursor-pointer transition-all shadow-lg shadow-orange-500/5 group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 pr-2">
                        <div className="text-sm font-bold text-white uppercase truncate">{t.nombre_usuario}</div>
                        <div className="text-[10px] text-white/40 mt-0.5 flex items-center gap-1"><Building2 size={10}/> {t.nombre_agencia}</div>
                      </div>
                      <div className="text-[10px] text-white/30 whitespace-nowrap bg-white/5 px-2 py-1 rounded">
                        {new Date(t.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-orange-400 mb-2 truncate bg-orange-400/10 px-2 py-1.5 rounded-md inline-block">
                      {t.motivo}
                    </div>
                    <div className="text-[11px] text-white/50 line-clamp-2 italic leading-relaxed">
                      "{t.mensaje}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA: TICKETS RESUELTOS (HISTORIAL) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                <CheckCircle size={16}/> Historial Resueltos
              </h3>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md">
                {resueltos.length} Tickets
              </span>
            </div>

            {resueltos.length === 0 ? (
              <div className="card p-8 text-center bg-white/[0.01] border-dashed border border-white/10 text-white/30 text-[11px] font-bold uppercase tracking-widest">
                El historial está vacío
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                {resueltos.map(t => (
                  <div key={t.id} onClick={() => setSelectedTicket(t)} className="card p-4 bg-ink-900 border-white/5 border-l-4 border-l-emerald-500/30 opacity-70 hover:opacity-100 cursor-pointer transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-white uppercase truncate">{t.nombre_usuario}</div>
                        <div className="text-[9px] text-white/40">{t.nombre_agencia}</div>
                      </div>
                      <div className="text-[9px] text-white/30">{new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-[10px] text-white/50 truncate italic">
                      Motivo: {t.motivo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {selectedTicket && (
        <TicketDialog 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onSave={() => { setSelectedTicket(null); loadTickets(); }} 
          onDelete={() => borrarTicket(selectedTicket.id)} 
        />
      )}
    </Layout>
  );
}

// MODAL PARA LEER Y GESTIONAR EL TICKET
function TicketDialog({ ticket, onClose, onSave, onDelete }: any) {
  const [formData, setFormData] = useState({ ...ticket });
  const [submitting, setSubmitting] = useState(false);
  const isResolved = formData.estado === 'resuelto';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); 
    setSubmitting(true);
    await supabase.from('tickets_soporte').update({ estado: formData.estado }).eq('id', ticket.id);
    setSubmitting(false); 
    onSave();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header del Modal */}
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isResolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
              <LifeBuoy size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Ticket de Soporte</h3>
              <p className="text-[10px] text-white/40">{new Date(ticket.created_at).toLocaleString()}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors bg-white/5 rounded-lg"><X size={20}/></button>
        </div>

        {/* Contenido del Ticket */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><Users size={12}/> Usuario</label>
              <div className="text-sm font-bold text-white bg-ink-950 border border-white/5 px-3 py-2.5 rounded-xl">{ticket.nombre_usuario}</div>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><Building2 size={12}/> Agencia</label>
              <div className="text-sm text-white/80 bg-ink-950 border border-white/5 px-3 py-2.5 rounded-xl truncate" title={ticket.nombre_agencia}>{ticket.nombre_agencia}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><Mail size={12}/> Email Contacto</label>
              <div className="text-xs text-brand-400 bg-brand-500/5 border border-brand-500/10 px-3 py-2.5 rounded-xl truncate" title={ticket.email_plataforma}>{ticket.email_plataforma}</div>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><Phone size={12}/> Teléfono</label>
              <div className="text-xs text-white/80 bg-ink-950 border border-white/5 px-3 py-2.5 rounded-xl">{ticket.telefono}</div>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1"><MessageSquare size={12}/> Motivo de la consulta</label>
            <div className={`text-sm font-bold px-4 py-3 rounded-xl border ${isResolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
              {ticket.motivo}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5 block">Mensaje / Detalle</label>
            <div className="text-sm text-white/80 bg-ink-950 border border-white/5 px-5 py-4 rounded-xl leading-relaxed whitespace-pre-wrap">
              {ticket.mensaje}
            </div>
          </div>
          
          {/* Formulario de Acción */}
          <form onSubmit={onSubmit} className="pt-4 border-t border-white/5">
            <label className={`flex items-center gap-4 cursor-pointer group p-4 rounded-xl border transition-colors ${isResolved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
               <input 
                 type="checkbox" 
                 checked={isResolved} 
                 onChange={e => setFormData({...formData, estado: e.target.checked ? 'resuelto' : 'pendiente'})} 
                 className={`w-5 h-5 rounded border-white/20 bg-ink-950 focus:ring-offset-0 ${isResolved ? 'text-emerald-500' : 'text-brand-500'}`} 
               />
               <div>
                 <span className={`text-sm font-bold block transition-colors ${isResolved ? 'text-emerald-400' : 'text-white/90 group-hover:text-white'}`}>
                   Marcar ticket como RESUELTO
                 </span>
                 <span className="text-[10px] text-white/40 block mt-0.5">
                   {isResolved ? 'Este ticket ya está archivado en el historial.' : 'Al marcarlo, se moverá a la columna de historial.'}
                 </span>
               </div>
            </label>

            <div className="flex gap-3 pt-6 mt-2">
              <button type="button" onClick={() => { onDelete(); }} className="px-6 py-3.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                <Trash2 size={16}/> Borrar
              </button>
              <button type="submit" className={`flex-1 py-3.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isResolved ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20'}`} disabled={submitting}>
                {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : <><CheckCircle size={16}/> Guardar Cambios</>}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}