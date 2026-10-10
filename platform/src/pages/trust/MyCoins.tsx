import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Alert, Button } from '../../components/ui';
import { API_BASE } from '../../config';

interface History { date: string; reason: string; coins: number; awardedBy: string; note: string }
interface MyReq { date: string; to: string; coins: number; reason: string; status: string; note: string }

export default function MyCoins() {
  const { session } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [rules, setRules] = useState<string[][]>([]);
  const [requests, setRequests] = useState<MyReq[]>([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  // transfer request form
  const [tTo, setTTo] = useState('');
  const [tCoins, setTCoins] = useState('');
  const [tReason, setTReason] = useState('');
  const [tBusy, setTBusy] = useState(false);
  const [tMsg, setTMsg] = useState('');

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
        if (!d.ok) setErr(d.error || 'Coins load nahi hue.');
        else { setBalance(d.balance || 0); setHistory(d.history || []); setRules((d.rules || []).filter((r: string[]) => r[0])); setRequests(d.requests || []); }
      } catch { setErr('Network problem. Dobara try karo.'); }
      setLoading(false);
    })();
  }, []);

  async function sendTransferRequest() {
    setErr(''); setTMsg(''); setTBusy(true);
    try {
      const r = await fetch(`${API_BASE}/sdsaTrustPortal`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'transfer', username, password, to: tTo, coins: Number(tCoins || 0), reason: tReason }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Request nahi gayi.');
      else { setTMsg(d.message); setTTo(''); setTCoins(''); setTReason('');
        // reload
        const rr = await fetch(`${API_BASE}/sdsaTrustPortal`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'read', username, password }),
        });
        const dd = await rr.json();
        if (dd.ok) { setBalance(dd.balance || 0); setRequests(dd.requests || []); setHistory(dd.history || []); }
      }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setTBusy(false);
  }

  if (!username || !password) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow">
        <h2 className="font-extrabold text-primary mb-2">Trust Member Login Required</h2>
        <p className="text-sm text-gray-600 mb-4">Apne coins dekhne ke liye trust member login karein.</p>
        <Link to="/trust/login" className="text-primary font-bold underline">Trust Member Login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-extrabold text-primary">My Coins 🪙</h2>
      {err && <Alert tone="error">{err}</Alert>}

      {/* Balance card */}
      <div className="rounded-xl bg-primary text-white p-6 shadow text-center">
        <p className="text-xs uppercase tracking-widest text-white/70">Total Coin Balance</p>
        {loading ? <p className="text-5xl font-extrabold mt-2">…</p> : (
          <p className="text-6xl font-extrabold mt-2 text-accent">{balance}</p>
        )}
        <p className="text-xs text-white/60 mt-2">Admin approval ke baad coins milete hain · 1 post = 1 award</p>
      </div>

      {/* Internal Transfer Request — member to member, admin approval zaroori */}
      <div className="bg-white rounded-xl p-5 shadow border-l-4 border-accent">
        <h3 className="font-bold text-primary mb-1">🔁 Send Coins to Member (Request)</h3>
        <p className="text-xs text-gray-500 mb-3">Dusre member ko coins bhejne ke liye request bhejo — admin approve karega tabhi transfer hoga.</p>
        {tMsg && <Alert tone="success">{tMsg}</Alert>}
        <div className="flex flex-wrap gap-2 items-center">
          <input className="input-sdsa w-44 !py-2" placeholder="To member username" value={tTo} onChange={(e) => setTTo(e.target.value)} />
          <input type="number" min={1} max={500} className="input-sdsa w-24 !py-2" placeholder="Coins" value={tCoins} onChange={(e) => setTCoins(e.target.value)} />
          <input className="input-sdsa w-52 !py-2" placeholder="Reason" value={tReason} onChange={(e) => setTReason(e.target.value)} />
          <Button type="button" disabled={tBusy || !tTo || !tCoins || !tReason} onClick={sendTransferRequest} className="!py-2 !px-5">
            {tBusy ? '…' : '🔁 Send Request'}
          </Button>
        </div>
      </div>

      {/* My Requests */}
      {requests.length > 0 && (
        <div>
          <h3 className="font-bold text-primary mb-2">📤 My Transfer Requests</h3>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">To</th><th className="px-4 py-2">Coins</th><th className="px-4 py-2">Reason</th><th className="px-4 py-2">Status</th></tr>
              </thead>
              <tbody>
                {requests.map((rq, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{rq.date}</td>
                    <td className="px-4 py-2">@{rq.to}</td>
                    <td className="px-4 py-2 font-bold text-primary">{rq.coins}</td>
                    <td className="px-4 py-2">{rq.reason}{rq.note ? <span className="text-gray-400 text-xs"> · {rq.note}</span> : ''}</td>
                    <td className="px-4 py-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${rq.status === 'Approved' ? 'bg-green-100 text-green-700' : rq.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {rq.status === 'Approved' ? '✅ Approved' : rq.status === 'Rejected' ? '❌ Rejected' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="font-bold text-primary mb-2">📜 Coin History</h3>
        {history.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center text-sm text-gray-500">
            {loading ? 'Loading…' : 'Abhi koi coin nahi. Good work post karo, admin approve karega to coins milenge!'}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Kaam</th><th className="px-4 py-2">Coins</th><th className="px-4 py-2">Awarded By</th></tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{h.date}</td>
                    <td className="px-4 py-2">{h.reason}{h.note ? <span className="text-gray-400 text-xs"> · {h.note}</span> : ''}</td>
                    <td className="px-4 py-2 font-bold text-primary">+{h.coins}</td>
                    <td className="px-4 py-2 text-gray-500">{h.awardedBy || 'Admin'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rules */}
      <div>
        <h3 className="font-bold text-primary mb-2">📊 Coin Rules (suggested)</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {rules.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow">
              <p className="font-bold text-primary text-sm">{r[0]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r[1]}</p>
              <p className="text-accent-dark font-extrabold text-lg mt-1">{r[2]} coins</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Final coins hamesha admin (managing trustee) decide karte hain.</p>
      </div>
    </div>
  );
}
