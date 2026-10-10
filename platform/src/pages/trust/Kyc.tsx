import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { API_BASE } from '../../config';

// KYC — trust member apna ID proof submit karega, admin verify karega.
const ID_TYPES = ['Aadhaar Card', 'PAN Card', 'Driving License', 'Voter ID'];

interface KycStatus { status: string; date: string; idType: string; note: string }

export default function TrustKyc() {
  const { session } = useAuth();
  const [kyc, setKyc] = useState<KycStatus | null>(null);
  const [idType, setIdType] = useState(ID_TYPES[0]);
  const [idNumber, setIdNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const username = session?.username || '';
  const password = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sdsa_trust_pw') || '' : '';

  useEffect(() => {
    (async () => {
      if (!username || !password) { setLoading(false); return; }
      try {
        const r = await fetch(`${API_BASE}/sdsaTrustPortal`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'read', username, password }),
        });
        const d = await r.json();
        if (d.ok) setKyc(d.kyc || null);
        else setErr(d.error || 'Load failed.');
      } catch { setErr('Network problem. Dobara try karo.'); }
      setLoading(false);
    })();
  }, []);

  function pickFile(f: File | null) {
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type)) {
      setErr('Sirf JPG, PNG, WEBP ya GIF image chalegi.'); return;
    }
    if (f.size > 4_000_000) { setErr('Image 4MB se chhoti karo.'); return; }
    setErr(''); setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ''));
    reader.readAsDataURL(f);
  }

  async function submit() {
    setErr(''); setMsg(''); setBusy(true);
    try {
      if (!file) { setErr('ID ki photo choose karo.'); setBusy(false); return; }
      const imageBase64 = preview.split(',')[1] || '';
      const r = await fetch(`${API_BASE}/sdsaTrustPortal`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'kyc', username, password, idType, idNumber, imageBase64, imageMime: file.type }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'KYC submit nahi hua.');
      else { setMsg(d.message); setKyc({ status: 'Pending', date: '', idType, note: '' }); setFile(null); setPreview(''); setIdNumber(''); }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setBusy(false);
  }

  if (!username || !password) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow">
        <h2 className="font-extrabold text-primary mb-2">Trust Member Login Required</h2>
        <p className="text-sm text-gray-600 mb-4">KYC ke liye trust member login karein.</p>
        <Link to="/trust/login" className="text-primary font-bold underline">Trust Member Login →</Link>
      </div>
    );
  }

  const status = kyc?.status || 'Not Submitted';
  const statusColor = status === 'Verified' ? 'bg-green-100 text-green-700' : status === 'Rejected' ? 'bg-red-100 text-red-700' : status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-extrabold text-primary">KYC Verification 🆔</h2>
      {err && <Alert tone="error">{err}</Alert>}
      {msg && <Alert tone="success">{msg}</Alert>}

      {/* Status */}
      <div className="bg-white rounded-xl p-5 shadow flex items-center justify-between">
        <div>
          <p className="font-bold text-primary text-sm">Aapka KYC Status</p>
          {kyc && kyc.date && <p className="text-xs text-gray-400">{kyc.date} · {kyc.idType}</p>}
          {kyc?.note && <p className="text-xs text-gray-500 mt-1">📝 {kyc.note}</p>}
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>
          {status === 'Verified' ? '✅ Verified' : status === 'Rejected' ? '❌ Rejected' : status === 'Pending' ? '⏳ Pending' : 'Not Submitted'}
        </span>
      </div>

      {status !== 'Verified' && (
        <div className="bg-white rounded-xl p-5 shadow space-y-3">
          <h3 className="font-bold text-primary">ID Proof Submit karo</h3>
          <p className="text-xs text-gray-500">Admin verify karega. Verified hone ke baad hi full member benefits milenge.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label-sdsa">ID Type</label>
              <select className="input-sdsa" value={idType} onChange={(e) => setIdType(e.target.value)}>
                {ID_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-sdsa">ID Number</label>
              <input required className="input-sdsa" placeholder="ID number likho" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label-sdsa">ID ki photo (clear photo)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="input-sdsa !py-1.5" onChange={(e) => pickFile(e.target.files?.[0] || null)} />
          </div>
          {preview && <img src={preview} alt="ID preview" className="w-40 rounded-lg border" />}
          <Button type="button" disabled={busy || !idNumber || !file} onClick={submit}>
            {busy ? 'Submitting…' : '🆔 Submit KYC'}
          </Button>
        </div>
      )}
    </div>
  );
}
