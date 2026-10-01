import { Card, Badge, Alert } from '../../components/ui';

export default function Settings() {
  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-primary">Settings</h1>
      <Alert tone="info">Academy profile, contact info and policies are managed under <b>Website Content</b> (no code changes needed). Security settings live in your Supabase dashboard.</Alert>
      <Card>
        <h3 className="font-bold text-primary mb-2">Security Checklist</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✓ Row Level Security enabled on all tables (students never see other students' data)</li>
          <li>✓ Role-based routing - students cannot open /admin routes</li>
          <li>✓ Password hashing & session management handled by Supabase Auth</li>
          <li>✓ File uploads restricted (type + size) to authorized buckets</li>
          <li>✓ Secrets only in .env.local - never in frontend code</li>
          <li>◎ Recommended: enable Supabase automated daily backups (paid tier) before first batch starts</li>
          <li>◎ Recommended: MFA on the admin account</li>
        </ul>
      </Card>
      <Card>
        <h3 className="font-bold text-primary mb-2">Academy Info</h3>
        <p className="text-sm text-gray-600">Sathamba Digital Saksham Academy (SDSA)<br />Sathamba, Aravalli District, Gujarat<br />WhatsApp: +91 70437 95279 · Email: kumarmehul48@gmail.com<br />Status: <Badge tone="accent">Setting up - pre-launch</Badge></p>
      </Card>
    </div>
  );
}
