import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { isBackendConfigured } from '../../lib/supabaseClient';
import { Button, Alert } from '../../components/ui';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(''); const [done, setDone] = useState(false);
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isBackendConfigured) {
      setErr('Backend setup pending: Supabase credentials are not configured. Password reset is disabled.');
      return;
    }
    setErr(''); setBusy(true);
    const { error } = await resetPassword(email);
    setBusy(false);
    if (error) {
      setErr(error);
    } else {
      setDone(true);
    }
  }

  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-lg font-extrabold text-primary mb-4">Reset Password</h1>
        {!isBackendConfigured && (
          <div className="mb-4">
            <Alert tone="warning">
              Backend setup pending: Supabase authentication is not configured. Password reset is currently disabled.
            </Alert>
          </div>
        )}
        {err && <div className="mb-3"><Alert tone="error">{err}</Alert></div>}
        {done ? <Alert tone="success">If this email is registered, a password reset link has been sent. Check your inbox.</Alert> : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="label-sdsa">Your account email</label>
              <input required type="email" disabled={!isBackendConfigured || busy} className="input-sdsa" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" disabled={!isBackendConfigured || busy} className="w-full">
              {busy ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
        <Link to="/login" className="block text-center text-xs text-primary mt-4 hover:underline">← Back to login</Link>
      </div>
    </div>
  );
}
