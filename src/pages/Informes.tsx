import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { 
  Building2, Search, FileText, Loader2, X, 
  TrendingUp, MapPin, Printer, Info, CheckCircle2,
  BedDouble, Bath, Square, Home, Tags, FileSignature, QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatEUR } from '../lib/format';

const PROVINCIAS: Record<string, { nombre: string, baseM2: number }> = {
  '01': { nombre: 'Álava', baseM2: 2523.50 }, '02': { nombre: 'Albacete', baseM2: 1381.33 },
  '03': { nombre: 'Alicante', baseM2: 2525.17 }, '04': { nombre: 'Almería', baseM2: 1600.67 },
  '05': { nombre: 'Ávila', baseM2: 1195.50 }, '06': { nombre: 'Badajoz', baseM2: 1147.00 },
  '07': { nombre: 'Baleares', baseM2: 4787.83 }, '08': { nombre: 'Barcelona', baseM2: 3598.67 },
  '09': { nombre: 'Burgos', baseM2: 1552.50 }, '10': { nombre: 'Cáceres', baseM2: 1135.33 },
  '11': { nombre: 'Cádiz', baseM2: 2103.83 }, '12': { nombre: 'Castellón', baseM2: 1584.67 },
  '13': { nombre: 'Ciudad Real', baseM2: 970.33 }, '14': { nombre: 'Córdoba', baseM2: 1496.17 },
  '15': { nombre: 'A Coruña', baseM2: 2001.33 }, '16': { nombre: 'Cuenca', baseM2: 1018.50 },
  '17': { nombre: 'Girona', baseM2: 2850.67 }, '18': { nombre: 'Granada', baseM2: 1868.67 },
  '19': { nombre: 'Guadalajara', baseM2: 1565.50 }, '20': { nombre: 'Gipuzkoa', baseM2: 3960.17 },
  '21': { nombre: 'Huelva', baseM2: 1583.00 }, '22': { nombre: 'Huesca', baseM2: 1565.50 },
  '23': { nombre: 'Jaén', baseM2: 1052.67 }, '24': { nombre: 'León', baseM2: 1315.50 },
  '25': { nombre: 'Lleida', baseM2: 1552.17 }, '26': { nombre: 'La Rioja', baseM2: 1600.50 },
  '27': { nombre: 'Lugo', baseM2: 1231.00 }, '28': { nombre: 'Madrid', baseM2: 4561.67 },
  '29': { nombre: 'Málaga', baseM2: 3695.67 }, '30': { nombre: 'Murcia', baseM2: 1681.00 },
  '31': { nombre: 'Navarra', baseM2: 1998.17 }, '32': { nombre: 'Ourense', baseM2: 1263.33 },
  '33': { nombre: 'Asturias', baseM2: 1749.67 }, '34': { nombre: 'Palencia', baseM2: 1267.17 },
  '35': { nombre: 'Las Palmas', baseM2: 2671.33 }, '36': { nombre: 'Pontevedra', baseM2: 1855.00 },
  '37': { nombre: 'Salamanca', baseM2: 1607.50 }, '38': { nombre: 'S.C. Tenerife', baseM2: 2981.67 },
  '39': { nombre: 'Cantabria', baseM2: 2048.33 }, '40': { nombre: 'Segovia', baseM2: 1528.50 },
  '41': { nombre: 'Sevilla', baseM2: 2097.67 }, '42': { nombre: 'Soria', baseM2: 1144.17 },
  '43': { nombre: 'Tarragona', baseM2: 1943.83 }, '44': { nombre: 'Teruel', baseM2: 1027.17 },
  '45': { nombre: 'Toledo', baseM2: 1299.67 }, '46': { nombre: 'Valencia', baseM2: 2144.17 },
  '47': { nombre: 'Valladolid', baseM2: 1652.00 }, '48': { nombre: 'Bizkaia', baseM2: 3295.17 },
  '49': { nombre: 'Zamora', baseM2: 1082.67 }, '50': { nombre: 'Zaragoza', baseM2: 1825.50 },
  '51': { nombre: 'Ceuta', baseM2: 2175.17 }, '52': { nombre: 'Melilla', baseM2: 1965.33 }
};

const generarIdVisual = (id: any) => {
  if (!id) return 'ID-000';
  return `ID-${String(id).substring(0, 5).toUpperCase()}`;
};

export default function Informes() {
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

  if (selectedProp) { return <CMAReport propiedad={selectedProp} onClose={() => setSelectedProp(null)} />; }

  const propsFiltradas = propiedades.filter(p => p.titulo.toLowerCase().includes(filtro.toLowerCase()) || p.ciudad?.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <Layout title="Informes CMA">
      <PageHeader title="Informes de Valoración" subtitle="Genera análisis comparativos de mercado para tus clientes." />
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input className="input pl-12 bg-ink-900 border-white/10" placeholder="Buscar propiedad..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </div>
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
            <button onClick={() => setSelectedProp(p)} className="mt-auto w-full py-2.5 rounded-xl bg-white/5 text-white/70 text-[11px] font-bold hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2"><FileText size={14} /> Generar Informe</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

function CMAReport({ propiedad, onClose }: { propiedad: any, onClose: () => void }) {
  const { perfil } = useAuth();
  const displayId = generarIdVisual(propiedad.id);

  const calcularValorReal = () => {
    const area = Number(propiedad.metros_cuadrados || 0);
    const cp = propiedad.codigo_postal || '28001'; 
    const prefix = cp.substring(0, 2);
    const provinciaData = PROVINCIAS[prefix] || { nombre: 'España', baseM2: 1500 };
    let mZona = 1, mTipo = 1, mEstado = 1, mTamano = 1;
    const sufijo = Number(cp.substring(2, 5));
    if (sufijo >= 1 && sufijo <= 9) mZona = 1.50; else if (sufijo >= 10 && sufijo <= 25) mZona = 1.15; else if (sufijo >= 26 && sufijo <= 50) mZona = 1.00; else mZona = 0.85;
    const t = (propiedad.tipo || 'piso').toLowerCase();
    if (['ático'].includes(t)) mTipo = 1.30; else if (['chalet', 'casa'].includes(t)) mTipo = 1.25; else if (['estudio', 'loft'].includes(t)) mTipo = 1.10; else if (['local'].includes(t)) mTipo = 0.65; else if (['garaje'].includes(t)) mTipo = 0.35;
    const est = propiedad.estado_fisico || 'Buen estado/Reformada';
    if (est === 'A estrenar/Nueva') mEstado = 1.35; else if (est === 'Buen estado/Reformada') mEstado = 1.05; else if (est === 'A reformar/A renovar') mEstado = 0.80; else if (est === 'En ruinas') mEstado = 0.45;
    if (area > 0 && area < 50) mTamano = 1.20; else if (area > 200) mTamano = 1.10;
    const multiplicadorTotal = mZona * mTipo * mEstado * mTamano;
    return Math.round((provinciaData.baseM2 * multiplicadorTotal) * area);
  };

  const valorEstimado = calcularValorReal();
  const precioM2Calculado = propiedad.metros_cuadrados ? Math.round(valorEstimado / propiedad.metros_cuadrados) : 0;
  const comisionAgencia = valorEstimado * 0.03; 
  const impuestosAprox = valorEstimado * 0.08; 
  const netoPropietario = valorEstimado - comisionAgencia - impuestosAprox;

  // URL PARA EL CÓDIGO QR DEL PDF
  const nombreAgenciaFijo = propiedad.nombre_agencia || perfil?.agencia || perfil?.nombre_agencia || 'TU INMOBILIARIA';
  const agenteNombre = perfil?.nombre || '';
  const agenteTelf = perfil?.telefono || '';
  const publicUrl = `${window.location.origin}/p/${propiedad.id}?an=${encodeURIComponent(nombreAgenciaFijo)}&un=${encodeURIComponent(agenteNombre)}&t=${encodeURIComponent(agenteTelf)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}&margin=1`;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Informe_CMA_${displayId}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 overflow-y-auto print:static print:bg-white print:text-black">
      <div className="sticky top-0 bg-ink-900 border-b border-white/10 px-6 py-3 flex justify-between items-center z-20 print:hidden">
        <button onClick={onClose} className="text-white/50 hover:text-white flex items-center gap-2 text-sm"><X size={18}/> Cerrar</button>
        <button onClick={handlePrint} className="btn-primary text-xs py-1.5 px-4"><Printer size={16} /> Imprimir Informe</button>
      </div>

      <div className="max-w-[800px] mx-auto p-8 print:p-0 print:max-w-none">
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6 print:border-slate-300">
          <div>
            <div className="text-brand-400 font-black text-2xl tracking-tighter">INMOFICINA</div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold print:text-xs print:text-slate-500">Luxury CRM • Análisis de Mercado • {displayId}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-white/60 uppercase print:text-xs">Fecha</div>
            <div className="text-xs font-bold text-white print:text-sm print:text-black">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-white mb-1 print:text-2xl print:text-black leading-tight">{propiedad.titulo}</h1>
          <p className="text-white/50 flex items-center gap-1.5 text-xs mb-4 print:text-sm print:text-slate-600"><MapPin size={14}/> {propiedad.direccion}, {propiedad.ciudad} {propiedad.codigo_postal}</p>
          <div className="h-40 rounded-xl overflow-hidden border border-white/10 mb-6 print:border-slate-300">
            {propiedad.fotos?.[0] ? <img src={propiedad.fotos[0]} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/10"><Building2 size={32}/></div>}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[ {icon: Home, val: propiedad.tipo, label: 'Tipo'}, {icon: Square, val: `${propiedad.metros_cuadrados}m²`, label: 'Superficie'}, {icon: BedDouble, val: propiedad.habitaciones, label: 'Hab.'}, {icon: Bath, val: propiedad.banos, label: 'Baños'} ].map((item, i) => (
              <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 print:bg-slate-50 print:border-slate-200 text-center">
                <item.icon className="mx-auto mb-1 text-white/40 print:text-slate-400" size={16} />
                <div className="text-[11px] font-bold text-white print:text-sm print:text-black truncate capitalize">{item.val || '-'}</div>
                <div className="text-[7px] uppercase text-white/40 print:text-[10px]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 print:text-xs"><FileSignature size={14} /> Memoria Descriptiva</h3>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 print:border-l-2 print:border-brand-500 print:pl-3 print:p-0">
            <p className="text-[11px] text-white/70 leading-relaxed print:text-sm print:text-slate-700">{propiedad.descripcion || 'Propiedad pendiente de descripción.'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 print:break-inside-avoid">
          <div>
            <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 print:text-xs"><TrendingUp size={14} /> Valoración</h3>
            <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20 mb-2 print:bg-slate-50">
              <div className="text-[8px] text-white/60 uppercase font-bold mb-0.5 print:text-[10px]">Sugerido</div>
              <div className="text-2xl font-black text-brand-400 print:text-2xl print:text-slate-900">{formatEUR(valorEstimado)}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div className="text-[8px] text-white/40 uppercase font-bold print:text-[10px]">Precio/m²</div>
              <div className="text-xs font-bold text-white print:text-sm print:text-black">{formatEUR(precioM2Calculado)}</div>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 print:text-xs"><Info size={14} /> Estrategia</h3>
            <div className="p-4 rounded-lg bg-ink-950 border border-white/5 print:bg-slate-50 space-y-3">
              {[ {label: 'Rápida (0-3m)', val: valorEstimado * 0.93, color: 'bg-emerald-500', w: 'w-[70%]'}, {label: 'Óptima (3-6m)', val: valorEstimado, color: 'bg-brand-500', w: 'w-[85%]'}, {label: 'Aspiracional', val: valorEstimado * 1.07, color: 'bg-amber-500', w: 'w-full'} ].map((s, i) => (
                <div key={i}><div className="flex justify-between text-[9px] mb-1 print:text-xs"><span className="text-white/50 print:text-slate-600">{s.label}</span><span className="font-bold print:text-black">{formatEUR(s.val)}</span></div>
                <div className="h-1.5 bg-white/10 rounded-full print:bg-slate-200"><div className={`h-full ${s.color} rounded-full ${s.w}`} style={{printColorAdjust:'exact'}}/></div></div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-300">
          <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 print:text-xs"><CheckCircle2 size={14} /> Resumen Neto</h3>
          <div className="space-y-1.5 text-[11px] print:text-sm">
            <div className="flex justify-between text-white/60 print:text-slate-600"><span>Precio de Venta</span> <span className="font-semibold">{formatEUR(valorEstimado)}</span></div>
            <div className="flex justify-between text-red-400/80 print:text-red-600"><span>Honorarios e Impuestos (Est.)</span> <span className="font-semibold">- {formatEUR(comisionAgencia + impuestosAprox)}</span></div>
            <div className="flex justify-between pt-2 mt-1 border-t border-white/10 print:border-slate-300 text-sm font-black text-white print:text-base print:text-slate-900"><span>NETO ESTIMADO PROPIETARIO</span> <span className="text-brand-400">{formatEUR(netoPropietario)}</span></div>
          </div>
        </div>

        {/* SECCIÓN QR PARA EL PDF */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-6 print:bg-slate-50 print:border-slate-300 print:break-inside-avoid">
           <img src={qrUrl} alt="QR Ficha VIP" className="w-20 h-20 rounded-lg print:border print:border-slate-200" />
           <div>
             <h4 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5"><QrCode size={16} className="text-brand-400 print:text-brand-600"/> Ficha Interactiva VIP</h4>
             <p className="text-[11px] text-white/60 print:text-slate-600 mt-1 max-w-sm">Escanea este código con la cámara de tu móvil para acceder a la galería completa, detalles inmersivos y contacto directo con el agente.</p>
           </div>
        </div>

        <div className="mt-8 text-center text-[7px] text-white/20 uppercase tracking-[0.2em] print:text-[9px] print:text-slate-400">Documento confidencial generado por INMOFICINA LUXURY CRM. No constituye tasación oficial.</div>
      </div>
    </div>
  );
}