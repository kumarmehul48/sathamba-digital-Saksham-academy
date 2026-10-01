import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Badge, Empty } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Certificate } from '../../types/database';

export default function Certificates() {
  const { studentRecordId } = useAuth();
  const [items, setItems] = useState<Certificate[] | null>(null);
  useEffect(() => {
    if (!studentRecordId) return;
    supabase.from('certificates').select('*, courses(title)').eq('student_id', studentRecordId)
      .then(({ data }) => setItems(data as Certificate[]));
  }, [studentRecordId]);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Certificates</h1>
      {items === null ? <p className="text-gray-400 text-sm">Loading…</p> : items.length === 0 ?
        <Empty text="Your certificate will appear here after course completion (Week 26) - keep going!" /> :
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((c) => (
            <Card key={c.id} className="border-2 border-accent-dark text-center">
              <Badge tone={c.status === 'issued' ? 'success' : 'gray'}>{c.status}</Badge>
              <h3 className="font-extrabold text-primary mt-2">{c.courses?.title}</h3>
              <p className="text-xs text-gray-500 mt-1">Certificate No: <b>{c.certificate_number}</b></p>
              <p className="text-xs text-gray-500">Issued: {fmtDate(c.issue_date)}</p>
              {c.status === 'issued' && <a href={`/verify-certificate/${c.certificate_number}`} className="btn-accent !text-xs !px-3 !py-1.5 mt-3 inline-block">View / Verify →</a>}
            </Card>
          ))}
        </div>}
    </div>
  );
}
