import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge } from '../../components/ui';
import type { Assessment, Batch, Week } from '../../types/database';

const TYPES = ['pre', 'weekly', 'mid_course', 'practical', 'final', 'capstone'] as const;
export default function Assessments() {
  const [items, setItems] = useState<Assessment[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ type: 'weekly' });
  const load = () => supabase.from('assessments').select('*, weeks(week_number, title)').order('held_on')
    .then(({ data }) => setItems((data ?? []) as Assessment[]));
  useEffect(() => {
    load();
    supabase.from('batches').select('*').then(({ data }) => setBatches((data ?? []) as Batch[]));
    supabase.from('weeks').select('*').order('week_number').then(({ data }) => setWeeks((data ?? []) as Week[]));
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('assessments').insert([{
      batch_id: form.batch_id || null, week_id: form.week_id || null, type: form.type,
      title: form.title, held_on: form.held_on || null, max_score: Number(form.max_score) || 100,
    }]);
    if (!error) { setOpen(false); setForm({ type: 'weekly' }); load(); }
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Assessments</h1><Button onClick={() => setOpen(true)}>+ New Assessment</Button></div>
      <Card>
        <Table head={['Title', 'Type', 'Week', 'Date', 'Max Score']}>
          {items.map((a) => (
            <tr key={a.id}>
              <Td><b>{a.title}</b></Td>
              <Td><Badge tone="accent">{a.type.replace('_', '-')}</Badge></Td>
              <Td>{a.weeks ? `W${a.weeks.week_number}` : '—'}</Td>
              <Td>{a.held_on ?? '—'}</Td><Td>{a.max_score}</Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No assessments scheduled yet.</p>}
      </Card>
      <Modal open={open} title="New Assessment" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Title *</label><input required className="input-sdsa" placeholder="Weekly Test W04 - Typing" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label-sdsa">Type</label><select className="input-sdsa" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}</select></div>
          <div><label className="label-sdsa">Batch</label><select className="input-sdsa" value={form.batch_id ?? ''} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}>
            <option value="">— all —</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div><label className="label-sdsa">Week (for weekly tests)</label><select className="input-sdsa" value={form.week_id ?? ''} onChange={(e) => setForm({ ...form, week_id: e.target.value })}>
            <option value="">— none —</option>{weeks.map((w) => <option key={w.id} value={w.id}>W{String(w.week_number).padStart(2, '0')}: {w.title}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-sdsa">Date</label><input type="date" className="input-sdsa" value={form.held_on ?? ''} onChange={(e) => setForm({ ...form, held_on: e.target.value })} /></div>
            <div><label className="label-sdsa">Max Score</label><input type="number" className="input-sdsa" value={form.max_score ?? 100} onChange={(e) => setForm({ ...form, max_score: e.target.value })} /></div>
          </div>
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </Modal>
    </div>
  );
}
