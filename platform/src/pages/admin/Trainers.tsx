import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge } from '../../components/ui';
import type { Trainer } from '../../types/database';

export default function Trainers() {
  const [items, setItems] = useState<Trainer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const load = () => supabase.from('trainers').select('*, profiles(*)').then(({ data }) => setItems((data ?? []) as Trainer[]));
  useEffect(() => { load(); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('trainers').insert([{ profile_id: form.profile_id, skills: form.skills ? form.skills.split(',').map((s: string) => s.trim()) : [] }]);
    if (!error) { setOpen(false); setForm({}); load(); }
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Trainers</h1><Button onClick={() => setOpen(true)}>+ Add Trainer</Button></div>
      <Card>
        <Table head={['Name', 'Contact', 'Skills', 'Status']}>
          {items.map((t) => (
            <tr key={t.id}>
              <Td><b>{t.profiles?.full_name}</b></Td>
              <Td>{t.profiles?.mobile ?? '—'}</Td>
              <Td>{(t.skills ?? []).join(', ') || '—'}</Td>
              <Td><Badge tone={t.status === 'active' ? 'success' : 'gray'}>{t.status}</Badge></Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No trainers yet.</p>}
      </Card>
      <Modal open={open} title="Add Trainer" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Profile ID (auth user UUID, role=trainer) *</label><input required className="input-sdsa" value={form.profile_id ?? ''} onChange={(e) => setForm({ ...form, profile_id: e.target.value })} /></div>
          <div><label className="label-sdsa">Skills (comma separated)</label><input className="input-sdsa" placeholder="MS Office, Internet, AI" value={form.skills ?? ''} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
