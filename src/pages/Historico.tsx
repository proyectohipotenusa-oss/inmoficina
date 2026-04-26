import { useEffect, useState, FormEvent, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Plus, Loader2, X, AlertCircle, 
  Calendar, Trophy, Sigma, TrendingUp, Euro, BarChart3, Trash2
} from 'lucide-react';
import { formatEUR } from '../lib/format';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const generarIdVisual = (id: any) => {
  if (!id) return 'ID-000';
  return `ID-${String(id).substring(0, 5).toUpperCase()}`;
};

export default function Ventas() {
  const { perfil } = useAuth();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const load = async () => {
    if (!perfil?.agencia_id) return;
    setLoading(true);
    const { data } = await supabase
      .from('ventas')
      .select('*')
      .eq('agencia_id', perfil.agencia_id)
      .order('fecha', { ascending: false });
    setVentas(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [perfil?.agencia_id]);

  const deleteVenta = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Seguro que quieres eliminar este registro contable? Se restará del Dashboard.')) return;
    setLoading(true);
    await supabase.from('ventas').delete().eq('id', id);
    load();
  };

  const stats = useMemo(() => {
    const hoy = new Date();
    const currentMonth = hoy.getMonth(); 
    const currentYear = hoy.getFullYear();

    const monthsData = Array.from({ length: 4 }).map((_, i) => {
      let dMonth = currentMonth - i;
      let dYear = currentYear;
      if (dMonth < 0) { dMonth += 12; dYear -= 1; }
      return {
        key: `${dYear}-${dMonth}`,
        nombre: MESES[dMonth],
        importe: 0,
        cantidad: 0,
        isCurrent: i === 0
      };
    }).reverse();

    ventas.forEach(v => {
      const d = new Date(v.fecha);
      const vYear = d.getFullYear();
      const vMonth = d.getMonth();
      
      const key = `${vYear}-${vMonth}`;
      const slot = monthsData.find(m => m.key === key);
      if (slot) {
        slot.importe += Number(v.importe);
        slot.cantidad += 1;
      }
    });

    const mActual = monthsData[3];
    const previos = [monthsData[0], monthsData[1], monthsData[2]];
    const sumaPrevios = previos.reduce((acc, m) => acc + m.importe, 0);
    const mediaPrevios = sumaPrevios / 3;
    const mejorPrevio = [...previos].sort((a, b) => b.importe - a.importe)[0];
    const maxPrevio = Math.max(...previos.map(m => m.importe)) || 1;

    return { mActual, previos, sumaPrevios, mediaPrevios, mejorPrevio, maxPrevio };
  }, [ventas]);

  const donutTotal = stats.sumaPrevios + stats.mActual.importe;
  const p1 = donutTotal ? (stats.previos[0].importe / donutTotal) * 360 : 0;
  const p2 = donutTotal ? (stats.previos[1].importe / donutTotal) * 360 : 0;
  const p3 = donutTotal ? (stats.previos[2].importe / donutTotal) * 360 : 0;
  const p4 = donutTotal ? (stats.mActual.importe / donutTotal) * 360 : 0;
  
  const end1 = p1; const end2 = end1 + p2; const end3 = end2 + p3; const end4 = end3 + p4;

  const donutBackground = donutTotal === 0 
    ? `conic-gradient(#2a2d36 0 360deg)` 
    : `conic-gradient(#3b82f6 0deg ${end1}deg, #06b6d4 ${end1}deg ${end2}deg, #10b981 ${end2}deg ${end3}deg, #f59e0b ${end3}deg ${end4}deg)`;

  return (
    <Layout title="Ventas">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Registro de ventas</h1>
          <p className="mt-1 text-[13px] text-white/50">Seguimiento mensual de facturación y comparativa histórica.</p>
        </div>
        <button className="btn-primary shrink-0 !bg-indigo-500 hover:!bg-indigo-400 !border-indigo-400" onClick={() => setIsCreating(true)}>
          <Plus size={16} /> Registrar venta
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center text-white/40"><Loader2 className="animate-spin" size={24} /></div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 bg-ink-900 border-white/5 flex flex-col justify-between h-32">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><Calendar size={14} className="text-white/60" /></div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                  Ventas {stats.mActual.nombre} <span className="text-white/60 ml-1">({stats.mActual.cantidad})</span>
                </div>
                <div className="text-2xl font-bold text-white leading-none">{formatEUR(stats.mActual.importe)}</div>
                <div className="text-[11px] text-white/40 mt-1">Mes en curso</div>
              </div>
            </div>

            <div className="card p-5 bg-ink-900 border-white/5 flex flex-col justify-between h-32">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><Trophy size={14} className="text-white/60" /></div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Mejor Mes (3 Previos)</div>
                <div className="text-2xl font-bold text-white leading-none">{formatEUR(stats.mejorPrevio.importe)}</div>
                <div className="text-[11px] text-white/40 mt-1">{stats.mejorPrevio.nombre}</div>
              </div>
            </div>

            <div className="card p-5 bg-ink-900 border-white/5 flex flex-col justify-between h-32">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><Sigma size={14} className="text-white/60" /></div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Suma 3 Meses Previos</div>
                <div className="text-2xl font-bold text-white leading-none">{formatEUR(stats.sumaPrevios)}</div>
                <div className="text-[11px] text-white/40 mt-1">{stats.previos[0].nombre} - {stats.previos[2].nombre}</div>
              </div>
            </div>

            <div className="card p-5 bg-ink-900 border-white/5 flex flex-col justify-between h-32">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><TrendingUp size={14} className="text-white/60" /></div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Media Mensual</div>
                <div className="text-2xl font-bold text-white leading-none">{formatEUR(stats.mediaPrevios)}</div>
                <div className="text-[11px] text-white/40 mt-1">Últimos 3 Meses</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6 bg-ink-900 border-white/5 h-80 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2"><div className="h-6 w-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><BarChart3 size={12} /></div><h3 className="text-sm font-bold text-white">Facturación mensual</h3></div>
                <div className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40">3 meses previos</div>
              </div>
              <div className="flex-1 flex items-end justify-around gap-6 mt-auto">
                {stats.previos.map(m => {
                  const height = m.importe === 0 ? '4px' : `${(m.importe / stats.maxPrevio) * 100}%`;
                  return (
                    <div key={m.nombre} className="flex-1 flex flex-col items-center justify-end h-full group">
                      <div className="text-[10px] font-bold text-white/70 mb-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">{formatEUR(m.importe)}</div>
                      <div className={`w-full max-w-[100px] rounded-t-xl transition-all duration-1000 ease-out ${m.importe > 0 ? 'bg-gradient-to-t from-indigo-600/80 to-blue-400' : 'bg-indigo-500/20'}`} style={{ height }} />
                      <div className="mt-3 text-center"><div className="text-[12px] font-bold text-white/80">{m.nombre}</div><div className="text-[10px] text-white/40">{m.cantidad} venta{m.cantidad !== 1 ? 's' : ''}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-6 bg-ink-900 border-white/5 h-80 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-white">Distribución 4 meses</h3>
                <div className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40">Incluye actual</div>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-medium"><span className="flex items-center gap-2 text-white/70"><span className="h-2 w-2 rounded-full bg-blue-500" /> {stats.previos[0].nombre}</span><span className="text-white">{formatEUR(stats.previos[0].importe)}</span></div>
                  <div className="flex items-center justify-between text-[11px] font-medium"><span className="flex items-center gap-2 text-white/70"><span className="h-2 w-2 rounded-full bg-cyan-500" /> {stats.previos[1].nombre}</span><span className="text-white">{formatEUR(stats.previos[1].importe)}</span></div>
                  <div className="flex items-center justify-between text-[11px] font-medium"><span className="flex items-center gap-2 text-white/70"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {stats.previos[2].nombre}</span><span className="text-white">{formatEUR(stats.previos[2].importe)}</span></div>
                  <div className="flex items-center justify-between text-[11px] font-medium"><span className="flex items-center gap-2 text-white/90 font-bold"><span className="h-2 w-2 rounded-full bg-amber-500" /> {stats.mActual.nombre} (Actual)</span><span className="text-white font-bold">{formatEUR(stats.mActual.importe)}</span></div>
                </div>
                <div className="w-44 h-44 flex-shrink-0 ml-8 relative rounded-full flex items-center justify-center transition-all duration-1000 shadow-xl" style={{ background: donutBackground }}>
                  <div className="w-[120px] h-[120px] bg-ink-900 rounded-full flex flex-col items-center justify-center shadow-inner">
                    <div className="text-[9px] text-white/40 font-bold tracking-widest mb-1">TOTAL</div>
                    <div className="text-lg font-bold text-white">{formatEUR(donutTotal)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-0 bg-ink-900 border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Últimas ventas</h3>
              <div className="text-[11px] text-white/40">{ventas.length} registrada{ventas.length !== 1 ? 's' : ''}</div>
            </div>

            {ventas.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                  <Euro size={24} className="text-indigo-400" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Sin ventas registradas</div>
                <div className="text-[13px] text-white/40">Registra tu primera venta para empezar a llenar el histórico mensual.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-4 font-bold">Fecha</th>
                      <th className="px-6 py-4 font-bold">Propiedad</th>
                      <th className="px-6 py-4 font-bold text-right">Importe</th>
                      <th className="px-6 py-4 font-bold text-center">Borrar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((v) => (
                      <tr key={v.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                        <td className="px-6 py-4 text-[13px] font-medium text-white/70">
                          {new Date(v.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white/90">{v.propiedad}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-400">
                          {formatEUR(v.importe)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={(e) => deleteVenta(v.id, e)} className="p-1.5 rounded-md hover:bg-red-500/20 text-white/20 hover:text-red-400 transition" title="Eliminar registro">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {isCreating && <NuevaVentaDialog onClose={() => setIsCreating(false)} onSaved={() => { setIsCreating(false); load(); }} />}
    </Layout>
  );
}

function NuevaVentaDialog({ onClose, onSaved }: { onClose: () => void, onSaved: () => void }) {
  const { perfil } = useAuth();
  
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [selectedPropId, setSelectedPropId] = useState('NO ID');
  const [manualName, setManualName] = useState('');
  
  const [importe, setImporte] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProps = async () => {
      if (!perfil?.agencia_id) return;
      setLoadingProps(true);
      const { data } = await supabase
        .from('propiedades')
        .select('id, titulo, referencia, created_at')
        .eq('agencia_id', perfil.agencia_id)
        .order('created_at', { ascending: true }); 
      setPropiedades(data || []);
      setLoadingProps(false);
    };
    loadProps();
  }, [perfil?.agencia_id]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let nombreFinal = manualName.trim();
    
    if (selectedPropId !== 'NO ID') {
       const prop = propiedades.find(p => p.id === selectedPropId);
       if (prop) {
          const ref = prop.referencia || generarIdVisual(prop.id);
          nombreFinal = `${ref} - ${prop.titulo}`;
       }
    } else if (!nombreFinal) {
       nombreFinal = 'Venta Histórica/Externa';
    }

    const { error: dbError } = await supabase.from('ventas').insert({ 
      agencia_id: perfil?.agencia_id, 
      propiedad: nombreFinal, 
      importe: parseFloat(importe), 
      fecha: fecha 
    });

    setSubmitting(false);
    if (dbError) setError(dbError.message); else onSaved();
  };

  const isValid = (selectedPropId !== 'NO ID' || manualName.trim().length > 0) && importe && fecha;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md card p-0 overflow-hidden animate-slide-up bg-ink-950 border-white/10 shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <div>
            <div className="text-base font-semibold text-white">Registrar nueva venta</div>
            <div className="text-[12px] text-white/50 mt-0.5">Selecciona del catálogo o añade una externa</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition"><X size={18}/></button>
        </div>
        
        <form id="venta-form" onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Propiedad vendida *</label>
            <div className="relative">
              <select 
                className="input bg-ink-900 border-white/10 focus:border-indigo-500 appearance-none pr-10" 
                value={selectedPropId} 
                onChange={(e) => setSelectedPropId(e.target.value)}
                disabled={loadingProps}
              >
                {loadingProps ? (
                  <option>Cargando catálogo...</option>
                ) : (
                  <>
                    <option value="NO ID">NO ID (Venta anterior o externa)</option>
                    {propiedades.map(p => {
                      const ref = p.referencia || generarIdVisual(p.id);
                      return <option key={p.id} value={p.id}>{ref} - {p.titulo}</option>
                    })}
                  </>
                )}
              </select>
            </div>
          </div>
          
          {selectedPropId === 'NO ID' && (
            <div className="animate-fade-in">
              <label className="label">Descripción de la venta *</label>
              <input 
                required 
                className="input bg-ink-900 border-white/10 focus:border-indigo-500" 
                value={manualName} 
                onChange={(e) => setManualName(e.target.value)} 
                placeholder="Ej. Piso en Calle Mayor (Venta 2023)" 
                autoFocus
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Importe de cierre *</label>
              <div className="relative">
                {/* Input transformado a texto para soportar formateo visual en tiempo real */}
                <input 
                  required 
                  type="text" 
                  className="input bg-ink-900 border-white/10 focus:border-indigo-500 pr-8" 
                  value={importe ? new Intl.NumberFormat('es-ES').format(Number(importe)) : ''} 
                  onChange={(e) => setImporte(e.target.value.replace(/\D/g, ''))} 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs font-bold">€</span>
              </div>
            </div>
            <div><label className="label">Fecha *</label><input required type="date" className="input bg-ink-900 border-white/10 focus:border-indigo-500" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
          </div>
          
          {error && <div className="flex items-start gap-2 text-[11px] text-red-400 bg-red-500/10 p-3 rounded-lg"><AlertCircle size={14}/>{error}</div>}
        </form>
        
        <div className="pt-4 p-6 flex justify-end gap-3 border-t border-white/5 bg-ink-900">
          <button type="button" className="btn-ghost border border-white/10" onClick={onClose} disabled={submitting}>Cancelar</button>
          <button type="submit" form="venta-form" className="btn-primary !bg-indigo-500 hover:!bg-indigo-400" disabled={submitting || !isValid}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Registrar venta'}
          </button>
        </div>
      </div>
    </div>
  );
}