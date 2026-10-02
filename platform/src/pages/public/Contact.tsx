import { useState } from 'react';
import { Card, Button, Alert } from '../../components/ui';
import { asset,  API_BASE } from '../../config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', location: '', course_interest: '', message: '' });
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
        body: JSON.stringify({ ...form, form_type: 'enquiry' }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) { setErr(d.error || 'Could not send right now. Please WhatsApp us at +91 70437 95279.'); setBusy(false); return; }
      setSent(true);
    } catch {
      setErr('Network problem. Please check your internet or WhatsApp us at +91 70437 95279.');
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-1">Contact Us</h1>
        <p className="text-accent text-sm font-semibold">Sathamba Digital Saksham Academy (SDSA) | Get in Touch</p>
      </div>
      <div className="container-sdsa section-pad grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="font-extrabold text-primary mb-4">Send an Enquiry</h2>
          {sent ? <Alert tone="success">Thank you! Your enquiry has reached us. We will contact you soon.</Alert> : (
            <form onSubmit={submit} className="space-y-3">
              {err && <Alert tone="error">{err}</Alert>}
              <div><label className="label-sdsa">Name *</label><input required disabled={busy} className="input-sdsa" value={form.name} onChange={set('name')} /></div>
              <div><label className="label-sdsa">Mobile *</label><input required disabled={busy} className="input-sdsa" value={form.mobile} onChange={set('mobile')} /></div>
              <div><label className="label-sdsa">Email</label><input type="email" disabled={busy} className="input-sdsa" value={form.email} onChange={set('email')} /></div>
              <div><label className="label-sdsa">Village / Town</label><input disabled={busy} className="input-sdsa" value={form.location} onChange={set('location')} /></div>
              <div><label className="label-sdsa">Program Interest</label><input disabled={busy} className="input-sdsa" placeholder="26-Week Planned Digital Skills Program" value={form.course_interest} onChange={set('course_interest')} /></div>
              <div><label className="label-sdsa">Message</label><textarea rows={3} disabled={busy} className="input-sdsa" value={form.message} onChange={set('message')} /></div>
              <Button type="submit" disabled={busy} className="w-full">{busy ? 'Sending…' : 'Send Enquiry'}</Button>
            </form>
          )}
        </Card>
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-primary mb-2">Location</h3>
            <p className="text-gray-600 text-sm">Sathamba, Aravalli District, Gujarat<br />(Detailed center location provided during enrolment inquiry)</p>
          </Card>
          <Card>
            <h3 className="font-bold text-primary mb-2">WhatsApp / Phone</h3>
            <p className="text-gray-600 text-sm">+91 70437 95279</p>
            <a href="https://wa.me/917043795279" target="_blank" rel="noreferrer" className="btn-accent inline-block mt-3 text-sm">Chat on WhatsApp</a>
          </Card>
          <Card>
            <h3 className="font-bold text-primary mb-2">Email</h3>
            <p className="text-gray-600 text-sm">kumarmehul48@gmail.com</p>
          </Card>
          <Card>
            <h3 className="font-bold text-primary mb-2">Batch Schedules & Session Details</h3>
            <p className="text-gray-600 text-sm">Session schedules and batch timings are arranged per cohort requirements and communicated during enrolment inquiries.</p>
          </Card>
          <Card className="bg-primary-50">
            <div className="flex items-center gap-3">
              <img src={asset("sdsa-trust-logo.webp")} alt="Trust logo" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-primary">Managing Trust</h3>
                <p className="text-gray-800 text-sm font-semibold">Shivansh Digital Sagacity & Alleviation</p>
                <p className="text-accent-dark text-xs italic">Nurturing Wisdom, Sustaining Lives</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
