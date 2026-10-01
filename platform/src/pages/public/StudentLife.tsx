import { Card } from '../../components/ui';
export default function StudentLife() {
  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-2">Student Life at SDSA</h1>
        <p className="text-accent">Learn • Practice • Apply • Grow</p>
      </div>
      <div className="container-sdsa section-pad grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          ['One Computer Per Student', 'No sharing. Every student practices on their own machine every class.'],
          ['Small Batches', 'Personal attention. Trainers know every student by name and pace.'],
          ['Weekly Practical Activities', 'Every week ends with hands-on tasks - documents, sheets, slides, AI tools.'],
          ['Projects That Matter', 'Students build projects for real life: budgets, catalogues, event plans.'],
          ['Safe & Friendly Space', 'Especially welcoming to first-time computer users and women learners.'],
          ['Certificates & Portfolio', 'Leave with proof of your skills, not just a promise.'],
        ].map(([t, d]) => (
          <Card key={t} className="border-t-4 border-t-accent-dark">
            <h3 className="font-bold text-primary mb-1.5">{t}</h3>
            <p className="text-sm text-gray-600">{d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
