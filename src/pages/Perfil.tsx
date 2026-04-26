import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { User, Camera, ShieldCheck, Sparkles, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface AgenciaData {
  id: string;
  nombre: string;
}

export default function Perfil() {
  const { perfil, user } = useAuth();
  const [agencia, setAgencia] = useState<AgenciaData | null>(null);

  const [nombre, setNombre] = useState('');
  const [emailPublico, setEmailPublico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (perfil?.agencia_id) {
      supabase.from('agencias').select('id, nombre').eq('id', perfil.agencia_id).single().then(({data}) => {
        if (data) setAgencia(data as AgenciaData);
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

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${perfil?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      await supabase.from('perfiles').update({ avatar_url: publicUrl }).eq('id', perfil?.id);
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updates = { nombre, email_publico: emailPublico, telefono, slug, bio };
      const { error } = await supabase.from('perfiles').update(updates).eq('id', perfil?.id);
      if (error) throw error;
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`inmoficina.es/u/${slug}`);
    alert('Enlace copiado al portapapeles');
  };

  return (
    <Layout title="Mi Perfil">
      <PageHeader title="Perfil Público" subtitle="Configura tu tarjeta de visita digital y enlace VIP." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="card p-6 bg-ink-900 border-white/5 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-500/10 blur-3xl rounded-full" />
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-5 relative z-10 text-white/90">
              <Sparkles size={16} className="text-brand-400"/> Tu enlace público
            </h3>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-ink-950 border border-white/10 rounded-xl text-[13px] text-white/60">
                <ExternalLink size={14} className="text-white/20 shrink-0" />
                <span className="truncate">inmoficina.es/u/<strong className="text-white">{slug}</strong></span>
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={copyToClipboard} className="btn-ghost border border-white/5 flex-1 py-2 text-[12px] flex items-center justify-center gap-1">
                  <Copy size={14}/> Copiar
                </button>
                <a href={`/u/${slug}`} target="_blank" rel="noopener noreferrer" className="btn-ghost border border-white/5 flex-1 py-2 text-[12px] flex items-center justify-center gap-1">
                  <ExternalLink size={14}/> Visitar
                </a>
              </div>
            </div>
          </div>
          
          <div className="card p-6 bg-ink-900 border-white/5 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-white/90"><ShieldCheck size={16} className="text-emerald-400"/> Info Privada</h3>
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div><div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Acceso</div><div className="text-sm font-mono text-white/80">{user?.email}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Agencia</div><div className="text-sm font-bold text-white/80">{agencia?.nombre || 'Independiente'}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Rol</div><div className="text-sm uppercase text-brand-400 font-bold">{perfil?.rol}</div></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card p-0 bg-ink-900 border-white/5 overflow-hidden">
          <form onSubmit={onSubmit}>
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-ink-950 border border-white/10 overflow-hidden flex items-center justify-center relative">
                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-white/20" />}
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                      {uploading ? <Loader2 size={20} className="animate-spin text-white" /> : <><Camera size={20} className="text-white mb-1" /><span className="text-[10px] font-bold text-white">Cambiar</span></>}
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">Tarjeta de Visita Digital</h2>
                  <p className="text-xs text-white/50">Esta información será visible para tus clientes en los enlaces VIP de propiedades y dosieres.</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="label">Nombre Público</label><input required className="input bg-ink-950 border-white/10 text-sm" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
                <div><label className="label">Alias URL (Slug)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">/u/</span><input required className="input bg-ink-950 border-white/10 pl-9 text-sm" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} /></div></div>
                <div><label className="label">Teléfono Público (WhatsApp)</label><input className="input bg-ink-950 border-white/10 text-sm" value={telefono} onChange={e => setTelefono(e.target.value)} /></div>
                <div><label className="label">Email Público</label><input type="email" className="input bg-ink-950 border-white/10 text-sm" value={emailPublico} onChange={e => setEmailPublico(e.target.value)} /></div>
              </div>
              <div><label className="label">Biografía Profesional (Opcional)</label><textarea rows={4} className="input bg-ink-950 border-white/10 resize-none text-sm leading-relaxed" placeholder="Ej. Especialista en mercado residencial prime con 10 años de experiencia..." value={bio} onChange={e => setBio(e.target.value)} /></div>
            </div>

            <div className="p-6 pt-0 flex justify-end">
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin" /> : 'Guardar Perfil'}</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}