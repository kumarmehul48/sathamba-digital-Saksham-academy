import { useState } from 'react';
import { Card, Button, Alert } from '../../components/ui';
import { API_BASE, WHATSAPP_URL } from '../../config';

export default function Apply() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', location: '', course_interest: '26-Week Planned Digital Skills Program' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/sdsaSubmitLead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, form_type: 'admission' }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) { setErr(d.error || 'Could not submit right now. Please contact us on WhatsApp.'); setBusy(false); return; }
      setSent(true);
    } catch {
      setErr('Network problem. Please check your internet or contact us on WhatsApp.');
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-1">Inquire / Apply for Enrolment</h1>
        <p className="text-accent text-sm font-semibold">Sathamba Digital Saksham Academy (SDSA) | Planned 26-Week Program</p>
      </div>
      <div className="container-sdsa section-pad max-w-2xl">
        <Card>
          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Inquiry Received!</h2>
              <p className="text-gray-600 text-sm mb-4">
                Thank you, {form.name}. Your details have been submitted to our administration team. We will review your inquiry and share details regarding batch schedules, prerequisites, and enrolment steps via WhatsApp or Email.
              </p>
              <a className="btn-accent inline-block" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Connect on WhatsApp</a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              {err && <Alert tone="error">{err}</Alert>}
              <h2 className="font-extrabold text-primary">Inquiry & Application Form</h2>
              <p className="text-xs text-gray-500 mb-2">Submit your details to express interest in the planned 26-week digital skills program.</p>
              <div><label className="label-sdsa">Full Name *</label><input required disabled={busy} className="input-sdsa" value={form.name} onChange={set('name')} /></div>
              <div><label className="label-sdsa">Mobile Number *</label><input required disabled={busy} className="input-sdsa" value={form.mobile} onChange={set('mobile')} /></div>
              <div><label className="label-sdsa">Email Address</label><input type="email" disabled={busy} className="input-sdsa" value={form.email} onChange={set('email')} /></div>
              <div><label className="label-sdsa">Village / Town *</label><input required disabled={busy} className="input-sdsa" value={form.location} onChange={set('location')} /></div>
              <div>
                <label className="label-sdsa">Program</label>
                <select className="input-sdsa" value={form.course_interest} onChange={set('course_interest')}>
                  <option value="26-Week Planned Digital Skills Program">26-Week Planned Digital Skills Program</option>
                </select>
              </div>
              <Button type="submit" disabled={busy} className="w-full">{busy ? 'Submitting…' : 'Submit Expression of Interest'}</Button>
              <p className="text-xs text-gray-400">
                By submitting this form, you acknowledge our draft <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>. Applicants under 18 require parent or guardian consent.
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
