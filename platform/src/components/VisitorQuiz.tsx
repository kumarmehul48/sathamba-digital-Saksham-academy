import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../config';

/**
 * Visitor engagement popup — a fun/curiosity question that appears once a
 * day on public pages. Preference questions give a playful tailored reply;
 * knowledge questions teach a quick fact. Purely client-side.
 */

type Q = {
  q: string;
  sub?: string;
  options: string[];
  correct?: number;             // if set → knowledge question
  replies?: string[];          // per-option reply for preference questions
};

const QUESTIONS: Q[] = [
  {
    q: 'Tumhe sabse jyada kya pasand hai? 😄',
    sub: 'Aise hi fun things se hum computer skills sikhate hain',
    options: ['Khana & Cooking 😋', 'Gaming 🎮', 'Video & Film 🎬', 'Search karna & naya seekhna 🔍'],
    replies: [
      'Wah! Cooking bhi ek science hai — recipes, timing, measurement. Waise hi coding me bhi recipe (steps) likhte hain! SDSA me seekho. 👨‍🍳✨',
      'Games ke piche bhi coding hoti hai! SDSA me game banana aur khelna dono seekh sakte ho. 🎮⚡',
      'Videos banane me editing, thumbnails, storytelling — SDSA ke 26-week course me sab milega. 🎬✨',
      'Curious log sabse aage nikalte hain! Internet se kaise research kare — SDSA me full seekh milegi. 🔍🚀',
    ],
  },
  {
    q: 'Future ki super-power kaunsi skill hai? 🚀',
    options: ['AI tools 🤖', 'Typing & computer 💻', 'Digital payment 📱', 'Teeno! ✅'],
    correct: 3,
  },
  {
    q: 'WWW ka full form kya hai? 🌐',
    options: ['World Wide Web ✅', 'World Web Wire', 'Wide World Web'],
    correct: 0,
  },
  {
    q: 'Ctrl+C keyboard se kya hota hai? ⌨️',
    options: ['Paste', 'Copy ✅', 'Cut'],
    correct: 1,
  },
  {
    q: 'Tumhara phone din me kitni der chalta hai? 📱😄',
    options: ['1 ghanta', '3-4 ghante', 'Poora din'],
    replies: [
      'Kam screen time = best! Waise SDSA me screens se seekhte hain — sahi jagah, sahi time. 👍',
      'Normal hai! Agar wahi time ek naya skill me lagao toh 26 hafte me tum pro ban sakte ho. 💪',
      'Poora din?! Chalo ab usi phone se kuch kaam ka seekh lo — SDSA digital skills class! 😉',
    ],
  },
  {
    q: 'Strong password kaisa hona chahiye? 🔒',
    options: ['Mera naam', '123456', 'Lamba + letters, numbers, symbols ✅'],
    correct: 2,
  },
];

const KEY = 'sdsa_visitor_quiz';
const SEEN_KEY = 'sdsa_quiz_seen';
const today = () => new Date().toISOString().slice(0, 10);

/** Pick a question the visitor has NOT seen yet; reset once all are seen. */
function nextQuestion(): Q {
  let seen: number[] = [];
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { seen = []; }
  let candidates = QUESTIONS.map((_, i) => i).filter((i) => !seen.includes(i));
  if (candidates.length === 0) { seen = []; candidates = QUESTIONS.map((_, i) => i); }
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  seen.push(pick);
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch { /* ignore */ }
  return QUESTIONS[pick];
}

export default function VisitorQuiz() {
  const [open, setOpen] = useState(false);
  const [q] = useState<Q>(nextQuestion);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    let shown = '';
    try { shown = localStorage.getItem(KEY) || ''; } catch { shown = today(); }
    if (shown !== today()) {
      const t = setTimeout(() => setOpen(true), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  function close() {
    try { localStorage.setItem(KEY, today()); } catch { /* ignore */ }
    setOpen(false);
  }

  if (!open) return null;
  const answered = picked !== null;
  const right = q.correct !== undefined && picked === q.correct;
  const reply = q.replies ? (q.replies[picked ?? 0] || '') : '';

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="Close" className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>

        <div className="flex items-center gap-3 mb-3">
          <img src={asset('sdsa-badge.webp')} alt="SDSA" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-extrabold text-primary text-sm">Quick Question! 🎯</p>
            <p className="text-[11px] text-gray-400">1 minute · curiosity check</p>
          </div>
        </div>

        <h3 className="font-extrabold text-gray-800 text-lg mb-1">{q.q}</h3>
        {q.sub && <p className="text-xs text-gray-500 mb-3">{q.sub}</p>}

        {!answered ? (
          <div className="space-y-2">
            {q.options.map((o, i) => (
              <button key={i} onClick={() => setPicked(i)}
                className="w-full text-left text-sm font-semibold px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:border-accent hover:bg-accent/10 transition">
                {o}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className={`font-bold text-sm ${q.correct !== undefined ? (right ? 'text-green-600' : 'text-orange-500') : 'text-primary'}`}>
              {q.correct !== undefined ? (right ? '🎉 Sahi jawab!' : `Almost! Sahi jawab: ${q.options[q.correct]}`) : '😄 Badhiya!'}
            </p>
            {reply && <p className="text-sm text-gray-700">{reply}</p>}
            {q.correct !== undefined && (
              <p className="text-xs text-gray-500">
                {right ? 'Aise hi interesting things SDSA me roz milenge — join karo!' : 'Koi baat nahi — SDSA me ye sab easy tarike se sikhayenge!'}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <Link to="/course" onClick={close} className="btn-primary flex-1 text-center text-sm">Courses dekho →</Link>
              <Link to="/apply" onClick={close} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-accent/15 text-primary hover:bg-accent/30">Apply</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
