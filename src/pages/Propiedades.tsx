import { useEffect, useState, FormEvent, ChangeEvent, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { 
  Building2, Plus, Loader2, X, Trash2, MapPin, BedDouble, Bath, Square, ChevronRight,
  Home, Tags, Info, Camera, ArrowLeft, ArrowRight, Sparkles, Calculator, Euro, Percent, ArrowUpRight, Globe, QrCode, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';

const TIPOS = ['piso', 'ático', 'dúplex', 'chalet', 'casa', 'estudio', 'loft', 'local', 'oficina', 'garaje', 'terreno', 'nave', 'trastero'] as const;
const TRANSACCIONES = ['Disponible para venta', 'Disponible para alquiler', 'Venta y alquiler', 'Reservada', 'Vendida', 'Alquilada'] as const;
const ESTADOS_FISICOS = ['A estrenar/Nueva', 'Buen estado/Reformada', 'A reformar/A renovar', 'En ruinas'] as const;

const COLOR_TEXTO_BORDE: Record<string, string> = {
  'Disponible para venta': 'text-blue-600 border-blue-400',
  'Disponible para alquiler': 'text-purple-600 border-purple-400',
  'Venta y alquiler': 'text-indigo-600 border-indigo-400',
  'Reservada': 'text-orange-600 border-orange-400',
  'Vendida': 'text-emerald-600 border-emerald-400',
  'Alquilada': 'text-pink-600 border-pink-400'
};

const generarIdVisual = (id: any) => { if (!id) return 'ID-000'; return `ID-${String(id).substring(0, 5).toUpperCase()}`; };

export default function Propiedades() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<any | null>(null);
  const [viewingProp, setViewingProp] = useState<any | null>(null);
  const [sortPrice, setSortPrice] = useState<'asc'|'desc'|null>(null);
  const [planAgencia, setPlanAgencia] = useState<'estandar'|'premium'>('premium');

  const nombreAgenciaFijo = perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || 'Agencia Inmobiliaria';

  const loadData = useCallback(async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
    const { data: agData } = await supabase.from('agencias').select('plan').eq('id', perfil.agencia_id).single();
    setPropiedades(data || []);
    if (agData) setPlanAgencia(agData.plan as any);
    setLoading(false);
  }, [perfil?.agencia_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const abrirFichaPublica = (p: any, e: React.MouseEvent) => {
    e.stopPropagation(); if (planAgencia === 'estandar') return alert("Función Premium: Catálogo y Ficha VIP");
    const url = `${window.location.origin}/p/${p.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(perfil?.nombre || '')}&t=${encodeURIComponent(perfil?.telefono || '')}`;
    window.open(url, '_blank');
  };

  const abrirCatalogoPublico = () => {
    if (planAgencia === 'estandar') return alert("Función Premium: Catálogo Público");
    const url = `${window.location.origin}/a/${perfil?.agencia_id}?an=${encodeURIComponent(nombreAgenciaFijo)}`;
    window.open(url, '_blank');
  };

  const sortedProps = [...propiedades].sort((a, b) => {
    if (sortPrice === 'asc') return (Number(a.precio) || 0) - (Number(b.precio) || 0);
    if (sortPrice === 'desc') return (Number(b.precio) || 0) - (Number(a.precio) || 0);
    return 0;
  });

  return (
    <Layout title="Propiedades">
      <PageHeader title="Catálogo de Propiedades" subtitle="Gestiona tu cartera de inmuebles, publica y comparte fichas." actions={
        <div className="flex gap-2 w-full justify-end">
          <button className={`btn-ghost border border-white/10 flex items-center gap-1.5 text-[11px] py-1.5 px-3 ${planAgencia === 'estandar' ? 'opacity-50' : ''}`} onClick={abrirCatalogoPublico}>
            <Globe size={14}/> Catálogo Público {planAgencia === 'estandar' && '🔒'}
          </button>
          <button className="btn-primary text-[11px] py-1.5 px-3" onClick={() => setIsDialogOpen(true)}><Plus size={14} /> Nueva Propiedad</button>
        </div>
      } />

      <div className="mb-4 flex justify-end">
         <button onClick={() => setSortPrice(prev => prev === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/60 transition">
           Ordenar por Precio <span className="text-brand-400 font-bold">{sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : '↕'}</span>
         </button>
      </div>

      {loading ? <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProps.map(p => (
            <div key={p.id} className="card p-0 overflow-hidden group hover:border-white/10 transition-all cursor-pointer flex flex-col relative" onClick={() => { setEditingProp(p); setIsDialogOpen(true); }}>
              <div className="relative aspect-[16/11] bg-ink-950 overflow-hidden">
                {p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><Building2 size={28} /></div>}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md border-2 bg-white text-[9px] font-black uppercase tracking-wider ${COLOR_TEXTO_BORDE[p.transaccion] || 'text-gray-800'}`}>{p.transaccion}</div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-ink-950/95 border border-white/10 text-[9px] font-mono text-white">{generarIdVisual(p.id)}</div>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="flex justify-between gap-2 mb-1"><h3 className="text-[12px] font-semibold text-white truncate">{p.titulo}</h3><div className="text-brand-400 font-bold text-[13px]">{formatEUR(p.precio)}</div></div>
                <div className="flex items-center gap-1.5 text-white/40 text-[10px] mb-3"><MapPin size={10} /><span className="truncate">{p.direccion}{p.ciudad ? `, ${p.ciudad}` : ''}</span></div>
                <div className="mt-auto border-t border-white/5 pt-2">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <div className="flex items-center gap-1"><BedDouble size={12} className="text-white/20"/><span className="text-[10px] text-white/60">{p.habitaciones || 0}</span></div>
                    <div className="flex items-center gap-1"><Bath size={12} className="text-white/20"/><span className="text-[10px] text-white/60">{p.banos || 0}</span></div>
                    <div className="flex items-center gap-1"><Square size={10} className="text-white/20"/><span className="text-[10px] text-white/60">{p.metros_cuadrados || 0}m²</span></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); setViewingProp(p); }} className="flex-1 py-1.5 rounded-md bg-white/5 text-white/60 text-[10px] hover:bg-brand-500 hover:text-white transition flex items-center justify-center gap-1.5">Ficha Hipoteca <ChevronRight size={12} /></button>
                    <button onClick={(e) => abrirFichaPublica(p, e)} className="p-1.5 rounded-md bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition" title="Ficha VIP (Pública)"><Globe size={12}/></button>
                    <button onClick={(e) => { e.stopPropagation(); if (planAgencia === 'premium') window.location.href = '/inversion'; else alert("Dossier Inversión: Solo Premium"); }} className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition" title="Dossier Inversión"><TrendingUp size={12}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isDialogOpen && <PropDialog propiedad={editingProp} agenciaFija={nombreAgenciaFijo} onClose={() => { setIsDialogOpen(false); setEditingProp(null); }} onSaved={loadData} />}
      {viewingProp && <FullViewModal propiedad={viewingProp} onClose={() => setViewingProp(null)} />}
    </Layout>
  );
}

// FULL VIEW MODAL (Calculadora Hipoteca Interna) - Mantenido íntegro del .txt
function FullViewModal({ propiedad, onClose }: any) {
  const fotosArray = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];
  const displayId = generarIdVisual(propiedad.id);
  const precio = Number(propiedad.precio) || 0;
  const [porcentajeEntrada, setPorcentajeEntrada] = useState<number>(20);
  const [plazoAños, setPlazoAños] = useState<number>(30);
  const [interesAnual, setInteresAnual] = useState<number>(2.9);
  
  const gastosITP = precio * 0.10; 
  const entradaCash = precio * (porcentajeEntrada / 100);
  const capitalPrestamo = precio - entradaCash;
  const cashNecesario = entradaCash + gastosITP;
  const interesMensual = (interesAnual / 100) / 12;
  const numeroPagos = plazoAños * 12;
  const cuotaMensual = capitalPrestamo > 0 && interesMensual > 0 ? (capitalPrestamo * interesMensual * Math.pow(1 + interesMensual, numeroPagos)) / (Math.pow(1 + interesMensual, numeroPagos) - 1) : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 backdrop-blur-sm p-4 animate-fade-in">
      <button onClick={onClose} className="fixed top-4 right-4 z-[70] h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 border border-white/10"><X size={20} /></button>
      <div className="w-full max-w-5xl h-full max-h-[90vh] bg-ink-900 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col">
        <div className="relative h-48 sm:h-56 bg-ink-950 shrink-0">
          {fotosArray.length > 0 ? <img src={fotosArray[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/5"><Building2 size={48} /></div>}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex gap-2 mb-3"><span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border-2 bg-white shadow-lg ${COLOR_TEXTO_BORDE[propiedad.transaccion] || 'text-gray-800'}`}>{propiedad.transaccion}</span><span className="px-2.5 py-1 rounded-md bg-ink-950/95 border border-white/10 text-[9px] font-mono text-white">{displayId}</span></div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><h1 className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">{propiedad.titulo}</h1><div className="text-xl font-black text-brand-400 bg-ink-900/80 px-3 py-1.5 rounded-xl backdrop-blur-md">{formatEUR(precio)}</div></div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-white/60 text-[13px]"><MapPin size={14} />{propiedad.direccion}, {propiedad.ciudad} {propiedad.codigo_postal}</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"><Square className="mx-auto mb-1.5 text-white/20" size={18} /><div className="text-lg font-bold text-white">{propiedad.metros_cuadrados}</div><div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">m²</div></div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"><BedDouble className="mx-auto mb-1.5 text-white/20" size={18} /><div className="text-lg font-bold text-white">{propiedad.habitaciones}</div><div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">Dormit.</div></div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"><Bath className="mx-auto mb-1.5 text-white/20" size={18} /><div className="text-lg font-bold text-white">{propiedad.banos}</div><div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">Baños</div></div>
            </div>
            <div className="space-y-2"><h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5"><Info size={14} /> Memoria Descriptiva</h3><div className="text-white/70 text-[13px] leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 rounded-xl border border-white/5">{propiedad.descripcion || 'Propiedad pendiente de descripción.'}</div></div>
          </div>
          <div className="lg:col-span-1">
             <div className="sticky top-0 space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-3"><Calculator size={14} /> Plan Hipotecario</h3>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-5">
                   <div className="flex justify-between items-center"><label className="text-[10px] font-bold text-white/60 flex items-center gap-1 uppercase tracking-wider"><Euro size={10}/> Aportación ({porcentajeEntrada}%)</label><span className="text-[13px] font-bold text-white">{formatEUR(entradaCash)}</span></div>
                   <input type="range" min="10" max="60" step="5" value={porcentajeEntrada} onChange={(e) => setPorcentajeEntrada(Number(e.target.value))} className="w-full accent-emerald-500 h-1.5" />
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-ink-950 p-2.5 rounded-xl border border-white/5"><label className="text-[8px] text-white/40 uppercase mb-1.5 block font-bold">Plazo (Años)</label><select className="w-full bg-transparent text-[13px] font-bold text-white outline-none" value={plazoAños} onChange={(e) => setPlazoAños(Number(e.target.value))}>{[5,10,15,20,25,30,35,40].map(a => <option key={a} value={a}>{a} Años</option>)}</select></div>
                      <div className="bg-ink-950 p-2.5 rounded-xl border border-white/5"><label className="text-[8px] text-white/40 uppercase mb-1.5 block font-bold">Interés TIN</label><div className="flex items-center gap-1"><input type="number" step="0.1" className="w-full bg-transparent text-[13px] font-bold text-white outline-none" value={interesAnual} onChange={(e) => setInteresAnual(Number(e.target.value))} /><Percent size={10} className="text-white/40" /></div></div>
                   </div>
                   <div className="pt-3 border-t border-emerald-500/20 space-y-2.5">
                      <div className="flex justify-between items-center text-[11px]"><span className="text-white/50">Impuestos (10%)</span><span className="font-bold text-white/80">{formatEUR(gastosITP)}</span></div>
                      <div className="flex justify-between items-center bg-white/[0.03] p-2.5 rounded-xl"><span className="text-[10px] font-bold uppercase text-white/70">Ahorro Necesario</span><span className="font-black text-white text-sm">{formatEUR(cashNecesario)}</span></div>
                      <div className="flex justify-between items-center bg-emerald-500/20 p-3 rounded-xl mt-2 border border-emerald-500/30"><span className="text-[10px] font-bold uppercase text-emerald-400">Cuota Mes</span><span className="text-xl font-black text-emerald-400">{formatEUR(cuotaMensual)}</span></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropDialog({ propiedad, agenciaFija, onClose, onSaved }: any) {
  const { perfil } = useAuth();
  const isEditing = !!propiedad;
  const [titulo, setTitulo] = useState(propiedad?.titulo || '');
  const [tipo, setTipo] = useState(propiedad?.tipo || TIPOS[0]);
  const [transaccion, setTransaccion] = useState(propiedad?.transaccion || TRANSACCIONES[0]);
  const [precio, setPrecio] = useState(propiedad?.precio ? String(propiedad.precio) : '');
  const [m2, setM2] = useState(propiedad?.metros_cuadrados || '');
  const [direccion, setDireccion] = useState(propiedad?.direccion || '');
  const [ciudad, setCiudad] = useState(propiedad?.ciudad || '');
  const [cp, setCp] = useState(propiedad?.codigo_postal || '');
  const [habitaciones, setHabitaciones] = useState(propiedad?.habitaciones || '');
  const [banos, setBanos] = useState(propiedad?.banos || '');
  const [estadoFisico, setEstadoFisico] = useState(propiedad?.estado_fisico || ESTADOS_FISICOS[1]);
  const [descripcion, setDescripcion] = useState(propiedad?.descripcion || '');
  const [fotos, setFotos] = useState<string[]>(Array.isArray(propiedad?.fotos) ? propiedad.fotos : []);
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const generarConIA = () => {
    if (!tipo || (!ciudad && !cp) || !m2) { alert("Faltan datos de ubicación o tipo para que la IA funcione."); return; }
    setIsGeneratingIA(true);
    const ubicacion = ciudad ? `${ciudad} ${cp ? `(CP: ${cp})` : ''}` : `zona ${cp}`;
    setTimeout(() => {
      setDescripcion(`Presentamos este exclusivo ${tipo.toLowerCase()} en ${ubicacion}.\n\nCon una superficie de ${m2}m², esta propiedad destaca por su excelente estado (${estadoFisico.toLowerCase()}) y una distribución inteligente que incluye ${habitaciones || 'varias'} habitaciones y ${banos || 'varios'} baños.\n\nIdeal para quienes buscan calidad de vida en una ubicación estratégica. Contacta ahora para programar una visita privada.`);
      setIsGeneratingIA(false);
    }, 1200);
  };

  const handlePhotoUpload = async (e: any) => {
    const files = Array.from(e.target.files).slice(0, 8 - fotos.length);
    for (const file of files as File[]) {
      const reader = new FileReader(); reader.readAsDataURL(file);
      reader.onload = (event) => { setFotos(prev => [...prev, event.target?.result as string]); };
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const payload = { agencia_id: perfil?.agencia_id, agente_id: perfil?.id, nombre_agencia: agenciaFija, titulo, tipo, transaccion, precio: precio ? Number(precio) : null, metros_cuadrados: m2, direccion, ciudad, codigo_postal: cp, habitaciones, banos, estado_fisico: estadoFisico, descripcion, fotos };
    if (isEditing) await supabase.from('propiedades').update(payload).eq('id', propiedad.id);
    else await supabase.from('propiedades').insert(payload);
    setSubmitting(false); onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-ink-950 border border-white/10 rounded-2xl overflow-hidden animate-slide-up flex flex-col max-h-[95vh]">
        <div className="px-5 py-4 border-b border-white/5 flex justify-between">
          <h3 className="text-sm font-semibold text-white">{isEditing ? 'Editar propiedad' : 'Nueva propiedad'}</h3>
          <button onClick={onClose}><X size={18}/></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
          <div><label className="label">Título *</label><input required className="input bg-ink-900 border-white/10 text-sm" value={titulo} onChange={e => setTitulo(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
             <div><label className="label">Tipo</label><select className="input bg-ink-900 border-white/10 text-sm" value={tipo} onChange={e => setTipo(e.target.value)}>{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
             <div><label className="label">Transacción</label><select className="input bg-ink-900 border-white/10 text-sm" value={transaccion} onChange={e => setTransaccion(e.target.value)}>{TRANSACCIONES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div><label className="label">Precio *</label><input required className="input bg-ink-900 border-white/10 text-sm" type="number" value={precio} onChange={e => setPrecio(e.target.value)} /></div>
             <div><label className="label">Metros²</label><input className="input bg-ink-900 border-white/10 text-sm" type="number" value={m2} onChange={e => setM2(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             <div><label className="label">Habit.</label><input className="input bg-ink-900 border-white/10 text-sm" type="number" value={habitaciones} onChange={e => setHabitaciones(e.target.value)} /></div>
             <div><label className="label">Baños</label><input className="input bg-ink-900 border-white/10 text-sm" type="number" value={banos} onChange={e => setBanos(e.target.value)} /></div>
             <div><label className="label">Ciudad</label><input className="input bg-ink-900 border-white/10 text-sm" value={ciudad} onChange={e => setCiudad(e.target.value)} /></div>
             <div><label className="label">CP</label><input className="input bg-ink-900 border-white/10 text-sm" value={cp} onChange={e => setCp(e.target.value)} /></div>
          </div>
          <div className="flex justify-between items-end"><label className="label">Memoria Descriptiva</label><button type="button" onClick={generarConIA} disabled={isGeneratingIA} className="text-[9px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1">{isGeneratingIA ? <Loader2 className="animate-spin" size={10}/> : <Sparkles size={10}/>} Generar con IA</button></div>
          <textarea rows={4} className="input bg-ink-900 border-white/10 text-xs resize-none" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <div><label className="label">Fotos (Máx 8)</label><input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="text-xs text-white/40" /></div>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-4 text-[11px] font-bold uppercase">{submitting ? <Loader2 size={14} className="animate-spin mx-auto"/> : (isEditing ? 'Actualizar' : 'Crear Propiedad')}</button>
        </form>
      </div>
    </div>
  );
}