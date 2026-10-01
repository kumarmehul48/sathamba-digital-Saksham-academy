import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Badge, Empty, Modal } from '../../components/ui';
import type { Workbook } from '../../types/database';

export default function Workbooks() {
  const [items, setItems] = useState<Workbook[] | null>(null);
  const [open, setOpen] = useState<Workbook | null>(null);
  useEffect(() => {
    supabase.from('workbooks').select('*, weeks(week_number, title)').eq('is_published', true)
      .order('created_at').then(({ data }) => setItems(data as Workbook[]));
  }, []);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Workbooks</h1>
      {items === null ? <p className="text-gray-400 text-sm">Loading…</p> :
        items.length === 0 ? <Empty text="Workbooks will appear here as your trainer publishes them week by week." /> :
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((wb) => (
            <Card key={wb.id}>
              <Badge tone="primary">Week {String(wb.weeks?.week_number ?? 0).padStart(2, '0')}</Badge>
              <h3 className="font-bold text-primary mt-2">{wb.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{wb.explanation}</p>
              <button onClick={() => setOpen(wb)} className="text-xs font-bold text-primary hover:underline mt-2">Open workbook →</button>
            </Card>
          ))}
        </div>}
      <Modal open={!!open} title={open?.title ?? ''} onClose={() => setOpen(null)}>
        {open && (
          <div className="space-y-4 text-sm text-gray-700">
            {open.explanation && <p>{open.explanation}</p>}
            <Section title="Topics" xs={open.topics} />
            <Section title="Examples" xs={open.examples} />
            <Section title="Practice" xs={open.practice} />
            <Section title="Self-Check" xs={open.self_check} />
          </div>
        )}
      </Modal>
    </div>
  );
}
function Section({ title, xs }: { title: string; xs: string[] }) {
  if (!xs?.length) return null;
  return (<div><h4 className="font-extrabold text-primary text-xs uppercase mb-1.5">{title}</h4><ul className="list-disc pl-5 space-y-1">{xs.map((x, i) => <li key={i}>{x}</li>)}</ul></div>);
}
