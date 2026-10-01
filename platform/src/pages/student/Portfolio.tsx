import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Badge, Button, Empty, Alert } from '../../components/ui';
import type { Portfolio, Project } from '../../types/database';

export default function Portfolio() {
  const { studentRecordId } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  useEffect(() => { load(); }, [studentRecordId]);
  async function load() {
    if (!studentRecordId) return;
    let { data: p } = await supabase.from('portfolios').select('*').eq('student_id', studentRecordId).maybeSingle();
    if (!p) {
      await supabase.from('portfolios').insert([{ student_id: studentRecordId }]);
      ({ data: p } = await supabase.from('portfolios').select('*').eq('student_id', studentRecordId).maybeSingle());
    }
    setPortfolio(p as Portfolio);
    const { data: pr } = await supabase.from('projects').select('*').eq('portfolio_id', p!.id);
    setProjects((pr ?? []) as Project[]);
  }
  async function addProject(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.from('projects').insert([{
      portfolio_id: portfolio!.id,
      name: form.name, description: form.description,
      skills: form.skills ? form.skills.split(',').map((s) => s.trim()) : [],
      links: form.links ? form.links.split(',').map((s) => s.trim()) : [],
      approval: 'pending',
    }]);
    setMsg(error ? 'Could not add.' : 'Project added - pending trainer approval.');
    if (!error) { setForm({}); load(); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Portfolio</h1>
      <Alert tone="info">Your portfolio is your proof of learning: projects, documents, spreadsheets, presentations and AI-assisted work - reviewed and approved by your trainer, used for your certificate.</Alert>
      <Card>
        <h3 className="font-bold text-primary mb-2">Status: <Badge tone={portfolio?.status === 'completed' ? 'success' : 'accent'}>{portfolio?.status ?? 'in_progress'}</Badge></h3>
        <form onSubmit={addProject} className="grid sm:grid-cols-2 gap-3 mt-3">
          <div><label className="label-sdsa">Project Name *</label><input required className="input-sdsa" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label-sdsa">Skills Used (comma separated)</label><input className="input-sdsa" placeholder="Excel, PowerPoint, AI" value={form.skills ?? ''} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label-sdsa">Description</label><textarea rows={2} className="input-sdsa" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label-sdsa">Links (comma separated)</label><input className="input-sdsa" value={form.links ?? ''} onChange={(e) => setForm({ ...form, links: e.target.value })} /></div>
          <div className="sm:col-span-2"><Button type="submit">Add Project</Button></div>
        </form>
        {msg && <p className="text-xs mt-2 text-gray-600">{msg}</p>}
      </Card>
      {projects.length === 0 ? <Empty text="No projects yet. Add your Week 21-23 project work here." /> :
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Card key={p.id}>
              <div className="flex justify-between"><b className="text-primary">{p.name}</b><Badge tone={p.approval === 'approved' ? 'success' : p.approval === 'rejected' ? 'danger' : 'gray'}>{p.approval}</Badge></div>
              <p className="text-sm text-gray-600 mt-1">{p.description}</p>
              {p.skills?.length > 0 && <div className="flex gap-1 flex-wrap mt-2">{p.skills.map((s) => <Badge key={s} tone="primary">{s}</Badge>)}</div>}
              {p.trainer_feedback && <p className="text-xs bg-primary-50 p-2 rounded mt-2">Trainer: {p.trainer_feedback}</p>}
            </Card>
          ))}
        </div>}
    </div>
  );
}
