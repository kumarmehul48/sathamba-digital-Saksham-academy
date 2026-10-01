import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge, Alert } from '../../components/ui';
import type { Workbook, Week } from '../../types/database';

// Workbook management: create/replace per week, publish/unpublish, version history via workbook_versions.
export default function Workbooks() {
  const [items, setItems] = useState<Workbook[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState('');
  const load = () => supabase.from('workbooks').select('*, weeks(week_number, title)').then(({ data }) => setItems((data ?? []) as Workbook[]));
  useEffect(() => { load(); supabase.from('weeks').select('*').order('week_number').then(({ data }) => setWeeks((data ?? []) as Week[])); }, []);
  const lines = (s: any) => String(s ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    const payload = {
      week_id: form.week_id, title: form.title, explanation: form.explanation || null,
      topics: lines(form.topics), examples: lines(form.examples),
      practice: lines(form.practice), self_check: lines(form.self_check),
      is_published: !!form.is_published,
    };
    const { error } = form.id
      ? await supabase.from('workbooks').update(payload).eq('id', form.id)
      : await supabase.from('workbooks').insert([payload]);
    setMsg(error ? error.message : 'Workbook saved.');
    if (!error) { setOpen(false); load(); }
  }
  async function version(wb: Workbook, bump: 'v1.1' | 'v2.0') {
    await supabase.from('workbook_versions').insert([{ workbook_id: wb.id, version: bump, content: wb as any }]);
    setMsg(`Version ${bump} snapshot created for "${wb.title}".`);
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold text-primary">Workbooks</h1>
        <Button onClick={() => { setForm({ is_published: false }); setOpen(true); }}>+ New Workbook</Button></div>
      {msg && <Alert tone="success">{msg}</Alert>}
      <Card>
        <Table head={['Week', 'Title', 'Published', 'Versions']}>
          {items.map((w) => (
            <tr key={w.id}>
              <Td><Badge tone="primary">W{String(w.weeks?.week_number ?? 0).padStart(2, '0')}</Badge></Td>
              <Td>{w.title}</Td>
              <Td><Badge tone={w.is_published ? 'success' : 'gray'}>{w.is_published ? 'Yes' : 'No'}</Badge></Td>
              <Td className="space-x-2">
                <button onClick={() => { setForm({ id: w.id, week_id: w.week_id, title: w.title, explanation: w.explanation, topics: (w.topics ?? []).join('\n'), examples: (w.examples ?? []).join('\n'), practice: (w.practice ?? []).join('\n'), self_check: (w.self_check ?? []).join('\n'), is_published: w.is_published }); setOpen(true); }} className="text-xs font-bold text-primary hover:underline">Edit</button>
                <button onClick={() => version(w, 'v1.1')} className="text-xs hover:underline text-gray-500">v1.1</button>
                <button onClick={() => version(w, 'v2.0')} className="text-xs hover:underline text-gray-500">v2.0</button>
              </Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No workbooks yet - create one per week as you prepare content.</p>}
      </Card>
      <Modal open={open} title={form.id ? 'Edit Workbook' : 'New Workbook'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Week *</label><select required className="input-sdsa" value={form.week_id ?? ''} onChange={(e) => setForm({ ...form, week_id: e.target.value })}>
            <option value="">— select week —</option>
            {weeks.map((w) => <option key={w.id} value={w.id}>W{String(w.week_number).padStart(2, '0')}: {w.title}</option>)}</select></div>
          <div><label className="label-sdsa">Title *</label><input required className="input-sdsa" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label-sdsa">Explanation</label><textarea rows={2} className="input-sdsa" value={form.explanation ?? ''} onChange={(e) => setForm({ ...form, explanation: e.target.value })} /></div>
          {(['topics', 'examples', 'practice', 'self_check'] as const).map((k) => (
            <div key={k}><label className="label-sdsa">{k.replace('_', ' ')[0].toUpperCase() + k.slice(1).replace('_', ' ')} (one per line)</label><textarea rows={2} className="input-sdsa" value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
          ))}
          <label className="flex items-center gap-2 text-sm font-semibold text-primary"><input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Publish to students</label>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
