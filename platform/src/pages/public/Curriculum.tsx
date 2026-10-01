import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MODULES, fetchWeeks, WeekData } from '../../data/curriculum';
import { Card, Badge } from '../../components/ui';

export default function Curriculum() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  useEffect(() => { fetchWeeks().then(setWeeks); }, []);

  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-2">26-Week Planned Curriculum</h1>
        <p className="text-white/90 text-sm font-semibold mb-1">Sathamba Digital Saksham Academy (SDSA) | સાઠંબા ડિજિટલ સક્ષમ એકેડમી</p>
        <p className="text-accent text-xs font-semibold">Learn • Practice • Apply • Grow | Every week planned step by step</p>
      </div>
      <div className="container-sdsa section-pad space-y-10">
        {MODULES.map((m) => (
          <div key={m.module}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-extrabold text-primary">Module {m.module}: {m.title}</h2>
              <Badge tone="accent">Weeks {m.start}-{m.end}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeks.filter((w) => w.module === m.module).map((w) => (
                <Link key={w.week} to={`/curriculum/week/${w.week}`}>
                  <Card className="h-full hover:shadow-md transition border-b-4 border-b-accent-dark">
                    <Badge tone="primary">Week {String(w.week).padStart(2, '0')}</Badge>
                    <h3 className="font-bold text-primary mt-2 mb-1.5">{w.title}</h3>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      {w.topics.slice(0, 3).map((t) => <li key={t}>• {t}</li>)}
                      {w.topics.length > 3 && <li className="text-gray-400">+{w.topics.length - 3} more</li>}
                    </ul>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
