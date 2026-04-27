import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { 
  Building2, Search, TrendingUp, MapPin, Printer, X, 
  Coins, BarChart3, PieChart, Landmark, ArrowUpRight, Percent, Loader2, QrCode
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

  useEffect(() => {
    const load = async () => {
      if (!perfil?.agencia_id) return;
      const { data } = await supabase.from('propiedades').select('*').eq('agencia_id', perfil.agencia_id).order('titulo');
      setPropiedades(data || []);
      setLoading(false);
    };
    load();
  }, [perfil?.agencia_id]);

  if (selectedProp) { return <InvestmentReport propiedad={selectedProp} onClose={() => setSelectedProp(null)} />; }

  const propsFiltradas = propiedades.filter(p => p.titulo.toLowerCase().includes(filtro.toLowerCase()) || p.ciudad?.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <Layout title="Dossier de Inversión">
      <PageHeader title="Dossier de Inversión" subtitle="Analiza la rentabilidad financiera y el ROI para tus clientes inversores." />
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
        <input className="input pl-10 bg-ink-900 border-white/10 text-[13px]" placeholder="Buscar propiedad..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </div>
      
      {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-400" /></div> : propsFiltradas.length === 0 ? <div className="text-center py-20 text-white/40">No hay propiedades.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {propsFiltradas.map(p => (
            <div key={p.id} className="card p-4 bg-ink-900 border-white/5 flex flex-col group relative">
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-ink-950/80 border border-white/10 text-[8px] font-mono text-white/60">
                {generarIdVisual(p.id)}
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-ink-950 overflow-hidden border border-white/10 shrink-0">
                  {p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-2 text-white/10" size={16}/>}
                </div>
                <div className="min-w-0 pr-8">
                  <h3 className="text-[13px] font-bold text-white truncate leading-tight">{p.titulo}</h3>
                  <p className="text-[9px] text-white/40 flex items-center gap-1 mt-1"><MapPin size={10}/> {p.ciudad}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProp(p)} className="mt-auto w-full py-2 rounded-lg bg-white/5 text-brand-400 text-[11px] font-bold hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2"><TrendingUp size={12} /> Dossier de inversión</button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

function InvestmentReport({ propiedad, onClose }: { propiedad: PropiedadInv, onClose: () => void }) {
  const { perfil } = useAuth();
  const displayId = generarIdVisual(propiedad.id);
  const precioCompra = Number(propiedad.precio || 300000);
  const gastosCompra = precioCompra * 0.12; 
  const inversionTotal = precioCompra + gastosCompra;
  
  const cpSufijo = Number((propiedad.codigo_postal || '28001').substring(2, 5));
  let yieldEstimado = 0.055;

  if (cpSufijo >= 1 && cpSufijo <= 9) yieldEstimado = 0.062; 
  else if (cpSufijo >= 10 && cpSufijo <= 25) yieldEstimado = 0.068; 
  else yieldEstimado = 0.075; 

  const est = (propiedad.estado_fisico || '').toLowerCase();
  if (est.includes('estrenar') || est.includes('nueva')) yieldEstimado += 0.015;
  else if (est.includes('buen') || est.includes('reformada')) yieldEstimado += 0.008;
  else if (est.includes('reformar')) yieldEstimado -= 0.02; 

  const t = (propiedad.tipo || '').toLowerCase();
  if (t.includes('ático') || t.includes('chalet')) yieldEstimado += 0.01;

  const ingresosAlquilerMes = (precioCompra * yieldEstimado) / 12;
  const gastosAnuales = precioCompra * 0.01; 
  const ingresosNetosAnuales = (ingresosAlquilerMes * 12) - gastosAnuales;
  const yieldNeto = (ingresosNetosAnuales / inversionTotal) * 100;

  const nombreAgenciaFijo = propiedad.nombre_agencia || perfil?.agencia || perfil?.nombre_agencia || perfil?.empresa || formatAgencyName(perfil?.agencia_id);
  const agenteNombre = perfil?.nombre || '';
  const agenteTelf = perfil?.telefono || '';
  const publicUrl = `${window.location.origin}/p/${propiedad.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}&margin=1`;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Dossier_Inversion_${displayId}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 overflow-y-auto print:static print:h-auto print:w-full print:bg-white print:overflow-visible print:text-slate-800">
      <style>{`@media print { @page { size: A4; margin: 12mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; } .print\\:hidden { display: none !important; } }`}</style>
      
      <div className="sticky top-0 bg-ink-900 border-b border-white/10 px-6 py-3 flex justify-between items-center z-20 print:hidden">
        <button onClick={onClose} className="text-white/50 hover:text-white flex items-center gap-2 text-[13px]"><X size={16}/> Cerrar</button>
        <button onClick={handlePrint} className="btn-primary text-[11px] py-1.5 px-4"><Printer size={14} /> Imprimir Dossier</button>
      </div>

      <div className="max-w-[800px] mx-auto p-4 sm:p-6 print:p-0 print:max-w-full print:transform print:scale-[0.90] print:origin-top-left print:w-[111%]">
        <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-4 print:border-slate-300">
          <div>
            <div className="text-brand-400 font-black text-xl sm:text-2xl tracking-tighter uppercase print:text-brand-600">{nombreAgenciaFijo}</div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold print:text-[9px] print:text-slate-500">Investment & Financial Report • {displayId}</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-white/60 uppercase print:text-[9px] print:text-slate-500">Confidencial • {new Date().getFullYear()}</div>
          </div>
        </div>

        <div className="mb-5">
          <h1 className="text-lg sm:text-xl font-bold text-white mb-1 print:text-lg print:text-black leading-tight">{propiedad.titulo}</h1>
          <p className="text-white/50 flex items-center gap-1.5 text-[11px] mb-3 print:text-[10px] print:text-slate-600"><MapPin size={12}/> {propiedad.direccion}, {propiedad.ciudad} {propiedad.codigo_postal}</p>
          <div className="h-32 sm:h-40 rounded-xl overflow-hidden border border-white/10 mb-4 print:h-32 print:border-slate-300">
            {propiedad.fotos?.[0] ? <img src={propiedad.fotos[0]} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/10"><Building2 size={24}/></div>}
          </div>
          
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 print:bg-slate-50 print:border-slate-200">
            <div className="text-[9px] text-white/40 uppercase font-bold mb-0.5 print:text-[9px] print:text-slate-500">Precio de Adquisición</div>
            <div className="text-xl font-black text-white print:text-xl print:text-black">{formatEUR(precioCompra)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 print:break-inside-avoid">
          <div className="text-center p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-50 print:border-slate-200">
            <Percent className="mx-auto mb-1 text-brand-400 print:text-blue-600" size={16} />
            <div className="text-lg font-black text-white print:text-lg print:text-black">{yieldNeto.toFixed(2)}%</div>
            <div className="text-[7px] text-white/40 uppercase font-bold print:text-[8px] print:text-slate-500">Yield Neto Anual</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-50 print:border-slate-200">
            <BarChart3 className="mx-auto mb-1 text-emerald-400 print:text-emerald-600" size={16} />
            <div className="text-lg font-black text-white print:text-lg print:text-black">{formatEUR(ingresosAlquilerMes)}</div>
            <div className="text-[7px] text-white/40 uppercase font-bold print:text-[8px] print:text-slate-500">Alquiler Mes (Est.)</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-50 print:border-slate-200">
            <Coins className="mx-auto mb-1 text-amber-400 print:text-amber-600" size={16} />
            <div className="text-lg font-black text-white print:text-lg print:text-black">{formatEUR(ingresosNetosAnuales)}</div>
            <div className="text-[7px] text-white/40 uppercase font-bold print:text-[8px] print:text-slate-500">Cash Flow Anual</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 print:break-inside-avoid">
          <div className="space-y-2">
            <h3 className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 print:text-[10px] print:text-slate-800"><Landmark size={12} className="text-brand-400 print:text-blue-600" /> Desglose</h3>
            <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200 text-[10px] print:text-[11px]">
              <div className="flex justify-between print:text-slate-700"><span>Precio Inmueble</span> <span className="font-bold print:text-black">{formatEUR(precioCompra)}</span></div>
              <div className="flex justify-between text-white/40 print:text-slate-600"><span>Gastos Adq. (12%)</span> <span>{formatEUR(gastosCompra)}</span></div>
              <div className="flex justify-between pt-1.5 border-t border-white/10 print:border-slate-300 font-black text-[11px] text-brand-400 print:text-[12px] print:text-blue-600"><span>INVERSIÓN TOTAL</span> <span>{formatEUR(inversionTotal)}</span></div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 print:text-[10px] print:text-slate-800"><PieChart size={12} className="text-brand-400 print:text-blue-600" /> A 5 años</h3>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200 flex items-center justify-between">
              <div><div className="text-[8px] text-white/40 uppercase font-bold mb-0.5 print:text-[9px] print:text-slate-500">Retorno Total Est.</div><div className="text-lg font-black text-emerald-400 print:text-lg print:text-emerald-600">{formatEUR(ingresosNetosAnuales * 5)}</div></div>
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
             <p className="text-[9px] text-white/60 print:text-slate-600 mt-0.5 max-w-sm">Escanea este código para acceder a la galería y contacto directo con la agencia.</p>
           </div>
        </div>
      </div>
    </div>
  );
}