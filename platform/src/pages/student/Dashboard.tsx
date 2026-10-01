import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Stat, Progress, Badge, Alert } from '../../components/ui';
import type { Student, Assignment, Submission } from '../../types/database';
import { WEEKS } from '../../data/curriculum';

export default function Dashboard() {
  const { profile, studentRecordId } = useAuth();
  const [me, setMe] = useState<Student | null>(null);
  const [att, setAtt] = useState<{ present: number; total: number }>({ present: 0, total: 0 });
  const [pending, setPending] = useState(0);
  const [ann, setAnn] = useState<{ id: string; title: string; body: string }[]>([]);

  useEffect(() => {
    if (!studentRecordId) return;
    supabase.from('students').select('*, profiles(*), batches(*)').eq('id', studentRecordId).single()
      .then(({ data }) => setMe(data as Student));
    supabase.from('attendance').select('status').eq('student_id', studentRecordId)
      .then(({ data }) => {
        const rows = data ?? [];
        setAtt({ present: rows.filter((r: any) => r.status === 'present').length, total: rows.length });
      });
    supabase.from('submissions').select('assignment_id').eq('student_id', studentRecordId)
      .then(async ({ data: subs }) => {
        const done = new Set((subs ?? []).map((s: any) => s.assignment_id));
        const { data: asg } = await supabase.from('assignments').select('id').limit(500);
        setPending((asg ?? []).filter((a: any) => !done.has(a.id)).length);
      });
    supabase.from('announcements').select('id,title,body').eq('is_published', true).order('published_at', { ascending: false }).limit(3)
      .then(({ data }) => setAnn(data ?? []));
  }, [studentRecordId]);

  const currentWeek = me?.current_week ?? 1;
  const pct = (currentWeek / 26) * 100;
  const attPct = att.total ? (att.present / att.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Namaste, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm">Student ID: <b>{me?.student_id ?? '—'}</b> · Batch: <b>{me?.batches?.name ?? 'To be assigned'}</b> · Admission: <b>{me?.admission_date}</b></p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Overall Progress" value={`${Math.round(pct)}%`} hint={`Week ${currentWeek} of 26`} />
        <Stat label="Attendance" value={`${Math.round(attPct)}%`} hint={`${att.present}/${att.total} classes present`} />
        <Stat label="Pending Assignments" value={pending} hint="Submit on time for full feedback" />
        <Stat label="Current Week" value={`W${String(currentWeek).padStart(2, '0')}`} hint={WEEKS[currentWeek - 1]?.title} />
      </div>
      <Card><Progress value={pct} /></Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-primary mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/student/course" className="btn-primary !text-xs !px-3 !py-2">My Course</Link>
            <Link to="/student/assignments" className="btn-accent !text-xs !px-3 !py-2">Assignments</Link>
            <Link to="/student/workbooks" className="btn-outline !text-xs !px-3 !py-2">Workbooks</Link>
            <Link to="/student/certificates" className="btn-outline !text-xs !px-3 !py-2">Certificates</Link>
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-primary mb-2">Announcements</h3>
          {ann.length === 0 ? <p className="text-sm text-gray-400">No announcements yet.</p> : (
            <ul className="space-y-2">
              {ann.map((a) => <li key={a.id}><Badge tone="accent">New</Badge> <b className="text-sm">{a.title}</b><p className="text-xs text-gray-500">{a.body.slice(0, 90)}</p></li>)}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
