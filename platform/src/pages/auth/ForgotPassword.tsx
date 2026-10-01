import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { WHATSAPP_URL, WHATSAPP_LABEL } from '../../config';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-primary grid place-items-center p-4">
      <Card className="w-full max-w-sm text-center">
        <h1 className="text-lg font-extrabold text-primary mb-2">Forgot Password?</h1>
        <p className="text-sm text-gray-600 mb-4">
          Passwords are managed by the academy. Please contact us and we will reset it for you.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-accent inline-block mb-3">
          WhatsApp: {WHATSAPP_LABEL}
        </a>
        <p className="text-xs text-gray-400">
          <Link to="/login" className="underline">Back to login</Link>
        </p>
      </Card>
    </div>
  );
}
