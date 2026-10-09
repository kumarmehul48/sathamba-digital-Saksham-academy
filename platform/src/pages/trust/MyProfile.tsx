import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { API_BASE } from '../../config';

export default function MyProfile() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  const [other, setOther] = useState('');

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
        if (d.ok && d.profile) {
          const p = d.profile;
          setName(p.name || ''); setDesignation(p.designation || ''); setBio(p.bio || '');
          setPhoto(p.photo || ''); setInstagram(p.instagram || ''); setFacebook(p.facebook || '');
          setLinkedin(p.linkedin || ''); setYoutube(p.youtube || ''); setOther(p.other || '');
        } else if (!d.ok) setErr(d.error || 'Profile load nahi hua.');
      } catch { setErr('Network problem. Dobara try karo.'); }
      setLoading(false);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setMsg(''); setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/sdsaTrustPortal`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'profile', username, password,
          bio, photo, instagram, facebook, linkedin, youtube, other,
        }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Save nahi hua.');
      else setMsg(d.message || 'Profile saved!');
    } catch { setErr('Network problem. Dobara try karo.'); }
    setBusy(false);
  }

  if (!username || !password) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow">
        <h2 className="font-extrabold text-primary mb-2">Trust Member Login Required</h2>
        <p className="text-sm text-gray-600 mb-4">Profile update karne ke liye trust member login karein.</p>
        <Link to="/trust/login" className="text-primary font-bold underline">Trust Member Login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-extrabold text-primary">My Profile 👤</h2>

      <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow space-y-4">
        {err && <Alert tone="error">{err}</Alert>}
        {msg && <Alert tone="success">{msg}</Alert>}
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {!loading && (
          <>
            <div className="flex items-center gap-4">
              {photo ? (
                <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-extrabold text-2xl grid place-items-center border-2 border-primary/30">{(name || 'S')[0]}</div>
              )}
              <div>
                <p className="font-bold text-primary">{name}</p>
                <p className="text-xs text-gray-500">{designation} · @{username}</p>
              </div>
            </div>

            <div>
              <label className="label-sdsa">Bio</label>
              <textarea rows={3} disabled={busy} className="input-sdsa" placeholder="Apne bare me 2-3 line me likho" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div>
              <label className="label-sdsa">Photo Link</label>
              <input disabled={busy} className="input-sdsa" placeholder="https://... (profile photo ka link)" value={photo} onChange={(e) => setPhoto(e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label-sdsa">Instagram</label>
                <input disabled={busy} className="input-sdsa" placeholder="https://instagram.com/username" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <div>
                <label className="label-sdsa">Facebook</label>
                <input disabled={busy} className="input-sdsa" placeholder="https://facebook.com/username" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>
              <div>
                <label className="label-sdsa">LinkedIn</label>
                <input disabled={busy} className="input-sdsa" placeholder="https://linkedin.com/in/username" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
              <div>
                <label className="label-sdsa">YouTube</label>
                <input disabled={busy} className="input-sdsa" placeholder="https://youtube.com/@channel" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-sdsa">Other Link</label>
                <input disabled={busy} className="input-sdsa" placeholder="Koi aur social/site link" value={other} onChange={(e) => setOther(e.target.value)} />
              </div>
            </div>

            <Button type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? 'Saving…' : '💾 Save Profile'}</Button>
          </>
        )}
      </form>
    </div>
  );
}
