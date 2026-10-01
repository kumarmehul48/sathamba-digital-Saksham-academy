import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Badge, Modal, Alert } from '../../components/ui';

const CATS = ['Classroom', 'Student Activities', 'Projects', 'Events', 'Workshops', 'Academy Activities'];
export default function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState('');
  const load = () => supabase.from('gallery').select('*').order('sort_order').then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);
  async function upload() {
    setMsg('');
    const file = form.file;
    if (!file) return setMsg('Choose an image first.');
    if (file.size > 5 * 1024 * 1024) return setMsg('Image must be under 5 MB (optimize for web).');
    if (!/^image\/(jpeg|png|webp|jpg)$/.test(file.type)) return setMsg('Only JPG/PNG/WebP images allowed.');
    const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
    if (upErr) return setMsg('Upload failed: ' + upErr.message);
    const url = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
    const { error } = await supabase.from('gallery').insert([{ category: form.category || 'Classroom', title: form.title, image_url: url }]);
    setMsg(error ? error.message : 'Photo added to gallery.');
    if (!error) { setOpen(false); setForm({}); load(); }
  }
  async function remove(id: string) {
    if (!confirm('Remove this photo from the gallery?')) return;
    await supabase.from('gallery').delete().eq('id', id); load();
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Gallery</h1><Button onClick={() => setOpen(true)}>+ Add Photo</Button></div>
      {msg && <Alert tone={msg.includes('added') ? 'success' : 'error'}>{msg}</Alert>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((g) => (
          <Card key={g.id} className="!p-0 overflow-hidden">
            <img src={g.image_url} alt={g.title} className="w-full h-32 object-cover" loading="lazy" />
            <div className="p-2 flex justify-between items-center"><div><Badge tone="primary">{g.category}</Badge><p className="text-xs font-semibold mt-1">{g.title}</p></div>
              <button onClick={() => remove(g.id)} className="text-xs text-danger font-bold hover:underline">Del</button></div>
          </Card>
        ))}
      </div>
      {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No photos yet.</p>}
      <Modal open={open} title="Add Gallery Photo" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <div><label className="label-sdsa">Title *</label><input className="input-sdsa" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label-sdsa">Category</label><select className="input-sdsa" value={form.category ?? 'Classroom'} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label-sdsa">Image (JPG/PNG/WebP, max 5 MB) *</label><input type="file" accept="image/jpeg,image/png,image/webp" className="input-sdsa" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] })} /></div>
          <Button className="w-full" onClick={upload}>Upload & Publish</Button>
        </div>
      </Modal>
    </div>
  );
}
