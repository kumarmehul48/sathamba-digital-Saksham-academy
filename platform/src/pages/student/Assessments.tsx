import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Badge, Empty, Table, Td } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Assessment, ResultRow } from '../../types/database';

export default function Assessments() {
  const { studentRecordId } = useAuth();
  const [items, setItems] = useState<(Assessment & { result?: ResultRow | null })[]>([]);
  useEffect(() => {
    supabase.from('assessments').select('*, weeks(week_number, title)').order('held_on')
      .then(async ({ data }) => {
        if (!studentRecordId || !data) return;
        const { data: results } = await supabase.from('results').select('*').eq('student_id', studentRecordId).eq('is_published', true);
        const map = new Map((results ?? []).map((r: any) => [r.assessment_id, r]));
        setItems((data as Assessment[]).map((a) => ({ ...a, result: map.get(a.id) ?? null })));
      });
  }, [studentRecordId]);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Assessments</h1>
      {items.length === 0 ? <Empty text="Assessment schedule will appear here." /> :
        <Card><Table head={['Assessment', 'Type', 'Date', 'Result']}>
          {items.map((a) => (
            <tr key={a.id}>
              <Td><b className="text-primary">{a.title}</b>{a.weeks && <span className="text-xs text-gray-400 block">Week {a.weeks.week_number}: {a.weeks.title}</span>}</Td>
              <Td><Badge tone="accent">{a.type.replace('_', '-')}</Badge></Td>
              <Td>{fmtDate(a.held_on)}</Td>
              <Td>{a.result ? <Badge tone={a.result.passed ? 'success' : 'danger'}>{a.result.score}/{a.max_score} ({a.result.percentage}%)</Badge> : <span className="text-gray-400 text-xs">Scheduled</span>}</Td>
            </tr>
          ))}
        </Table></Card>}
    </div>
  );
}
