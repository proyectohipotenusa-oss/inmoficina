import { useEffect, useState, FormEvent, ChangeEvent, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { 
  Building2, Plus, Loader2, X, Trash2, MapPin, BedDouble, Bath, Square, ChevronRight,
  Home, Tags, Info, Camera, ArrowLeft, ArrowRight, Sparkles, Calculator, Euro, Percent, ArrowUpRight, Globe, QrCode, TrendingUp, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';

interface Propiedad {
  id: string; titulo: string; descripcion: string; precio: number; transaccion: string;
  tipo: string; estado_fisico: string; metros_cuadrados: number; habitaciones: number;
  banos: number; direccion: string; ciudad: string; codigo_postal: string;
  fotos: string[]; referencia: string; created_at: string; nombre_agencia?: string;
}

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
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<Propiedad | null>(null);
  const [viewingProp, setViewingProp] = useState<Propiedad | null>(null);
  
  const [sortPrice, setSortPrice] = useState<'asc'|'desc'|null>(null);
  const [planAgencia, setPlanAgencia] = useState<'estandar'|'premium'>('premium');

  const nombreAgenciaFijo = perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || 'Agencia Inmobiliaria';

  const loadData = useCallback(async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
    const { data: agData } = await supabase.from('agencias').select('plan').eq('id', perfil.agencia_id).single();
    
    setPropiedades((data as Propiedad[]) || []);
    if (agData) setPlanAgencia(agData.plan as any);
    setLoading(false);
  }, [perfil?.agencia_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const abrirFichaPublica = (p: Propiedad, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (planAgencia === 'estandar') return alert("Función Premium: Actualiza tu plan para compartir Fichas VIP.");
    const agenteNombre = perfil?.nombre || '';
    const agenteTelf = perfil?.telefono || '';
    const url = `${window.location.origin}/p/${p.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
    window.open(url, '_blank');
  };

  const abrirCatalogoPublico = () => {
    if (!perfil?.agencia_id) return;
    if (planAgencia === 'estandar') return alert("Función Premium: Actualiza tu plan para activar tu Catálogo Público.");
    const agenteNombre = perfil?.nombre || '';
    const agenteTelf = perfil?.telefono || '';
    const url = `${window.location.origin}/a/${perfil.agencia_id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
    window.open(url, '_blank');
  };

  const sortedProps = [...propiedades].sort((a, b) => {
    if (sortPrice === 'asc') return (Number(a.precio) || 0) - (Number(b.precio) || 0);
    if (sortPrice === 'desc') return (Number(b.precio) || 0) - (Number(a.precio) || 0);
    return 0;
  });

  return (
    <Layout title="Propiedades">
      <PageHeader 
        title="Catálogo de Propiedades" 
        subtitle="Gestiona tu cartera de inmuebles, publica y comparte fichas." 
        actions={
          <div className="flex flex-wrap gap-2 w-full justify-end">
            <button className={`btn-ghost border border-white/10 flex items-center gap-1.5 text-[11px] py-1.5 px-3 whitespace-nowrap ${planAgencia === 'estandar' ? 'opacity-50' : ''}`} onClick={abrirCatalogoPublico}>
              <Globe size={14}/> Catálogo Público {planAgencia === 'estandar' && '🔒'}
            </button>
            <button className="btn-primary text-[11px] py-1.5 px-3 whitespace-nowrap" onClick={() => { setEditingProp(null); setIsDialogOpen(true); }}>
              <Plus size={14} /> Nueva Propiedad
            </button>
          </div>
        } 
      />

      <div className="mb-4 flex justify-end">
         <button onClick={() => setSortPrice(prev => prev === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/60 hover:text-white transition whitespace-nowrap">
           Ordenar por Precio <span className="text-brand-400 font-bold">{sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : '↕'}</span>
         </button>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div>
      ) : propiedades.length === 0 ? (
        <EmptyState icon={Building2} title="Sin propiedades" description="Añade tu primer inmueble al catálogo para empezar." />
      ) : (
        <div className="card p-0 bg-ink-900 border-white/5 overflow-hidden animate-fade-in w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-left text-[9px] uppercase tracking-widest text-white/40 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-4 py-3 font-bold">Propiedad</th>
                  <th className="px-4 py-3 font-bold">Transacción</th>
                  <th className="px-4 py-3 font-bold">Características</th>
                  <th className="px-4 py-3 font-bold text-right cursor-pointer hover:text-white group transition-colors" onClick={() => setSortPrice(prev => prev === 'asc' ? 'desc' : 'asc')}>
                    <div className="flex items-center justify-end gap-1.5">Precio <span className="text-white/30 group-hover:text-white/60">{sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : '↕'}</span></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProps.map(p => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition cursor-pointer" onClick={() => { setEditingProp(p); setIsDialogOpen(true); }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-ink-950 overflow-hidden border border-white/10 shrink-0">
                          {p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-2 text-white/10" size={16}/>}
                        </div>
                        <div className="min-w-[150px] max-w-[200px]">
                          <div className="font-semibold text-[13px] text-white/90 truncate">{p.titulo}</div>
                          <div className="text-[9px] text-white/40 mt-1 uppercase tracking-wider truncate">{p.referencia || `ID-${p.id.substring(0,5)}`} • {p.ciudad}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-white/5 border-white/10 text-white/70 whitespace-nowrap">{p.transaccion}</span></td>
                    <td className="px-4 py-3 text-[10px] text-white/50">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center gap-1" title="Habitaciones"><BedDouble size={12}/>{p.habitaciones || 0}</span>
                        <span className="flex items-center gap-1" title="Baños"><Bath size={12}/>{p.banos || 0}</span>
                        <span className="flex items-center gap-1" title="Superficie"><Square size={10}/>{p.metros_cuadrados || 0}m²</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="font-bold text-[13px] text-white mr-1 whitespace-nowrap">{formatEUR(p.precio)}</div>
                        
                        {/* CORRECCIÓN 1: Quitada la clase opacity-0 group-hover:opacity-100 para que se vea siempre en móviles */}
                        <div className="flex items-center gap-1 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setViewingProp(p); }} className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition" title="Ficha Interna y Calculadora Financiera"><Calculator size={12}/></button>
                          <button onClick={(e) => abrirFichaPublica(p, e)} className={`p-1.5 rounded-md transition ${planAgencia === 'estandar' ? 'bg-white/5 text-white/20' : 'bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white'}`} title="Ficha Técnica VIP (Pública)"><Globe size={12}/></button>
                          <button onClick={(e) => { e.stopPropagation(); if (planAgencia === 'premium') window.location.href = '/inversion'; else alert("Función Premium: Actualiza tu plan para crear Dossiers de Inversión."); }} className={`p-1.5 rounded-md transition ${planAgencia === 'estandar' ? 'bg-white/5 text-white/20' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white'}`} title="Dossier de Inversión"><TrendingUp size={12}/></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isDialogOpen && <PropertyDialog propiedad={editingProp} agenciaFija={nombreAgenciaFijo} onClose={() => { setIsDialogOpen(false); setEditingProp(null); }} onSaved={loadData} />}
      {viewingProp && <FullViewModal propiedad={viewingProp} onClose={() => setViewingProp(null)} />}
    </Layout>
  );
}

function FullViewModal({ propiedad, onClose }: { propiedad: Propiedad, onClose: () => void }) {
  const { perfil } = useAuth();
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

  const nombreAgenciaFijo = propiedad.nombre_agencia || perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || 'Agencia Inmobiliaria';
  const agenteNombre = perfil?.nombre || '';
  const agenteTelf = perfil?.telefono || '';
  const publicUrl = `${window.location.origin}/p/${propiedad.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}&margin=2`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 backdrop-blur-sm p-4 animate-fade-in w-full">
      <button onClick={onClose} className="fixed top-4 right-4 z-[70] h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition backdrop-blur-xl border border-white/10"><X size={20} /></button>
      <div className="w-full max-w-5xl h-full max-h-[90vh] bg-ink-900 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col">
        <div className="relative h-48 sm:h-56 bg-ink-950 w-full shrink-0">
          {fotosArray.length > 0 ? <img src={fotosArray[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/5"><Building2 size={48} /></div>}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border-2 bg-white shadow-lg ${COLOR_TEXTO_BORDE[propiedad.transaccion] || 'text-gray-800 border-gray-300'}`}>{propiedad.transaccion}</span>
              <span className="px-2.5 py-1 rounded-md bg-ink-950/95 border-2 border-white/10 text-[9px] font-mono font-bold text-white shadow-lg">{displayId}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight drop-shadow-md">{propiedad.titulo}</h1>
              <div className="text-xl sm:text-2xl font-black text-brand-400 drop-shadow-md bg-ink-900/80 px-3 py-1.5 rounded-xl backdrop-blur-md w-fit">{formatEUR(precio)}</div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-white/60 text-[13px]"><MapPin size={14} className="shrink-0" /><span className="truncate">{propiedad.direccion}, {propiedad.ciudad} {propiedad.codigo_postal}</span></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"><Square className="mx-auto mb-1.5 text-white/20" size={18} /><div className="text-lg font-bold text-white">{propiedad.metros_cuadrados}</div><div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">m²</div></div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"><BedDouble className="mx-auto mb-1.5 text-white/20" size={18} /><div className="text-lg font-bold text-white">{propiedad.habitaciones}</div><div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">Dormit.</div></div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"><Bath className="mx-auto mb-1.5 text-white/20" size={18} /><div className="text-lg font-bold text-white">{propiedad.banos}</div><div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">Baños</div></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5"><Info size={14} /> Memoria Descriptiva</h3>
              <div className="text-white/70 text-[13px] leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 rounded-xl border border-white/5">{propiedad.descripcion || 'Propiedad pendiente de descripción.'}</div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-0 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-3"><Calculator size={14} /> Plan Hipotecario</h3>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><label className="text-[10px] font-bold text-white/60 flex items-center gap-1 uppercase tracking-wider"><Euro size={10}/> Aportación ({porcentajeEntrada}%)</label><span className="text-[13px] font-bold text-white">{formatEUR(entradaCash)}</span></div>
                    <input type="range" min="10" max="60" step="5" value={porcentajeEntrada} onChange={(e) => setPorcentajeEntrada(Number(e.target.value))} className="w-full accent-emerald-500 h-1.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-ink-950 p-2.5 rounded-xl border border-white/5"><label className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5 block font-bold">Plazo (Años)</label><select className="w-full bg-transparent text-[13px] font-bold text-white outline-none cursor-pointer" value={plazoAños} onChange={(e) => setPlazoAños(Number(e.target.value))}>{[5, 10, 15, 20, 25, 30, 35, 40].map(anio => <option key={anio} value={anio} className="bg-ink-900 text-white">{anio} Años</option>)}</select></div>
                    <div className="bg-ink-950 p-2.5 rounded-xl border border-white/5"><label className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5 block font-bold">Interés TIN</label><div className="flex items-center gap-1"><input type="number" step="0.1" className="w-full bg-transparent text-[13px] font-bold text-white outline-none" value={interesAnual} onChange={(e) => setInteresAnual(Number(e.target.value))} /><Percent size={10} className="text-white/40" /></div></div>
                  </div>
                  <div className="pt-3 border-t border-emerald-500/20 space-y-2.5">
                    <div className="flex justify-between items-center text-[11px]"><span className="text-white/50">Impuestos y Notaría (10%)</span><span className="font-bold text-white/80">{formatEUR(gastosITP)}</span></div>
                    <div className="flex justify-between items-center text-[11px]"><span className="text-white/50">Préstamo Bancario</span><span className="font-bold text-white/80">{formatEUR(capitalPrestamo)}</span></div>
                    <div className="flex justify-between items-center bg-white/[0.03] p-2.5 rounded-xl border border-white/5 mt-1"><span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Ahorro Necesario</span><span className="font-black text-white text-sm">{formatEUR(cashNecesario)}</span></div>
                    <div className="flex justify-between items-center bg-emerald-500/20 p-3 rounded-xl mt-2 border border-emerald-500/30"><span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Cuota Mes</span><span className="text-xl font-black text-emerald-400">{formatEUR(cuotaMensual)}</span></div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5 mb-4"><QrCode size={16} /> QR Escaparate VIP</h3>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center flex flex-col items-center">
                  <div className="bg-white p-2 rounded-xl border border-white/20 mb-3 shadow-lg">
                    <img src={qrUrl} alt="QR Ficha VIP" className="w-32 h-32 object-contain" />
                  </div>
                  <p className="text-[11px] text-white/50 mb-4 px-2">Escanea para ver la Ficha Pública. Ideal para imprimir en escaparates, carteles de Se Vende o folletos.</p>
                  <button onClick={() => window.open(qrUrl, '_blank')} className="btn-secondary w-full py-2.5 text-xs">Ver en HD</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyDialog({ propiedad, agenciaFija, onClose, onSaved }: { propiedad?: Propiedad | null, agenciaFija: string, onClose: () => void, onSaved: () => void }) {
  const { perfil } = useAuth();
  const isEditing = !!propiedad;
  
  const [titulo, setTitulo] = useState(propiedad?.titulo || '');
  const [tipo, setTipo] = useState(propiedad?.tipo || TIPOS[0]);
  const [transaccion, setTransaccion] = useState(propiedad?.transaccion || TRANSACCIONES[0]);
  const [precio, setPrecio] = useState(propiedad?.precio ? String(propiedad.precio) : '');
  const [m2, setM2] = useState(propiedad?.metros_cuadrados ? String(propiedad.metros_cuadrados) : '');
  const [direccion, setDireccion] = useState(propiedad?.direccion || '');
  const [ciudad, setCiudad] = useState(propiedad?.ciudad || '');
  const [codigoPostal, setCodigoPostal] = useState(propiedad?.codigo_postal || '');
  const [habitaciones, setHabitaciones] = useState(propiedad?.habitaciones ? String(propiedad.habitaciones) : '');
  const [banos, setBanos] = useState(propiedad?.banos ? String(propiedad.banos) : '');
  const [estadoFisico, setEstadoFisico] = useState(propiedad?.estado_fisico || ESTADOS_FISICOS[1]);
  const [descripcion, setDescripcion] = useState(propiedad?.descripcion || '');
  const [fotos, setFotos] = useState<string[]>(Array.isArray(propiedad?.fotos) ? propiedad.fotos : []);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const movePhoto = (index: number, direction: 'left' | 'right') => {
    const newFotos = [...fotos];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fotos.length) return;
    [newFotos[index], newFotos[newIndex]] = [newFotos[newIndex], newFotos[index]];
    setFotos(newFotos);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) { if (w > 1200) { h *= 1200 / w; w = 1200; } } else { if (h > 1200) { w *= 1200 / h; h = 1200; } }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 8 - fotos.length);
    setIsCompressing(true);
    const compressed = await Promise.all(files.map(f => compressImage(f)));
    setFotos(prev => [...prev, ...compressed]);
    setIsCompressing(false);
    e.target.value = '';
  };

  // CORRECCIÓN 2: LÓGICA DE PRECIOS PARA LA INTELIGENCIA ARTIFICIAL
  const generarDescripcion = () => {
    if (!tipo || (!ciudad && !codigoPostal) || !m2 || !precio) { 
      alert("Rellena el tipo, ciudad/C.P., metros cuadrados y PRECIO para que la IA pueda redactar un buen texto."); 
      return; 
    }
    
    setIsGeneratingIA(true); 
    
    const preNum = Number(precio);
    const m2Num = Number(m2);
    const pre = formatEUR(preNum);
    const precioM2 = preNum / m2Num;
    
    const hab = habitaciones || 'varias';
    const ban = banos || 'varios';
    const esCasa = tipo.toLowerCase() === 'casa' || tipo.toLowerCase() === 'chalet';
    const pronombre = esCasa ? 'a' : 'o';
    const ubicacion = ciudad ? `${ciudad} ${codigoPostal ? `(CP: ${codigoPostal})` : ''}` : `el código postal ${codigoPostal}`;

    // Lógica para determinar el tono de la venta (Basado en el Precio por metro cuadrado y total)
    let tono = 'neutro';
    if (precioM2 < 1500) tono = 'ganga_inversor';
    else if (precioM2 > 4500 || preNum > 700000) tono = 'lujo_exclusivo';
    else if (estadoFisico.includes('reformar')) tono = 'proyecto_reforma';
    else tono = 'estandar_emocional';

    let plantillas: string[] = [];

    if (tono === 'ganga_inversor') {
      plantillas = [
        `Oportunidad de mercado en ${ubicacion}. Est${pronombre === 'a' ? 'a' : 'e'} ${tipo.toLowerCase()} de ${m2Num}m² sale a la venta por tan solo ${pre}, ofreciendo una rentabilidad potencial excelente.\\n\\nCon ${hab} habitaciones y ${ban} baños, es una opción ideal tanto para inversores como para primera vivienda a un coste inmejorable. Estado actual: ${estadoFisico}.\\n\\nInmuebles en esta franja de precio no suelen durar en cartera. Contáctanos antes de que se reserve.`,
        `Excelente relación calidad-precio en ${ubicacion}. Adquiere est${pronombre === 'a' ? 'a' : 'e'} ${tipo.toLowerCase()} de ${m2Num}m² por ${pre} y asegura tu inversión.\\n\\nCuenta con ${hab} dormitorios y ${ban} baños. Su estado es ${estadoFisico}. Ideal para quienes buscan maximizar su capital sin renunciar a una buena zona.\\n\\nLlámanos para agendar una visita y analizar las posibilidades de este activo.`
      ];
    } else if (tono === 'lujo_exclusivo') {
      plantillas = [
        `Exclusividad y prestigio en el corazón de ${ubicacion}. Presentamos est${pronombre === 'a' ? 'a' : 'e'} imponente ${tipo.toLowerCase()} de ${m2Num}m², una propiedad reservada para los gustos más exigentes.\\n\\nCada uno de sus ${hab} dormitorios y ${ban} baños ha sido diseñado buscando la máxima amplitud y sofisticación. Estado de conservación: ${estadoFisico}.\\n\\nValorada en ${pre}, representa un estatus de vida único. Agende una visita privada con nuestros asesores para experimentar este inmueble.`,
        `Una auténtica joya inmobiliaria en ${ubicacion}. Est${pronombre === 'a' ? 'a' : 'e'} ${tipo.toLowerCase()} premium de ${m2Num}m² redefine el concepto de elegancia.\\n\\nDisfrute de ${hab} estancias de lujo y ${ban} baños con calidades excepcionales. Se entrega en condición: ${estadoFisico}.\\n\\nPor ${pre}, usted no solo adquiere una propiedad, sino un estilo de vida superior. Contacte con nuestra división de lujo para más detalles.`
      ];
    } else if (tono === 'proyecto_reforma') {
      plantillas = [
        `Lienzo en blanco en ${ubicacion}. Est${pronombre === 'a' ? 'a' : 'e'} ${tipo.toLowerCase()} de ${m2Num}m² es el proyecto perfecto para diseñar la casa de tus sueños a medida.\\n\\nLa propiedad, actualmente con ${hab} habitaciones y ${ban} baños, tiene una condición de ${estadoFisico}, ofreciendo infinitas posibilidades de redistribución.\\n\\nPor ${pre}, adquieres un espacio con un potencial de revalorización brutal. Ven a visitarlo con tu arquitecto y visualiza el resultado.`
      ];
    } else {
      plantillas = [
        `Descubre tu próximo hogar en ${ubicacion}. Est${pronombre === 'a' ? 'a' : 'e'} cálid${pronombre} ${tipo.toLowerCase()} de ${m2Num}m² ofrece un equilibrio perfecto entre confort y ubicación.\\n\\nSus espacios están distribuidos en ${hab} dormitorios acogedores y ${ban} baños muy funcionales. Estado de la propiedad: ${estadoFisico}.\\n\\nDisponible por ${pre}, es la opción ideal para familias que buscan establecerse en un entorno agradable. Te invitamos a conocerlo hoy mismo.`,
        `En la atractiva zona de ${ubicacion}, te espera est${pronombre === 'a' ? 'a' : 'e'} fantástic${pronombre} ${tipo.toLowerCase()}. Con ${m2Num}m², está diseñado para aprovechar al máximo la luz natural.\\n\\nCuenta con ${hab} habitaciones espaciosas y ${ban} baños, presentándose en un estado ${estadoFisico}.\\n\\nComercializado por ${pre}, creemos que es un inmueble que cumplirá todas tus expectativas de vida. Llámanos sin compromiso.`
      ];
    }

    setTimeout(() => {
      setDescripcion(plantillas[Math.floor(Math.random() * plantillas.length)]);
      setIsGeneratingIA(false);
    }, 1000);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { agencia_id: perfil?.agencia_id, agente_id: perfil?.id, nombre_agencia: agenciaFija, titulo, tipo, transaccion, precio: precio ? Number(precio) : null, metros_cuadrados: Number(m2), direccion, ciudad, codigo_postal: codigoPostal, habitaciones: Number(habitaciones), banos: Number(banos), estado_fisico: estadoFisico, descripcion, fotos };
    if (isEditing && propiedad) { await supabase.from('propiedades').update(payload).eq('id', propiedad.id); } 
    else { await supabase.from('propiedades').insert(payload); }
    setSubmitting(false); onSaved(); onClose();
  };

  const onDelete = async () => {
    if (!confirm('¿Eliminar propiedad?')) return;
    setSubmitting(true); await supabase.from('propiedades').delete().eq('id', propiedad.id);
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in w-full">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card p-0 overflow-hidden animate-slide-up bg-ink-950 border-white/10 flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0 bg-ink-950/50">
          <div><div className="text-sm font-semibold text-white">{isEditing ? 'Editar propiedad' : 'Nueva propiedad'}</div></div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={18} /></button>
        </div>
        <form id="prop-form" onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto custom-scrollbar bg-ink-900/50">
          <div><label className="label">Título *</label><input required className="input bg-ink-950 border-white/10 text-sm" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Tipo</label><select className="input bg-ink-950 border-white/10 text-sm" value={tipo} onChange={(e) => setTipo(e.target.value)}>{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="label">Transacción</label><select className="input bg-ink-950 border-white/10 text-sm" value={transaccion} onChange={(e) => setTransaccion(e.target.value)}>{TRANSACCIONES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Precio *</label><div className="relative"><input required type="text" className="input bg-ink-950 border-white/10 text-sm pr-8" value={precio ? new Intl.NumberFormat('es-ES').format(Number(precio)) : ''} onChange={(e) => setPrecio(e.target.value.replace(/\D/g, ''))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs font-bold">€</span></div></div>
            <div><label className="label">m² construidos</label><input type="number" className="input bg-ink-950 border-white/10 text-sm" value={m2} onChange={(e) => setM2(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Habitaciones</label><input type="number" className="input bg-ink-950 border-white/10 text-sm" value={habitaciones} onChange={(e) => setHabitaciones(e.target.value)} /></div>
            <div><label className="label">Baños</label><input type="number" className="input bg-ink-950 border-white/10 text-sm" value={banos} onChange={(e) => setBanos(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className="label">Ciudad</label><input className="input bg-ink-950 border-white/10 text-sm" value={ciudad} onChange={(e) => setCiudad(e.target.value)} /></div>
            <div><label className="label">Código Postal</label><input className="input bg-ink-950 border-white/10 text-sm" placeholder="Ej. 46001" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} /></div>
            <div><label className="label">Estado Físico</label><select className="input bg-ink-950 border-white/10 text-sm" value={estadoFisico} onChange={(e) => setEstadoFisico(e.target.value)}>{ESTADOS_FISICOS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div><label className="label">Dirección / Ubicación</label><input className="input bg-ink-950 border-white/10 text-sm" value={direccion} onChange={(e) => setDireccion(e.target.value)} /></div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="label mb-0">Memoria Descriptiva</label>
              <button type="button" onClick={generarDescripcion} disabled={isGeneratingIA} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 px-2 py-1 rounded transition disabled:opacity-50">
                {isGeneratingIA ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Redactar IA
              </button>
            </div>
            <textarea rows={4} className="input bg-ink-950 border-white/10 resize-none text-xs leading-relaxed" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} disabled={isGeneratingIA} />
          </div>
          <div>
            <label className="label flex justify-between items-center mb-1.5"><span>Galería ({fotos.length}/8)</span></label>
            <div className="grid grid-cols-4 gap-2">
              {fotos.map((f, i) => (
                <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-ink-900">
                  <img src={f} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                    <div className="flex justify-between items-start"><div className="bg-ink-950/80 rounded px-1 text-[8px] font-bold text-white border border-white/10">#{i + 1}</div><button type="button" onClick={() => setFotos(prev => prev.filter((_, idx) => idx !== i))} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"><Trash2 size={10}/></button></div>
                    <div className="flex justify-center gap-1">
                      {i > 0 && <button type="button" onClick={() => movePhoto(i, 'left')} className="p-1 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-md transition"><ArrowLeft size={12} /></button>}
                      {i < fotos.length - 1 && <button type="button" onClick={() => movePhoto(i, 'right')} className="p-1 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-md transition"><ArrowRight size={12} /></button>}
                    </div>
                  </div>
                </div>
              ))}
              {fotos.length < 8 && <label className="aspect-square rounded-lg bg-ink-950 border border-dashed border-white/20 hover:border-brand-500/50 transition cursor-pointer flex items-center justify-center text-white/30 hover:text-brand-400"><input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isCompressing} />{isCompressing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16}/>}</label>}
            </div>
          </div>
        </form>
        <div className="p-4 border-t border-white/5 bg-ink-950/50 flex justify-between items-center shrink-0">
          {isEditing ? <button type="button" onClick={onDelete} className="text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-1"><Trash2 size={14}/> Eliminar</button> : <div/>}
          <div className="flex gap-2"><button className="btn-ghost border border-white/10 text-xs py-1.5 px-3" onClick={onClose}>Cancelar</button><button type="submit" form="prop-form" className="btn-primary text-xs py-1.5 px-4" disabled={submitting}>{submitting ? <Loader2 size={14} className="animate-spin" /> : (isEditing ? 'Actualizar' : 'Crear')}</button></div>
        </div>
      </div>
    </div>
  );
}