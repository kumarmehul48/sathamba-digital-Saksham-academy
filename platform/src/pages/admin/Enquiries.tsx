import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Badge, Table, Td, Button, Modal } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Enquiry } from '../../types/database';

const STATUSES = ['new', 'contacted', 'follow_up', 'closed'];
export default function Enquiries() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [active, setActive] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState('');
  const load = () => supabase.from('enquiries').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setItems((data ?? []) as Enquiry[]));
  useEffect(() => { load(); }, []);
  async function setStatus(status: string) {
    if (!active) return;
    await supabase.from('enquiries').update({ status, notes: notes || active.notes }).eq('id', active.id);
    setActive(null); setNotes(''); load();
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Enquiries</h1>
      <Card>
        <Table head={['Name', 'Contact', 'Interest', 'Received', 'Status', '']}>
          {items.map((e) => (
            <tr key={e.id}>
              <Td><b>{e.name}</b></Td>
              <Td>{e.mobile}<span className="block text-xs text-gray-400">{e.email ?? ''} {e.location ?? ''}</span></Td>
              <Td>{e.course_interest ?? '—'}</Td>
              <Td>{fmtDate(e.created_at)}</Td>
              <Td><Badge tone={e.status === 'new' ? 'accent' : e.status === 'closed' ? 'gray' : 'success'}>{e.status.replace('_', ' ')}</Badge></Td>
              <Td><button onClick={() => { setActive(e); setNotes(e.notes ?? ''); }} className="text-xs font-bold text-primary hover:underline">Open</button></Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No enquiries yet - the Contact form feeds this list.</p>}
      </Card>
      <Modal open={!!active} title={`Enquiry: ${active?.name ?? ''}`} onClose={() => setActive(null)}>
        <p className="text-sm text-gray-600 mb-3">Mobile: <b>{active?.mobile}</b> · {active?.email ?? '—'} · {active?.location ?? '—'}</p>
        {active?.message && <p className="text-sm bg-gray-50 p-2 rounded mb-3">"{active.message}"</p>}
        <div><label className="label-sdsa">Follow-up Notes</label><textarea rows={3} className="input-sdsa" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {STATUSES.map((s) => <Button key={s} variant="outline" onClick={() => setStatus(s)}>{s.replace('_', ' ')}</Button>)}
        </div>
      </Modal>
    </div>
  );
}
