import { Link } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import { WHATSAPP_URL, WHATSAPP_LABEL } from '../../config';

export default function ComingSoon() {
  return (
    <div className="max-w-xl">
      <Card className="text-center py-10">
        <div className="text-4xl mb-3">🚀</div>
        <h1 className="text-xl font-extrabold text-primary mb-2">Opening Soon</h1>
        <p className="text-sm text-gray-600 mb-5">
          This section becomes active once your batch starts. Your assignments, attendance, results and
          certificates will appear here during the program.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/curriculum" className="btn-primary inline-block">View Full Curriculum</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button className="btn-accent">WhatsApp: {WHATSAPP_LABEL}</Button></a>
        </div>
      </Card>
    </div>
  );
}
