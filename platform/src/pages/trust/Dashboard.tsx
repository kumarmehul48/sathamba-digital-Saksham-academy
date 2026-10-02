import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { API_BASE, SHEET_URL } from '../../config';

interface TrustData {
  ok: boolean;
  stats: { admissions: number; enquiries: number; students: number; announcements: number };
  recentAdmissions: { name: string; mobile: string; course: string; batch: string }[];
  recentEnquiries: { name: string; mobile: string; email: string; message: string }[];
  recentAnnouncements: { title: string; body: string; date: string }[];
}

export default function TrustDashboard() {
  const { session } = useAuth();
  const [d, setD] = useState<TrustData | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/sdsaTrustData`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'})
      .then((r) => r.json())
      .then((j) => (j.ok ? setD(j) : setErr('Could not load data.')))
      .catch(() => setErr('Could not load data.'));
  }, []);

  const Stat = ({ n, label, icon }: { n: number | string; label: string; icon: string }) => (
    <Card className="text-center">
      <p className="text-3xl mb-1">{icon}</p>
      <p className="text-3xl font-extrabold text-primary">{d ? n : '…'}</p>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Trust header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-xl p-6 flex items-center gap-4 flex-wrap">
        <img src="sdsa-trust-logo.webp" alt="Trust logo" className="w-16 h-16 rounded-full object-cover border-2 border-accent bg-white/10" />
        <div className="flex-1 min-w-[240px]">
          <Badge tone="accent">Shivansh Digital Sagacity &amp; Alleviation</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold mt-2">Trust Dashboard</h1>
          <p className="text-xs text-white/80">Nurturing Wisdom, Sustaining Lives — Academy Overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{session?.name}</p>
          <p className="text-xs text-white/80">{session?.designation || 'Trust Member'}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon="📝" n={d?.stats.admissions ?? 0} label="Admissions" />
        <Stat icon="❓" n={d?.stats.enquiries ?? 0} label="Enquiries" />
        <Stat icon="🎓" n={d?.stats.students ?? 0} label="Students" />
        <Stat icon="📢" n={d?.stats.announcements ?? 0} label="Announcements" />
      </div>

      {err && <Card className="text-sm text-danger font-semibold">{err}</Card>}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent admissions */}
        <Card>
          <h2 className="font-extrabold text-primary mb-3">📝 Recent Admissions</h2>
          {!d || d.recentAdmissions.length === 0 ? (
            <p className="text-sm text-gray-500">No admissions yet. Website admission forms will appear here automatically.</p>
          ) : (
            <ul className="space-y-2">
              {d.recentAdmissions.map((a, i) => (
                <li key={i} className="border-l-4 border-accent pl-3">
                  <p className="font-bold text-sm text-gray-800">{a.name} <span className="font-normal text-gray-400 text-xs">· {a.mobile}</span></p>
                  <p className="text-xs text-gray-600">{a.course || 'Course pending'} {a.batch ? `· ${a.batch}` : ''}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent enquiries */}
        <Card>
          <h2 className="font-extrabold text-primary mb-3">❓ Recent Enquiries</h2>
          {!d || d.recentEnquiries.length === 0 ? (
            <p className="text-sm text-gray-500">No enquiries yet. Contact-page enquiries will appear here automatically.</p>
          ) : (
            <ul className="space-y-2">
              {d.recentEnquiries.map((a, i) => (
                <li key={i} className="border-l-4 border-accent pl-3">
                  <p className="font-bold text-sm text-gray-800">{a.name} <span className="font-normal text-gray-400 text-xs">· {a.mobile}</span></p>
                  <p className="text-xs text-gray-600">{a.message || a.email || ''}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <h2 className="font-extrabold text-primary mb-3">📢 Latest Announcements</h2>
        {!d || d.recentAnnouncements.length === 0 ? (
          <p className="text-sm text-gray-500">No announcements yet.</p>
        ) : (
          <ul className="space-y-2">
            {d.recentAnnouncements.map((a, i) => (
              <li key={i} className="border-l-4 border-accent pl-3">
                <p className="font-bold text-sm text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-600">{a.body}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Note + full data */}
      <Card className="bg-primary-50">
        <p className="text-sm text-gray-700">
          This is a read-only overview for trust members. For adding students, creating logins, managing admissions and editing announcements,
          the managing trustee/admin opens the Data Excel directly.
        </p>
        <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-primary inline-block mt-3 text-sm">📊 Open Data Excel</a>
        <p className="text-[11px] text-gray-400 mt-2">Trust logins are managed in the <b>Trust</b> tab of the Data Excel (Username, Password, Name, Designation).</p>
      </Card>

      <div className="text-center">
        <Link to="/" className="text-xs text-accent-dark font-semibold underline">← Back to SDSA Website</Link>
      </div>
    </div>
  );
}
