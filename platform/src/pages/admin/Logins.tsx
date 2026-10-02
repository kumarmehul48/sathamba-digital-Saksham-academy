import { useState } from 'react';
import { Card, Button, Alert } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { API_BASE } from '../../config';

interface SRec { name: string; mobile: string; batch: string; status: string }
interface TRec { username: string; name: string; designation: string }

export default function Logins() {
  const { session } = useAuth();
  const [adminPass, setAdminPass] = useState('');
  const [students, setStudents] = useState<SRec[] | null>(null);
  const [trust, setTrust] = useState<TRec[] | null>(null);
  const [msg, setMsg] = useState<{ t: 'ok' | 'err'; m: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // student form
  const [sName, setSName] = useState(''); const [sMob, setSMob] = useState('');
  const [sPw, setSPw] = useState(''); const [sBatch, setSBatch] = useState('');
  // trust form
  const [tUser, setTUser] = useState(''); const [tPw, setTPw] = useState('');
  const [tName, setTName] = useState(''); const [tDesig, setTDesig] = useState('');

  async function call(action: string, payload: Record<string, unknown> = {}) {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`${API_BASE}/sdsaManageLogin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUser: session?.name || '', adminPass, action, payload }),
      });
      const d = await r.json();
      setBusy(false);
      if (!d.ok) { setMsg({ t: 'err', m: d.error || 'Failed.' }); return null; }
      return d;
    } catch {
      setBusy(false); setMsg({ t: 'err', m: 'Network error.' }); return null;
    }
  }

  async function load() {
    const d = await call('list');
    if (d) {
      setStudents(d.students || []); setTrust(d.trust || []);
      setMsg({ t: 'ok', m: 'Logins loaded.' });
    }
  }

  async function act(action: string, payload: Record<string, unknown>, okMsg: string, reset?: () => void) {
    const d = await call(action, payload);
    if (d) { setMsg({ t: 'ok', m: okMsg }); if (reset) reset(); await load(); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Student &amp; Trust Logins</h1>
        <p className="text-sm text-gray-500">Create, change or remove student and trust-member logins — no need to open the Excel.</p>
      </div>

      {msg && <Alert tone={msg.t === 'ok' ? 'success' : 'error'}>{msg.m}</Alert>}

      {/* Admin password gate */}
      <Card>
        <h2 className="font-extrabold text-primary mb-2">🔐 Confirm Admin Password</h2>
        <p className="text-xs text-gray-500 mb-3">Signed in as <b>{session?.name}</b>. Enter your admin password to manage logins (same one you use to log in).</p>
        <div className="flex gap-2 flex-wrap">
          <input type="password" className="input-sdsa flex-1 min-w-[200px]" placeholder="Admin password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
          <Button disabled={busy || !adminPass} onClick={load}>{busy ? 'Working…' : 'Load / Verify'}</Button>
        </div>
      </Card>

      {students !== null && trust !== null && (
        <>
          {/* STUDENTS */}
          <Card>
            <h2 className="font-extrabold text-primary mb-3">🎓 Student Logins ({students.length})</h2>
            {students.length === 0 ? <p className="text-sm text-gray-500 mb-3">No student logins yet.</p> : (
              <div className="space-y-2 mb-4">
                {students.map((s) => (
                  <div key={s.mobile} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-wrap">
                    <div className="min-w-[180px]">
                      <p className="text-sm font-bold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.mobile} · {s.batch || 'No batch'} · {s.status || 'Active'}</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangePw onSet={(pw) => act('update_student', { mobile: s.mobile, password: pw }, `Password updated for ${s.name}`)} />
                      <button disabled={busy} onClick={() => { if (confirm(`Remove login for ${s.name}?`)) act('delete_student', { mobile: s.mobile }, `Login removed for ${s.name}`); }}
                        className="text-xs bg-danger/10 text-danger font-bold px-3 py-1.5 rounded-lg hover:bg-danger/20">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h3 className="font-bold text-primary text-sm mb-2">➕ New Student Login</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              <input className="input-sdsa" placeholder="Student name" value={sName} onChange={(e) => setSName(e.target.value)} />
              <input className="input-sdsa" placeholder="Mobile number" value={sMob} onChange={(e) => setSMob(e.target.value)} />
              <input className="input-sdsa" type="password" placeholder="Password" value={sPw} onChange={(e) => setSPw(e.target.value)} />
              <input className="input-sdsa" placeholder="Batch (optional)" value={sBatch} onChange={(e) => setSBatch(e.target.value)} />
            </div>
            <Button className="mt-2" disabled={busy || !sName || !sMob || !sPw}
              onClick={() => act('create_student', { name: sName, mobile: sMob, password: sPw, batch: sBatch, status: 'Active' }, `Login created for ${sName}`,
                () => { setSName(''); setSMob(''); setSPw(''); setSBatch(''); })}>
              Create Student Login
            </Button>
          </Card>

          {/* TRUST */}
          <Card>
            <h2 className="font-extrabold text-primary mb-3">🤝 Trust Logins — Shivansh Digital Sagacity &amp; Alleviation ({trust.length})</h2>
            {trust.length === 0 ? <p className="text-sm text-gray-500 mb-3">No trust logins yet.</p> : (
              <div className="space-y-2 mb-4">
                {trust.map((t) => (
                  <div key={t.username} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-wrap">
                    <div className="min-w-[180px]">
                      <p className="text-sm font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-500">@{t.username} · {t.designation || 'Trust Member'}</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangePw onSet={(pw) => act('update_trust', { username: t.username, password: pw }, `Password updated for ${t.name}`)} />
                      <button disabled={busy} onClick={() => { if (confirm(`Remove login for ${t.name}?`)) act('delete_trust', { username: t.username }, `Login removed for ${t.name}`); }}
                        className="text-xs bg-danger/10 text-danger font-bold px-3 py-1.5 rounded-lg hover:bg-danger/20">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h3 className="font-bold text-primary text-sm mb-2">➕ New Trust Member Login</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              <input className="input-sdsa" placeholder="Username" value={tUser} onChange={(e) => setTUser(e.target.value)} />
              <input className="input-sdsa" type="password" placeholder="Password" value={tPw} onChange={(e) => setTPw(e.target.value)} />
              <input className="input-sdsa" placeholder="Full name" value={tName} onChange={(e) => setTName(e.target.value)} />
              <input className="input-sdsa" placeholder="Designation (e.g. Trustee)" value={tDesig} onChange={(e) => setTDesig(e.target.value)} />
            </div>
            <Button className="mt-2" disabled={busy || !tUser || !tPw || !tName}
              onClick={() => act('create_trust', { username: tUser, password: tPw, name: tName, designation: tDesig }, `Trust login created for ${tName}`,
                () => { setTUser(''); setTPw(''); setTName(''); setTDesig(''); })}>
              Create Trust Login
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}

function ChangePw({ onSet }: { onSet: (pw: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [pw, setPw] = useState('');
  if (!editing) return (
    <button onClick={() => setEditing(true)} className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg hover:bg-primary/20">Change password</button>
  );
  return (
    <span className="flex gap-1">
      <input autoFocus type="password" className="input-sdsa !py-1 !text-xs w-32" placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button disabled={!pw} onClick={() => { onSet(pw); setEditing(false); setPw(''); }} className="text-xs bg-success/10 text-success font-bold px-2.5 py-1.5 rounded-lg hover:bg-success/20">Save</button>
      <button onClick={() => { setEditing(false); setPw(''); }} className="text-xs bg-gray-100 text-gray-500 font-bold px-2.5 py-1.5 rounded-lg">✕</button>
    </span>
  );
}
