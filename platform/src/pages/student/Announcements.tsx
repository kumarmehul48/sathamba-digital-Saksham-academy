import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Badge, Empty } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Announcement } from '../../types/database';

export default function Announcements() {
  const [items, setItems] = useState<Announcement[] | null>(null);
  useEffect(() => {
    supabase.from('announcements').select('*').eq('is_published', true).order('published_at', { ascending: false })
      .then(({ data }) => setItems(data as Announcement[]));
  }, []);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Announcements</h1>
      {items === null ? <p className="text-gray-400 text-sm">Loading…</p> : items.length === 0 ?
        <Empty text="No announcements yet." /> :
        <div className="space-y-4">
          {items.map((a) => (
            <Card key={a.id}><div className="flex justify-between items-center"><h3 className="font-bold text-primary">{a.title}</h3><span className="text-xs text-gray-400">{fmtDate(a.published_at)}</span></div>
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{a.body}</p></Card>
          ))}
        </div>}
    </div>
  );
}
