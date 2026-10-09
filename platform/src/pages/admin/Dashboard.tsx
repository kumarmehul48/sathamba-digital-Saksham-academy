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
interface Totals { totalCoinsIssued: number; totalTransfers: number; members: number; pendingPosts: number }

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
      }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setLoading(false);
  }

  useEffect(() => { if (adminUser && adminPass) load(); else setLoading(false); }, []);

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
            <span className="text-sm font-extrabold text-accent-dark whitespace-nowrap">+{l.coins}</span>
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
