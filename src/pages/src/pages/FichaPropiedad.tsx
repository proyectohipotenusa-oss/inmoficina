import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { supabase } from '../lib/supabase';
import { 
  MapPin, BedDouble, Bath, Square, Home, Building2, 
  ChevronLeft, ChevronRight, Share2, AlertCircle, Tags, Image as ImageIcon, ArrowUpRight
} from 'lucide-react';
import { formatEUR } from '../lib/format';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

const COLOR_TEXTO_BORDE: Record<string, string> = {
  'Disponible para venta': 'text-sky-400 border-sky-400',
  'Disponible para alquiler': 'text-purple-400 border-purple-400',
  'Venta y alquiler': 'text-indigo-400 border-indigo-400',
  'Reservada': 'text-orange-400 border-orange-400',
  'Vendida': 'text-emerald-400 border-emerald-400',
  'Alquilada': 'text-pink-400 border-pink-400'
};

export default function FichaPropiedad() {
  const [match, params] = useRoute('/p/:id');
  const [propiedad, setPropiedad] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [agenciaFinal, setAgenciaFinal] = useState('Cargando...');

  const searchParams = new URLSearchParams(window.location.search);
  const nombreAgente = searchParams.get('un') || '';
  const telefonoAgente = searchParams.get('t') || '';

  useEffect(() => {
    if (!match || !params?.id) return;
    
    const fetchFullData = async () => {
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(params.id)) {
            setPropiedad(null);
            setLoading(false);
            return;
        }

        const { data: prop, error: pErr } = await supabase.from('propiedades').select('*').eq('id', params.id).single();
        if (pErr) throw pErr;
        setPropiedad(prop);

        // SOLUCIÓN PERMANENTE: Consultar directo a la tabla de agencias
        if (prop.agencia_id) {
          const { data: agData } = await supabase.from('agencias').select('nombre').eq('id', prop.agencia_id).single();
          if (agData?.nombre) {
             setAgenciaFinal(agData.nombre);
             return;
          }
        }
        
        // Fallback si la agencia fuera eliminada o fallara la consulta
        setAgenciaFinal(prop.nombre_agencia || searchParams.get('an') || 'Agencia Inmobiliaria');

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [match, params?.id]);

  if (loading) return <div className="min-h-screen bg-ink-950 flex items-center justify-center text-brand-400 animate-pulse font-mono tracking-widest text-sm">CARGANDO EXCLUSIVIDAD...</div>;
  if (!propiedad) return <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 text-center"><AlertCircle size={48} className="text-white/20 mb-4" /><h2 className="text-xl font-bold text-white mb-2">Propiedad no encontrada</h2></div>;

  const fotosArray = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];
  const displayId = propiedad.referencia || `ID-${String(propiedad.id).substring(0, 5).toUpperCase()}`;

  const nextFoto = () => setFotoIndex((i) => (i === fotosArray.length - 1 ? 0 : i + 1));
  const prevFoto = () => setFotoIndex((i) => (i === 0 ? fotosArray.length - 1 : i - 1));

  const linkBase = `${window.location.origin}/p/${propiedad.id}?an=${encodeURIComponent(agenciaFinal)}&un=${encodeURIComponent(nombreAgente)}&t=${encodeURIComponent(telefonoAgente)}`;
  const mensajeWA = nombreAgente ? `Hola ${nombreAgente}, estoy interesado en esta propiedad: ${linkBase}` : `Hola, estoy interesado en esta propiedad: ${linkBase}`;
  const urlWhatsApp = telefonoAgente ? `https://wa.me/${telefonoAgente.replace(/[^\d]/g, '')}?text=${encodeURIComponent(mensajeWA)}` : `https://wa.me/?text=${encodeURIComponent(mensajeWA)}`;

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30 overflow-x-hidden pb-24">
      <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] bg-ink-900 group">
        {fotosArray.length > 0 ? <img src={fotosArray[fotoIndex]} className="w-full h-full object-cover animate-fade-in" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><Building2 size={64} /></div>}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-ink-950" />
        
        <div className="absolute top-8 left-6 right-6 z-10 flex justify-between items-start animate-slide-up">
          <div className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
            <img src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" alt="Logo" className="w-full h-full object-contain bg-transparent" />
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-brand-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
               <span className="text-[12px] font-black tracking-widest uppercase text-white/95 leading-none">
                 {agenciaFinal}
               </span>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Enlace VIP copiado al portapapeles'); }} className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition shadow-2xl"><Share2 size={18} /></button>
          </div>
        </div>

        {fotosArray.length > 1 && (
          <>
            <button onClick={prevFoto} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition md:opacity-0 group-hover:opacity-100 hover:bg-white/10"><ChevronLeft size={24}/></button>
            <button onClick={nextFoto} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition md:opacity-0 group-hover:opacity-100 hover:bg-white/10"><ChevronRight size={24}/></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {fotosArray.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === fotoIndex ? 'w-5 bg-brand-400' : 'w-2 bg-white/30'}`} />)}
            </div>
          </>
        )}
      </div>

      <div className="relative -mt-10 px-4 sm:px-8 max-w-4xl mx-auto z-20">
        <div className="bg-ink-900/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl mb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full border bg-black/20 text-[11px] font-black uppercase tracking-wider ${COLOR_TEXTO_BORDE[propiedad.transaccion] || 'text-white border-white/20'}`}>{propiedad.transaccion}</span>
            <span className="text-[12px] font-mono font-bold text-white/40 tracking-widest">REF: {displayId}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">{propiedad.titulo}</h1>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="text-white/60 flex items-center justify-center sm:justify-start gap-1.5 text-base"><MapPin size={18} className="text-brand-400"/> {propiedad.direccion}, {propiedad.ciudad}</div>
            <div className="text-4xl sm:text-6xl font-black text-brand-400 tracking-tighter">{formatEUR(Number(propiedad.precio))}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[ { icon: Square, val: `${propiedad.metros_cuadrados}m²`, label: 'Superficie' }, { icon: BedDouble, val: propiedad.habitaciones, label: 'Habitaciones' }, { icon: Bath, val: propiedad.banos, label: 'Baños' }, { icon: Home, val: propiedad.tipo, label: 'Tipo' } ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center transition hover:bg-white/[0.04]"><item.icon className="mx-auto mb-3 text-white/20" size={28} strokeWidth={1.5} /><div className="text-xl sm:text-2xl font-bold text-white capitalize">{item.val || '-'}</div><div className="text-[11px] uppercase tracking-widest text-white/40 mt-1">{item.label}</div></div>
          ))}
        </div>

        <div className="mb-12">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            Memoria Descriptiva
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </h3>
          <div className="text-base sm:text-lg text-white/70 leading-relaxed font-light whitespace-pre-wrap max-w-3xl mx-auto text-center sm:text-left">
            {propiedad.descripcion || 'Propiedad exclusiva pendiente de descripción detallada.'}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          <span className="px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 text-sm text-white/60 flex items-center gap-2"><Tags size={16} className="text-brand-400"/> {propiedad.estado_fisico}</span>
        </div>

        {fotosArray.length > 1 && (
          <div className="mb-16">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon size={18} className="text-brand-400" /> Galería de la propiedad
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent ml-2" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fotosArray.map((fotoUrl: string, idx: number) => (
                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group bg-ink-900 cursor-pointer" onClick={() => { setFotoIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <img src={fotoUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-16 flex justify-center">
          <button 
            onClick={() => window.location.href = `/a/${propiedad.agencia_id}?an=${encodeURIComponent(agenciaFinal)}`}
            className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/[0.03] border border-brand-500/30 text-white font-bold hover:bg-brand-500/10 hover:border-brand-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] group"
          >
            <Building2 size={24} className="text-brand-400 group-hover:scale-110 transition-transform" />
            Ver otras propiedades de {agenciaFinal}
            <ArrowUpRight size={20} className="text-white/40 group-hover:text-white transition" />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-ink-950/80 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-center">
        <a href={urlWhatsApp} target="_blank" rel="noreferrer" className="flex-1 max-w-sm h-14 rounded-2xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#20b858] transition shadow-xl shadow-[#25D366]/20">
          <WhatsAppIcon size={24} /> Compartir vía WhatsApp
        </a>
      </div>
    </div>
  );
}