import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Stat, Card, Table, Td, Badge } from '../../components/ui';
import { fmtDate } from '../../lib/utils';

export default function Dashboard() {
  const [s, setS] = useState<any>({});
  useEffect(() => {
    (async () => {
      const count = async (table: string, q?: (req: any) => any): Promise<number> => {
        let req = supabase.from(table).select('id', { count: 'exact', head: true });
        if (q) req = q(req);
        const { count: c } = await req; return c ?? 0;
      };
      const today = new Date().toISOString().slice(0, 10);
      setS({
        totalStudents: await count('students'),
        activeStudents: await count('students', (r) => r.eq('status', 'active')),
        pendingAdmissions: await count('admissions', (r) => r.in('status', ['pending', 'under_review'])),
        activeBatches: await count('batches', (r) => r.eq('status', 'active')),
        todaysAttendance: await count('attendance', (r) => r.eq('date', today)),
        assignments: await count('assignments'),
        assessments: await count('assessments'),
        certificates: await count('certificates', (r) => r.eq('status', 'issued')),
        newEnquiries: await count('enquiries', (r) => r.eq('status', 'new')),
      });
      const { data: recent } = await supabase.from('admissions').select('*').order('applied_at', { ascending: false }).limit(5);
      setS((x: any) => ({ ...x, recent: recent ?? [] }));
    })();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-primary">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Total Students" value={s.totalStudents ?? '…'} />
        <Stat label="Active Students" value={s.activeStudents ?? '…'} />
        <Stat label="Pending Admissions" value={s.pendingAdmissions ?? '…'} />
        <Stat label="Active Batches" value={s.activeBatches ?? '…'} />
        <Stat label="Today's Attendance" value={s.todaysAttendance ?? '…'} />
        <Stat label="Assignments" value={s.assignments ?? '…'} />
        <Stat label="Assessments" value={s.assessments ?? '…'} />
        <Stat label="Issued Certificates" value={s.certificates ?? '…'} />
        <Stat label="New Enquiries" value={s.newEnquiries ?? '…'} />
      </div>
      <Card>
        <h3 className="font-bold text-primary mb-3">Recent Applications</h3>
        <Table head={['Name', 'Mobile', 'Applied', 'Status']}>
          {(s.recent ?? []).map((a: any) => (
            <tr key={a.id}>
              <Td><b>{a.name}</b></Td><Td>{a.mobile}</Td><Td>{fmtDate(a.applied_at)}</Td>
              <Td><Badge tone={a.status === 'approved' || a.status === 'enrolled' ? 'success' : a.status === 'rejected' ? 'danger' : 'accent'}>{a.status}</Badge></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
