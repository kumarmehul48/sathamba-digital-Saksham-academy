import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button, Alert } from '../../components/ui';
import { API_BASE } from '../../config';

const CATEGORIES = ['Trust Work', 'Social Help', 'Education Support', 'Special Contribution'];

const driveThumb = (link: string, w = 400) => {
  const m = link.match(/[-\w]{25,}/);
  return m ? `https://drive.google.com/thumbnail?id=${m[0]}&sz=w${w}` : link;
};

interface Post {
  date: string; title: string; description: string; category: string;
  images: string; status: string; coins: string; adminNote: string; social: string;
}

export default function MyPosts() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [social, setSocial] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const username = session?.username || '';
  const password = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sdsa_trust_pw') || '' : '';

  async function load() {
    setLoading(true); setErr('');
    try {
      const r = await fetch(`${API_BASE}/sdsaTrustPortal`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read', username, password }),
      });
      const d = await r.json();
      if (!d.ok) { setErr(d.error || 'Posts load nahi hue.'); setPosts([]); }
      else setPosts(d.posts || []);
    } catch { setErr('Network problem. Dobara try karo.'); }
    setLoading(false);
  }

  useEffect(() => { if (username && password) load(); else { setLoading(false); setErr(''); } }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!file) { setErr('Proof image zaroori hai — kaam ki photo lagao.'); return; }
    setBusy(true);
    try {
      const imageBase64: string = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result));
        fr.onerror = () => rej(new Error('File read failed'));
        fr.readAsDataURL(file);
      });
      const r = await fetch(`${API_BASE}/sdsaTrustPortal`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post', username, password,
          title, description, category, socialLink: social,
          imageBase64, imageMime: file.type, filename: file.name,
        }),
      });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Post save nahi hua.');
      else {
        setMsg(d.message || 'Post submitted!');
        setTitle(''); setDescription(''); setSocial(''); setFile(null);
        (document.getElementById('post-image') as HTMLInputElement | null)?.value !== undefined && (() => { const el = document.getElementById('post-image') as HTMLInputElement | null; if (el) el.value = ''; })();
        load();
      }
    } catch { setErr('Network problem. Dobara try karo.'); }
    setBusy(false);
  }

  if (!username || !password) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow">
        <h2 className="font-extrabold text-primary mb-2">Trust Member Login Required</h2>
        <p className="text-sm text-gray-600 mb-4">Apne posts dekhne ke liye trust member login karein.</p>
        <Link to="/trust/login" className="text-primary font-bold underline">Trust Member Login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">My Good Work Posts 🤝</h2>
        <p className="text-sm text-gray-500">Apna accha kaam post karo — admin (managing trustee) approve karega to coins milenge.</p>
      </div>

      {/* Submit form */}
      <form onSubmit={submit} className="bg-white rounded-xl p-5 shadow space-y-3">
        <h3 className="font-bold text-primary">🆕 Naya Post</h3>
        {err && <Alert tone="error">{err}</Alert>}
        {msg && <Alert tone="success">{msg}</Alert>}
        <div>
          <label className="label-sdsa">Work Title *</label>
          <input required disabled={busy} className="input-sdsa" placeholder="e.g. Gaon me free digital help camp" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label-sdsa">Description *</label>
          <textarea required disabled={busy} rows={3} className="input-sdsa" placeholder="Kya kaam kiya, kisko help mili — detail me likho" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label-sdsa">Category *</label>
            <select disabled={busy} className="input-sdsa" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-sdsa">Proof Image * (JPG/PNG, max 4MB)</label>
            <input id="post-image" required disabled={busy} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="input-sdsa" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>
        <div>
          <label className="label-sdsa">Social Media Post Link (optional)</label>
          <input disabled={busy} className="input-sdsa" placeholder="https://instagram.com/p/..." value={social} onChange={(e) => setSocial(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? 'Posting…' : '📤 Submit for Coins'}</Button>
      </form>

      {/* My posts list */}
      <div className="space-y-3">
        <h3 className="font-bold text-primary">📋 Mere Posts</h3>
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow text-center text-sm text-gray-500">
            Abhi koi post nahi. Pehla good-work post upar se karo!
          </div>
        )}
        {posts.map((p, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow flex gap-4">
            {p.images ? (
              <a href={p.images} target="_blank" rel="noreferrer">
                <img src={driveThumb(p.images)} alt={p.title} className="w-24 h-24 rounded-lg object-cover border" />
              </a>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-100 grid place-items-center text-gray-400 text-xs">No image</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-primary truncate">{p.title}</p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${p.status === 'Approved' ? 'bg-green-100 text-green-700' : p.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.status === 'Approved' ? `✅ Approved +${p.coins || 0} coins` : p.status === 'Rejected' ? '❌ Rejected' : '⏳ Pending'}
                </span>
              </div>
              <p className="text-xs text-gray-400">{p.date} · {p.category}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
              {p.adminNote && <p className="text-xs text-gray-500 mt-1">📝 {p.adminNote}</p>}
              {p.social && <a href={p.social} target="_blank" rel="noreferrer" className="text-xs text-accent-dark underline mt-1 inline-block">Social post ↗</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
