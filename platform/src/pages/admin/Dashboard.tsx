import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { API_BASE } from '../../config';

// TRUST COIN CONSOLE — Mehul Parmar (Trust Admin) ka one-stop control page.
// Sab kuch ek jagah: total coins, members, direct transfer, pending posts, full history.
// Student/academy side ka content yahan nahi hai — wo alag portal me hai.

const SUGGEST: Record<string, number> = {
  'Trust Work': 15, 'Social Help': 10, 'Education Support': 15, 'Special Contribution': 25,
};

const driveThumb = (link: string, w = 400) => {
  const m = link.match(/[-\w]{25,}/);
  return m ? `https://drive.google.com/thumbnail?id=${m[0]}&sz=w${w}` : link;
};

interface Post {
  row: number; date: string; username: string; name: string; title: string;
  description: string; category: string; images: string; status: string;
  coins: string; adminNote: string; social: string;
}
interface Member { username: string; name: string; email?: string; phone?: string; balance: number }
interface LedgerEntry {
  row: number; date: string; username: string; name: string;
  reason: string; coins: number; awardedBy: string; note: string;
}
interface Totals { totalCoinsIssued: number; totalTransfers: number; members: number; pendingPosts: number; pendingRegistrations?: number; pendingKyc?: number; pendingTransferRequests?: number }
interface Reg { row: number; date: string; name: string; mobile: string; email: string; reason: string; status: string; note: string; approvedUsername: string }
interface Kyc { row: number; date: string; username: string; name: string; idType: string; idNumber: string; photo: string; status: string; note: string }
interface TReq { row: number; date: string; from: string; to: string; coins: number; reason: string; status: string; note: string }

export default function AdminDashboard() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busyRow, setBusyRow] = useState(0);

  // per-post inputs
  const [coinInput, setCoinInput] = useState<Record<number, string>>({});
  const [noteInput, setNoteInput] = useState<Record<number, string>>({});
  // direct transfer state
  const [toUser, setToUser] = useState('');
  const [tCoins, setTCoins] = useState('');
  const [tReason, setTReason] = useState('');
  const [tBusy, setTBusy] = useState(false);
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [kycList, setKycList] = useState<Kyc[]>([]);
  const [transferRequests, setTransferRequests] = useState<TReq[]>([]);
  // add member form
  const [mUser, setMUser] = useState(''); const [mPass, setMPass] = useState('');
  const [mName, setMName] = useState(''); const [mEmail, setMEmail] = useState(''); const [mPhone, setMPhone] = useState('');
  const [mBusy, setMBusy] = useState(false);
  // per-reg approve inputs
  const [regCreds, setRegCreds] = useState<Record<number, { u: string; p: string }>>({});
  // per-item notes
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState('');

  const adminUser = session?.username || '';
  const adminPass = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sdsa_admin_pw') || '' : '';

  async function load() {
    setLoading(true); setErr('');
    try {
      const r = await fetch(`${API_BASE}/sdsaAdminCoins`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', adminUser, adminPass }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Load failed.');
      else {
        setPosts(d.posts || []);
        setMembers(d.members || []);
        setLedger(d.ledger || []);
        setTotals(d.totals || null);
        setRegistrations(d.registrations || []);
        setKycList(d.kyc || []);
        setTransferRequests(d.transferRequests || []);
      }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setLoading(false);
  }

  useEffect(() => { if (adminUser && adminPass) load(); else setLoading(false); }, []);

  // generic action: regApprove/regReject/kycApprove/kycReject/transferApprove/transferReject/addMember
  async function adminAction(id: string, action: string, payload: Record<string, unknown> = {}) {
    setErr(''); setMsg(''); setBusyId(id);
    try {
      const r = await fetch(`${API_BASE}/sdsaAdminCoins`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminUser, adminPass, ...payload }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Action failed.');
      else { setMsg(d.message); load(); }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setBusyId('');
  }

  async function act(row: number, action: 'approve' | 'reject', post: Post) {
    setErr(''); setMsg(''); setBusyRow(row);
    try {
      const r = await fetch(`${API_BASE}/sdsaAdminCoins`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action, adminUser, adminPass, row,
          coins: Number(coinInput[row] || SUGGEST[post.category] || 10),
          note: noteInput[row] || '',
        }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Action failed.');
      else { setMsg(d.message); load(); }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setBusyRow(0);
  }

  async function transfer() {
    setErr(''); setMsg(''); setTBusy(true);
    try {
      const r = await fetch(`${API_BASE}/sdsaAdminCoins`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grant', adminUser, adminPass,
          to: toUser, coins: Number(tCoins || 0), reason: tReason || 'Direct transfer',
        }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Transfer failed.');
      else { setMsg(d.message); setToUser(''); setTCoins(''); setTReason(''); load(); }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setTBusy(false);
  }

  if (!adminUser || !adminPass) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow">
        <h2 className="font-extrabold text-primary mb-2">Trust Admin Login Required</h2>
        <p className="text-sm text-gray-600 mb-4">Coin console khulne ke liye trust login karein.</p>
        <Link to="/trust/login" className="text-primary font-bold underline">Trust Login →</Link>
      </div>
    );
  }

  const pending = posts.filter((p) => p.status === 'Pending');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Trust Coin Console 🪙</h2>
        <p className="text-sm text-gray-500">Mehul Parmar (Trust Admin) ka control center — total coins, direct transfer, pending posts aur full history, sab ek page par.</p>
      </div>
      {err && <Alert tone="error">{err}</Alert>}
      {msg && <Alert tone="success">{msg}</Alert>}

      {/* TOTALS — admin ka control & count */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase">🪙 Total Coins Issued</p>
          <p className="text-3xl font-extrabold text-accent-dark">{totals ? totals.totalCoinsIssued : '…'}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase">🔁 Total Transfers</p>
          <p className="text-3xl font-extrabold text-primary">{totals ? totals.totalTransfers : '…'}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase">👥 Members</p>
          <p className="text-3xl font-extrabold text-primary">{totals ? totals.members : '…'}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase">⏳ Pending Posts</p>
          <p className="text-3xl font-extrabold text-yellow-600">{totals ? totals.pendingPosts : '…'}</p>
        </div>
      </div>

      {/* DIRECT COIN TRANSFER — sabse upar, one click */}
      <div className="bg-white rounded-xl p-4 shadow border-l-4 border-accent">
        <h3 className="font-bold text-primary mb-1">💸 Direct Coin Transfer</h3>
        <p className="text-xs text-gray-500 mb-3">Bina post ke seedha coins do — member ka username, email ya phone (list se bhi chun sakte ho). Ledger me entry automatic.</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            list="member-list"
            className="input-sdsa w-48 !py-2"
            placeholder="Username / Email / Phone"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
          />
          <datalist id="member-list">
            {members.map((m) => (
              <option key={m.username} value={m.username}>
                {m.name} (@{m.username}){m.phone ? ` · ${m.phone}` : ''} — {m.balance} coins
              </option>
            ))}
          </datalist>
          <input
            type="number" min={1} max={500} placeholder="Coins"
            className="input-sdsa w-24 !py-2" value={tCoins}
            onChange={(e) => setTCoins(e.target.value)}
          />
          <input
            placeholder="Reason (e.g. Welcome bonus)"
            className="input-sdsa w-52 !py-2" value={tReason}
            onChange={(e) => setTReason(e.target.value)}
          />
          <Button type="button" disabled={tBusy || !toUser || !tCoins} onClick={transfer}
            className="!py-2 !px-5">
            {tBusy ? '…' : '💸 Transfer Coins'}
          </Button>
        </div>
      </div>

      {/* ADD MEMBER — seedha trust member login banao */}
      <div className="bg-white rounded-xl p-4 shadow border-l-4 border-green-600">
        <h3 className="font-bold text-primary mb-1">➕ Add Trust Member (Direct)</h3>
        <p className="text-xs text-gray-500 mb-3">Seedha member banao — username/password set karo, wo /trust/login se login kar payega.</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input className="input-sdsa w-36 !py-2" placeholder="Username" value={mUser} onChange={(e) => setMUser(e.target.value)} />
          <input className="input-sdsa w-32 !py-2" placeholder="Password" value={mPass} onChange={(e) => setMPass(e.target.value)} />
          <input className="input-sdsa w-36 !py-2" placeholder="Full name" value={mName} onChange={(e) => setMName(e.target.value)} />
          <input className="input-sdsa w-48 !py-2" placeholder="Email (optional)" value={mEmail} onChange={(e) => setMEmail(e.target.value)} />
          <input className="input-sdsa w-36 !py-2" placeholder="Phone (optional)" value={mPhone} onChange={(e) => setMPhone(e.target.value)} />
          <Button type="button" disabled={mBusy || !mUser || !mPass || !mName}
            onClick={() => { setMBusy(true); adminAction('addMember', 'addMember', { username: mUser, password: mPass, name: mName, email: mEmail, phone: mPhone }).then(() => setMBusy(false)); setMUser(''); setMPass(''); setMName(''); setMEmail(''); setMPhone(''); }}
            className="!py-2 !px-4 bg-green-600 hover:bg-green-700">
            {mBusy ? '…' : '➕ Add Member'}
          </Button>
        </div>
      </div>

      {/* REGISTRATION REQUESTS — approve karke login banao */}
      <div>
        <h3 className="font-bold text-primary mb-2">📥 Registration Requests ({registrations.filter((r) => r.status === 'Pending').length} pending)</h3>
        {registrations.length === 0 && (
          <div className="bg-white rounded-xl p-5 shadow text-center text-sm text-gray-500">Abhi koi registration request nahi. Trust login page se request aayegi.</div>
        )}
        {registrations.map((r) => (
          <div key={r.row} className={`bg-white rounded-xl p-4 shadow mb-3 border-l-4 ${r.status === 'Pending' ? 'border-yellow-400' : r.status === 'Approved' ? 'border-green-600' : 'border-red-500'}`}>
            <p className="font-bold text-primary">{r.name} {r.status !== 'Pending' && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 ${r.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status === 'Approved' ? `✅ Approved @${r.approvedUsername || ''}` : '❌ Rejected'}</span>}</p>
            <p className="text-xs text-gray-400">{r.date} · 📱 {r.mobile} · ✉️ {r.email}</p>
            <p className="text-sm text-gray-600 mt-1">"{r.reason}"</p>
            {r.status === 'Pending' ? (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <input className="input-sdsa w-32 !py-1.5" placeholder="Username" value={regCreds[r.row]?.u || ''} onChange={(e) => setRegCreds((c) => ({ ...c, [r.row]: { u: e.target.value, p: c[r.row]?.p || '' } }))} />
                <input className="input-sdsa w-32 !py-1.5" placeholder="Password" value={regCreds[r.row]?.p || ''} onChange={(e) => setRegCreds((c) => ({ ...c, [r.row]: { u: c[r.row]?.u || '', p: e.target.value } }))} />
                <Button type="button" disabled={busyId === `reg${r.row}` || !regCreds[r.row]?.u || !regCreds[r.row]?.p}
                  onClick={() => adminAction(`reg${r.row}`, 'regApprove', { row: r.row, username: regCreds[r.row].u, password: regCreds[r.row].p })}
                  className="!py-1.5 !px-4 bg-green-600 hover:bg-green-700">
                  {busyId === `reg${r.row}` ? '…' : '✅ Approve + Login Banao'}
                </Button>
                <Button type="button" disabled={busyId === `reg${r.row}`}
                  onClick={() => adminAction(`reg${r.row}`, 'regReject', { row: r.row, note: notes[`reg${r.row}`] || '' })}
                  className="!py-1.5 !px-4 bg-red-600 hover:bg-red-700">
                  ❌ Reject
                </Button>
                <input className="input-sdsa w-44 !py-1.5" placeholder="Reject note (optional)" value={notes[`reg${r.row}`] || ''} onChange={(e) => setNotes((n) => ({ ...n, [`reg${r.row}`]: e.target.value }))} />
              </div>
            ) : r.note && <p className="text-xs text-gray-400 mt-2">📝 {r.note}</p>}
          </div>
        ))}
      </div>

      {/* KYC VERIFICATION */}
      <div>
        <h3 className="font-bold text-primary mb-2">🆔 KYC Verification ({kycList.filter((k) => k.status === 'Pending').length} pending)</h3>
        {kycList.length === 0 && (
          <div className="bg-white rounded-xl p-5 shadow text-center text-sm text-gray-500">Abhi koi KYC nahi. Members portal ke KYC page se submit karenge.</div>
        )}
        {kycList.map((k) => (
          <div key={k.row} className={`bg-white rounded-xl p-4 shadow mb-3 border-l-4 ${k.status === 'Pending' ? 'border-yellow-400' : k.status === 'Verified' ? 'border-green-600' : 'border-red-500'}`}>
            <div className="flex gap-4">
              {k.photo ? (
                <a href={k.photo} target="_blank" rel="noreferrer">
                  <img src={`https://drive.google.com/thumbnail?id=${(k.photo.match(/[-\w]{25,}/) || [''])[0]}&sz=w400`} alt="ID" className="w-28 h-28 rounded-lg object-cover border" />
                </a>
              ) : <div className="w-28 h-28 rounded-lg bg-gray-100 grid place-items-center text-gray-400 text-xs">No ID</div>}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary">{k.name} <span className="font-normal text-xs text-gray-400">@{k.username}</span> {k.status !== 'Pending' && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 ${k.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{k.status === 'Verified' ? '✅ Verified' : '❌ Rejected'}</span>}</p>
                <p className="text-xs text-gray-400">{k.date} · {k.idType} · No. {k.idNumber}</p>
                {k.status === 'Pending' && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Button type="button" disabled={busyId === `kyc${k.row}`} onClick={() => adminAction(`kyc${k.row}`, 'kycApprove', { row: k.row })} className="!py-1.5 !px-4 bg-green-600 hover:bg-green-700">
                      {busyId === `kyc${k.row}` ? '…' : '✅ Verify'}
                    </Button>
                    <Button type="button" disabled={busyId === `kyc${k.row}`} onClick={() => adminAction(`kyc${k.row}`, 'kycReject', { row: k.row, note: notes[`kyc${k.row}`] || '' })} className="!py-1.5 !px-4 bg-red-600 hover:bg-red-700">
                      ❌ Reject
                    </Button>
                    <input className="input-sdsa w-44 !py-1.5" placeholder="Note (optional)" value={notes[`kyc${k.row}`] || ''} onChange={(e) => setNotes((n) => ({ ...n, [`kyc${k.row}`]: e.target.value }))} />
                  </div>
                )}
                {k.status !== 'Pending' && k.note && <p className="text-xs text-gray-400 mt-2">📝 {k.note}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TRANSFER REQUESTS — member to member internal */}
      <div>
        <h3 className="font-bold text-primary mb-2">🔁 Transfer Requests ({transferRequests.filter((t) => t.status === 'Pending').length} pending)</h3>
        <p className="text-xs text-gray-500 mb-2">Members ek dusre ko coins bhejne ki request bhejte hain — approve karne par sender ke wallet se receiver ke wallet me coins chale jayenge.</p>
        {transferRequests.length === 0 && (
          <div className="bg-white rounded-xl p-5 shadow text-center text-sm text-gray-500">Abhi koi transfer request nahi.</div>
        )}
        {transferRequests.map((t) => (
          <div key={t.row} className={`bg-white rounded-xl p-4 shadow mb-3 border-l-4 ${t.status === 'Pending' ? 'border-yellow-400' : t.status === 'Approved' ? 'border-green-600' : 'border-red-500'}`}>
            <p className="font-bold text-primary text-sm"> @{t.from} → @{t.to} : <span className="text-accent-dark">{t.coins} coins</span> {t.status !== 'Pending' && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 ${t.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.status === 'Approved' ? '✅ Approved' : '❌ Rejected'}</span>}</p>
            <p className="text-xs text-gray-400">{t.date} · Reason: {t.reason}</p>
            {t.status === 'Pending' && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Button type="button" disabled={busyId === `tr${t.row}`} onClick={() => adminAction(`tr${t.row}`, 'transferApprove', { row: t.row })} className="!py-1.5 !px-4 bg-green-600 hover:bg-green-700">
                  {busyId === `tr${t.row}` ? '…' : '✅ Approve Transfer'}
                </Button>
                <Button type="button" disabled={busyId === `tr${t.row}`} onClick={() => adminAction(`tr${t.row}`, 'transferReject', { row: t.row, note: notes[`tr${t.row}`] || '' })} className="!py-1.5 !px-4 bg-red-600 hover:bg-red-700">
                  ❌ Reject
                </Button>
                <input className="input-sdsa w-44 !py-1.5" placeholder="Note (optional)" value={notes[`tr${t.row}`] || ''} onChange={(e) => setNotes((n) => ({ ...n, [`tr${t.row}`]: e.target.value }))} />
              </div>
            )}
            {t.status !== 'Pending' && t.note && <p className="text-xs text-gray-400 mt-2">📝 {t.note}</p>}
          </div>
        ))}
      </div>

      {/* PENDING POSTS */}
      <div>
        <h3 className="font-bold text-primary mb-2">⏳ Pending Approval ({pending.length})</h3>
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {!loading && pending.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow text-center text-sm text-gray-500">
            Koi pending post nahi. Members portal se post karte hi yahan aayega. 🎉
          </div>
        )}
        {pending.map((p) => (
          <div key={p.row} className="bg-white rounded-xl p-4 shadow mb-3 border-l-4 border-yellow-400">
            <div className="flex gap-4">
              {p.images ? (
                <a href={p.images} target="_blank" rel="noreferrer">
                  <img src={driveThumb(p.images)} alt={p.title} className="w-28 h-28 rounded-lg object-cover border" />
                </a>
              ) : (
                <div className="w-28 h-28 rounded-lg bg-gray-100 grid place-items-center text-gray-400 text-xs">No image</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary">{p.title}</p>
                <p className="text-xs text-gray-400">{p.date} · {p.category} · {p.name} (@{p.username})</p>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                {p.social && <a href={p.social} target="_blank" rel="noreferrer" className="text-xs text-accent-dark underline">Social post ↗</a>}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <input
                    type="number" min={1} max={500}
                    className="input-sdsa w-24 !py-1.5" placeholder="Coins"
                    value={coinInput[p.row] ?? String(SUGGEST[p.category] || 10)}
                    onChange={(e) => setCoinInput((c) => ({ ...c, [p.row]: e.target.value }))}
                  />
                  <input
                    className="input-sdsa w-44 !py-1.5" placeholder="Note (optional)"
                    value={noteInput[p.row] || ''}
                    onChange={(e) => setNoteInput((n) => ({ ...n, [p.row]: e.target.value }))}
                  />
                  <Button type="button" disabled={busyRow === p.row} onClick={() => act(p.row, 'approve', p)}
                    className="!py-1.5 !px-4 bg-green-600 hover:bg-green-700">
                    {busyRow === p.row ? '…' : '✅ Approve + Coins'}
                  </Button>
                  <Button type="button" disabled={busyRow === p.row} onClick={() => act(p.row, 'reject', p)}
                    className="!py-1.5 !px-4 bg-red-600 hover:bg-red-700">
                    ❌ Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MEMBER BALANCES */}
      <div>
        <h3 className="font-bold text-primary mb-2">👥 Member Balances</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {members.map((m) => (
            <div key={m.username} className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
              <div>
                <p className="font-bold text-primary text-sm">{m.name}</p>
                <p className="text-xs text-gray-400">@{m.username}</p>
              </div>
              <p className="text-2xl font-extrabold text-accent-dark">{m.balance}</p>
            </div>
          ))}
          {members.length === 0 && <p className="text-sm text-gray-500">Abhi koi member nahi.</p>}
        </div>
      </div>

      {/* FULL COIN HISTORY / TRANSFER DETAILS */}
      <div>
        <h3 className="font-bold text-primary mb-2">📜 Coin History & Transfer Details ({ledger.length})</h3>
        {ledger.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow text-center text-sm text-gray-500">
            Abhi koi transfer nahi hua. Pehla coin do — history yahan banegi.
          </div>
        )}
        {ledger.map((l) => (
          <div key={`${l.row}-${l.date}`} className="bg-white rounded-xl p-3 shadow mb-2 flex items-center gap-3">
            <span className={`text-sm font-extrabold whitespace-nowrap ${l.coins < 0 ? 'text-red-600' : 'text-accent-dark'}`}>{l.coins < 0 ? l.coins : `+${l.coins}`}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary truncate">{l.name || l.username} <span className="font-normal text-xs text-gray-400">@{l.username}</span></p>
              <p className="text-xs text-gray-500 truncate">{l.reason}{l.note ? ` · 📝 ${l.note}` : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 whitespace-nowrap">by {l.awardedBy || 'admin'}</p>
              <p className="text-xs text-gray-500 whitespace-nowrap">{l.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
