import { useEffect, useState } from 'react';
import { Card } from '../../components/ui';
import { API_BASE } from '../../config';

interface Announcement { date: string; title: string; details: string; }

export default function SAnnouncements() {
  const [ann, setAnn] = useState<Announcement[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/sdsaGetData`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'announcements' }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setAnn(d.announcements); else { setAnn([]); setErr('Could not load announcements.'); } })
      .catch(() => { setAnn([]); setErr('Could not load announcements. Check your internet.'); });
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-primary mb-4">📢 Announcements</h1>
      {ann === null ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : err ? (
        <p className="text-sm text-gray-500">{err}</p>
      ) : ann.length === 0 ? (
        <p className="text-sm text-gray-500">No announcements yet. New notices from the academy will appear here.</p>
      ) : (
        <div className="space-y-4">
          {ann.map((a, i) => (
            <Card key={i}>
              <p className="font-bold text-gray-800">{a.title} <span className="font-normal text-gray-400 text-xs">({a.date})</span></p>
              <p className="text-sm text-gray-600 mt-1">{a.details}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
