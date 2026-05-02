import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Rss, Download, Globe, Home, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function Portales() {
  const { perfil } = useAuth();
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!perfil?.agencia_id) return;
      const { data } = await supabase
        .from('propiedades')
        .select('*')
        .eq('agencia_id', perfil.agencia_id)
        .in('transaccion', ['Disponible para venta', 'Disponible para alquiler', 'Venta y alquiler']);
      setPropiedades(data || []);
      setLoading(false);
    };
    load();
  }, [perfil?.agencia_id]);

  const descargarXML = (contenido: string, nombreArchivo: string) => {
    const blob = new Blob([contenido], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- GENERADOR FORMATO KYERO V3 (Fotocasa, Habitaclia, Pisos.com...) ---
  const generarKyeroXML = () => {
    setExportando('kyero');
    setTimeout(() => {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <kyero>\n    <feed_version>3</feed_version>\n  </kyero>\n`;
      
      propiedades.forEach(p => {
        const urlFicha = `${window.location.origin}/p/${p.id}`;
        xml += `  <property>\n`;
        xml += `    <id>${p.id.substring(0, 8)}</id>\n`;
        xml += `    <date>${new Date(p.created_at || Date.now()).toISOString().split('T')[0]}</date>\n`;
        xml += `    <ref>${p.referencia || p.id.substring(0, 8)}</ref>\n`;
        xml += `    <price>${p.precio || 0}</price>\n`;
        xml += `    <currency>EUR</currency>\n`;
        xml += `    <price_freq>sale</price_freq>\n`;
        xml += `    <part_ownership>0</part_ownership>\n`;
        xml += `    <leasehold>0</leasehold>\n`;
        xml += `    <new_build>${p.estado_fisico === 'A estrenar/Nueva' ? 1 : 0}</new_build>\n`;
        xml += `    <type>${p.tipo || 'apartment'}</type>\n`;
        xml += `    <town>${p.ciudad || 'Unknown'}</town>\n`;
        xml += `    <province>${p.ciudad || 'Unknown'}</province>\n`;
        xml += `    <location_detail>${p.direccion || ''}</location_detail>\n`;
        xml += `    <beds>${p.habitaciones || 0}</beds>\n`;
        xml += `    <baths>${p.banos || 0}</baths>\n`;
        xml += `    <pool>0</pool>\n`;
        xml += `    <surface_area>\n      <built>${p.metros_cuadrados || 0}</built>\n    </surface_area>\n`;
        xml += `    <desc>\n      <es>${p.descripcion?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || 'Propiedad exclusiva'}</es>\n    </desc>\n`;
        xml += `    <url>${urlFicha}</url>\n`;
        
        if (p.fotos && p.fotos.length > 0) {
          xml += `    <images>\n`;
          p.fotos.forEach((foto: string, index: number) => {
            xml += `      <image id="${index + 1}">\n        <url>${foto}</url>\n      </image>\n`;
          });
          xml += `    </images>\n`;
        }
        xml += `  </property>\n`;
      });
      
      xml += `</root>`;
      descargarXML(xml, `kyero_export_${new Date().toISOString().split('T')[0]}.xml`);
      setExportando(null);
    }, 1000);
  };

  // --- GENERADOR FORMATO IDEALISTA ---
  const generarIdealistaXML = () => {
    setExportando('idealista');
    setTimeout(() => {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<idealista>\n`;
      
      propiedades.forEach(p => {
        const operacion = p.transaccion.includes('alquiler') ? 'rent' : 'sale';
        let propertyType = '1'; // 1=Piso/Apartamento (default)
        if (p.tipo === 'chalet' || p.tipo === 'casa') propertyType = '2';
        if (p.tipo === 'local') propertyType = '4';
        if (p.tipo === 'garaje') propertyType = '5';
        if (p.tipo === 'terreno') propertyType = '7';

        xml += `  <property>\n`;
        xml += `    <propertyCode>${p.referencia || p.id.substring(0, 8)}</propertyCode>\n`;
        xml += `    <propertyReference>${p.id.substring(0, 8)}</propertyReference>\n`;
        xml += `    <propertyFeatures>\n`;
        xml += `      <featuresType>${propertyType}</featuresType>\n`;
        xml += `      <featuresAreaConstructed>${p.metros_cuadrados || 0}</featuresAreaConstructed>\n`;
        xml += `      <featuresRooms>${p.habitaciones || 0}</featuresRooms>\n`;
        xml += `      <featuresBathrooms>${p.banos || 0}</featuresBathrooms>\n`;
        xml += `    </propertyFeatures>\n`;
        xml += `    <propertyAddress>\n`;
        xml += `      <addressVisibility>3</addressVisibility>\n`; // Calle oculta por defecto
        xml += `      <addressTown>${p.ciudad || 'Unknown'}</addressTown>\n`;
        xml += `      <addressPostalcode>${p.codigo_postal || ''}</addressPostalcode>\n`;
        xml += `      <addressStreetName>${p.direccion || ''}</addressStreetName>\n`;
        xml += `    </propertyAddress>\n`;
        xml += `    <propertyOperation>\n`;
        xml += `      <operationType>${operacion}</operationType>\n`;
        xml += `      <operationPrice>${p.precio || 0}</operationPrice>\n`;
        xml += `    </propertyOperation>\n`;
        xml += `    <propertyDescriptions>\n`;
        xml += `      <descriptionLanguage>1</descriptionLanguage>\n`; // 1 = Español
        xml += `      <descriptionText>${p.descripcion?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || 'Propiedad disponible'}</descriptionText>\n`;
        xml += `    </propertyDescriptions>\n`;
        
        if (p.fotos && p.fotos.length > 0) {
          xml += `    <propertyImages>\n`;
          p.fotos.forEach((foto: string, index: number) => {
            xml += `      <image>\n        <imageLabel>Foto ${index + 1}</imageLabel>\n        <imageUrl>${foto}</imageUrl>\n      </image>\n`;
          });
          xml += `    </propertyImages>\n`;
        }
        xml += `  </property>\n`;
      });
      
      xml += `</idealista>`;
      descargarXML(xml, `idealista_export_${new Date().toISOString().split('T')[0]}.xml`);
      setExportando(null);
    }, 1000);
  };

  return (
    <Layout title="Pasarela Portales">
      <PageHeader 
        title="Pasarela de Portales" 
        subtitle="Exporta tu cartera de propiedades a los principales portales inmobiliarios de España." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* IDEALISTA */}
        <div className="card bg-ink-900 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Home size={100} /></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-[#E6F598]/10 flex items-center justify-center border border-[#E6F598]/20 text-[#D4E86C]">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Idealista</h3>
                <p className="text-[10px] text-[#D4E86C] font-bold uppercase tracking-widest">Formato Nativo</p>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-6 flex-1">
              Genera el archivo XML con el esquema oficial exigido por Idealista. Exclusivo para su plataforma de publicación automática.
            </p>
            <button 
              onClick={generarIdealistaXML}
              disabled={loading || propiedades.length === 0 || exportando !== null}
              className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-[#D4E86C]/10 text-white hover:text-[#D4E86C] border border-white/10 hover:border-[#D4E86C]/30 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {exportando === 'idealista' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {exportando === 'idealista' ? 'Generando Feed...' : 'Exportar a Idealista'}
            </button>
          </div>
        </div>

        {/* KYERO (Fotocasa, Habitaclia, etc) */}
        <div className="card bg-ink-900 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Rss size={100} /></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-400">
                <Rss size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Kyero (Universal)</h3>
                <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest">Fotocasa, Habitaclia...</p>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-6 flex-1">
              Genera el estándar Kyero v3. Es el formato universal aceptado por la mayoría de portales en España (Fotocasa, Pisos.com, YaEncontre...).
            </p>
            <button 
              onClick={generarKyeroXML}
              disabled={loading || propiedades.length === 0 || exportando !== null}
              className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-brand-500/10 text-white hover:text-brand-400 border border-white/10 hover:border-brand-500/30 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {exportando === 'kyero' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {exportando === 'kyero' ? 'Generando Feed...' : 'Exportar Feed Kyero'}
            </button>
          </div>
        </div>

      </div>

      {/* INSTRUCCIONES */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-4 flex items-center gap-2"><AlertCircle size={14}/> Instrucciones de sincronización</h4>
        <div className="space-y-3">
           <div className="flex gap-3 items-start">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-white/50 leading-relaxed"><strong className="text-white/80">1. Descarga el archivo XML.</strong> Haz clic en el botón correspondiente a los portales donde tengas contratada la publicación.</p>
           </div>
           <div className="flex gap-3 items-start">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-white/50 leading-relaxed"><strong className="text-white/80">2. Envíalo a tu gestor del portal.</strong> Si es tu primera vez, debes enviar este archivo al soporte técnico de Idealista o Fotocasa para que mapeen tus campos. Dile que envías formato nativo (Idealista) o Kyero v3 (Fotocasa).</p>
           </div>
        </div>
      </div>
    </Layout>
  );
}