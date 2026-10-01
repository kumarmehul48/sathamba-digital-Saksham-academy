import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Badge, Table, Td, Button, Modal } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Admission } from '../../types/database';

const STATUSES: Admission['status'][] = ['pending', 'under_review', 'approved', 'rejected', 'enrolled'];
export default function Admissions() {
  const [items, setItems] = useState<Admission[] | null>(null);
  const [active, setActive] = useState<Admission | null>(null);
  const [notes, setNotes] = useState('');
  const load = () => supabase.from('admissions').select('*').order('applied_at', { ascending: false })
    .then(({ data }) => setItems((data ?? []) as Admission[]));
  useEffect(() => { load(); }, []);
  async function setStatus(a: Admission, status: Admission['status']) {
    await supabase.from('admissions').update({ status, notes: notes || a.notes }).eq('id', a.id);
    // Approval → create student account (Supabase Dashboard → Auth → Invite, role=student), then Students page to assign batch/ID.
    setActive(null); setNotes(''); load();
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Admissions</h1>
      <p className="text-sm text-gray-500">Flow: Apply → Pending → Under Review → Approved → account + Student ID + batch → Enrolled.</p>
      <Card>
        <Table head={['Applicant', 'Contact', 'Interest', 'Applied', 'Status', 'Action']}>
          {(items ?? []).map((a) => (
            <tr key={a.id}>
              <Td><b>{a.name}</b></Td>
              <Td>{a.mobile}<span className="block text-xs text-gray-400">{a.email ?? a.location}</span></Td>
              <Td>{a.course_interest ?? '—'}</Td>
              <Td>{fmtDate(a.applied_at)}</Td>
              <Td><Badge tone={a.status === 'enrolled' ? 'success' : a.status === 'rejected' ? 'danger' : a.status === 'approved' ? 'accent' : 'gray'}>{a.status.replace('_', ' ')}</Badge></Td>
              <Td><button onClick={() => { setActive(a); setNotes(a.notes ?? ''); }} className="text-xs font-bold text-primary hover:underline">Review</button></Td>
            </tr>
          ))}
        </Table>
        {items?.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No applications yet - the Apply page feeds this list automatically.</p>}
      </Card>
      <Modal open={!!active} title={`Review: ${active?.name ?? ''}`} onClose={() => setActive(null)}>
        <p className="text-sm text-gray-600 mb-2">Mobile: <b>{active?.mobile}</b> · Email: {active?.email ?? '—'} · Village: {active?.location ?? '—'}</p>
        {active?.notes && <p className="text-xs bg-gray-50 p-2 rounded mb-3">Notes: {active.notes}</p>}
        <div><label className="label-sdsa">Notes</label><textarea rows={2} className="input-sdsa" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {STATUSES.map((s) => (
            <Button key={s} variant={s === 'approved' ? 'accent' : s === 'rejected' ? 'danger' : 'outline'}
              onClick={() => active && setStatus(active, s)}>{s.replace('_', ' ')}</Button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Approving? Create their login in Supabase Auth (role=student), then add them in Students with batch + Student ID.</p>
      </Modal>
    </div>
  );
}
