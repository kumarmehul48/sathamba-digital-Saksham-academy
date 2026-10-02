import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { asset,  WHATSAPP_URL } from '../../config';

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { error } = await signIn(id, pw);
    setBusy(false);
    if (error) setErr(error);
    else nav('/');
  }

  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={asset("sdsa-badge.webp")} alt="SDSA Academy" className="w-14 h-14 rounded-full object-cover border-2 border-primary/15" />
            <span className="text-gray-300 font-bold">+</span>
            <img src={asset("sdsa-trust-logo.webp")} alt="SDSA Trust" className="w-14 h-14 rounded-full object-cover border-2 border-accent/50" />
          </div>
          <h1 className="text-lg font-extrabold text-primary">Student • Trust • Staff Login</h1>
          <p className="text-xs text-gray-500">SDSA Academy · Shivansh Digital Sagacity &amp; Alleviation</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {err && <Alert tone="error">{err}</Alert>}
          <div>
            <label className="label-sdsa">Mobile Number / Username</label>
            <input required disabled={busy} className="input-sdsa" placeholder="Student: mobile no | Trust/Staff: username" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div>
            <label className="label-sdsa">Password</label>
            <input required type="password" disabled={busy} className="input-sdsa" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Signing in…' : 'Login'}</Button>
        </form>
        <div className="flex justify-between text-xs mt-4">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          <Link to="/apply" className="text-primary font-semibold hover:underline">Apply for admission →</Link>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">Trust members: username & password milenge trust trustee se. Students: mobile + password.</p>
        <p className="text-[11px] text-gray-400 text-center mt-4">
          Password milne ke liye academy se sampark karein:{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark underline">WhatsApp</a>
        </p>
      </div>
    </div>
  );
}
