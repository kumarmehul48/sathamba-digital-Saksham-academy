import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Badge, Alert } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Announcement } from '../../types/database';

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ audience: 'students' });
  const [msg, setMsg] = useState('');
  const load = () => supabase.from('announcements').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setItems((data ?? []) as Announcement[]));
  useEffect(() => { load(); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.from('announcements').insert([{
      title: form.title, body: form.body, audience: form.audience,
      is_published: !!form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    }]);
    setMsg(error ? error.message : 'Announcement created.');
    if (!error) { setOpen(false); setForm({ audience: 'students' }); load(); }
  }
  async function toggle(a: Announcement) {
    await supabase.from('announcements').update({ is_published: !a.is_published, published_at: !a.is_published ? new Date().toISOString() : null }).eq('id', a.id);
    load();
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Announcements</h1><Button onClick={() => setOpen(true)}>+ New</Button></div>
      {msg && <Alert tone="success">{msg}</Alert>}
      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id}>
            <div className="flex justify-between flex-wrap gap-2"><b className="text-primary">{a.title}</b>
              <div className="flex items-center gap-2"><Badge tone="gray">{a.audience}</Badge>
                <Badge tone={a.is_published ? 'success' : 'gray'}>{a.is_published ? 'Published' : 'Draft'}</Badge>
                <button onClick={() => toggle(a)} className="text-xs font-bold text-primary hover:underline">{a.is_published ? 'Unpublish' : 'Publish'}</button></div></div>
            <p className="text-sm text-gray-600 mt-2">{a.body}</p>
            {a.published_at && <p className="text-xs text-gray-400 mt-1">{fmtDate(a.published_at)}</p>}
          </Card>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No announcements yet.</p>}
      </div>
      <Modal open={open} title="New Announcement" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Title *</label><input required className="input-sdsa" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label-sdsa">Body *</label><textarea required rows={4} className="input-sdsa" value={form.body ?? ''} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          <div><label className="label-sdsa">Audience</label><select className="input-sdsa" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
            {['students', 'all', 'trainers'].map((x) => <option key={x}>{x}</option>)}</select></div>
          <label className="flex items-center gap-2 text-sm font-semibold text-primary"><input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Publish immediately</label>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
