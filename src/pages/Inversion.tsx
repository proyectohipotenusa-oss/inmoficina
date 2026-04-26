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

const generarIdVisual = (id: any) => {
  if (!id) return 'ID-000';
  return `ID-${String(id).substring(0, 5).toUpperCase()}`;
};

export default function Inversion() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [selectedProp, setSelectedProp] = useState<any | null>(null);

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
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input className="input pl-12 bg-ink-900 border-white/10" placeholder="Buscar propiedad..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </div>
      
      {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-400" /></div> : propsFiltradas.length === 0 ? <div className="text-center py-20 text-white/40">No hay propiedades.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propsFiltradas.map(p => (
            <div key={p.id} className="card p-5 bg-ink-900 border-white/5 flex flex-col group relative">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-ink-950/80 border border-white/10 text-[9px] font-mono text-white/60">
                {generarIdVisual(p.id)}
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-ink-950 overflow-hidden border border-white/10 shrink-0">
                  {p.fotos?.[0] ? <img src={p.fotos[0]} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-3 text-white/10" size={20}/>}
                </div>
                <div className="min-w-0 pr-8">
                  <h3 className="text-sm font-bold text-white truncate">{p.titulo}</h3>
                  <p className="text-[10px] text-white/40 flex items-center gap-1 mt-1"><MapPin size={10}/> {p.ciudad}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProp(p)} className="mt-auto w-full py-2.5 rounded-xl bg-white/5 text-brand-400 text-[11px] font-bold hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2"><TrendingUp size={14} /> Dossier de inversión</button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

function InvestmentReport({ propiedad, onClose }: { propiedad: any, onClose: () => void }) {
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

  // TU AGENCIA COMO TÍTULO
  const nombreAgenciaFijo = propiedad.nombre_agencia || perfil?.agencia || perfil?.nombre_agencia || 'TU INMOBILIARIA';
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
      <div className="sticky top-0 bg-ink-900 border-b border-white/10 px-6 py-3 flex justify-between items-center z-20 print:hidden">
        <button onClick={onClose} className="text-white/50 hover:text-white flex items-center gap-2 text-sm"><X size={18}/> Cerrar</button>
        <button onClick={handlePrint} className="btn-primary text-xs py-1.5 px-4"><Printer size={16} /> Imprimir Dossier</button>
      </div>

      <div className="max-w-[800px] mx-auto p-8 print:p-0 print:max-w-none">
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6 print:border-slate-300">
          <div>
            {/* EL NOMBRE DE TU AGENCIA AHORA AQUÍ */}
            <div className="text-brand-400 font-black text-2xl tracking-tighter uppercase">{nombreAgenciaFijo}</div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold print:text-[10px] print:text-slate-500">Investment & Financial Report • {displayId}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-white/60 uppercase print:text-xs">Confidencial • {new Date().getFullYear()}</div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-white mb-1 print:text-2xl print:text-black leading-tight">{propiedad.titulo}</h1>
          <p className="text-white/50 flex items-center gap-1.5 text-xs mb-4 print:text-sm print:text-slate-600"><MapPin size={14}/> {propiedad.direccion}, {propiedad.ciudad} {propiedad.codigo_postal}</p>
          <div className="h-40 rounded-xl overflow-hidden border border-white/10 mb-6 print:border-slate-300">
            {propiedad.fotos?.[0] ? <img src={propiedad.fotos[0]} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/10"><Building2 size={32}/></div>}
          </div>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 print:bg-slate-50 print:border-slate-200">
            <div className="text-[10px] text-white/40 uppercase font-bold mb-1 print:text-[10px] print:text-slate-500">Precio de Adquisición</div>
            <div className="text-2xl font-black text-white print:text-2xl print:text-black">{formatEUR(precioCompra)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 print:break-inside-avoid">
          <div className="text-center p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-50 print:border-slate-200">
            <Percent className="mx-auto mb-1.5 text-brand-400 print:text-blue-600" size={20} />
            <div className="text-xl font-black text-white print:text-xl print:text-black">{yieldNeto.toFixed(2)}%</div>
            <div className="text-[8px] text-white/40 uppercase font-bold print:text-[10px] print:text-slate-500">Yield Neto Anual</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-50 print:border-slate-200">
            <BarChart3 className="mx-auto mb-1.5 text-emerald-400 print:text-emerald-600" size={20} />
            <div className="text-xl font-black text-white print:text-xl print:text-black">{formatEUR(ingresosAlquilerMes)}</div>
            <div className="text-[8px] text-white/40 uppercase font-bold print:text-[10px] print:text-slate-500">Alquiler Mes (Est.)</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-50 print:border-slate-200">
            <Coins className="mx-auto mb-1.5 text-amber-400 print:text-amber-600" size={20} />
            <div className="text-xl font-black text-white print:text-xl print:text-black">{formatEUR(ingresosNetosAnuales)}</div>
            <div className="text-[8px] text-white/40 uppercase font-bold print:text-[10px] print:text-slate-500">Cash Flow Anual</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 print:break-inside-avoid">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 print:text-xs print:text-slate-800"><Landmark size={14} className="text-brand-400 print:text-blue-600" /> Desglose</h3>
            <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200 text-[11px] print:text-sm">
              <div className="flex justify-between print:text-slate-700"><span>Precio Inmueble</span> <span className="font-bold print:text-black">{formatEUR(precioCompra)}</span></div>
              <div className="flex justify-between text-white/40 print:text-slate-600"><span>Gastos Adq. (12%)</span> <span>{formatEUR(gastosCompra)}</span></div>
              <div className="flex justify-between pt-2 border-t border-white/10 print:border-slate-300 font-black text-sm text-brand-400 print:text-base print:text-blue-600"><span>INVERSIÓN TOTAL</span> <span>{formatEUR(inversionTotal)}</span></div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 print:text-xs print:text-slate-800"><PieChart size={14} className="text-brand-400 print:text-blue-600" /> A 5 años</h3>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200 flex items-center justify-between">
              <div><div className="text-[9px] text-white/40 uppercase font-bold mb-0.5 print:text-[10px] print:text-slate-500">Retorno Total Est.</div><div className="text-xl font-black text-emerald-400 print:text-xl print:text-emerald-600">{formatEUR(ingresosNetosAnuales * 5)}</div></div>
              <ArrowUpRight size={24} className="text-emerald-500/20 print:text-emerald-200" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 print:bg-slate-100 print:border-slate-200 text-center print:break-inside-avoid">
          <p className="text-white/60 italic text-[11px] print:text-xs print:text-slate-700">"Activo con perfil de riesgo bajo y rentabilidad estable. Ideal para diversificación patrimonial."</p>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-6 print:bg-slate-50 print:border-slate-300 print:break-inside-avoid">
           <img src={qrUrl} alt="QR Ficha VIP" className="w-20 h-20 rounded-lg print:border print:border-slate-200" />
           <div>
             <h4 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5"><QrCode size={16} className="text-brand-400 print:text-brand-600"/> Ficha Interactiva VIP</h4>
             <p className="text-[11px] text-white/60 print:text-slate-600 mt-1 max-w-sm">Escanea este código con la cámara de tu móvil para acceder a la galería completa, detalles inmersivos y contacto directo con la agencia.</p>
           </div>
        </div>

      </div>
    </div>
  );
}