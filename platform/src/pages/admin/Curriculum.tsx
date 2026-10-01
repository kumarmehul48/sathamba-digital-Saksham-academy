import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Modal, Table, Td, Badge } from '../../components/ui';
import type { Week, Module } from '../../types/database';

// Modules & Weeks are seeded (26 weeks) and fully editable here - no code changes needed.
export default function Curriculum() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [edit, setEdit] = useState<Week | null>(null);
  const [form, setForm] = useState<any>({});
  const load = () => supabase.from('weeks').select('*, modules(*)').order('week_number')
    .then(({ data }) => setWeeks((data ?? []) as Week[]));
  useEffect(() => {
    load();
    supabase.from('modules').select('*').order('module_number').then(({ data }) => setModules((data ?? []) as Module[]));
  }, []);
  function openEdit(w: Week) { setEdit(w); setForm({ title: w.title, topics: (w.topics ?? []).join('\n'), objectives: (w.objectives ?? []).join('\n'), activities: (w.activities ?? []).join('\n'), applications: (w.applications ?? []).join('\n'), is_published: w.is_published }); }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const lines = (s: any) => String(s ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
    const { error } = await supabase.from('weeks').update({
      title: form.title, topics: lines(form.topics), objectives: lines(form.objectives),
      activities: lines(form.activities), applications: lines(form.applications),
      is_published: form.is_published,
    }).eq('id', edit!.id);
    if (!error) { setEdit(null); load(); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Curriculum Management</h1>
      <div className="grid sm:grid-cols-4 gap-2">
        {modules.map((m) => <Card key={m.id} className="!p-3 text-center"><Badge tone="accent">Module {m.module_number}</Badge><p className="text-xs font-bold text-primary mt-1">{m.title}</p><p className="text-[10px] text-gray-400">Weeks {m.weeks_start}–{m.weeks_end}</p></Card>)}
      </div>
      <Card>
        <Table head={['Week', 'Title', 'Module', 'Published', '']}>
          {weeks.map((w) => (
            <tr key={w.id}>
              <Td><b>W{String(w.week_number).padStart(2, '0')}</b></Td>
              <Td>{w.title}</Td>
              <Td className="text-xs text-gray-500">{w.modules?.title}</Td>
              <Td><Badge tone={w.is_published ? 'success' : 'gray'}>{w.is_published ? 'Yes' : 'No'}</Badge></Td>
              <Td><button onClick={() => openEdit(w)} className="text-xs font-bold text-primary hover:underline">Edit</button></Td>
            </tr>
          ))}
        </Table>
      </Card>
      <Modal open={!!edit} title={`Edit Week ${edit?.week_number}: ${edit?.title ?? ''}`} onClose={() => setEdit(null)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label-sdsa">Title *</label><input required className="input-sdsa" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          {(['topics', 'objectives', 'activities', 'applications'] as const).map((k) => (
            <div key={k}><label className="label-sdsa">{k[0].toUpperCase() + k.slice(1)} (one per line)</label><textarea rows={3} className="input-sdsa" value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
          ))}
          <label className="flex items-center gap-2 text-sm font-semibold text-primary"><input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published (visible on public site)</label>
          <Button type="submit" className="w-full">Save Week</Button>
        </form>
      </Modal>
    </div>
  );
}
