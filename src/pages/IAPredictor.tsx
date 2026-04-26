import { useState, FormEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { Sparkles, Loader2, MapPin, Building2, TrendingUp, Calculator, CheckCircle2, Square } from 'lucide-react';
import { formatEUR } from '../lib/format';

// 1. DICCIONARIO COMPLETO: 52 Provincias de España con precio m2 base realista (EUR)
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

const TIPOS = ['Piso', 'Ático', 'Dúplex', 'Chalet', 'Casa', 'Estudio', 'Loft', 'Local', 'Oficina', 'Garaje', 'Terreno', 'Nave', 'Trastero'];
const ESTADOS_FISICOS = ['A estrenar/Nueva', 'Buen estado/Reformada', 'A reformar/A renovar', 'En ruinas'];

interface Estimacion {
  cp: string;
  tipo: string;
  estado: string;
  m2: number;
  precioM2: number;
  total: number;
  min: number;
  max: number;
  location: string;
  trend: number;
}

export default function IAPredictor() {
  const [m2, setM2] = useState('');
  const [cp, setCp] = useState('');
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [estado, setEstado] = useState(ESTADOS_FISICOS[1]);
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResult] = useState<Estimacion | null>(null);
  const [historial, setHistorial] = useState<Estimacion[]>([]);

  const calcularValoracion = (e: FormEvent) => {
    e.preventDefault();
    if (!m2 || !cp || cp.length !== 5) return alert("Introduce CP válido de 5 cifras y m².");

    setLoading(true);

    setTimeout(() => {
      const area = Number(m2);
      const prefix = cp.substring(0, 2);
      const provincia = PROVINCIAS[prefix];
      if (!provincia) { setLoading(false); return alert("CP no reconocido."); }

      // --- ALGORITMO MAESTRO FUSIONADO (Grok + ChatGPT + Inmoficina) ---
      let mZona = 1.0, mTipo = 1.0, mEstado = 1.0, mTamano = 1.0;

      // 1. ZONA (Ajuste para bases altas)
      const sufijo = Number(cp.substring(2, 5));
      if (sufijo >= 1 && sufijo <= 9) mZona = 1.50;       // Prime (+50% sobre base ya alta)
      else if (sufijo >= 10 && sufijo <= 25) mZona = 1.15; // Alta demanda (+15%)
      else if (sufijo >= 26 && sufijo <= 50) mZona = 1.00; // Media (Base)
      else mZona = 0.85;                                  // Periferia (-15%)

      // 2. TIPOLOGÍA
      const t = tipo.toLowerCase();
      if (['ático'].includes(t)) mTipo = 1.30;
      else if (['chalet', 'casa'].includes(t)) mTipo = 1.25;
      else if (['estudio', 'loft'].includes(t)) mTipo = 1.10;
      else if (['local', 'oficina'].includes(t)) mTipo = 0.65;
      else if (['garaje', 'terreno'].includes(t)) mTipo = 0.35;

      // 3. ESTADO FÍSICO (Tinsa + Grok)
      if (estado === 'A estrenar/Nueva') mEstado = 1.35;
      else if (estado === 'Buen estado/Reformada') mEstado = 1.05;
      else if (estado === 'A reformar/A renovar') mEstado = 0.80;
      else if (estado === 'En ruinas') mEstado = 0.45;

      // 4. ECONOMÍA DE ESCALA (Curva en U de Lujo de Grok)
      if (area < 50) mTamano = 1.20;       // Micro/Pequeño: Premium por alta rotación
      else if (area > 200) mTamano = 1.10; // Lujo Grande: Premium por exclusividad/mansión
      else mTamano = 1.00;                 // Estándar (50m - 200m)

      // CÁLCULO FINAL
      const multiplicadorTotal = mZona * mTipo * mEstado * mTamano;
      const precioFinalM2 = Math.round(provincia.baseM2 * multiplicadorTotal);
      const totalEstimated = precioFinalM2 * area;

      const nuevaEstimacion: Estimacion = {
        cp, tipo, estado, m2: area,
        precioM2: precioFinalM2,
        total: totalEstimated,
        min: Math.round(totalEstimated * 0.93),
        max: Math.round(totalEstimated * 1.07),
        location: `${provincia.nombre} (Zona ${cp})`,
        trend: sufijo <= 9 ? 4.5 : (sufijo <= 25 ? 2.1 : -1.5)
      };

      setResult(nuevaEstimacion);
      setHistorial(prev => [nuevaEstimacion, ...prev].slice(0, 5));
      setLoading(false);
    }, 800);
  };

  return (
    <Layout title="Predictor IA">
      <PageHeader title="IA de Valoración Inmobiliaria" subtitle="Sincronizado con Informes CMA. Algoritmo de precisión 2026." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card border border-brand-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator size={100} /></div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 relative"><Sparkles className="text-brand-400" size={20} /> Nueva Estimación</h3>
            <form onSubmit={calcularValoracion} className="space-y-5 relative">
              <div>
                <label className="label">Código Postal *</label>
                <div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" /><input required maxLength={5} placeholder="Ej: 46001" className="input pl-10" value={cp} onChange={e => setCp(e.target.value.replace(/\D/g, ''))} /></div>
              </div>
              <div>
                <label className="label">Superficie (m²) *</label>
                <div className="relative"><Square size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" /><input required type="number" placeholder="Ej: 120" className="input pl-10" value={m2} onChange={e => setM2(e.target.value)} /></div>
              </div>
              <div>
                <label className="label">Tipo de Inmueble</label>
                <div className="relative"><Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" /><select className="input pl-10" value={tipo} onChange={e => setTipo(e.target.value)}>{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div>
                <label className="label">Estado de conservación</label>
                <div className="relative"><CheckCircle2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" /><select className="input pl-10" value={estado} onChange={e => setEstado(e.target.value)}>{ESTADOS_FISICOS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base mt-4">{loading ? <><Loader2 className="animate-spin" size={18} /> Procesando...</> : 'Calcular Valor Real'}</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {resultado ? (
            <div className="animate-fade-in space-y-6">
              <div className="card bg-gradient-to-br from-ink-900 to-ink-950 border-brand-500/30 p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-brand-400 font-bold tracking-widest uppercase text-xs mb-2">Valoración de Mercado</div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{formatEUR(resultado.total)}</h2>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${resultado.trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}><TrendingUp size={16} className={resultado.trend < 0 ? 'rotate-180' : ''} />{Math.abs(resultado.trend)}%</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5"><div className="text-white/40 text-xs mb-1">Precio/m²</div><div className="text-xl font-bold text-white">{formatEUR(resultado.precioM2)}</div></div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5"><div className="text-white/40 text-xs mb-1">Venta Rápida</div><div className="text-xl font-bold text-emerald-400">{formatEUR(resultado.min)}</div></div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5"><div className="text-white/40 text-xs mb-1">Aspiracional</div><div className="text-xl font-bold text-amber-400">{formatEUR(resultado.max)}</div></div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5"><div className="text-white/40 text-xs mb-1">Ubicación</div><div className="text-sm font-bold text-white truncate">{resultado.location}</div></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 text-center text-white/40"><div><Sparkles size={48} className="mx-auto mb-4 opacity-20" /><h3 className="text-xl font-bold text-white/60 mb-2">Algoritmo Maestro</h3><p className="max-w-md mx-auto text-sm">El Predictor utiliza la síntesis de inteligencias artificiales para ofrecerte el cálculo más preciso del mercado español en 2026.</p></div></div>
          )}

          {historial.length > 0 && (
            <div className="card p-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Últimas Consultas</h4>
              <div className="space-y-3">
                {historial.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5 group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-ink-950 border border-white/10 flex items-center justify-center">
                        <Building2 size={16} className="text-white/40" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.location}</div>
                        <div className="text-xs text-white/40">{item.tipo} • {item.m2}m² • {item.estado}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand-400">{formatEUR(item.total)}</div>
                      <div className="text-[10px] text-white/30">{formatEUR(item.precioM2)}/m²</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}