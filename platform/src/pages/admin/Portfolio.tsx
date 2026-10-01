import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Table, Td, Badge, Button } from '../../components/ui';
import type { Project, Portfolio as PF } from '../../types/database';

export default function PortfolioReview() {
  const [items, setItems] = useState<Project[]>([]);
  const load = () => supabase.from('projects').select('*, portfolios(students(profiles(full_name)))')
    .then(({ data }) => setItems((data ?? []) as Project[]));
  useEffect(() => { load(); }, []);
  async function act(p: Project, approval: 'approved' | 'rejected', feedback?: string) {
    await supabase.from('projects').update({ approval, trainer_feedback: feedback ?? p.trainer_feedback }).eq('id', p.id);
    load();
  }
  async function completePortfolio(pid: string) {
    await supabase.from('portfolios').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', pid);
    load();
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Portfolio Review</h1>
      <Card>
        <Table head={['Student', 'Project', 'Skills', 'Approval', 'Action']}>
          {items.map((p: any) => (
            <tr key={p.id}>
              <Td>{p.portfolios?.students?.profiles?.full_name ?? '—'}</Td>
              <Td><b>{p.name}</b><span className="block text-xs text-gray-400">{p.description?.slice(0, 60)}</span></Td>
              <Td className="text-xs">{(p.skills ?? []).join(', ')}</Td>
              <Td><Badge tone={p.approval === 'approved' ? 'success' : p.approval === 'rejected' ? 'danger' : 'gray'}>{p.approval}</Badge></Td>
              <Td className="space-x-2 text-xs">
                <button onClick={() => act(p, 'approved')} className="font-bold text-success hover:underline">Approve</button>
                <button onClick={() => { const f = prompt('Feedback for student:'); act(p, 'rejected', f ?? undefined); }} className="font-bold text-danger hover:underline">Reject</button>
                <button onClick={() => completePortfolio(p.portfolio_id)} className="text-gray-500 hover:underline">Complete</button>
              </Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No portfolio projects submitted yet.</p>}
      </Card>
    </div>
  );
}
