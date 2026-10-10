import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { asset, WHATSAPP_URL, API_BASE } from '../../config';

// TRUST LOGIN — sirf trust members + Trust Admin (sab authority) ke liye.
// Student login ke liye /login alag page hai.
export default function TrustLogin() {
  const { signIn, signOut } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  // registration request
  const [showReg, setShowReg] = useState(false);
  const [rName, setRName] = useState('');
  const [rMobile, setRMobile] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rReason, setRReason] = useState('');
  const [rMsg, setRMsg] = useState('');
  const [rErr, setRErr] = useState('');
  const [rBusy, setRBusy] = useState(false);

  async function sendRegistration(e: React.FormEvent) {
    e.preventDefault();
    setRErr(''); setRMsg(''); setRBusy(true);
    try {
      const r = await fetch(`${API_BASE}/sdsaTrustRequest`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name: rName, mobile: rMobile, email: rEmail, reason: rReason }),
      });
      const d = await r.json();
      if (!d.ok) setRErr(d.error || 'Request nahi gayi.');
      else { setRMsg(d.message); setRName(''); setRMobile(''); setREmail(''); setRReason(''); }
    } catch { setRErr('Network problem. Dobara try karo.'); }
    setRBusy(false);
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
        <form onSubmit={submit} className="space-y-3">
          {err && <Alert tone="error">{err}</Alert>}
          <div>
            <label className="label-sdsa">Username / Email / Phone</label>
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

        {/* Registration request — naya member banna hai? */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button type="button" onClick={() => { setShowReg(!showReg); setRErr(''); setRMsg(''); }}
            className="text-xs font-bold text-accent-dark underline">
            {showReg ? '← Login par wapas' : '🆕 Trust Member Banne ki Request'}
          </button>
        </div>
        {showReg && (
          <form onSubmit={sendRegistration} className="mt-4 space-y-2.5 text-left">
            {rErr && <Alert tone="error">{rErr}</Alert>}
            {rMsg && <Alert tone="success">{rMsg}</Alert>}
            <div>
              <label className="label-sdsa">Pura Naam</label>
              <input required className="input-sdsa" placeholder="Apna naam" value={rName} onChange={(e) => setRName(e.target.value)} />
            </div>
            <div>
              <label className="label-sdsa">Mobile</label>
              <input required className="input-sdsa" placeholder="10-digit mobile" value={rMobile} onChange={(e) => setRMobile(e.target.value)} />
            </div>
            <div>
              <label className="label-sdsa">Email</label>
              <input required type="email" className="input-sdsa" placeholder="Email address" value={rEmail} onChange={(e) => setREmail(e.target.value)} />
            </div>
            <div>
              <label className="label-sdsa">Trust join karne ka reason</label>
              <textarea required className="input-sdsa !py-2 h-20" placeholder="Kyun trust ka member banana chahte ho?" value={rReason} onChange={(e) => setRReason(e.target.value)} />
            </div>
            <Button type="submit" disabled={rBusy} className="w-full">{rBusy ? 'Bhej rahe hain…' : 'Request Bhejo'}</Button>
            <p className="text-[10px] text-gray-400 text-center">Admin approve karenge — uske baad username/password milega.</p>
          </form>
        )}
      </div>
    </div>
  );
}
