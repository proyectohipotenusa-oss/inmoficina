import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { User, Camera, ShieldCheck, Sparkles, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Perfil() {
  const { perfil, user } = useAuth();
  const [agencia, setAgencia] = useState<any>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [emailPublico, setEmailPublico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cargar datos al inicio
  useEffect(() => {
    if (perfil?.agencia_id) {
      supabase.from('agencias').select('*').eq('id', perfil.agencia_id).single().then(({data}) => {
        if (data) setAgencia(data);
      });
    }
    if (perfil) {
      setNombre(perfil.nombre || '');
      setEmailPublico(perfil.email_publico || '');
      setTelefono(perfil.telefono || '');
      setSlug(perfil.slug || perfil.id || '');
      setBio(perfil.bio || '');
      setAvatarUrl(perfil.avatar_url || '');
    }
  }, [perfil]);

  // Lógica para comprimir y subir la foto del perfil
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Tamaño ideal para foto de perfil
        const MAX_SIZE = 400;
        let w = img.width, h = img.height;
        
        if (w > h) { if (w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE; } } 
        else { if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE; } }
        
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarUrl(base64);
        }
        setUploading(false);
      };
    };
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('perfiles').update({
      nombre,
      email_publico: emailPublico,
      telefono,
      slug,
      bio,
      avatar_url: avatarUrl // Guardamos la foto
    }).eq('id', perfil?.id);
    
    setTimeout(() => setSubmitting(false), 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://inmoficina.es/u/${slug}`);
    alert('Enlace copiado al portapapeles');
  };

  return (
    <Layout title="Perfil del agente">
      <PageHeader 
        title="Perfil del agente" 
        subtitle="Gestiona tus datos, tu foto y tu enlace público." 
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-6xl">
        
        <div className="xl:col-span-2">
          <div className="card p-8 bg-ink-900 border-white/5">
            
            {/* Cabecera Avatar */}
            <div className="flex gap-4 items-center mb-8">
              <div className="relative">
                <div className="h-16 w-16 rounded-xl bg-ink-950 flex items-center justify-center border border-white/5 overflow-hidden">
                   {avatarUrl ? (
                     <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User size={24} className="text-white/30" />
                   )}
                </div>
                
                {/* Input de archivo oculto con el botón */}
                <label className="absolute -bottom-2 -right-2 h-7 w-7 bg-brand-500 rounded-full flex items-center justify-center text-white border-2 border-ink-900 hover:bg-brand-400 transition cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                </label>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{nombre || perfil?.nombre || 'Usuario'}</h2>
                <div className="text-[13px] text-brand-400">{perfil?.email || user?.email}</div>
                <div className="text-[10px] text-white/40 mt-1">Sube una imagen cuadrada de al menos 256x256</div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Nombre completo</label>
                  <input required className="input bg-ink-950 border-white/10" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div>
                  <label className="label">Email de acceso</label>
                  <input className="input bg-ink-950 border-white/5 text-white/50 cursor-not-allowed" disabled value={perfil?.email || user?.email || ''} />
                </div>
                
                <div>
                  <label className="label">Email personal (de contacto público)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                    <input className="input bg-ink-950 border-white/10 pl-9" placeholder="tu-email@ejemplo.com" value={emailPublico} onChange={e => setEmailPublico(e.target.value)} />
                  </div>
                  <p className="text-[10px] text-white/40 mt-1.5">Si lo dejas vacío, se usará tu email de acceso en la ficha pública.</p>
                </div>
                <div>
                  <label className="label">Teléfono con WhatsApp</label>
                  <input className="input bg-ink-950 border-white/10" placeholder="+34 600 000 000" value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="label">Slug público</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-ink-950 text-white/40 text-[13px]">
                      inmoficina.es/u/
                    </span>
                    <input required className="input bg-ink-950 border-white/10 rounded-l-none focus:z-10" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="label">Mini-bio</label>
                  <textarea 
                    className="input bg-ink-950 border-white/10 resize-none" 
                    rows={3} 
                    maxLength={280} 
                    placeholder="Preséntate en 2-3 frases. Especialización, zonas, experiencia..."
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                  />
                  <div className="text-right text-[10px] text-white/40 mt-1.5">{bio.length}/280</div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="btn-primary !px-6" disabled={submitting || uploading}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tarjetas Laterales */}
        <div className="space-y-6">
          <div className="card p-6 bg-ink-900 border-white/5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-5 text-white/90">
              <ShieldCheck size={16} className="text-white/40"/> Licencia de agencia
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Agencia</div>
                <div className="text-base text-white font-semibold">{agencia?.nombre || perfil?.agencia_id}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Nº de licencia</div>
                <div className="text-sm text-white/70 font-medium">{agencia?.licencia || '—'}</div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-ink-900/80 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-3xl rounded-full" />
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-5 relative z-10 text-white/90">
              <Sparkles size={16} className="text-brand-400"/> Tu enlace público
            </h3>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-ink-950 border border-white/10 rounded-xl text-[13px] text-white/60">
                <ExternalLink size={14} className="text-white/20 shrink-0" />
                <span className="truncate">inmoficina.es/u/<strong className="text-white">{slug}</strong></span>
              </div>
              
              <div className="flex gap-3">
                <button onClick={copyToClipboard} className="btn-ghost border border-white/5 flex-1 py-2 text-[12px] flex items-center justify-center gap-1">
                  <Copy size={14}/> Copiar
                </button>
                {/* BOTÓN CONVERTIDO A ENLACE EXTERNO PARA BURLAR EL IFRAME */}
                <a 
                  href={`/u/${slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-ghost border border-white/5 flex-1 py-2 text-[12px] flex items-center justify-center gap-1"
                >
                  <ExternalLink size={14}/> Previsualizar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}