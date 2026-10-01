import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { isBackendConfigured } from '../../lib/supabaseClient';
import { Button, Alert } from '../../components/ui';

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isBackendConfigured) {
      setErr('Backend setup pending: Supabase credentials are not configured. Login is disabled.');
      return;
    }
    setErr(''); setBusy(true);
    const { error } = await signIn(email, pw); setBusy(false);
    if (error) setErr(error);
    else nav('/'); // rbac routes by role
  }

  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto grid place-items-center rounded-full bg-accent-dark text-primary-dark font-black mb-3">SDSA</div>
          <h1 className="text-lg font-extrabold text-primary">Student & Staff Login</h1>
          <p className="text-xs text-gray-500">Sathamba Digital Saksham Academy</p>
        </div>
        {!isBackendConfigured && (
          <div className="mb-4">
            <Alert tone="warning">
              Backend setup pending: Supabase authentication is not configured. Login is currently disabled.
            </Alert>
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {err && <Alert tone="error">{err}</Alert>}
          <div>
            <label className="label-sdsa">Email</label>
            <input required type="email" disabled={!isBackendConfigured || busy} className="input-sdsa" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label-sdsa">Password</label>
            <input required type="password" disabled={!isBackendConfigured || busy} className="input-sdsa" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy || !isBackendConfigured} className="w-full">{busy ? 'Signing in…' : 'Login'}</Button>
        </form>
        <div className="flex justify-between text-xs mt-4">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          <Link to="/apply" className="text-primary font-semibold hover:underline">Apply for admission →</Link>
        </div>
      </div>
    </div>
  );
}
