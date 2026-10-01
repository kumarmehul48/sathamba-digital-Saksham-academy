import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Stat, Table, Td, Badge, Empty } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { AttendanceRow } from '../../types/database';

export default function Attendance() {
  const { studentRecordId } = useAuth();
  const [rows, setRows] = useState<AttendanceRow[] | null>(null);
  useEffect(() => {
    if (!studentRecordId) return;
    supabase.from('attendance').select('*').eq('student_id', studentRecordId).order('date', { ascending: false })
      .then(({ data }) => setRows(data as AttendanceRow[]));
  }, [studentRecordId]);
  const present = (rows ?? []).filter((r) => r.status === 'present').length;
  const pct = rows && rows.length ? (present / rows.length) * 100 : 0;
  const byMonth = new Map<string, AttendanceRow[]>();
  (rows ?? []).forEach((r) => { const m = r.date.slice(0, 7); byMonth.set(m, [...(byMonth.get(m) ?? []), r]); });
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Attendance</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Total Classes" value={rows?.length ?? 0} />
        <Stat label="Present" value={present} />
        <Stat label="Percentage" value={`${Math.round(pct)}%`} hint="75%+ required for certificate" />
      </div>
      {rows === null ? <p className="text-gray-400 text-sm">Loading…</p> : rows.length === 0 ? <Empty text="Attendance will appear after your batch starts." /> :
        <Card>
          <Table head={['Date', 'Status']}>
            {[...byMonth.entries()].map(([month, mrows]) => (
              <>
                <tr key={month}><Td className="font-bold text-primary" >{month}</Td><Td>{mrows.filter((r) => r.status === 'present').length}/{mrows.length} present</Td></tr>
                {mrows.map((r) => <tr key={r.id}><Td className="pl-6 text-gray-600">{fmtDate(r.date)}</Td><Td><Badge tone={r.status === 'present' ? 'success' : 'danger'}>{r.status}</Badge></Td></tr>)}
              </>
            ))}
          </Table>
        </Card>}
    </div>
  );
}
