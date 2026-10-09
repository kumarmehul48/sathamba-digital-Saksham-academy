import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { asset,  WHATSAPP_URL } from '../../config';

export default function Login() {
  const { signIn, signOut, session } = useAuth();
  const nav = useNavigate();
  function continueTo() {
    const r = session?.role;
    if (r === 'admin' || r === 'super_admin') nav('/admin/dashboard');
    else if (r === 'trust') nav('/trust/dashboard');
    else nav('/student/dashboard');
  }
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { error } = await signIn(id, pw, 'student');
    setBusy(false);
    if (error) { setErr(error); return; }
    // role ke hisaab se sahi dashboard pe bhejo
    try {
      const s = JSON.parse(localStorage.getItem('sdsa_session') || '{}');
      if (s.role === 'admin' || s.role === 'super_admin') nav('/admin/dashboard');
      else if (s.role === 'trust') nav('/trust/dashboard');
      else nav('/student/dashboard');
    } catch {
      nav('/');
    }
  }

  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-5">
          <img src={asset('sdsa-badge.webp')} alt="SDSA Academy" className="w-16 h-16 mx-auto rounded-full mb-3 object-cover" />
          <h1 className="text-lg font-extrabold text-primary">Student Login</h1>
          <p className="text-xs text-gray-500">Sathamba Digital Saksham Academy</p>
        </div>
        {session && (
          <div className="mb-4 p-3 rounded-lg bg-accent/15 border border-accent/40 text-center">
            <p className="text-xs font-bold text-primary mb-2">👤 Already logged in as {session.name} ({session.role})</p>
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={continueTo} className="text-xs bg-primary text-white font-bold px-3 py-1.5 rounded-lg">Continue to Dashboard →</button>
              <button type="button" onClick={async () => { await signOut(); }} className="text-xs bg-white border border-gray-300 text-gray-600 font-bold px-3 py-1.5 rounded-lg">Logout</button>
            </div>
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {err && <Alert tone="error">{err}</Alert>}
          <div>
            <label className="label-sdsa">Mobile / Email / Username</label>
            <input required disabled={busy} className="input-sdsa" placeholder="Mobile / Email / Username" value={id} onChange={(e) => setId(e.target.value)} />
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
        <p className="text-[10px] text-gray-400 text-center mt-2">Students: mobile, email, username ya phone + password se login karein.</p>
        <p className="text-xs text-center mt-3 border-t border-gray-100 pt-3">
          Trust member ho? <Link to="/trust/login" className="text-accent-dark font-bold hover:underline">Trust Member Login →</Link>
        </p>
        <p className="text-[11px] text-gray-400 text-center mt-4">
          Password milne ke liye academy se sampark karein:{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark underline">WhatsApp</a>
        </p>
      </div>
    </div>
  );
}
