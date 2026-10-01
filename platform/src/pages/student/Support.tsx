import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Button, Badge, Empty } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { SupportTicket } from '../../types/database';

export default function Support() {
  const { studentRecordId } = useAuth();
  const [items, setItems] = useState<SupportTicket[] | null>(null);
  const [form, setForm] = useState({ subject: '', category: 'Admission', description: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { load(); }, [studentRecordId]);
  async function load() {
    if (!studentRecordId) return;
    const { data } = await supabase.from('support_tickets').select('*').eq('student_id', studentRecordId).order('created_at', { ascending: false });
    setItems(data as SupportTicket[]);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('support_tickets').insert([{ ...form, student_id: studentRecordId }]);
    setMsg(error ? 'Could not create ticket.' : 'Ticket created - we will respond soon.');
    if (!error) { setForm({ subject: '', category: 'Admission', description: '' }); load(); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Help & Support</h1>
      <Card>
        <h3 className="font-bold text-primary mb-3">Create a Support Ticket</h3>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label-sdsa">Subject *</label><input required className="input-sdsa" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          <div><label className="label-sdsa">Category</label><select className="input-sdsa" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Admission', 'Batch/Timing', 'Course Content', 'Assignment', 'Technical', 'Other'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label-sdsa">Description</label><textarea rows={3} className="input-sdsa" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <Button type="submit">Submit Ticket</Button>
          {msg && <p className="text-xs text-gray-600">{msg}</p>}
        </form>
      </Card>
      {items === null ? <p className="text-gray-400 text-sm">Loading…</p> : items.length === 0 ? <Empty text="No tickets yet." /> :
        <div className="space-y-3">
          {items.map((t) => (
            <Card key={t.id}>
              <div className="flex justify-between flex-wrap gap-2"><b className="text-primary text-sm">{t.subject}</b>
                <span className="text-xs text-gray-400">{fmtDate(t.created_at)}</span></div>
              <p className="text-xs text-gray-500 mt-1">{t.category} · <Badge tone={t.status === 'resolved' || t.status === 'closed' ? 'success' : 'accent'}>{t.status}</Badge></p>
              {t.description && <p className="text-sm text-gray-600 mt-2">{t.description}</p>}
            </Card>
          ))}
        </div>}
    </div>
  );
}
