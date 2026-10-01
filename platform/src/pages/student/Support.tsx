import { Card } from '../../components/ui';
import { WHATSAPP_URL, WHATSAPP_LABEL } from '../../config';

export default function SSupport() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-primary mb-4">Help & Support</h1>
      <Card className="space-y-4">
        <div>
          <h2 className="font-bold text-gray-800 mb-1">Need help?</h2>
          <p className="text-sm text-gray-600">
            For batch details, fee information, password reset, or any question, message the academy directly.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">WhatsApp / Phone</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-accent inline-block">{WHATSAPP_LABEL}</a>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">Email</p>
          <p className="text-sm text-gray-700 font-semibold">kumarmehul48@gmail.com</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">Center</p>
          <p className="text-sm text-gray-700 font-semibold">Sathamba, Aravalli District, Gujarat</p>
        </div>
      </Card>
    </div>
  );
}
