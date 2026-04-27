import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { 
  Building2, Search, FileText, X, 
  TrendingUp, MapPin, Printer, Info, CheckCircle2,
  BedDouble, Bath, Square, Home, FileSignature, QrCode, Loader2, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';

const PROVINCIAS: Record<string, { nombre: string, baseM2: number }> = {
  '01': { nombre: 'Álava', baseM2: 2523.50 }, '28': { nombre: 'Madrid', baseM2: 4561.67 }, '08': { nombre: 'Barcelona', baseM2: 3598.67 }, '46': { nombre: 'Valencia', baseM2: 2144.17 }
};

const generarIdVisual = (id: any) => { if (!id) return 'ID-000'; return `ID-${String(id).substring(0, 5).toUpperCase()}`; };

const formatAgencyName = (slug?: string) => {
  if (!slug) return 'Agencia Inmobiliaria';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function Informes() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [selectedProp, setSelectedProp] = useState<any | null>(null);
  const [planAgencia, setPlanAgencia] = useState<'estandar'|'premium'>('premium');

  useEffect(() => {
    const load = async () => {
      if (!perfil?.agencia_id) return;
      const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id);
      const { data: agData } = await supabase.from('agencias').select('plan').eq('id', perfil.agencia_id).single();
      setPropiedades(data || []);
      if (agData) setPlanAgencia(agData.plan as any);
      setLoading(false);
    };
    load();
  }, [perfil?.agencia_id]);

  if (planAgencia === 'estandar') {
    return (
      <Layout title="Informes CMA">
        <div className="py-24 text-center flex flex-col items-center">
          <Lock size={48} className="text-amber-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Función Premium</h2>
          <p className="text-white/40 max-w-sm mb-8 text-sm">Mejora tu plan para generar Informes de Valoración CMA profesionales y automáticos.</p>
        </div>
      </Layout>
    );
  }

  if (selectedProp) return <CMAReport propiedad={selectedProp} onClose={() => setSelectedProp(null)} />;

  const propsFiltradas = propiedades.filter(p => p.titulo.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <Layout title="Informes CMA">
      <PageHeader title="Informes de Valoración" subtitle="Genera análisis comparativos de mercado para tus clientes." />
      <div className="mb-6 relative max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} /><input className="input pl-10 bg-ink-900 border-white/10 text-[13px]" placeholder="Buscar propiedad..." value={filtro} onChange={(e) => setFiltro(e.target.value)} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {propsFiltradas.map(p => (
          <div key={p.id} className="card p-4 bg-ink-900 border-white/5 flex flex-col group relative">
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-ink-950/80 border border-white/10 text-[8px] font-mono text-white/60">{generarIdVisual(p.id)}</div>
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-ink-950 overflow-hidden border border-white/10 shrink-0">{p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-2 text-white/10" size={16}/>}</div>
              <div className="min-w-0 pr-8"><h3 className="text-[13px] font-bold text-white truncate">{p.titulo}</h3><p className="text-[9px] text-white/40 mt-1"><MapPin size={10} className="inline mr-1"/> {p.ciudad}</p></div>
            </div>
            <button onClick={() => setSelectedProp(p)} className="mt-auto w-full py-2 rounded-lg bg-white/5 text-white/70 text-[11px] font-bold hover:bg-brand-500 transition-all flex items-center justify-center gap-2"><FileText size={12} /> Generar Informe</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

function CMAReport({ propiedad, onClose }: any) {
  const { perfil } = useAuth();
  const displayId = generarIdVisual(propiedad.id);
  const nombreAgenciaFijo = propiedad.nombre_agencia || perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || formatAgencyName(perfil?.agencia_id);
  const valorEstimado = Number(propiedad.precio) || 250000;
  const publicUrl = `${window.location.origin}/p/${propiedad.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}&margin=1`;

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 overflow-y-auto print:static print:bg-white print:text-black w-full">
      <style>{`@media print { @page { size: A4; margin: 12mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; } .print\\:hidden { display: none !important; } }`}</style>
      <div className="sticky top-0 bg-ink-900 border-b border-white/10 px-6 py-3 flex justify-between items-center z-20 print:hidden">
        <button onClick={onClose} className="text-white/50 hover:text-white flex items-center gap-2 text-[13px]"><X size={16}/> Cerrar</button>
        <button onClick={() => window.print()} className="btn-primary text-[11px] py-1.5 px-4"><Printer size={14} /> Imprimir Informe</button>
      </div>
      {/* ESCALADO AL 70% PARA 1 FOLIO */}
      <div className="max-w-[800px] mx-auto p-6 print:p-0 print:max-w-full print:transform print:scale-[0.70] print:origin-top-left print:w-[142%]">
        <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-4 print:border-slate-300">
          <div><div className="text-brand-400 font-black text-2xl tracking-tighter uppercase print:text-brand-600">{nombreAgenciaFijo}</div><div className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold print:text-[9px] print:text-slate-500">Luxury CRM • Análisis de Mercado • {displayId}</div></div>
          <div className="text-right text-[8px] uppercase text-white/60 print:text-slate-500">Fecha: <strong>{new Date().toLocaleDateString()}</strong></div>
        </div>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-white mb-1 print:text-black leading-tight">{propiedad.titulo}</h1>
          <p className="text-white/50 flex items-center gap-1.5 text-[11px] mb-3 print:text-slate-600"><MapPin size={12}/> {propiedad.direccion}, {propiedad.ciudad}</p>
          <div className="h-32 sm:h-40 rounded-xl overflow-hidden border border-white/10 mb-4 print:border-slate-300">
            {propiedad.fotos?.[0] ? <img src={propiedad.fotos[0]} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/10"><Building2 size={24}/></div>}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[ {icon: Home, val: propiedad.tipo, label: 'Tipo'}, {icon: Square, val: `${propiedad.metros_cuadrados}m²`, label: 'Superficie'}, {icon: BedDouble, val: propiedad.habitaciones, label: 'Hab.'}, {icon: Bath, val: propiedad.banos, label: 'Baños'} ].map((item, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-white/5 border border-white/5 print:bg-slate-50 print:border-slate-200 text-center">
                <item.icon className="mx-auto mb-0.5 text-white/40 print:text-slate-400" size={14} />
                <div className="text-[10px] font-bold text-white print:text-black">{item.val || '-'}</div>
                <div className="text-[6px] uppercase text-white/40 print:text-[7px]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4"><h3 className="text-[9px] font-bold text-brand-400 uppercase mb-1.5">Memoria Descriptiva</h3><div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 print:border-l-2 print:border-brand-500 print:pl-3"><p className="text-[10px] text-white/70 leading-relaxed print:text-slate-700">{propiedad.descripcion || 'Propiedad pendiente de descripción.'}</p></div></div>
        <div className="grid grid-cols-2 gap-3 mb-4 print:break-inside-avoid">
          <div><h3 className="text-[9px] font-bold text-brand-400 uppercase mb-1.5">Valoración Sugerida</h3><div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 print:bg-slate-50"><div className="text-xl font-black text-brand-400 print:text-slate-900">{formatEUR(valorEstimado)}</div></div></div>
          <div><h3 className="text-[9px] font-bold text-brand-400 uppercase mb-1.5">Estrategia de Venta</h3><div className="p-3 rounded-lg bg-ink-950 border border-white/5 print:bg-slate-50 space-y-2.5">{[ {label: 'Óptima (3-6m)', val: valorEstimado}, {label: 'Aspiracional', val: valorEstimado * 1.07} ].map((s, i) => (<div key={i} className="flex justify-between text-[8px]"><span className="text-white/50 print:text-slate-600">{s.label}</span><span className="font-bold print:text-black">{formatEUR(s.val)}</span></div>))}</div></div>
        </div>
        <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4 print:bg-slate-50 print:break-inside-avoid">
           <img src={qrUrl} alt="QR" className="w-16 h-16 rounded-lg print:border border-slate-200" />
           <div><h4 className="text-[11px] font-bold text-white print:text-black">Ficha Interactiva VIP</h4><p className="text-[9px] text-white/60 print:text-slate-600 mt-0.5">Escanea para acceder a la galería y contacto directo con la agencia.</p></div>
        </div>
        <div className="mt-4 text-center text-[6px] text-white/20 uppercase print:text-slate-400">Documento generado por INMOFICINA.</div>
      </div>
    </div>
  );
}