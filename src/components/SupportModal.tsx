import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  X, LifeBuoy, Send, CheckCircle2, Loader2, MessageSquare, User, Building2, Mail, Phone, Hash
} from 'lucide-react';

interface SupportModalProps {
  onClose: () => void;
  prefillMotivo?: string; // e.g. 'Olvido de contraseña / Acceso bloqueado'
}

const MOTIVOS = [
  'Olvido de contraseña / Acceso bloqueado',
  'Error de inicio de sesión',
  'Error en Sincronización con Portales',
  'Fallo en IA Predictor de Valor',
  'Problema con Informe CMA / Dossier Inversionista',
  'Error en el Pipeline Kanban',
  'Incidencia en la Agenda / Calendario',
  'Problema con gestión de Leads',
  'Error en Propiedades / Fichas',
  'Fallo en el módulo de Ventas / Histórico',
  'Problema con Perfil de Usuario o Avatar',
  'Error en módulo de Portales (Idealista, Fotocasa…)',
  'Problemas de visualización / interfaz',
  'Error de carga o rendimiento lento',
  'Problema con facturación o licencia',
  'Acceso bloqueado o cuenta suspendida',
  'Datos incorrectos o pérdida de información',
  'Duda de uso general / Formación',
  'Solicitud de nueva funcionalidad',
  'Otro problema técnico',
];

export function SupportModal({ onClose, prefillMotivo = '' }: SupportModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    licencia: '',
    email_plataforma: '',
    email_personal: '',
    telefono: '',
    motivo: prefillMotivo,
    mensaje: '',
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      nombre_agencia: form.empresa || 'No indicada',
      licencia: form.licencia || 'N/A',
      nombre_usuario: form.nombre,
      email_plataforma: form.email_plataforma,
      email_personal: form.email_personal,
      telefono: form.telefono,
      motivo: form.motivo,
      mensaje: form.mensaje,
      estado: 'pendiente',
    };

    const { error: err } = await supabase.from('tickets_soporte').insert([payload]);

    if (err) {
      setError('Error al enviar el ticket. Por favor, inténtalo de nuevo.');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-[2rem] shadow-2xl animate-slide-up flex flex-col max-h-[92vh]">
        
        {/* Header fijo */}
        <div className="flex items-center gap-4 px-8 pt-8 pb-5 border-b border-white/5 shrink-0">
          <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center border border-brand-500/20 shrink-0">
            <LifeBuoy className="text-brand-400" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white">Soporte Técnico</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Generación de ticket de ayuda</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors shrink-0">
            <X size={22} />
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <div className="overflow-y-auto flex-1 px-8 py-6 custom-scrollbar">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">¡Ticket Enviado!</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Hemos recibido tu solicitud. Nuestro equipo técnico revisará tu caso y se pondrá en contacto contigo a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              {/* Fila 1: Nombre + Empresa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                    <User size={10} /> Nombre *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Tu nombre completo"
                    value={form.nombre}
                    onChange={e => set('nombre', e.target.value)}
                    className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                    <Building2 size={10} /> Empresa *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nombre de tu agencia"
                    value={form.empresa}
                    onChange={e => set('empresa', e.target.value)}
                    className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Fila 2: Licencia + Teléfono */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                    <Hash size={10} /> Licencia <span className="text-white/25 normal-case tracking-normal font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nº de licencia"
                    value={form.licencia}
                    onChange={e => set('licencia', e.target.value)}
                    className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                    <Phone size={10} /> Teléfono *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={form.telefono}
                    onChange={e => set('telefono', e.target.value)}
                    className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Correo CRM */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                  <Mail size={10} /> Correo de la plataforma CRM *
                </label>
                <input
                  required
                  type="email"
                  placeholder="usuario@tuagencia.com (el que usas para acceder)"
                  value={form.email_plataforma}
                  onChange={e => set('email_plataforma', e.target.value)}
                  className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all"
                />
              </div>

              {/* Correo personal */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                  <Mail size={10} /> Correo personal de contacto *
                </label>
                <input
                  required
                  type="email"
                  placeholder="tu.correo@gmail.com (para responderte)"
                  value={form.email_personal}
                  onChange={e => set('email_personal', e.target.value)}
                  className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all"
                />
              </div>

              {/* Separador */}
              <div className="pt-1">
                <div className="w-full border-t border-white/5" />
              </div>

              {/* Motivo desplegable */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                  ¿Cuál es el motivo del ticket? *
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.motivo}
                    onChange={e => set('motivo', e.target.value)}
                    className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer pr-8"
                  >
                    <option value="" disabled className="bg-ink-900 text-white/40">Selecciona una categoría...</option>
                    {MOTIVOS.map(m => (
                      <option key={m} value={m} className="bg-ink-900">{m}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1.5 ml-1">
                  <MessageSquare size={10} /> Describe el problema con detalle *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explica qué ha ocurrido, cuándo empezó, y los pasos para reproducir el error si es posible..."
                  value={form.mensaje}
                  onChange={e => set('mensaje', e.target.value)}
                  className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-brand-500 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={17} /> : <><Send size={15} /> Enviar Ticket de Soporte</>}
              </button>

              <p className="text-center text-[10px] text-white/25 leading-relaxed">
                Nuestro equipo revisará tu solicitud y te contactará en un plazo de 24–48 h hábiles.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
