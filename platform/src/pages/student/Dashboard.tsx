import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { API_BASE, WHATSAPP_URL } from '../../config';

interface Announcement { date: string; title: string; details: string; }

export default function SDashboard() {
  const { session } = useAuth();
  const [ann, setAnn] = useState<Announcement[] | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/sdsaGetData`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'announcements' }),
    })
      .then((r) => r.json())
      .then((d) => setAnn(d.ok ? d.announcements : []))
      .catch(() => setAnn([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Welcome, {session?.name || 'Student'} 👋</h1>
        <p className="text-sm text-gray-500">Sathamba Digital Saksham Academy — Student Portal</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><p className="text-xs font-bold uppercase text-gray-400">Batch</p><p className="font-extrabold text-primary">{session?.batch || 'To be assigned'}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Status</p><p className="font-extrabold text-primary">{session?.status || 'Active'}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Program</p><p className="font-extrabold text-primary text-sm">26-Week Digital Skills Program</p></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-extrabold text-primary mb-3">📢 Announcements</h2>
          {ann === null ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : ann.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements yet. New notices from the academy will appear here.</p>
          ) : (
            <ul className="space-y-3">
              {ann.slice(0, 3).map((a, i) => (
                <li key={i} className="border-l-4 border-accent pl-3">
                  <p className="font-bold text-gray-800 text-sm">{a.title} <span className="font-normal text-gray-400 text-xs">({a.date})</span></p>
                  <p className="text-xs text-gray-600">{a.details}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/student/announcements" className="text-xs text-accent-dark font-bold underline mt-3 inline-block">View all →</Link>
        </Card>

        <Card>
          <h2 className="font-extrabold text-primary mb-3">📚 Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/curriculum" className="text-accent-dark font-semibold underline">Full 26-Week Curriculum</Link></li>
            <li><Link to="/student/profile" className="text-accent-dark font-semibold underline">My Profile</Link></li>
            <li><Link to="/student/support" className="text-accent-dark font-semibold underline">Help & Support</Link></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark font-semibold underline">WhatsApp the Academy</a></li>
          </ul>
          <p className="text-[11px] text-gray-400 mt-3">Assignments, attendance, results and certificate sections will become active once your batch starts.</p>
        </Card>
      </div>
    </div>
  );
}
