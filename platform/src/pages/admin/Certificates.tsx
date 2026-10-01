import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Table, Td, Badge, Modal, Alert } from '../../components/ui';
import { nextCertNumber } from '../../lib/utils';
import type { Certificate, Student, Course } from '../../types/database';

export default function Certificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState('');
  const load = () => supabase.from('certificates').select('*, courses(title)').order('issue_date', { ascending: false })
    .then(({ data }) => setItems((data ?? []) as Certificate[]));
  useEffect(() => {
    load();
    supabase.from('students').select('*, profiles(*)').eq('status', 'active').then(({ data }) => setStudents((data ?? []) as Student[]));
    supabase.from('courses').select('*').then(({ data }) => setCourses((data ?? []) as Course[]));
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.from('certificates').insert([{
      certificate_number: form.certificate_number || nextCertNumber(items.length + 1),
      student_id: form.student_id, course_id: form.course_id,
      issue_date: form.issue_date || new Date().toISOString().slice(0, 10), status: 'issued',
    }]);
    setMsg(error ? error.message : 'Certificate issued - publicly verifiable.');
    if (!error) { setOpen(false); setForm({}); load(); }
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Certificates</h1>
        <Button onClick={() => setOpen(true)}>+ Issue Certificate</Button></div>
      {msg && <Alert tone="success">{msg}</Alert>}
      <Card>
        <Table head={['Certificate No', 'Course', 'Issued', 'Status', 'Verify']}>
          {items.map((c) => (
            <tr key={c.id}>
              <Td><b>{c.certificate_number}</b></Td>
              <Td>{c.courses?.title}</Td><Td>{c.issue_date}</Td>
              <Td><Badge tone={c.status === 'issued' ? 'success' : 'gray'}>{c.status}</Badge></Td>
              <Td><a className="text-xs font-bold text-primary hover:underline" href={`/verify-certificate/${c.certificate_number}`} target="_blank">Check</a></Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No certificates issued yet.</p>}
      </Card>
      <Modal open={open} title="Issue Certificate" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Student *</label><select required className="input-sdsa" value={form.student_id ?? ''} onChange={(e) => setForm({ ...form, student_id: e.target.value })}>
            <option value="">— select —</option>{students.map((s) => <option key={s.id} value={s.id}>{s.profiles?.full_name} ({s.student_id})</option>)}</select></div>
          <div><label className="label-sdsa">Course *</label><select required className="input-sdsa" value={form.course_id ?? ''} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          <div><label className="label-sdsa">Certificate Number (auto if blank)</label><input className="input-sdsa" placeholder={nextCertNumber(items.length + 1)} value={form.certificate_number ?? ''} onChange={(e) => setForm({ ...form, certificate_number: e.target.value })} /></div>
          <div><label className="label-sdsa">Issue Date</label><input type="date" className="input-sdsa" value={form.issue_date ?? ''} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} /></div>
          <Button type="submit" className="w-full">Issue</Button>
        </form>
      </Modal>
    </div>
  );
}
