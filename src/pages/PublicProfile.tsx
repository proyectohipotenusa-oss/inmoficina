import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { supabase } from '../lib/supabase';
import { Building2, MapPin, BedDouble, Bath, Square, Mail, Phone, Loader2 } from 'lucide-react';
import { formatEUR } from '../lib/format';
import { Logo } from '../components/Logo';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

export default function PublicProfile() {
  const [, params] = useRoute('/u/:slug');
  const [agente, setAgente] = useState<any>(null);
  const [nombreAgencia, setNombreAgencia] = useState<string>('');
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      let { data: userData } = await supabase.from('perfiles').select('*').eq('slug', params.slug).single();
      if (!userData) {
        const { data: fallbackData } = await supabase.from('perfiles').select('*').eq('id', params.slug).single();
        userData = fallbackData;
      }

      setAgente(userData);

      if (userData?.agencia_id) {
        const { data: agData } = await supabase.from('agencias').select('nombre').eq('id', userData.agencia_id).single();
        if (agData) setNombreAgencia(agData.nombre);

        const { data: propsData } = await supabase
          .from('propiedades')
          .select('*')
          .eq('agencia_id', userData.agencia_id)
          .in('transaccion', ['Disponible para venta', 'Disponible para alquiler', 'Venta y alquiler'])
          .order('created_at', { ascending: false });
        setPropiedades(propsData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [params?.slug]);

  if (loading) return <div className="min-h-screen bg-ink-950 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={32} /></div>;
  
  if (!agente) return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center text-center px-6">
      <Logo size={48} />
      <div className="mt-8 text-2xl font-medium text-white/50">Agente no encontrado</div>
      <p className="mt-2 text-sm text-white/30">Comprueba que el enlace sea correcto.</p>
    </div>
  );

  const emailContacto = agente.email_publico || agente.email;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          .font-premium { font-family: 'Outfit', sans-serif; }
        `}
      </style>

      <div className="min-h-screen bg-ink-950 text-white font-premium selection:bg-brand-500/30 pb-20">
        {/* CABECERA ACTUALIZADA: Estilo idéntico al CRM interno */}
        <header className="sticky top-0 z-30 h-20 bg-ink-900/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
             <Logo size={52} />
             <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-baseline gap-2">
              <span className="text-white">Inmoficina</span>
              <span className="text-brand-400 text-xs md:text-sm tracking-widest uppercase font-semibold">Luxury CRM</span>
            </h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pt-10 animate-fade-in">
          <div className="card p-6 md:p-8 bg-ink-900 border-white/5 relative overflow-hidden mb-12 max-w-4xl mx-auto shadow-2xl">
            <div className="absolute inset-0 bg-brand-gradient opacity-5 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              
              <div className="h-28 w-28 rounded-2xl bg-ink-950 flex items-center justify-center text-3xl font-bold shadow-inner text-white border border-white/10 shrink-0 overflow-hidden">
                {agente.avatar_url ? (
                  <img src={agente.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (agente.nombre || agente.email).slice(0, 1).toUpperCase()
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 justify-center md:justify-start">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{agente.nombre}</h1>
                  {nombreAgencia && (
                    <span className="text-brand-400/80 font-medium text-[13px] flex items-center gap-1.5 before:content-['|'] before:hidden md:before:inline-block before:text-white/20">
                      {nombreAgencia}
                    </span>
                  )}
                </div>
                
                <p className="text-white/40 font-semibold uppercase tracking-widest text-[10px] mt-1.5 mb-4">
                  Agente Inmobiliario
                </p>
                
                {agente.bio && <p className="text-white/60 mt-3 text-[13px] max-w-2xl leading-relaxed mx-auto md:mx-0">{agente.bio}</p>}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
                  <a href={`mailto:${emailContacto}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-[12px] font-medium text-white/80 hover:text-white">
                    <Mail size={14} className="text-white/40" /> {emailContacto}
                  </a>
                  {agente.telefono && (
                    <>
                      <a href={`https://wa.me/${agente.telefono.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition text-[12px] font-medium text-[#25D366]">
                        <WhatsAppIcon size={14} /> WhatsApp
                      </a>
                      <a href={`tel:${agente.telefono.replace(/\s+/g, '')}`} className="flex items-center justify-center h-[34px] w-[34px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-white/80 hover:text-white" title="Llamar por teléfono">
                        <Phone size={14} />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white/90 mb-5 pl-2">Cartera de Propiedades</h2>

          {propiedades.length === 0 ? (
            <div className="py-16 text-center border border-white/5 border-dashed rounded-2xl text-[13px] text-white/40">
              No hay propiedades disponibles en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {propiedades.map((p) => (
                <div key={p.id} className="card p-0 overflow-hidden group hover:border-white/10 transition-all duration-300">
                  <div className="relative aspect-[16/11] bg-ink-900 overflow-hidden">
                    {p.fotos && p.fotos.length > 0 ? (
                      <img src={p.fotos[0]} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10"><Building2 size={28} /></div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-ink-950/80 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase tracking-wider text-white">
                      {p.transaccion}
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-[13px] font-semibold text-white/90 truncate leading-tight">{p.titulo}</h3>
                      <div className="text-brand-400 font-bold text-[13px] whitespace-nowrap">{formatEUR(p.precio)}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] mb-3">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{p.direccion}{p.ciudad ? `, ${p.ciudad}` : ''}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 px-1">
                      <div className="flex items-center gap-1"><BedDouble size={12} className="text-white/20" /><span className="text-[10px] font-medium text-white/60">{p.habitaciones || 0}</span></div>
                      <div className="w-px h-2.5 bg-white/10" />
                      <div className="flex items-center gap-1"><Bath size={12} className="text-white/20" /><span className="text-[10px] font-medium text-white/60">{p.banos || 0}</span></div>
                      <div className="w-px h-2.5 bg-white/10" />
                      <div className="flex items-center gap-1"><Square size={10} className="text-white/20" /><span className="text-[10px] font-medium text-white/60">{p.metros_cuadrados || 0}m²</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}