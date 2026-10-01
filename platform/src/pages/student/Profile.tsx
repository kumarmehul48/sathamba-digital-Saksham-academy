import { Card } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { WHATSAPP_URL } from '../../config';

export default function SProfile() {
  const { session } = useAuth();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-primary mb-4">My Profile</h1>
      <Card className="space-y-3">
        <div className="flex items-center gap-4">
          <img src="sdsa-badge.webp" alt="SDSA" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="text-lg font-extrabold text-primary">{session?.name}</p>
            <p className="text-xs text-gray-500">Student — Sathamba Digital Saksham Academy</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 border-t pt-3">
          <div><p className="text-xs font-bold uppercase text-gray-400">Batch</p><p className="font-bold text-gray-800">{session?.batch || 'To be assigned'}</p></div>
          <div><p className="text-xs font-bold uppercase text-gray-400">Status</p><p className="font-bold text-gray-800">{session?.status || 'Active'}</p></div>
          <div><p className="text-xs font-bold uppercase text-gray-400">Program</p><p className="font-bold text-gray-800 text-sm">26-Week Digital Skills Program</p></div>
          <div><p className="text-xs font-bold uppercase text-gray-400">Academy</p><p className="font-bold text-gray-800 text-sm">Sathamba, Aravalli</p></div>
        </div>
        <p className="text-xs text-gray-400 border-t pt-3">
          Need a correction in your details? <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-accent-dark underline">WhatsApp the academy</a>.
        </p>
      </Card>
    </div>
  );
}
