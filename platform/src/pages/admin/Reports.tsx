import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Table, Td, Badge } from '../../components/ui';
import { fmtDate } from '../../lib/utils';

// Reports with filters + CSV export (client-side generation; upgrade to server PDF/Excel later).
export default function Reports() {
  const [type, setType] = useState('students');
  const [rows, setRows] = useState<any[]>([]);
  const [head, setHead] = useState<string[]>([]);
  useEffect(() => { load(); }, [type]);
  async function load() {
    let data: any = []; let h: string[] = [];
    if (type === 'students') {
      ({ data } = await supabase.from('students').select('student_id, admission_date, current_week, status, profiles(full_name, mobile), batches(name)'));
      h = ['Student ID', 'Name', 'Mobile', 'Batch', 'Admission', 'Week', 'Status'];
      data = (data ?? []).map((s: any) => [s.student_id, s.profiles?.full_name, s.profiles?.mobile, s.batches?.name ?? '—', s.admission_date, s.current_week, s.status]);
    } else if (type === 'admissions') {
      ({ data } = await supabase.from('admissions').select('*').order('applied_at', { ascending: false }));
      h = ['Name', 'Mobile', 'Location', 'Interest', 'Status', 'Applied'];
      data = (data ?? []).map((a: any) => [a.name, a.mobile, a.location, a.course_interest, a.status, fmtDate(a.applied_at)]);
    } else if (type === 'attendance') {
      ({ data } = await supabase.from('attendance').select('date, status, students(student_id, profiles(full_name)), batches(name)'));
      h = ['Date', 'Batch', 'Student', 'Status'];
      data = (data ?? []).map((a: any) => [a.date, a.batches?.name, a.students?.profiles?.full_name, a.status]);
    } else if (type === 'results') {
      ({ data } = await supabase.from('results').select('score, percentage, passed, is_published, assessments(title, type), students(student_id, profiles(full_name))'));
      h = ['Student', 'Assessment', 'Type', 'Score', '%', 'Result', 'Published'];
      data = (data ?? []).map((r: any) => [r.students?.profiles?.full_name, r.assessments?.title, r.assessments?.type, r.score, r.percentage, r.passed ? 'Pass' : 'Fail', r.is_published ? 'Yes' : 'No']);
    } else if (type === 'certificates') {
      ({ data } = await supabase.from('certificates').select('certificate_number, issue_date, status, courses(title), students(profiles(full_name))'));
      h = ['Certificate No', 'Student', 'Course', 'Issued', 'Status'];
      data = (data ?? []).map((c: any) => [c.certificate_number, c.students?.profiles?.full_name, c.courses?.title, c.issue_date, c.status]);
    } else if (type === 'enquiries') {
      ({ data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }));
      h = ['Name', 'Mobile', 'Interest', 'Status', 'Created'];
      data = (data ?? []).map((e: any) => [e.name, e.mobile, e.course_interest, e.status, fmtDate(e.created_at)]);
    }
    setRows(data); setHead(h);
  }
  function exportCsv() {
    const csv = [head, ...rows].map((r) => r.map((c: any) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `sdsa-${type}-report.csv`; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-extrabold text-primary">Reports</h1>
        <div className="flex gap-2 flex-wrap">
          {['students', 'admissions', 'attendance', 'results', 'certificates', 'enquiries'].map((t) => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-2 rounded-lg text-xs font-bold capitalize ${type === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{t}</button>
          ))}
          <Button variant="accent" onClick={exportCsv}>Export CSV</Button>
        </div>
      </div>
      <Card>
        <Table head={head}>
          {rows.slice(0, 200).map((r: any, i: number) => <tr key={i}>{r.map((c: any, j: number) => <Td key={j}>{c ?? '—'}</Td>)}</tr>)}
        </Table>
        {rows.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No data for this report yet.</p>}
      </Card>
    </div>
  );
}
