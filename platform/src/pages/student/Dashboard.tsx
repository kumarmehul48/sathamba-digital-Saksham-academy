import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { API_BASE, WHATSAPP_URL } from '../../config';

interface Announcement { date: string; title: string; details: string; }

/* ---------- Gamification helpers (stored locally per student) ---------- */
const GK = (n: string) => `sdsa_game_${n}`;
const todayStr = () => new Date().toISOString().slice(0, 10);

function loadGame() {
  try { return JSON.parse(localStorage.getItem(GK('state')) || 'null'); } catch { return null; }
}
function initGame() {
  const g = loadGame();
  if (g) return g;
  const fresh = { first: todayStr(), last: '', streak: 0, xp: 0, weeksDone: [], quizDone: '' };
  localStorage.setItem(GK('state'), JSON.stringify(fresh));
  return fresh;
}
function updateGame(patch: any) {
  const g = loadGame() || initGame();
  const next = { ...g, ...patch };
  localStorage.setItem(GK('state'), JSON.stringify(next));
  return next;
}
function touchStreak() {
  const g = loadGame() || initGame();
  const t = todayStr();
  if (g.last === t) return g;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = g.last === y ? g.streak + 1 : 1;
  return updateGame({ last: t, streak, xp: (g.xp || 0) + 5 });
}

const LEVELS = [
  { min: 0, name: 'Digital Beginner', icon: '🌱' },
  { min: 50, name: 'Digital Explorer', icon: '🧭' },
  { min: 150, name: 'Digital Achiever', icon: '🚀' },
  { min: 300, name: 'Digital Champion', icon: '🏆' },
];
const levelOf = (xp: number) => [...LEVELS].reverse().find((l) => xp >= l.min) || LEVELS[0];

const TIPS = [
  'Typing fast? Keep fingers on home row: ASDF — JKL; 🖐️',
  'Ctrl+C = copy, Ctrl+V = paste. Practice until it is automatic!',
  'Strong password = long + mixed characters. Never share it. 🔒',
  'Before clicking any link, ask: do I know who sent this? 🤔',
  'Save your work often — Ctrl+S is your best friend. 💾',
  'Cloud = your files on the internet, safe even if the PC breaks. ☁️',
  'AI tools help you learn, but your brain must do the thinking. 🧠',
  'Undo mistakes instantly with Ctrl+Z. Magic button! ✨',
  'Organize files in folders with clear names — future you will thank you. 📁',
  'When something breaks, first rule: restart and stay calm. 😌',
];

/* ---------- Daily quiz ---------- */
const QUIZ = [
  { q: 'Which key combination copies selected text?', o: ['Ctrl+X', 'Ctrl+C', 'Ctrl+V'], a: 1 },
  { q: 'What should you never share online?', o: ['Your favorite game', 'Your password', 'Your city name'], a: 1 },
  { q: 'Which of these is an email service?', o: ['WhatsApp', 'Gmail', 'Zoom'], a: 1 },
  { q: 'Ctrl+Z does what?', o: ['Undo the last action', 'Zoom the screen', 'Close the window'], a: 0 },
  { q: 'What is a strong password?', o: ['123456', 'your name', 'Long + letters, numbers & symbols'], a: 2 },
  { q: 'Cloud storage keeps files…', o: ['Only on your PC', 'On the internet, accessible anywhere', 'In a pen drive only'], a: 1 },
  { q: 'You get a message: "You won ₹1 lakh, click here!" You should…', o: ['Click fast!', 'Share it with friends', 'Ignore — it is a scam'], a: 2 },
  { q: 'Which one is an operating system?', o: ['MS Word', 'Windows', 'Chrome browser'], a: 1 },
  { q: 'Ctrl+S is used to…', o: ['Save your work', 'Search the web', 'Shut down the PC'], a: 0 },
  { q: 'Before trusting a website, check for…', o: ['Cool colors', 'https:// in the address', 'Big pictures'], a: 1 },
];
const quizOfDay = QUIZ[Math.floor((Date.now() / 86400000)) % QUIZ.length];

export default function SDashboard() {
  const { session } = useAuth();
  const [ann, setAnn] = useState<Announcement[] | null>(null);
  const [game, setGame] = useState<any>(initGame());
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    setGame(touchStreak());
    fetch(`${API_BASE}/sdsaGetData`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'announcements' }),
    })
      .then((r) => r.json())
      .then((d) => setAnn(d.ok ? d.announcements : []))
      .catch(() => setAnn([]));
  }, []);

  const level = levelOf(game.xp || 0);
  const tip = TIPS[Math.floor((Date.now() / 86400000)) % TIPS.length];
  const quizDone = game.quizDone === todayStr();
  const weeksDone = (game.weeksDone || []).length;
  const progress = Math.round((weeksDone / 26) * 100);
  const badges = [
    { icon: '🎯', name: 'First Step', got: true, hint: 'Joined the portal' },
    { icon: '🔥', name: '3-Day Streak', got: game.streak >= 3, hint: 'Login 3 days in a row' },
    { icon: '⚡', name: '7-Day Streak', got: game.streak >= 7, hint: 'Login 7 days in a row' },
    { icon: '🧭', name: 'Explorer', got: weeksDone >= 2, hint: 'Complete 2 weeks' },
    { icon: '🚀', name: 'Halfway Hero', got: weeksDone >= 13, hint: 'Complete 13 weeks' },
    { icon: '🏆', name: 'Champion', got: weeksDone >= 26, hint: 'Complete all 26 weeks' },
  ];

  function answer(i: number) {
    if (picked !== null || quizDone) return;
    setPicked(i);
    if (i === quizOfDay.a) setGame(updateGame({ xp: (game.xp || 0) + 10, quizDone: todayStr() }));
    else setGame(updateGame({ quizDone: todayStr() }));
  }

  function toggleWeek(n: number) {
    const done: number[] = game.weeksDone || [];
    const next = done.includes(n) ? done.filter((w: number) => w !== n) : [...done, n].sort((x: number, y: number) => x - y);
    const xpGain = done.includes(n) ? 0 : 15;
    setGame(updateGame({ weeksDone: next, xp: (game.xp || 0) + xpGain }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Welcome, {session?.name || 'Student'} 👋</h1>
          <p className="text-sm text-gray-500">Sathamba Digital Saksham Academy — Student Portal</p>
        </div>
        <div className="bg-accent/15 border border-accent/40 rounded-xl px-4 py-2 text-center">
          <p className="text-xs font-bold text-accent-dark uppercase tracking-wide">Level</p>
          <p className="font-extrabold text-primary">{level.icon} {level.name}</p>
        </div>
      </div>

      {/* Gamification strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center bg-gradient-to-b from-accent/10 to-white">
          <p className="text-3xl mb-1">⚡</p>
          <p className="text-2xl font-extrabold text-primary">{game.xp || 0}</p>
          <p className="text-xs text-gray-500 font-bold uppercase">XP Points</p>
        </Card>
        <Card className="text-center bg-gradient-to-b from-orange-50 to-white">
          <p className="text-3xl mb-1">🔥</p>
          <p className="text-2xl font-extrabold text-primary">{game.streak || 1} day{(game.streak || 1) === 1 ? '' : 's'}</p>
          <p className="text-xs text-gray-500 font-bold uppercase">Login Streak</p>
        </Card>
        <Card className="text-center bg-gradient-to-b from-primary-50 to-white">
          <p className="text-3xl mb-1">📅</p>
          <p className="text-2xl font-extrabold text-primary">{weeksDone}/26</p>
          <p className="text-xs text-gray-500 font-bold uppercase">Weeks Done</p>
        </Card>
        <Card className="text-center bg-gradient-to-b from-green-50 to-white">
          <p className="text-3xl mb-1">🎖️</p>
          <p className="text-2xl font-extrabold text-primary">{badges.filter((b) => b.got).length}/{badges.length}</p>
          <p className="text-xs text-gray-500 font-bold uppercase">Badges</p>
        </Card>
      </div>

      {/* 26-week journey progress */}
      <Card>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <h2 className="font-extrabold text-primary">🚀 My 26-Week Journey</h2>
          <span className="text-xs text-gray-500">Tap a week after you complete it — earn 15 XP each!</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-gray-600 mb-3">{progress}% complete {progress === 100 ? '— 🏆 You did it! Congratulations!' : '— keep going, every week counts!'}</p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => {
            const done = (game.weeksDone || []).includes(n);
            return (
              <button key={n} onClick={() => toggleWeek(n)} title={`Week ${n}`}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${done ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-500 hover:bg-accent/30'}`}>
                {done ? '✓' : n}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Daily quiz + tip */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-primary-50">
          <h2 className="font-extrabold text-primary mb-1">🧠 Daily Quiz (+10 XP)</h2>
          {quizDone && picked === null ? (
            <p className="text-sm text-gray-600">✅ Great job — come back tomorrow for the next question!</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-800 mb-3">{quizOfDay.q}</p>
              <div className="space-y-2">
                {quizOfDay.o.map((opt, i) => {
                  let cls = 'bg-white border-gray-200 hover:border-accent';
                  if (picked !== null) cls = i === quizOfDay.a ? 'bg-green-100 border-green-400 font-bold' : picked === i ? 'bg-red-100 border-red-300' : 'bg-white border-gray-200 opacity-60';
                  return (
                    <button key={i} disabled={picked !== null || quizDone} onClick={() => answer(i)}
                      className={`w-full text-left text-sm px-4 py-2.5 rounded-lg border transition ${cls}`}>
                      {String.fromCharCode(65 + i)}. {opt} {picked !== null && i === quizOfDay.a ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <p className="text-xs mt-2 font-semibold">
                  {picked === quizOfDay.a ? '🎉 Correct! +10 XP added.' : `Almost! The answer is ${String.fromCharCode(65 + quizOfDay.a)}. Try again tomorrow!`}
                </p>
              )}
            </>
          )}
        </Card>

        <Card className="bg-accent/10 border-accent/30">
          <h2 className="font-extrabold text-primary mb-1">💡 Tip of the Day</h2>
          <p className="text-base font-semibold text-gray-800">{tip}</p>
          <p className="text-xs text-gray-500 mt-3">New tip every day — small tricks make you fast!</p>
          <Link to="/curriculum" className="btn-primary inline-block mt-4 text-sm">📚 Explore This Week's Lesson →</Link>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <h2 className="font-extrabold text-primary mb-3">🎖️ My Badges</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div key={b.name} className={`text-center p-3 rounded-xl border ${b.got ? 'bg-accent/15 border-accent/40' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
              <p className="text-3xl mb-1">{b.got ? b.icon : '🔒'}</p>
              <p className="text-xs font-bold text-primary">{b.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{b.hint}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Batch info */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card><p className="text-xs font-bold uppercase text-gray-400">Batch</p><p className="font-extrabold text-primary">{session?.batch || 'To be assigned'}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Status</p><p className="font-extrabold text-primary">{session?.status || 'Active'}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Program</p><p className="font-extrabold text-primary text-sm">26-Week Digital Skills Program</p></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-extrabold text-primary mb-3">📢 Announcements</h2>
          {ann === null ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : ann.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements yet. New notices from the academy will appear here.</p>
          ) : (
            <ul className="space-y-3">
              {ann.slice(0, 3).map((a, i) => (
                <li key={i} className="border-l-4 border-accent pl-3">
                  <p className="font-bold text-gray-800 text-sm">{a.title} <span className="font-normal text-gray-400 text-xs">({a.date})</span></p>
                  <p className="text-xs text-gray-600">{a.details}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/student/announcements" className="text-xs text-accent-dark font-bold underline mt-3 inline-block">View all →</Link>
        </Card>

        <Card>
          <h2 className="font-extrabold text-primary mb-3">📚 Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/curriculum" className="text-accent-dark font-semibold underline">Full 26-Week Curriculum</Link></li>
            <li><Link to="/student/profile" className="text-accent-dark font-semibold underline">My Profile</Link></li>
            <li><Link to="/student/support" className="text-accent-dark font-semibold underline">Help &amp; Support</Link></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark font-semibold underline">WhatsApp the Academy</a></li>
          </ul>
          <p className="text-[11px] text-gray-400 mt-3">Assignments, attendance, results and certificate sections will become active once your batch starts.</p>
        </Card>
      </div>
    </div>
  );
}
