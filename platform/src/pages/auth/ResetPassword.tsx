import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase, { isBackendConfigured } from '../../lib/supabaseClient';
import { Button, Alert } from '../../components/ui';

export default function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!isBackendConfigured) {
      setErr('Backend setup pending: Supabase credentials are not configured. Password update is disabled.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    nav('/');
  }

  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-lg font-extrabold text-primary mb-4">Set New Password</h1>
        {!isBackendConfigured && (
          <div className="mb-4">
            <Alert tone="warning">
              Backend setup pending: Supabase authentication is not configured. Password update is currently disabled.
            </Alert>
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {err && <Alert tone="error">{err}</Alert>}
          <div>
            <label className="label-sdsa">New password (min 8 characters)</label>
            <input required type="password" minLength={8} disabled={!isBackendConfigured || busy} className="input-sdsa" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <Button type="submit" disabled={!isBackendConfigured || busy} className="w-full">
            {busy ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
