import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge, Alert } from '../../components/ui';
import { nextStudentId } from '../../lib/utils';
import type { Student, Batch } from '../../types/database';

// Add Student = create auth user (via supabase admin invite or your signup flow), then insert here.
export default function Students() {
  const [items, setItems] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState('');
  const load = () => supabase.from('students').select('*, profiles(*), batches(*)').order('created_at', { ascending: false })
    .then(({ data }) => setItems((data ?? []) as Student[]));
  useEffect(() => { load(); supabase.from('batches').select('*').then(({ data }) => setBatches((data ?? []) as Batch[])); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    const seq = items.length + 1;
    const { error } = await supabase.from('students').insert([{
      profile_id: form.profile_id, student_id: form.student_id || nextStudentId(seq),
      course_id: form.course_id || null, batch_id: form.batch_id || null,
      guardian_name: form.guardian_name || null, address: form.address || null,
    }]);
    setMsg(error ? error.message : 'Student added.');
    if (!error) { setOpen(false); load(); }
  }
  async function toggle(s: Student) {
    await supabase.from('students').update({ status: s.status === 'active' ? 'inactive' : 'active' }).eq('id', s.id);
    load();
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Students</h1>
        <Button onClick={() => { setForm({}); setOpen(true); }}>+ Add Student</Button></div>
      <Card>
        <Table head={['Student ID', 'Name', 'Batch', 'Week', 'Status', 'Actions']}>
          {items.map((s) => (
            <tr key={s.id}>
              <Td><b>{s.student_id}</b></Td>
              <Td>{s.profiles?.full_name}<span className="block text-xs text-gray-400">{s.profiles?.mobile}</span></Td>
              <Td>{s.batches?.name ?? '—'}</Td>
              <Td>W{String(s.current_week).padStart(2, '0')}</Td>
              <Td><Badge tone={s.status === 'active' ? 'success' : 'gray'}>{s.status}</Badge></Td>
              <Td><button onClick={() => toggle(s)} className="text-xs text-primary font-bold hover:underline">{s.status === 'active' ? 'Deactivate' : 'Activate'}</button></Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No students yet. Approve admissions first, or add directly.</p>}
      </Card>
      <Modal open={open} title="Add Student" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          {msg && <Alert tone={msg.includes('added') ? 'success' : 'error'}>{msg}</Alert>}
          <div><label className="label-sdsa">Profile ID (auth user UUID) *</label><input required className="input-sdsa" value={form.profile_id ?? ''} onChange={(e) => setForm({ ...form, profile_id: e.target.value })} /></div>
          <div><label className="label-sdsa">Student ID (auto if blank)</label><input className="input-sdsa" placeholder={nextStudentId(items.length + 1)} value={form.student_id ?? ''} onChange={(e) => setForm({ ...form, student_id: e.target.value })} /></div>
          <div><label className="label-sdsa">Batch</label><select className="input-sdsa" value={form.batch_id ?? ''} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}>
            <option value="">— none —</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div><label className="label-sdsa">Guardian Name</label><input className="input-sdsa" value={form.guardian_name ?? ''} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} /></div>
          <div><label className="label-sdsa">Address</label><input className="input-sdsa" value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <Button type="submit" className="w-full">Save</Button>
          <p className="text-xs text-gray-400">Create the student's login first (Supabase Auth → invite user with role=student), then paste their UUID here.</p>
        </form>
      </Modal>
    </div>
  );
}
