import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { supabase } from '../lib/supabase';
import { Building2, MapPin, BedDouble, Bath, Square, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatEUR } from '../lib/format';

const formatAgencyName = (slug?: string) => {
  if (!slug) return 'Tu Inmobiliaria';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function CatalogoPublico() {
  const [match, params] = useRoute('/a/:agencia_id');
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LA CORRECCIÓN ESTÁ AQUÍ (añadido el espacio de "new URLSearchParams")
  const searchParams = new URLSearchParams(window.location.search);
  const nombreAgente = searchParams.get('un') || '';
  const telefonoAgente = searchParams.get('t') || '';
  
  // LA AGENCIA DEFINITIVA EN EL CATÁLOGO
  const [nombreAgenciaPublico, setNombreAgenciaPublico] = useState(searchParams.get('an') || formatAgencyName(params?.agencia_id));

  useEffect(() => {
    if (!match || !params?.agencia_id) return;
    
    const fetchProps = async () => {
      try {
        const { data, error } = await supabase
          .from('propiedades')
          .select('*')
          .eq('agencia_id', params.agencia_id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const disponibles = (data || []).filter(p => !['Vendida', 'Alquilada'].includes(p.transaccion));
        setPropiedades(disponibles);

        // Si la propiedad tiene el nombre_agencia guardado de fábrica, lo usamos para el título del Catálogo
        if (data && data.length > 0 && data[0].nombre_agencia) {
           setNombreAgenciaPublico(data[0].nombre_agencia);
        }

      } catch (err) {
        console.error('Error cargando catálogo:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProps();
  }, [match, params?.agencia_id]);

  const abrirPropiedad = (id: string) => {
    window.location.href = `/p/${id}?an=${encodeURIComponent(nombreAgenciaPublico)}&un=${encodeURIComponent(nombreAgente)}&t=${encodeURIComponent(telefonoAgente)}`;
  };

  if (loading) return <div className="min-h-screen bg-ink-950 flex items-center justify-center text-brand-400 animate-pulse font-mono tracking-widest text-sm">CARGANDO CATÁLOGO...</div>;
  if (propiedades.length === 0) return <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 text-center"><AlertCircle size={48} className="text-white/20 mb-4" /><h2 className="text-xl font-bold text-white mb-2">No hay propiedades disponibles</h2></div>;

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans selection:bg-brand-500/30">
      
      {/* HEADER DEL CATÁLOGO */}
      <div className="relative pt-16 pb-12 px-6 border-b border-white/5 bg-ink-900/50">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] mb-6">
            <img 
              src="https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png" 
              alt="Logo" 
              className="w-full h-full object-contain bg-transparent" 
            />
          </div>
          <h1 className="text-[12px] font-black tracking-[0.3em] uppercase text-brand-400 mb-4">Catálogo Exclusivo</h1>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            {nombreAgenciaPublico}
          </h2>
          <p className="mt-4 text-white/50 text-sm max-w-lg">Explora nuestra cuidada selección de propiedades disponibles. Encuentra tu próximo hogar o tu mejor inversión.</p>
        </div>
      </div>

      {/* GRID DE PROPIEDADES */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((p) => {
            const fotoPortada = Array.isArray(p.fotos) && p.fotos.length > 0 ? p.fotos[0] : null;
            
            return (
              <div key={p.id} onClick={() => abrirPropiedad(p.id)} className="card p-0 bg-ink-900 border-white/5 overflow-hidden group hover:border-brand-500/50 transition-all duration-500 cursor-pointer flex flex-col relative shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                
                <div className="relative aspect-[4/3] bg-ink-950 overflow-hidden">
                  {fotoPortada ? (
                    <img src={fotoPortada} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10"><Building2 size={32} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white">{p.transaccion}</div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-2xl font-black text-brand-400">{formatEUR(Number(p.precio) || 0)}</div>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-white leading-tight mb-2 group-hover:text-brand-400 transition-colors">{p.titulo}</h3>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs mb-4">
                    <MapPin size={14} className="shrink-0" /><span className="truncate">{p.direccion}, {p.ciudad}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-white/60">
                    <div className="flex items-center gap-1.5"><BedDouble size={14} /> <span className="text-xs font-bold">{p.habitaciones || 0}</span></div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5"><Bath size={14} /> <span className="text-xs font-bold">{p.banos || 0}</span></div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5"><Square size={12} /> <span className="text-xs font-bold">{p.metros_cuadrados || 0}m²</span></div>
                  </div>
                  
                  <div className="mt-5 w-full py-3 rounded-xl bg-white/[0.03] text-white/80 text-xs font-bold text-center group-hover:bg-brand-500 group-hover:text-white transition flex items-center justify-center gap-2">
                    Ver Detalles <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}