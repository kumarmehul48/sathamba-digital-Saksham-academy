import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Badge, Progress } from '../../components/ui';
import { MODULES, WEEKS } from '../../data/curriculum';

export default function MyCourse() {
  const { studentRecordId } = useAuth();
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    if (!studentRecordId) return;
    supabase.from('students').select('current_week').eq('id', studentRecordId).single()
      .then(({ data }) => setCurrent(data?.current_week ?? 1));
  }, [studentRecordId]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-primary">My 26-Week Course</h1>
      <Card><Progress value={(current / 26) * 100} /></Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WEEKS.map((w) => {
          const state = w.week < current ? 'Completed' : w.week === current ? 'Current' : 'Locked';
          return (
            <Card key={w.week} className={state === 'Current' ? 'ring-2 ring-accent-dark' : state === 'Locked' ? 'opacity-60' : ''}>
              <div className="flex justify-between items-center">
                <Badge tone={state === 'Completed' ? 'success' : state === 'Current' ? 'accent' : 'gray'}>{state}</Badge>
                <span className="text-xs font-bold text-gray-400">W{String(w.week).padStart(2, '0')}</span>
              </div>
              <h3 className="font-bold text-primary mt-2 text-sm">{w.title}</h3>
              <p className="text-[11px] text-gray-400 mt-1">Module {w.module}: {MODULES.find((m) => m.module === w.module)?.title}</p>
              {state !== 'Locked' && <Link to={`/curriculum/week/${w.week}`} className="text-xs font-bold text-primary hover:underline mt-2 inline-block">Open week →</Link>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
