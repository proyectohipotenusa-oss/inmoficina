import { useEffect, useState, FormEvent, ChangeEvent, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { 
  Building2, Plus, Loader2, X, Trash2, MapPin, BedDouble, Bath, Square, ChevronRight,
  Home, Tags, Info, Camera, ArrowLeft, ArrowRight, Sparkles, Calculator, Euro, Percent, ArrowUpRight, Globe, QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';

interface Propiedad {
  id: string; titulo: string; descripcion: string; precio: number; transaccion: string;
  tipo: string; estado_fisico: string; metros_cuadrados: number; habitaciones: number;
  banos: number; direccion: string; ciudad: string; codigo_postal: string;
  fotos: string[]; referencia: string; created_at: string;
}

const TIPOS = ['piso', 'ático', 'dúplex', 'chalet', 'casa', 'estudio', 'loft', 'local', 'oficina', 'garaje', 'terreno', 'nave', 'trastero'] as const;
const TRANSACCIONES = ['Disponible para venta', 'Disponible para alquiler', 'Venta y alquiler', 'Reservada', 'Vendida', 'Alquilada'] as const;
const ESTADOS_FISICOS = ['A estrenar/Nueva', 'Buen estado/Reformada', 'A reformar/A renovar', 'En ruinas'] as const;

export default function Propiedades() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<Propiedad | null>(null);

  const loadData = useCallback(async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
    setPropiedades((data as Propiedad[]) || []);
    setLoading(false);
  }, [perfil?.agencia_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => { setEditingProp(null); setIsDialogOpen(true); };
  const openEdit = (p: Propiedad) => { setEditingProp(p); setIsDialogOpen(true); };

  return (
    <Layout title="Propiedades">
      <PageHeader title="Catálogo de Propiedades" subtitle="Gestiona tu cartera de inmuebles, publica y comparte fichas." actions={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> Nueva Propiedad</button>} />
      {loading ? <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div> : propiedades.length === 0 ? <EmptyState icon={Building2} title="Sin propiedades" description="Añade tu primer inmueble al catálogo para empezar." /> : (
        <div className="card p-0 bg-ink-900 border-white/5 overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 bg-white/[0.01]"><th className="px-6 py-4 font-bold">Propiedad</th><th className="px-6 py-4 font-bold">Transacción</th><th className="px-6 py-4 font-bold">Características</th><th className="px-6 py-4 font-bold text-right">Precio</th></tr></thead>
              <tbody>
                {propiedades.map(p => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition cursor-pointer group" onClick={() => openEdit(p)}>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-ink-950 overflow-hidden border border-white/10 shrink-0">{p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-2 text-white/10" size={16}/>}</div><div><div className="font-semibold text-white/90 truncate max-w-[200px]">{p.titulo}</div><div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{p.referencia || `ID-${p.id.substring(0,5)}`} • {p.ciudad}</div></div></div></td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 border-white/10 text-white/70">{p.transaccion}</span></td>
                    <td className="px-6 py-4 text-[11px] text-white/50"><div className="flex items-center gap-3"><span className="flex items-center gap-1" title="Habitaciones"><BedDouble size={12}/>{p.habitaciones || 0}</span><span className="flex items-center gap-1" title="Baños"><Bath size={12}/>{p.banos || 0}</span><span className="flex items-center gap-1" title="Superficie"><Square size={12}/>{p.metros_cuadrados || 0}m²</span></div></td>
                    <td className="px-6 py-4 text-right"><div className="font-bold text-white">{formatEUR(p.precio)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isDialogOpen && <PropDialog propiedad={editingProp} onClose={() => setIsDialogOpen(false)} onSaved={loadData} />}
    </Layout>
  );
}

function PropDialog({ propiedad, onClose, onSaved }: { propiedad?: Propiedad | null, onClose: () => void, onSaved: () => void }) {
  const { perfil } = useAuth();
  const isEditing = !!propiedad;
  
  const [titulo, setTitulo] = useState(propiedad?.titulo || '');
  const [descripcion, setDescripcion] = useState(propiedad?.descripcion || '');
  const [precio, setPrecio] = useState(propiedad?.precio?.toString() || '');
  const [transaccion, setTransaccion] = useState(propiedad?.transaccion || 'Disponible para venta');
  const [tipo, setTipo] = useState(propiedad?.tipo || 'piso');
  const [estadoFisico, setEstadoFisico] = useState(propiedad?.estado_fisico || 'Buen estado/Reformada');
  const [metros, setMetros] = useState(propiedad?.metros_cuadrados?.toString() || '');
  const [habitaciones, setHabitaciones] = useState(propiedad?.habitaciones?.toString() || '');
  const [banos, setBanos] = useState(propiedad?.banos?.toString() || '');
  const [direccion, setDireccion] = useState(propiedad?.direccion || '');
  const [ciudad, setCiudad] = useState(propiedad?.ciudad || '');
  const [cp, setCp] = useState(propiedad?.codigo_postal || '');
  const [referencia, setReferencia] = useState(propiedad?.referencia || '');
  const [fotos, setFotos] = useState<string[]>(propiedad?.fotos || []);
  
  const [submitting, setSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // --- MOTOR HEURÍSTICO IA (Copywriting Inmobiliario) ---
  const generarConIA = () => {
    setIsGenerating(true);
    
    // Simulamos el pensamiento de la IA
    setTimeout(() => {
      const isLujo = Number(precio) > 500000;
      const isReforma = estadoFisico === 'A reformar/A renovar';
      const zona = ciudad && cp ? `en el distrito de ${ciudad} (Código Postal ${cp}), una ubicación estratégica que garantiza calidad de vida, excelente conectividad y acceso a todos los servicios esenciales.` : 'en una ubicación privilegiada y de alta demanda.';
      
      let copy = `Presentamos este exclusivo ${tipo} ${zona}\n\n`;
      copy += `Con una superficie de ${metros || 'amplios'} m², la propiedad cuenta con una distribución óptima que incluye ${habitaciones || 'varias'} habitaciones luminosas y ${banos || 'cómodos'} baños completos. Cada espacio ha sido pensado para maximizar el confort y la funcionalidad.\n\n`;
      
      if (estadoFisico === 'A estrenar/Nueva') {
        copy += `El inmueble es de obra nueva, destacando por sus acabados de primera calidad, diseño contemporáneo y eficiencia energética, listo para convertirse en su nuevo hogar sin necesidad de adaptaciones.\n\n`;
      } else if (estadoFisico === 'Buen estado/Reformada') {
        copy += `La propiedad se encuentra en excelente estado de conservación, con detalles cuidados y lista para entrar a vivir desde el primer día.\n\n`;
      } else if (isReforma) {
        copy += `Esta propiedad representa una excelente oportunidad de inversión. Un lienzo en blanco con infinitas posibilidades de reforma y redistribución para crear la vivienda de sus sueños a medida.\n\n`;
      }

      if (isLujo) copy += `Una pieza única en el mercado orientada a clientes exigentes que valoran la exclusividad, la privacidad y el prestigio.\n\n`;
      
      copy += `No deje pasar esta oportunidad. Contáctenos para solicitar más información o programar una visita privada.`;

      setDescripcion(copy);
      setIsGenerating(false);
    }, 1200);
  };

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920; const MAX_HEIGHT = 1080;
          let width = img.width; let height = img.height;
          if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
          else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => { resolve(blob as Blob); }, 'image/webp', 0.8);
        };
      };
    });
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsCompressing(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const newUrls = [...fotos];
      for (let i = 0; i < files.length; i++) {
        if (newUrls.length >= 8) break;
        const file = files[i];
        const compressedBlob = await resizeImage(file);
        const fileName = `${Math.random().toString(36).substring(2)}.webp`;
        const filePath = `${perfil?.agencia_id}/${fileName}`;
        const { error } = await supabase.storage.from('propiedades').upload(filePath, compressedBlob, { contentType: 'image/webp' });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('propiedades').getPublicUrl(filePath);
        newUrls.push(publicUrl);
      }
      setFotos(newUrls);
    } catch (error) { console.error(error); alert('Error al subir imagen'); } 
    finally { setIsCompressing(false); }
  };

  const removePhoto = (index: number) => { setFotos(prev => prev.filter((_, i) => i !== index)); };
  const movePhoto = (index: number, dir: 'left'|'right') => {
    if (dir === 'left' && index > 0) { const newF = [...fotos]; [newF[index], newF[index-1]] = [newF[index-1], newF[index]]; setFotos(newF); }
    if (dir === 'right' && index < fotos.length - 1) { const newF = [...fotos]; [newF[index], newF[index+1]] = [newF[index+1], newF[index]]; setFotos(newF); }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const payload = { agencia_id: perfil?.agencia_id, titulo, descripcion, precio: Number(precio), transaccion, tipo, estado_fisico: estadoFisico, metros_cuadrados: Number(metros), habitaciones: Number(habitaciones), banos: Number(banos), direccion, ciudad, codigo_postal: cp, fotos, referencia };
    if (isEditing && propiedad) await supabase.from('propiedades').update(payload).eq('id', propiedad.id);
    else await supabase.from('propiedades').insert(payload);
    setSubmitting(false); onSaved(); onClose();
  };

  const onDelete = async () => {
    if (!propiedad || !confirm('¿Eliminar propiedad?')) return;
    setSubmitting(true); await supabase.from('propiedades').delete().eq('id', propiedad.id);
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl card p-0 overflow-hidden animate-slide-up bg-ink-950 border-white/10 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center shrink-0">
          <div><div className="text-lg font-semibold text-white">{isEditing ? 'Editar Inmueble' : 'Nuevo Inmueble'}</div></div>
          <div className="flex gap-2">
            {isEditing && <a href={`/p/${propiedad?.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-500 hover:text-white transition"><Globe size={12}/> Ver Ficha VIP</a>}
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"><X size={16}/></button>
          </div>
        </div>
        <form id="prop-form" onSubmit={onSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-400 flex items-center gap-1.5"><Building2 size={14}/> Datos Principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2"><label className="label">Título del Anuncio *</label><input required className="input bg-ink-900 border-white/10" value={titulo} onChange={e=>setTitulo(e.target.value)} /></div>
              <div><label className="label">Precio (€) *</label><input required type="number" className="input bg-ink-900 border-white/10" value={precio} onChange={e=>setPrecio(e.target.value)} /></div>
              <div><label className="label">Referencia Interna</label><input className="input bg-ink-900 border-white/10" placeholder="Ej. REF-001" value={referencia} onChange={e=>setReferencia(e.target.value)} /></div>
              <div><label className="label">Transacción</label><select className="input bg-ink-900 border-white/10" value={transaccion} onChange={e=>setTransaccion(e.target.value)}>{TRANSACCIONES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="label">Tipo de Inmueble</label><select className="input bg-ink-900 border-white/10 capitalize" value={tipo} onChange={e=>setTipo(e.target.value)}>{TIPOS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5"><Home size={14}/> Detalles y Ubicación</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="label">Superficie (m²)</label><input type="number" className="input bg-ink-900 border-white/10" value={metros} onChange={e=>setMetros(e.target.value)} /></div>
              <div><label className="label">Habitaciones</label><input type="number" className="input bg-ink-900 border-white/10" value={habitaciones} onChange={e=>setHabitaciones(e.target.value)} /></div>
              <div><label className="label">Baños</label><input type="number" className="input bg-ink-900 border-white/10" value={banos} onChange={e=>setBanos(e.target.value)} /></div>
              <div><label className="label">Estado Físico</label><select className="input bg-ink-900 border-white/10" value={estadoFisico} onChange={e=>setEstadoFisico(e.target.value)}>{ESTADOS_FISICOS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2"><label className="label">Dirección (Visible en Ficha)</label><input className="input bg-ink-900 border-white/10" value={direccion} onChange={e=>setDireccion(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-2"><div><label className="label">Ciudad</label><input className="input bg-ink-900 border-white/10" value={ciudad} onChange={e=>setCiudad(e.target.value)} /></div><div><label className="label">C.P.</label><input className="input bg-ink-900 border-white/10" value={cp} onChange={e=>setCp(e.target.value)} /></div></div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-white/5">
             <div className="flex justify-between items-end">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><Tags size={14}/> Descripción Pública</h3>
                <button type="button" onClick={generarConIA} disabled={isGenerating} className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 px-2 py-1 bg-brand-500/10 text-brand-400 rounded hover:bg-brand-500 hover:text-white transition disabled:opacity-50">
                  {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10}/>} Generar con IA
                </button>
             </div>
             <textarea rows={5} className="input bg-ink-900 border-white/10 resize-none text-sm leading-relaxed" placeholder="Describe los detalles de la propiedad..." value={descripcion} onChange={e=>setDescripcion(e.target.value)} disabled={isGenerating} />
          </div>
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5"><Camera size={14}/> Galería de Fotos (Máx. 8)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fotos.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg bg-ink-900 border border-white/10 relative group overflow-hidden">
                  <img src={url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    <button type="button" onClick={() => removePhoto(i)} className="p-1.5 bg-red-500/80 text-white rounded hover:bg-red-500 transition"><Trash2 size={14} /></button>
                    <div className="flex gap-2">
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
          <div className="flex gap-2"><button className="btn-ghost border border-white/10 text-xs py-1.5 px-3" onClick={onClose}>Cancelar</button><button type="submit" form="prop-form" className="btn-primary text-xs py-1.5 px-4" disabled={submitting}>{submitting ? <Loader2 size={14} className="animate-spin" /> : 'Guardar Inmueble'}</button></div>
        </div>
      </div>
    </div>
  );
}