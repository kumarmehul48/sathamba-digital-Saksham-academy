import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { asset, WHATSAPP_URL } from '../../config';

export default function TrustLogin() {
  const { signIn, signOut, session } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  function continueTo() {
    nav(session?.role === 'admin' ? '/admin/dashboard' : '/trust/dashboard');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { error } = await signIn(id, pw, 'trust');
    setBusy(false);
    if (error) { setErr(error); return; }
    try {
      const s = JSON.parse(localStorage.getItem('sdsa_session') || '{}');
      if (s.role === 'trust') nav('/trust/dashboard');
      else if (s.role === 'admin') nav('/admin/dashboard');
      else {
        setErr('Ye sirf trust members ke liye hai. Student login student page se karein.');
        await signOut();
      }
    } catch {
      nav('/');
    }
  }

  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-5">
          <img src={asset('sdsa-trust-logo.webp')} alt="SDSA Trust" className="w-16 h-16 mx-auto rounded-full mb-3 object-cover" />
          <h1 className="text-lg font-extrabold text-primary">Trust Member Login</h1>
          <p className="text-xs text-gray-500">Shivansh Digital Sagacity &amp; Alleviation</p>
          <p className="text-[10px] text-gray-400 mt-1">Nurturing Wisdom, Sustaining Lives</p>
        </div>
        {session && (session.role === 'trust' || session.role === 'admin') && (
          <div className="mb-4 p-3 rounded-lg bg-accent/15 border border-accent/40 text-center">
            <p className="text-xs font-bold text-primary mb-2">👤 Already logged in as {session.name} ({session.role})</p>
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={continueTo} className="text-xs bg-primary text-white font-bold px-3 py-1.5 rounded-lg">Continue to Trust Portal →</button>
              <button type="button" onClick={async () => { await signOut(); }} className="text-xs bg-white border border-gray-300 text-gray-600 font-bold px-3 py-1.5 rounded-lg">Logout</button>
            </div>
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {err && <Alert tone="error">{err}</Alert>}
          <div>
            <label className="label-sdsa">Username</label>
            <input required disabled={busy} className="input-sdsa" placeholder="Username / Email / Phone" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div>
            <label className="label-sdsa">Password</label>
            <input required type="password" disabled={busy} className="input-sdsa" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Signing in…' : 'Login'}</Button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-3">Username &amp; password trust trustee (admin) se milenge.</p>
        <p className="text-[11px] text-gray-400 text-center mt-3">
          Password milne ke liye sampark karein:{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark underline">WhatsApp</a>
        </p>
        <p className="text-xs text-center mt-4 border-t border-gray-100 pt-3">
          <Link to="/login" className="text-gray-500 hover:underline">← Student Login</Link>
        </p>
      </div>
    </div>
  );
}
