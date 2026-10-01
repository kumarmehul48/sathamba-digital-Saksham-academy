import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Badge, Stat, Empty } from '../../components/ui';
import type { ResultRow } from '../../types/database';

export default function Results() {
  const { studentRecordId } = useAuth();
  const [items, setItems] = useState<ResultRow[] | null>(null);
  useEffect(() => {
    if (!studentRecordId) return;
    supabase.from('results').select('*, assessments(title, type, max_score)').eq('student_id', studentRecordId).eq('is_published', true)
      .then(({ data }) => setItems(data as ResultRow[]));
  }, [studentRecordId]);
  const avg = items && items.length ? items.reduce((s, r) => s + Number(r.percentage), 0) / items.length : 0;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Results</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Published Results" value={items?.length ?? 0} />
        <Stat label="Average Score" value={`${Math.round(avg)}%`} />
        <Stat label="Overall Status" value={avg >= 40 ? 'On Track' : 'Needs Work'} />
      </div>
      {items === null ? <p className="text-gray-400 text-sm">Loading…</p> : items.length === 0 ? <Empty text="Results will appear here when published by your trainer." /> :
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((r) => (
            <Card key={r.id}>
              <div className="flex justify-between"><b className="text-primary text-sm">{r.assessments?.title}</b><Badge tone={r.passed ? 'success' : 'danger'}>{r.passed ? 'Pass' : 'Fail'}</Badge></div>
              <p className="text-2xl font-extrabold text-primary mt-2">{r.score}/{r.assessments?.max_score} <span className="text-sm text-gray-400">({r.percentage}%)</span></p>
              {r.feedback && <p className="text-xs bg-primary-50 p-2 rounded mt-2">Trainer: {r.feedback}</p>}
            </Card>
          ))}
        </div>}
    </div>
  );
}
