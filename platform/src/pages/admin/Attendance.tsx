import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Table, Td, Badge } from '../../components/ui';
import type { Batch, Student, AttendanceRow } from '../../types/database';

export default function Attendance() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchId, setBatchId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase.from('batches').select('*').eq('status', 'active').then(({ data }) => setBatches((data ?? []) as Batch[]));
  }, []);
  useEffect(() => {
    if (!batchId) return setStudents([]);
    supabase.from('students').select('*, profiles(*)').eq('batch_id', batchId).eq('status', 'active')
      .then(({ data }) => setStudents((data ?? []) as Student[]));
    supabase.from('attendance').select('*').eq('batch_id', batchId).eq('date', date)
      .then(({ data }) => { const m: any = {}; (data ?? []).forEach((r: any) => m[r.student_id] = r.status); setMarks(m); });
  }, [batchId, date]);
  async function mark() {
    if (!batchId) return;
    const rows = students.map((s) => ({ batch_id: batchId, student_id: s.id, date, status: (marks[s.id] ?? 'present') as any }));
    const { error } = await supabase.from('attendance').upsert(rows, { onConflict: 'batch_id,student_id,date' });
    alert(error ? 'Save failed: ' + error.message : `Attendance saved for ${rows.length} students.`);
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Attendance Management</h1>
      <Card>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className="label-sdsa">Batch</label><select className="input-sdsa" value={batchId} onChange={(e) => setBatchId(e.target.value)}>
            <option value="">— select batch —</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div><label className="label-sdsa">Date</label><input type="date" className="input-sdsa" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="flex items-end"><Button onClick={mark} disabled={!batchId || students.length === 0}>Save Attendance</Button></div>
        </div>
      </Card>
      <Card>
        <Table head={['Student', 'Roll', 'Status']}>
          {students.map((s) => (
            <tr key={s.id}>
              <Td><b>{s.profiles?.full_name}</b></Td>
              <Td>{s.student_id}</Td>
              <Td>
                <div className="flex gap-1">
                  {(['present', 'absent', 'late'] as const).map((st) => (
                    <button key={st} onClick={() => setMarks({ ...marks, [s.id]: st })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg ${(marks[s.id] ?? 'present') === st ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{st}</button>
                  ))}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        {batchId && students.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No active students in this batch.</p>}
        {!batchId && <p className="text-center text-gray-400 py-4 text-sm">Select a batch to mark attendance.</p>}
      </Card>
    </div>
  );
}
