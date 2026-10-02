import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { SHEET_URL, WHATSAPP_URL } from '../../config';

const tabs = [
  { name: 'Admissions', desc: 'Every website admission form entry lands here automatically.' },
  { name: 'Enquiries', desc: 'Contact-page enquiries with name, mobile and message.' },
  { name: 'Students', desc: 'Add a row to create a student login instantly (Name, Mobile, Password, Batch, Status).' },
  { name: 'Admin', desc: 'Your own and staff usernames & passwords. Change them anytime.' },
  { name: 'Announcements', desc: 'Write a notice here and it appears on the student portal.' },
];

export default function ADashboard() {
  const { profile, signOut } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Admin — Manage Everything in the Data Excel</h1>
          <p className="text-sm text-gray-500">Welcome, {profile?.full_name}</p>
        </div>
        <button onClick={signOut} className="text-xs bg-white/10 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark">Logout</button>
      </div>

      <Card className="text-center py-8">
        <p className="text-sm text-gray-500 mb-1">All academy data lives in one Google Sheet on your Drive</p>
        <h2 className="text-xl font-extrabold text-primary mb-4">SDSA Academy Data</h2>
        <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-primary inline-block text-base px-6 py-3">
          📊 Open Data Excel
        </a>
        <p className="text-[11px] text-gray-400 mt-3">
          Tip: In Google Sheets, File → Download → Microsoft Excel (.xlsx) gets you a real Excel file anytime.
        </p>
      </Card>

      <Card className="bg-primary-50 border border-accent/30">
        <h3 className="font-extrabold text-primary mb-1">🔐 Logins — student &amp; trust</h3>
        <p className="text-sm text-gray-600 mb-3">Create, change passwords or remove <b>student</b> and <b>trust member</b> logins directly from the portal — Excel kholne ki zaroorat nahi.</p>
        <Link to="/admin/logins" className="btn-primary inline-block text-sm">Open Logins Manager →</Link>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {tabs.map((t) => (
          <Card key={t.name}>
            <h3 className="font-extrabold text-primary">{t.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold text-primary mb-2">Student login kaise banayein (How to)</h3>
        <ol className="text-sm text-gray-700 list-decimal ml-5 space-y-1">
          <li>Data Excel mein <b>Students</b> tab kholein</li>
          <li>Nayi row mein: naam, mobile number, password, batch, status likhein</li>
          <li>Student website par mobile + password se login kar sakta hai — turant, bina kisi setup ke</li>
        </ol>
        <p className="text-xs text-gray-400 mt-3">
          Any question? <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark underline">WhatsApp support</a>
        </p>
      </Card>
    </div>
  );
}
