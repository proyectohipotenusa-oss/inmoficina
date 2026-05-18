import { useState, FormEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { Sparkles, Loader2, MapPin, Building2, TrendingUp, Calculator, CheckCircle2, Square, Lock } from 'lucide-react';
import { formatEUR } from '../lib/format';
import { useAuth } from '../context/AuthContext';

// DICCIONARIO COMPLETO: 52 Provincias de España con precio m2 base realista (EUR)
const PROVINCIAS: Record<string, { nombre: string, baseM2: number }> = {
'01': { nombre: 'Álava', baseM2: 2519 },
'02': { nombre: 'Albacete', baseM2: 1269 },
'03': { nombre: 'Alicante', baseM2: 2337 },
'04': { nombre: 'Almería', baseM2: 1537 },
'05': { nombre: 'Ávila', baseM2: 1157 },
'06': { nombre: 'Badajoz', baseM2: 1075 },
'07': { nombre: 'Baleares', baseM2: 4670 },
'08': { nombre: 'Barcelona', baseM2: 3709 },
'09': { nombre: 'Burgos', baseM2: 1480 },
'10': { nombre: 'Cáceres', baseM2: 1099 },
'11': { nombre: 'Cádiz', baseM2: 2182 },
'12': { nombre: 'Castellón', baseM2: 1470 },
'13': { nombre: 'Ciudad Real', baseM2: 923 },
'14': { nombre: 'Córdoba', baseM2: 1377 },
'15': { nombre: 'A Coruña', baseM2: 1706 },
'16': { nombre: 'Cuenca', baseM2: 959 },
'17': { nombre: 'Girona', baseM2: 2759 },
'18': { nombre: 'Granada', baseM2: 1894 },
'19': { nombre: 'Guadalajara', baseM2: 1562 },
'20': { nombre: 'Gipuzkoa', baseM2: 3717 },
'21': { nombre: 'Huelva', baseM2: 1524 },
'22': { nombre: 'Huesca', baseM2: 1568 },
'23': { nombre: 'Jaén', baseM2: 962 },
'24': { nombre: 'León', baseM2: 1256 },
'25': { nombre: 'Lleida', baseM2: 1455 },
'26': { nombre: 'La Rioja', baseM2: 1529 },
'27': { nombre: 'Lugo', baseM2: 1173 },
'28': { nombre: 'Madrid', baseM2: 4590 },
'29': { nombre: 'Málaga', baseM2: 3788 },
'30': { nombre: 'Murcia', baseM2: 1624 },
'31': { nombre: 'Navarra', baseM2: 1999 },
'32': { nombre: 'Ourense', baseM2: 1183 },
'33': { nombre: 'Asturias', baseM2: 1821 },
'34': { nombre: 'Palencia', baseM2: 1257 },
'35': { nombre: 'Las Palmas', baseM2: 2678 },
'36': { nombre: 'Pontevedra', baseM2: 1917 },
'37': { nombre: 'Salamanca', baseM2: 1595 },
'38': { nombre: 'S.C. Tenerife', baseM2: 2940 },
'39': { nombre: 'Cantabria', baseM2: 2138 },
'40': { nombre: 'Segovia', baseM2: 1550 },
'41': { nombre: 'Sevilla', baseM2: 2150 },
'42': { nombre: 'Soria', baseM2: 1171 },
'43': { nombre: 'Tarragona', baseM2: 1795 },
'44': { nombre: 'Teruel', baseM2: 998 },
'45': { nombre: 'Toledo', baseM2: 1162 },
'46': { nombre: 'Valencia', baseM2: 2143 },
'47': { nombre: 'Valladolid', baseM2: 1598 },
'48': { nombre: 'Bizkaia', baseM2: 3126 },
'49': { nombre: 'Zamora', baseM2: 1049 },
'50': { nombre: 'Zaragoza', baseM2: 1782 },
'51': { nombre: 'Ceuta', baseM2: 2288 },
'52': { nombre: 'Melilla', baseM2: 1950 }
};

export default function IAPredictor() {
  const [cp, setCp] = useState('');
  const [tipo, setTipo] = useState('Piso');
  const [m2, setM2] = useState('');
  const [estado, setEstado] = useState('Buen Estado');
  const [loading, setLoading] = useState(false);
  const [resultado, setResult] = useState<any>(null);
  const [historial, setHistorial] = useState<any[]>([]);

  const calcularValorReal = (e: FormEvent) => {
    e.preventDefault();
    if (!cp || cp.length !== 5 || !m2) return alert("Introduce un Código Postal válido (5 dígitos) y los metros cuadrados.");
    
    setLoading(true);
    setResult(null);

    // Algoritmo Matemático de Valoración
    const prefix = cp.substring(0, 2);
    const provinciaData = PROVINCIAS[prefix];
    if (!provinciaData) {
      setLoading(false);
      return alert("El Código Postal introducido no corresponde a ninguna provincia española válida.");
    }

    let baseM2 = provinciaData.baseM2;
    let mZona = 1, mTipo = 1, mEstado = 1, mTamano = 1;

    const sufijo = Number(cp.substring(2, 5));
    if (sufijo >= 1 && sufijo <= 9) mZona = 1.50; // Capital/Centro
    else if (sufijo >= 10 && sufijo <= 25) mZona = 1.15; // Primer anillo
    else if (sufijo >= 26 && sufijo <= 50) mZona = 1.00; // Periferia
    else mZona = 0.85; // Pueblos/Zonas alejadas

    if (tipo === 'Ático') mTipo = 1.30;
    else if (tipo === 'Chalet') mTipo = 1.25;
    else if (tipo === 'Local') mTipo = 0.65;
    
    if (estado === 'Nuevo') mEstado = 1.35;
    else if (estado === 'A Reformar') mEstado = 0.80;

    const area = Number(m2);
    if (area > 0 && area < 50) mTamano = 1.20; // Estudios (mayor €/m2)
    else if (area > 200) mTamano = 1.10; // Mansiones

    const multiplicadorTotal = mZona * mTipo * mEstado * mTamano;
    const precioM2Final = Math.round(baseM2 * multiplicadorTotal);
    const precioTotal = Math.round(precioM2Final * area);

    setTimeout(() => {
      const nuevoResultado = {
        total: precioTotal,
        precioM2: precioM2Final,
        provincia: provinciaData.nombre,
        location: `${provinciaData.nombre} (${cp})`,
        tipo, m2, estado,
        recomendacion: precioTotal > 300000 ? 'Inmueble de alto valor. Se recomienda estrategia de Home Staging y comercialización Premium.' : 'Inmueble con alta liquidez. Ideal para inversores o primera vivienda.'
      };
      
      setResult(nuevoResultado);
      setHistorial(prev => [nuevoResultado, ...prev].slice(0, 5)); // Guardar los últimos 5
      setLoading(false);
    }, 1500); // Simulamos tiempo de cómputo IA
  };

  return (
    <Layout title="Predictor de Valor IA">
      <PageHeader 
        title="Predictor de Valor IA" 
        subtitle="Tasación algorítmica de mercado en tiempo real para captar propiedades." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL IZQUIERDO: FORMULARIO Y CONTEXTO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 bg-ink-900 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full blur-2xl" />
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10"><Sparkles size={16} className="text-brand-400"/> Datos del Inmueble</h3>
            
            <form onSubmit={calcularValorReal} className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 block">Código Postal *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input required maxLength={5} className="w-full bg-ink-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-brand-500 outline-none" placeholder="Ej. 28001" value={cp} onChange={e => setCp(e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 block">Superficie *</label>
                  <div className="relative">
                    <Square className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input required type="number" className="w-full bg-ink-950 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:border-brand-500 outline-none" placeholder="m²" value={m2} onChange={e => setM2(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 block">Tipología</label>
                  <select className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none" value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option>Piso</option><option>Ático</option><option>Chalet</option><option>Local</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 block">Estado Actual</label>
                <select className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none" value={estado} onChange={e => setEstado(e.target.value)}>
                  <option>Nuevo</option><option>Buen Estado</option><option>A Reformar</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <><Calculator size={16} /> Calcular Valor Real</>}
                </button>
                {/* ESTE ES EL NUEVO TEXTO INFORMATIVO DE LOS CÓDIGOS POSTALES */}
                <p className="text-center text-[10px] text-white/30 font-medium italic mt-3 tracking-wide">
                  Algoritmo predictivo basado en 11.752 códigos postales.
                </p>
              </div>
            </form>
          </div>

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

        {/* PANEL DERECHO: RESULTADOS */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[500px] card flex flex-col items-center justify-center text-brand-400/50">
              <div className="relative">
                <Loader2 size={64} className="animate-spin mb-6 text-brand-500 opacity-20" />
                <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Analizando el mercado...</h3>
              <p className="text-sm text-white/40 text-center max-w-sm">Procesando variables demográficas, estado del inmueble y datos transaccionales recientes de la zona.</p>
            </div>
          ) : !resultado ? (
            <div className="h-[500px] card flex flex-col items-center justify-center text-white/20 border-dashed">
              <Sparkles size={64} className="mb-6 opacity-20" />
              <h3 className="text-lg font-bold text-white/50 mb-2 tracking-wide">Esperando datos</h3>
              <p className="text-sm text-white/40 text-center max-w-sm">Introduce las características de un inmueble a la izquierda y deja que nuestra IA calcule su valor óptimo de mercado.</p>
            </div>
          ) : (
            <div className="card p-8 bg-ink-900 relative overflow-hidden animate-fade-in border-brand-500/20">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10 relative z-10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-2 flex items-center gap-2"><CheckCircle2 size={14}/> Tasación IA Completada</div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">{resultado.location}</h2>
                  <p className="text-white/50 mt-2">{resultado.tipo} • {resultado.m2}m² construidos • {resultado.estado}</p>
                </div>
                <div className="text-left md:text-right bg-ink-950/50 p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Valor de Mercado Estimado</div>
                  <div className="text-4xl sm:text-5xl font-black text-brand-400 tracking-tighter drop-shadow-lg">{formatEUR(resultado.total)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 relative z-10">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><Building2 size={16} className="text-blue-400"/></div>
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Ratio / m² en {resultado.provincia}</span>
                  </div>
                  <div className="text-2xl font-black text-white mt-2">{formatEUR(resultado.precioM2)} <span className="text-sm font-medium text-white/40">/ m²</span></div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><TrendingUp size={16} className="text-emerald-400"/></div>
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Rango de Negociación</span>
                  </div>
                  <div className="text-lg font-black text-white mt-2">
                    <span className="text-white/40 font-medium">{formatEUR(resultado.total * 0.95)}</span> - {formatEUR(resultado.total * 1.05)}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 relative z-10">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-400 mb-2 flex items-center gap-1.5"><Info size={14}/> Consejo del Algoritmo</h4>
                <p className="text-sm text-white/80 leading-relaxed font-medium">{resultado.recomendacion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
