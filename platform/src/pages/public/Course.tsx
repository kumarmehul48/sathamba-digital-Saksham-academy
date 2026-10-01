import { Link } from 'react-router-dom';
import { MODULES, WEEKS } from '../../data/curriculum';
import { Card, Badge } from '../../components/ui';

export default function Course() {
  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-2">26-Week Planned Digital Skills Program</h1>
        <p className="text-white/90 text-sm font-semibold mb-1">Sathamba Digital Saksham Academy (SDSA) | સાઠંબા ડિજિટલ સક્ષમ એકેડમી</p>
        <p className="text-accent text-xs font-semibold">Digital Literacy → Computer Fundamentals → Office → Cloud → AI Skills → Projects → Portfolio</p>
      </div>
      <div className="container-sdsa section-pad space-y-12">
        <div className="grid sm:grid-cols-4 gap-4 text-center">
          {[
            ['26', 'Planned Weeks'],
            ['7', 'Core Modules'],
            ['100%', 'Practical Orientation'],
            ['Hands-on', 'Guided Learning'],
          ].map(([v, l]) => (
            <Card key={l}><p className="text-3xl font-extrabold text-primary">{v}</p><p className="text-sm text-gray-500">{l}</p></Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="h-section">Program Overview</h2>
            <p className="text-gray-600">
              A structured 26-week practical curriculum designed to guide learners step by step from basic digital awareness to practical competence. Each week focuses on specific topics, hands-on tasks, workbooks, and practical assignments to ensure skill growth over time.
            </p>
          </div>
          <div>
            <h2 className="h-section">Evaluation & Completion</h2>
            <ul className="text-gray-600 list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Modular practical exercises and milestone reviews throughout the 26 weeks</li>
              <li>Trainer feedback on practical assignments and student project work</li>
              <li>Compilation of completed work into a student digital portfolio</li>
              <li>Issuance of an SDSA completion certificate, publicly verifiable online</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="h-section">The 7 Modules</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {MODULES.map((m) => (
              <Card key={m.module}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-primary">Module {m.module}: {m.title}</h3>
                  <Badge tone="primary">W{String(m.start).padStart(2, '0')}-{String(m.end).padStart(2, '0')}</Badge>
                </div>
                <p className="text-sm text-gray-600">{WEEKS.filter((w) => w.module === m.module).map((w) => w.title).join(' · ')}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/curriculum" className="btn-primary">View Full Week-by-Week Curriculum</Link>
        </div>
      </div>
    </div>
  );
}
