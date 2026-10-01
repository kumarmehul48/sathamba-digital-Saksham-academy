import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge } from '../../components/ui';
import type { Assignment, Week, Submission } from '../../types/database';

export default function Assignments() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState<Submission | null>(null);
  const [form, setForm] = useState<any>({});
  const [gf, setGf] = useState({ score: 0, feedback: '' });
  const load = async () => {
    const { data } = await supabase.from('assignments').select('*, weeks(week_number, title)').order('created_at');
    setItems((data ?? []) as Assignment[]);
    const { data: s } = await supabase.from('submissions').select('*, students(profiles(full_name)), assignments(title, max_score)');
    setSubs((s ?? []) as any);
  };
  useEffect(() => { load(); supabase.from('weeks').select('*').order('week_number').then(({ data }) => setWeeks((data ?? []) as Week[])); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('assignments').insert([{
      week_id: form.week_id, title: form.title, description: form.description || null, due_date: form.due_date || null, max_score: Number(form.max_score) || 100,
    }]);
    if (!error) { setOpen(false); setForm({}); load(); }
  }
  async function gradeSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('submissions').update({ score: gf.score, feedback: gf.feedback, status: 'graded' }).eq('id', grade!.id);
    setGrade(null); load();
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Assignments</h1><Button onClick={() => setOpen(true)}>+ New Assignment</Button></div>
      <Card>
        <h3 className="font-bold text-primary mb-2">All Assignments</h3>
        <Table head={['Week', 'Title', 'Due', 'Max', 'Submissions']}>
          {items.map((a) => (
            <tr key={a.id}>
              <Td><Badge tone="primary">W{String(a.weeks?.week_number ?? 0).padStart(2, '0')}</Badge></Td>
              <Td>{a.title}</Td><Td>{a.due_date ?? '—'}</Td><Td>{a.max_score}</Td>
              <Td>{subs.filter((s) => s.assignment_id === a.id).length}</Td>
            </tr>
          ))}
        </Table>
      </Card>
      <Card>
        <h3 className="font-bold text-primary mb-2">Submissions to Review</h3>
        <Table head={['Student', 'Assignment', 'Submitted', 'Status', '']}>
          {subs.map((s: any) => (
            <tr key={s.id}>
              <Td>{s.students?.profiles?.full_name ?? '—'}</Td>
              <Td>{s.assignments?.title}</Td>
              <Td className="text-xs">{new Date(s.submitted_at).toLocaleDateString()}</Td>
              <Td><Badge tone={s.status === 'graded' ? 'success' : 'accent'}>{s.status}</Badge></Td>
              <Td>{s.status !== 'graded' && <button onClick={() => { setGrade(s); setGf({ score: 0, feedback: '' }); }} className="text-xs font-bold text-primary hover:underline">Grade</button>}</Td>
            </tr>
          ))}
        </Table>
        {subs.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No submissions yet.</p>}
      </Card>
      <Modal open={open} title="New Assignment" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Week *</label><select required className="input-sdsa" value={form.week_id ?? ''} onChange={(e) => setForm({ ...form, week_id: e.target.value })}>
            <option value="">— select —</option>{weeks.map((w) => <option key={w.id} value={w.id}>W{String(w.week_number).padStart(2, '0')}: {w.title}</option>)}</select></div>
          <div><label className="label-sdsa">Title *</label><input required className="input-sdsa" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label-sdsa">Description</label><textarea rows={2} className="input-sdsa" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-sdsa">Due Date</label><input type="date" className="input-sdsa" value={form.due_date ?? ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            <div><label className="label-sdsa">Max Score</label><input type="number" className="input-sdsa" value={form.max_score ?? 100} onChange={(e) => setForm({ ...form, max_score: e.target.value })} /></div>
          </div>
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </Modal>
      <Modal open={!!grade} title="Grade Submission" onClose={() => setGrade(null)}>
        <form onSubmit={gradeSubmit} className="space-y-3">
          <p className="text-sm text-gray-600">{grade?.content}</p>
          {grade?.file_url && <p className="text-xs">File: {grade.file_url} (open in Supabase Storage)</p>}
          <div><label className="label-sdsa">Score (max {grade?.assignments?.max_score})</label><input type="number" className="input-sdsa" value={gf.score} onChange={(e) => setGf({ ...gf, score: Number(e.target.value) })} /></div>
          <div><label className="label-sdsa">Feedback</label><textarea rows={2} className="input-sdsa" value={gf.feedback} onChange={(e) => setGf({ ...gf, feedback: e.target.value })} /></div>
          <Button type="submit" className="w-full">Save & Publish to Student</Button>
        </form>
      </Modal>
    </div>
  );
}
