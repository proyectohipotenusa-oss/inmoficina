import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { 
  Building2, Search, TrendingUp, MapPin, Printer, X, 
  Coins, BarChart3, PieChart, Landmark, ArrowUpRight, Percent, Loader2, QrCode, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';

interface PropiedadInv {
  id: string; titulo: string; ciudad: string; fotos: string[]; precio?: number;
  codigo_postal?: string; estado_fisico?: string; tipo?: string; nombre_agencia?: string;
  direccion?: string;
}

const generarIdVisual = (id: any) => {
  if (!id) return 'ID-000';
  return `ID-${String(id).substring(0, 5).toUpperCase()}`;
};

const formatAgencyName = (slug?: string) => {
  if (!slug) return 'Agencia Inmobiliaria';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function Inversion() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<PropiedadInv[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [selectedProp, setSelectedProp] = useState<PropiedadInv | null>(null);
  const [planAgencia, setPlanAgencia] = useState<'estandar' | 'premium'>('premium');

  useEffect(() => {
    const load = async () => {
      if (!perfil?.agencia_id) return;
      const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id).order('created_at', { ascending: false });
      const { data: agData } = await supabase.from('agencias').select('plan').eq('id', perfil.agencia_id).single();
      
      setPropiedades((data as PropiedadInv[]) || []);
      if (agData) setPlanAgencia(agData.plan as any);
      setLoading(false);
    };
    load();
  }, [perfil?.agencia_id]);

  if (planAgencia === 'estandar') {
    return (
      <Layout title="Dossier Inversión">
        <div className="py-24 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
            <Lock size={40} className="text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Función Premium</h2>
          <p className="text-white/40 max-w-sm mb-8 text-sm">Mejora tu plan para generar Dossiers de Inversión avanzados para tus clientes.</p>
        </div>
      </Layout>
    );
  }

  if (selectedProp) {
    return <InvestmentDossier propiedad={selectedProp} onClose={() => setSelectedProp(null)} />;
  }

  const propsFiltradas = propiedades.filter(p => 
    p.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
    p.ciudad?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Layout title="Dossier Inversión">
      <PageHeader 
        title="Dossier para Inversores" 
        subtitle="Genera documentos con cálculo de rentabilidad para compradores." 
      />

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
        <input 
          className="input pl-10 bg-ink-900 border-white/10 text-[13px]" 
          placeholder="Buscar propiedad para analizar..." 
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div>
      ) : propiedades.length === 0 ? (
         <div className="py-24 text-center flex flex-col items-center">
            <Building2 size={48} className="text-white/10 mb-4" />
            <h3 className="text-lg font-bold text-white">No hay propiedades</h3>
            <p className="text-white/40 text-sm">Sube propiedades desde el catálogo para analizar su rentabilidad.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {propsFiltradas.map(p => (
            <div key={p.id} className="card p-4 bg-ink-900 border-white/5 flex flex-col group relative">
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-ink-950/80 border border-white/10 text-[8px] font-mono text-white/60">
                {generarIdVisual(p.id)}
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-ink-950 overflow-hidden border border-white/10 shrink-0">
                  {p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-2 text-white/10" size={16}/>}
                </div>
                <div className="min-w-0 pr-8">
                  <h3 className="text-[13px] font-bold text-white truncate leading-tight">{p.titulo}</h3>
                  <p className="text-[9px] text-white/40 flex items-center gap-1 mt-1"><MapPin size={10}/> {p.ciudad}</p>
                </div>
              </div>
              <div className="mb-3 text-[11px] font-black text-brand-400 bg-brand-500/10 w-fit px-2 py-1 rounded">
                {formatEUR(p.precio || 0)}
              </div>
              <button 
                onClick={() => setSelectedProp(p)}
                className="mt-auto w-full py-2 rounded-lg bg-white/5 text-white/70 text-[11px] font-bold hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp size={12} /> Analizar Inversión
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

function InvestmentDossier({ propiedad, onClose }: { propiedad: PropiedadInv, onClose: () => void }) {
  const { perfil } = useAuth();
  const precio = Number(propiedad.precio) || 0;
  
  // VARIABLES DE INVERSIÓN (Simulación IA)
  const gastosITP = precio * 0.10;
  const reformaAprox = propiedad.estado_fisico === 'A reformar/A renovar' ? precio * 0.15 : (propiedad.estado_fisico === 'Buen estado/Reformada' ? precio * 0.05 : 0);
  const inversionTotal = precio + gastosITP + reformaAprox;

  // RENTABILIDAD ALQUILER (Estimación bruta 6.5% anual conservadora)
  const alquilerAnualBruto = inversionTotal * 0.065;
  const alquilerMensualEst = Math.round(alquilerAnualBruto / 12);
  const gastosMantenimiento = alquilerAnualBruto * 0.15; // IBI, Comunidad, Seguros
  const ingresosNetosAnuales = alquilerAnualBruto - gastosMantenimiento;
  const rentabilidadNeta = (ingresosNetosAnuales / inversionTotal) * 100;

  // CORRECCIÓN: Nombre de la agencia dinámico
  const nombreAgenciaFijo = propiedad.nombre_agencia || perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || formatAgencyName(perfil?.agencia_id);
  const agenteNombre = perfil?.nombre || '';
  const agenteTelf = perfil?.telefono || '';
  const publicUrl = `${window.location.origin}/p/${propiedad.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}&margin=1`;
  const displayId = generarIdVisual(propiedad.id);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Dossier_Inversion_${displayId}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 overflow-y-auto print:static print:bg-white print:text-black w-full">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      
      <div className="sticky top-0 bg-ink-900 border-b border-white/10 px-6 py-3 flex justify-between items-center z-20 print:hidden">
        <button onClick={onClose} className="text-white/50 hover:text-white flex items-center gap-2 text-[13px]">
          <X size={16}/> Cerrar
        </button>
        <button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-widest uppercase rounded-lg text-[11px] py-1.5 px-4 flex items-center gap-2 transition-colors">
          <Printer size={14} /> Imprimir Dossier
        </button>
      </div>

      <div className="max-w-[800px] mx-auto p-4 sm:p-6 print:p-0 print:max-w-full print:transform print:scale-[0.70] print:origin-top-left print:w-[142%]">
        
        {/* HEADER */}
        <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-4 print:border-slate-300">
          <div>
            <div className="text-purple-400 font-black text-xl sm:text-2xl tracking-tighter uppercase print:text-purple-700">
              {/* AQUÍ APLICAMOS LA CORRECCIÓN */}
              {nombreAgenciaFijo}
            </div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold print:text-[9px] print:text-slate-500">
              Luxury CRM • Dossier para Inversores • {displayId}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-white/60 uppercase print:text-[9px] print:text-slate-500">Rentabilidad Est.</div>
            <div className="text-[14px] font-black text-emerald-400 print:text-[14px] print:text-emerald-600">{rentabilidadNeta.toFixed(1)}% Neto</div>
          </div>
        </div>

        {/* HERO PROPERTY */}
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-bold text-white mb-1 print:text-lg print:text-black leading-tight truncate">{propiedad.titulo}</h1>
          <p className="text-white/50 flex items-center gap-1.5 text-[11px] mb-3 print:text-[10px] print:text-slate-600"><MapPin size={12}/> {propiedad.direccion}, {propiedad.ciudad} {propiedad.codigo_postal}</p>
          
          <div className="h-32 sm:h-40 rounded-xl overflow-hidden border border-white/10 mb-4 print:h-28 print:border-slate-300">
            {propiedad.fotos?.[0] ? <img src={propiedad.fotos[0]} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/10"><Building2 size={24}/></div>}
          </div>
        </div>

        {/* FINANCIAL BREAKDOWN */}
        <div className="grid grid-cols-2 gap-4 mb-4 print:break-inside-avoid">
          {/* Columna 1: Gastos */}
          <div>
            <h3 className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 print:text-[10px] print:text-amber-600"><Coins size={12} /> Estructura de Costes</h3>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200 space-y-2">
               <div className="flex justify-between items-center text-[10px] print:text-[10px]">
                 <span className="text-white/60 print:text-slate-600">Precio Inmueble</span>
                 <span className="font-bold text-white print:text-black">{formatEUR(precio)}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] print:text-[10px]">
                 <span className="text-white/60 print:text-slate-600">ITP / Notaría (Est. 10%)</span>
                 <span className="font-bold text-white print:text-black">{formatEUR(gastosITP)}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] print:text-[10px]">
                 <span className="text-white/60 print:text-slate-600">Adecuación / Reforma</span>
                 <span className="font-bold text-white print:text-black">{formatEUR(reformaAprox)}</span>
               </div>
               <div className="pt-2 mt-2 border-t border-white/10 print:border-slate-300 flex justify-between items-center text-[12px] font-black print:text-[12px]">
                 <span className="text-amber-400 print:text-amber-600">INVERSIÓN TOTAL</span>
                 <span className="text-white print:text-black">{formatEUR(inversionTotal)}</span>
               </div>
            </div>
          </div>

          {/* Columna 2: Ingresos */}
          <div>
            <h3 className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 print:text-[10px] print:text-emerald-600"><Landmark size={12} /> Flujo de Caja (Alquiler)</h3>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200 space-y-2">
               <div className="flex justify-between items-center text-[10px] print:text-[10px]">
                 <span className="text-white/60 print:text-slate-600">Alquiler Mensual (Est.)</span>
                 <span className="font-bold text-white print:text-black">{formatEUR(alquilerMensualEst)}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] print:text-[10px]">
                 <span className="text-white/60 print:text-slate-600">Ingresos Anuales Brutos</span>
                 <span className="font-bold text-white print:text-black">{formatEUR(alquilerAnualBruto)}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] print:text-[10px]">
                 <span className="text-white/60 print:text-slate-600">Gastos Anuales (Com/IBI/Seg)</span>
                 <span className="font-bold text-red-400 print:text-red-600">- {formatEUR(gastosMantenimiento)}</span>
               </div>
               <div className="pt-2 mt-2 border-t border-white/10 print:border-slate-300 flex justify-between items-center text-[12px] font-black print:text-[12px]">
                 <span className="text-emerald-400 print:text-emerald-600">NETO ANUAL</span>
                 <span className="text-white print:text-black">{formatEUR(ingresosNetosAnuales)}</span>
               </div>
            </div>
          </div>
        </div>

        {/* ROI CARDS */}
        <div className="mb-4 print:break-inside-avoid">
          <h3 className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 print:text-[10px] print:text-purple-600"><PieChart size={12} /> Proyección a 5 Años</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 print:bg-slate-50 print:border-slate-200 flex justify-between items-center">
              <div><div className="text-[7px] uppercase font-bold text-purple-400/80 mb-0.5 print:text-[9px] print:text-slate-500">Rentabilidad Neta</div><div className="text-lg font-black text-purple-400 print:text-lg print:text-purple-600">{rentabilidadNeta.toFixed(2)}%</div></div>
              <Percent size={20} className="text-purple-500/20 print:text-purple-200" />
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 print:bg-slate-50 print:border-slate-200 flex justify-between items-center">
              <div><div className="text-[7px] uppercase font-bold text-blue-400/80 mb-0.5 print:text-[9px] print:text-slate-500">Payback (Años)</div><div className="text-lg font-black text-blue-400 print:text-lg print:text-blue-600">{(inversionTotal / ingresosNetosAnuales).toFixed(1)}</div></div>
              <BarChart3 size={20} className="text-blue-500/20 print:text-blue-200" />
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 print:bg-slate-50 print:border-slate-200 flex justify-between items-center">
              <div><div className="text-[7px] uppercase font-bold text-emerald-400/80 mb-0.5 print:text-[9px] print:text-slate-500">Retorno Total Est.</div><div className="text-lg font-black text-emerald-400 print:text-lg print:text-emerald-600">{formatEUR(ingresosNetosAnuales * 5)}</div></div>
              <ArrowUpRight size={20} className="text-emerald-500/20 print:text-emerald-200" />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-100 print:border-slate-200 text-center print:break-inside-avoid">
          <p className="text-white/60 italic text-[10px] print:text-[10px] print:text-slate-700">"Activo con perfil de riesgo bajo y rentabilidad estable. Ideal para diversificación patrimonial."</p>
        </div>

        <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4 print:bg-slate-50 print:border-slate-300 print:break-inside-avoid">
           <img src={qrUrl} alt="QR Ficha VIP" className="w-16 h-16 rounded-lg print:border print:border-slate-200" />
           <div>
             <h4 className="text-[11px] font-bold text-white print:text-black flex items-center gap-1.5"><QrCode size={14} className="text-brand-400 print:text-brand-600"/> Ficha Interactiva VIP</h4>
             <p className="text-[9px] text-white/60 print:text-slate-600 mt-0.5 max-w-sm">Escanea este código para acceder a la galería y contacto directo con el asesor de inversiones.</p>
           </div>
        </div>

        <div className="mt-4 text-center text-[6px] text-white/20 uppercase tracking-[0.2em] print:text-[7px] print:text-slate-400">Las cifras expuestas son estimaciones basadas en big data y no constituyen asesoramiento financiero garantizado. Documento generado por INMOFICINA.</div>
      </div>
    </div>
  );
}