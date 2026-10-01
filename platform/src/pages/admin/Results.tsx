import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge } from '../../components/ui';
import type { Assessment, ResultRow, Student } from '../../types/database';

export default function Results() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [pick, setPick] = useState<Assessment | null>(null);
  const [entry, setEntry] = useState<Record<string, { score: string; feedback: string }>>({});
  useEffect(() => {
    supabase.from('assessments').select('*').order('held_on').then(({ data }) => setAssessments((data ?? []) as Assessment[]));
    supabase.from('students').select('*, profiles(*)').eq('status', 'active').then(({ data }) => setStudents((data ?? []) as Student[]));
    supabase.from('results').select('*, assessments(*)').then(({ data }) => setRows((data ?? []) as ResultRow[]));
  }, []);
  function open(a: Assessment) {
    setPick(a);
    const e: any = {};
    students.forEach((s) => { const r = rows.find((x) => x.assessment_id === a.id && x.student_id === s.id); e[s.id] = { score: r ? String(r.score) : '', feedback: r?.feedback ?? '' }; });
    setEntry(e);
  }
  async function publish() {
    if (!pick) return;
    const upserts = students.map((s) => {
      const sc = Number(entry[s.id]?.score ?? 0);
      const pct = (sc / pick.max_score) * 100;
      return { assessment_id: pick.id, student_id: s.id, score: sc, percentage: Math.round(pct * 100) / 100, passed: pct >= 40, feedback: entry[s.id]?.feedback || null, is_published: true };
    });
    const { error } = await supabase.from('results').upsert(upserts, { onConflict: 'assessment_id,student_id' });
    alert(error ? 'Failed: ' + error.message : 'Results published to students.');
    setPick(null);
    supabase.from('results').select('*, assessments(*)').then(({ data }) => setRows((data ?? []) as ResultRow[]));
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Results</h1>
      <Card>
        <h3 className="font-bold text-primary mb-2">Enter & Publish Marks</h3>
        <Table head={['Assessment', 'Type', 'Date', '']}>
          {assessments.map((a) => (
            <tr key={a.id}>
              <Td><b>{a.title}</b></Td><Td><Badge tone="accent">{a.type}</Badge></Td><Td>{a.held_on ?? '—'}</Td>
              <Td><button onClick={() => open(a)} className="text-xs font-bold text-primary hover:underline">Enter Marks</button></Td>
            </tr>
          ))}
        </Table>
        {assessments.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">Create assessments first.</p>}
      </Card>
      <Modal open={!!pick} title={`Marks: ${pick?.title ?? ''} (max ${pick?.max_score ?? 100})`} onClose={() => setPick(null)}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {students.map((s) => (
            <div key={s.id} className="grid grid-cols-3 gap-2 items-end">
              <p className="text-sm font-semibold col-span-3">{s.profiles?.full_name} <span className="text-xs text-gray-400">({s.student_id})</span></p>
              <input type="number" placeholder="Score" className="input-sdsa" value={entry[s.id]?.score ?? ''} onChange={(e) => setEntry({ ...entry, [s.id]: { ...entry[s.id], score: e.target.value } })} />
              <input placeholder="Feedback" className="input-sdsa col-span-2" value={entry[s.id]?.feedback ?? ''} onChange={(e) => setEntry({ ...entry, [s.id]: { ...entry[s.id], feedback: e.target.value } })} />
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" onClick={publish}>Save & Publish Results</Button>
      </Modal>
    </div>
  );
}
