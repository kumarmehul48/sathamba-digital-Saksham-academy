import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge } from '../../components/ui';
import type { Batch, Trainer, Course } from '../../types/database';

export default function Batches() {
  const [items, setItems] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const load = () => supabase.from('batches').select('*').order('start_date', { ascending: false })
    .then(({ data }) => setItems((data ?? []) as Batch[]));
  useEffect(() => {
    load();
    supabase.from('trainers').select('*, profiles(*)').then(({ data }) => setTrainers((data ?? []) as Trainer[]));
    supabase.from('courses').select('*').then(({ data }) => setCourses((data ?? []) as Course[]));
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('batches').insert([form]);
    if (!error) { setOpen(false); setForm({}); load(); }
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Batches</h1><Button onClick={() => setOpen(true)}>+ Add Batch</Button></div>
      <Card>
        <Table head={['Name', 'Schedule', 'Start', 'Status', 'Trainer']}>
          {items.map((b) => (
            <tr key={b.id}>
              <Td><b>{b.name}</b></Td>
              <Td>{b.schedule ?? '—'}</Td>
              <Td>{b.start_date}</Td>
              <Td><Badge tone={b.status === 'active' ? 'success' : b.status === 'upcoming' ? 'accent' : 'gray'}>{b.status}</Badge></Td>
              <Td>{trainers.find((t) => t.id === b.trainer_id)?.profiles?.full_name ?? '—'}</Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No batches yet.</p>}
      </Card>
      <Modal open={open} title="Add Batch" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Batch Name *</label><input required className="input-sdsa" placeholder="Morning 2026-A" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label-sdsa">Course</label><select className="input-sdsa" value={form.course_id ?? ''} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          <div><label className="label-sdsa">Trainer</label><select className="input-sdsa" value={form.trainer_id ?? ''} onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}>
            <option value="">— none —</option>{trainers.map((t) => <option key={t.id} value={t.id}>{t.profiles?.full_name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-sdsa">Start Date *</label><input required type="date" className="input-sdsa" value={form.start_date ?? ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
            <div><label className="label-sdsa">End Date</label><input type="date" className="input-sdsa" value={form.end_date ?? ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
          </div>
          <div><label className="label-sdsa">Schedule</label><input className="input-sdsa" placeholder="Mon-Sat 7-9 AM" value={form.schedule ?? ''} onChange={(e) => setForm({ ...form, schedule: e.target.value })} /></div>
          <div><label className="label-sdsa">Classroom / Lab</label><input className="input-sdsa" value={form.classroom ?? ''} onChange={(e) => setForm({ ...form, classroom: e.target.value })} /></div>
          <Button type="submit" className="w-full">Save Batch</Button>
        </form>
      </Modal>
    </div>
  );
}
