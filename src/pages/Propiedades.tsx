import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { 
  Building2, Plus, Loader2, X, Trash2, MapPin, BedDouble, Bath, Square, ChevronRight,
  Home, Tags, Info, Camera, ArrowLeft, ArrowRight, Sparkles, Calculator, Globe
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

const generarIdVisual = (id: any) => {
  if (!id) return 'ID-000';
  return `ID-${String(id).substring(0, 5).toUpperCase()}`;
};

export default function Propiedades() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProp, setEditingProp] = useState<any | null>(null);
  const [viewingProp, setViewingProp] = useState<any | null>(null);
  const [sortPrice, setSortPrice] = useState<'asc'|'desc'|null>(null);

  const nombreAgenciaFijo = perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || 'Agencia Inmobiliaria';

  const load = async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
    setPropiedades(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [perfil?.agencia_id]);

  const abrirFichaPublica = (p: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const agenteNombre = perfil?.nombre || '';
    const agenteTelf = perfil?.telefono || '';
    const url = `${window.location.origin}/p/${p.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
    window.open(url, '_blank');
  };

  const abrirCatalogoPublico = () => {
    if (!perfil?.agencia_id) return;
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
        title="Propiedades" 
        subtitle="Gestiona tu catálogo de inmuebles y sus galerías." 
        actions={
          <div className="flex gap-2">
            <button className="btn-ghost border border-white/10 text-brand-400 hover:bg-brand-500/10 px-3 py-1.5 text-[11px]" onClick={abrirCatalogoPublico}>
              <Globe size={14} /> Catálogo Público
            </button>
            <button className="btn-primary px-3 py-1.5 text-[11px]" onClick={() => setIsCreating(true)}>
              <Plus size={14} /> Nueva propiedad
            </button>
          </div>
        } 
      />

      <div className="mb-4 flex justify-end">
         <button onClick={() => setSortPrice(prev => prev === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/60 hover:text-white transition">
           Ordenar por Precio <span className="text-brand-400 font-bold">{sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : '↕'}</span>
         </button>
      </div>
      
      {loading ? <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div> : propiedades.length === 0 ? <EmptyState icon={Building2} title="Sin propiedades" description="Crea tu primera propiedad para empezar." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProps.map((p) => {
            const fotosArray = Array.isArray(p.fotos) ? p.fotos : [];
            const displayId = generarIdVisual(p.id);
            
            return (
              <div key={p.id} className="card p-0 overflow-hidden group hover:border-white/10 transition-all duration-300 cursor-pointer flex flex-col relative" onClick={() => setEditingProp(p)}>
                <div className="relative aspect-[16/11] bg-ink-900 overflow-hidden shrink-0">
                  {fotosArray.length > 0 ? <img src={fotosArray[0]} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><Building2 size={28} /></div>}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md border-2 bg-white text-[9px] font-black uppercase tracking-wider shadow-lg ${COLOR_TEXTO_BORDE[p.transaccion] || 'text-gray-800 border-gray-300'}`}>{p.transaccion}</div>
                  <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-ink-950/95 border-2 border-white/10 text-[9px] font-mono font-bold text-white shadow-lg">{displayId}</div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-[12px] font-semibold text-white truncate leading-tight">{p.titulo}</h3>
                    <div className="text-brand-400 font-bold text-[13px] whitespace-nowrap">{formatEUR(Number(p.precio) || 0)}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] mb-3"><MapPin size={10} className="shrink-0" /><span className="truncate">{p.direccion}{p.ciudad ? `, ${p.ciudad}` : ''}</span></div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between py-2 border-t border-white/5 px-1">
                      <div className="flex items-center gap-1"><BedDouble size={12} className="text-white/20" /><span className="text-[10px] font-medium text-white/60">{p.habitaciones || 0}</span></div>
                      <div className="w-px h-2.5 bg-white/10" />
                      <div className="flex items-center gap-1"><Bath size={12} className="text-white/20" /><span className="text-[10px] font-medium text-white/60">{p.banos || 0}</span></div>
                      <div className="w-px h-2.5 bg-white/10" />
                      <div className="flex items-center gap-1"><Square size={10} className="text-white/20" /><span className="text-[10px] font-medium text-white/60">{p.metros_cuadrados || 0}m²</span></div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingProp(p); }} className="flex-1 py-1.5 rounded-md bg-white/5 text-white/60 text-[10px] font-medium hover:bg-brand-50 hover:text-white transition flex items-center justify-center gap-1.5">Ficha Interna <ChevronRight size={12} /></button>
                      <button onClick={(e) => abrirFichaPublica(p, e)} className="w-7 h-7 shrink-0 rounded-md bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition flex items-center justify-center" title="Ficha VIP (Pública)"><Globe size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); window.location.href = '/inversion'; }} className="w-7 h-7 shrink-0 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition flex items-center justify-center" title="Dossier Inversión"><Calculator size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(isCreating || editingProp) && <PropertyDialog lead={editingProp} agenciaFija={nombreAgenciaFijo} onClose={() => { setIsCreating(false); setEditingProp(null); }} onSaved={load} />}
    </Layout>
  );
}

function PropertyDialog({ lead, agenciaFija, onClose, onSaved }: { lead?: any, agenciaFija: string, onClose: () => void, onSaved: () => void }) {
  const { perfil } = useAuth();
  const isEditing = !!lead;
  
  const [titulo, setTitulo] = useState(lead?.titulo || '');
  const [tipo, setTipo] = useState(lead?.tipo || TIPOS[0]);
  const [transaccion, setTransaccion] = useState(lead?.transaccion || TRANSACCIONES[0]);
  const [precio, setPrecio] = useState(lead?.precio ? String(lead.precio) : '');
  const [m2, setM2] = useState(lead?.metros_cuadrados || '');
  const [direccion, setDireccion] = useState(lead?.direccion || '');
  const [ciudad, setCiudad] = useState(lead?.ciudad || '');
  const [codigoPostal, setCodigoPostal] = useState(lead?.codigo_postal || '');
  const [habitaciones, setHabitaciones] = useState(lead?.habitaciones || '');
  const [banos, setBanos] = useState(lead?.banos || '');
  const [estadoFisico, setEstadoFisico] = useState(lead?.estado_fisico || ESTADOS_FISICOS[1]);
  const [descripcion, setDescripcion] = useState(lead?.descripcion || '');
  const [fotos, setFotos] = useState<string[]>(Array.isArray(lead?.fotos) ? lead.fotos : []);
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

  const generarDescripcion = () => {
    if (!tipo || (!ciudad && !codigoPostal) || !m2) { alert("Rellena el tipo, ciudad o código postal, y m² para que la IA haga su magia."); return; }
    setIsGeneratingIA(true); 
    const pre = formatEUR(Number(precio || 0));
    const hab = habitaciones || 'varias';
    const ban = banos || 'varios';
    const esCasa = tipo.toLowerCase() === 'casa' || tipo.toLowerCase() === 'chalet';
    const pronombre = esCasa ? 'a' : 'o';
    const ubicacion = ciudad ? `${ciudad} ${codigoPostal ? `(CP: ${codigoPostal})` : ''}` : `el código postal ${codigoPostal}`;

    const plantillas = [
      `Ubicad${pronombre} en una de las zonas más atractivas de ${ubicacion}, est${pronombre === 'a' ? 'a' : 'e'} exclusiv${pronombre} ${tipo.toLowerCase()} ofrece un equilibrio perfecto entre elegancia y funcionalidad.\n\nCon una superficie de ${m2}m², su distribución aprovecha al máximo la luz natural. Dispone de ${hab} dormitorios y ${ban} baños completos con excelentes acabados.\n\nEstado actual: ${estadoFisico}. Una oportunidad única en el mercado por ${pre}. Contáctanos para organizar una visita sin compromiso.`,
      `Excepcional ${tipo.toLowerCase()} de ${m2}m² en ${ubicacion}. Un inmueble pensado para satisfacer los estándares más exigentes, destacando por su amplitud y confort.\n\nLa propiedad consta de ${hab} habitaciones bien iluminadas y ${ban} baños. Su estado de conservación es: ${estadoFisico}, ideal para adaptarse a tu estilo de vida.\n\nPrecio de comercialización: ${pre}. Recomendamos agendar una visita en persona para apreciar todo su potencial y dimensiones.`,
      `¡Descubre tu próximo hogar en ${ubicacion}! Presentamos est${pronombre === 'a' ? 'a' : 'e'} magnífic${pronombre} ${tipo.toLowerCase()}, un espacio donde cada detalle ha sido cuidado.\n\nSus ${m2}m² se distribuyen de forma inmejorable en ${hab} cálidos dormitorios y ${ban} baños muy funcionales. Se encuentra en condición: ${estadoFisico}.\n\nInversión inteligente por ${pre}. No dejes pasar esta oportunidad, la exclusividad que buscas te está esperando.`,
      `En ${ubicacion}, te espera est${pronombre === 'a' ? 'a' : 'e'} fantástic${pronombre} ${tipo.toLowerCase()} de ${m2}m². Ideal tanto para vivienda habitual como para una sólida inversión.\n\nOfrece ${hab} habitaciones, ${ban} baños y una distribución impecable. Estado de la propiedad: ${estadoFisico}.\n\nDisponible por ${pre}. Llámanos y ven a conocerlo en persona, te aseguramos que cumplirá con tus expectativas.`
    ];

    setTimeout(() => {
      setDescripcion(plantillas[Math.floor(Math.random() * plantillas.length)]);
      setIsGeneratingIA(false);
    }, 1000);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { agencia_id: perfil?.agencia_id, agente_id: perfil?.id, nombre_agencia: agenciaFija, titulo, tipo, transaccion, precio: precio ? Number(precio) : null, metros_cuadrados: m2, direccion, ciudad, codigo_postal: codigoPostal, habitaciones, banos, estado_fisico: estadoFisico, descripcion, fotos };
    if (isEditing) { await supabase.from('propiedades').update(payload).eq('id', lead.id); } 
    else { await supabase.from('propiedades').insert(payload); }
    setSubmitting(false); onSaved(); onClose();
  };

  const onDelete = async () => {
    if (!confirm('¿Eliminar propiedad?')) return;
    setSubmitting(true); await supabase.from('propiedades').delete().eq('id', lead.id);
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
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