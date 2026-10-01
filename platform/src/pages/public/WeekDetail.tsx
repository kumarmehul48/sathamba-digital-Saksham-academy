import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WEEKS, MODULES, WeekData } from '../../data/curriculum';
import { Card, Badge } from '../../components/ui';

export default function WeekDetail() {
  const { weekNumber } = useParams();
  const [week, setWeek] = useState<WeekData | null>(null);
  useEffect(() => {
    const n = parseInt(weekNumber ?? '1', 10);
    if (n >= 1 && n <= 26) setWeek(WEEKS[n - 1]);
  }, [weekNumber]);
  if (!week) return <div className="container-sdsa py-20 text-center text-gray-500">Week not found. <Link to="/curriculum" className="text-primary font-semibold">Back to curriculum</Link></div>;
  const mod = MODULES.find((m) => m.module === week.module)!;
  const prev = week.week > 1 ? week.week - 1 : null;
  const next = week.week < 26 ? week.week + 1 : null;
  return (
    <div>
      <div className="bg-primary text-white py-12">
        <div className="container-sdsa">
          <Link to="/curriculum" className="text-accent text-sm hover:underline">← Back to Curriculum</Link>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="bg-accent-dark text-primary-dark font-extrabold px-4 py-2 rounded-lg">Week {String(week.week).padStart(2, '0')}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{week.title}</h1>
          </div>
          <p className="text-gray-200 mt-2">Module {mod.module}: {mod.title} (Weeks {mod.start}–{mod.end})</p>
        </div>
      </div>
      <div className="container-sdsa section-pad grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-extrabold text-primary mb-3">Topics Covered</h2>
            <ul className="space-y-2">
              {week.topics.map((t, i) => (
                <li key={t} className="flex gap-3 text-gray-700">
                  <span className="w-6 h-6 shrink-0 grid place-items-center rounded-full bg-primary text-white text-xs font-bold">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-extrabold text-primary mb-3">Related Workbook & Assignments</h2>
            <p className="text-sm text-gray-600 mb-3">Enrolled students get the full workbook for this week inside the portal: explanation, examples, practice exercises and self-check. Trainer assignments with due dates and feedback are also linked to this week.</p>
            <Link to="/login" className="btn-primary text-sm">Student Login to Access</Link>
          </Card>
          <div className="flex justify-between">
            {prev ? <Link to={`/curriculum/week/${prev}`} className="btn-outline text-sm">← Week {String(prev).padStart(2, '0')}</Link> : <span />}
            {next && <Link to={`/curriculum/week/${next}`} className="btn-outline text-sm">Week {String(next).padStart(2, '0')} →</Link>}
          </div>
        </div>
        <div className="space-y-4">
          <Card><Badge tone="accent">Placeholder</Badge><h3 className="font-bold text-primary mt-2 mb-1">Illustration</h3><p className="text-xs text-gray-500">Educational illustration for this week will appear here.</p></Card>
          <Card><Badge tone="accent">Placeholder</Badge><h3 className="font-bold text-primary mt-2 mb-1">Video Lesson</h3><p className="text-xs text-gray-500">Video lesson will be embedded here.</p></Card>
          <Card><Badge tone="accent">Placeholder</Badge><h3 className="font-bold text-primary mt-2 mb-1">Downloads</h3><p className="text-xs text-gray-500">Practice files and resources will be listed here.</p></Card>
        </div>
      </div>
    </div>
  );
}
