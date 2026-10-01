import { useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Alert } from '../../components/ui';

export default function Apply() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', location: '', course_interest: '26-Week Planned Digital Skills Program' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    const { error } = await supabase.from('admissions').insert([form]);
    if (error) { setErr('Could not submit right now. Please contact us via WhatsApp +91 70437 95279.'); return; }
    setSent(true);
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
              <a className="btn-accent inline-block" href="https://wa.me/917043795279" target="_blank" rel="noreferrer">Connect on WhatsApp</a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              {err && <Alert tone="error">{err}</Alert>}
              <h2 className="font-extrabold text-primary">Inquiry & Application Form</h2>
              <p className="text-xs text-gray-500 mb-2">Submit your details to express interest in the planned 26-week digital skills program.</p>
              <div><label className="label-sdsa">Full Name *</label><input required className="input-sdsa" value={form.name} onChange={set('name')} /></div>
              <div><label className="label-sdsa">Mobile Number *</label><input required className="input-sdsa" value={form.mobile} onChange={set('mobile')} /></div>
              <div><label className="label-sdsa">Email Address</label><input type="email" className="input-sdsa" value={form.email} onChange={set('email')} /></div>
              <div><label className="label-sdsa">Village / Town *</label><input required className="input-sdsa" value={form.location} onChange={set('location')} /></div>
              <div>
                <label className="label-sdsa">Program</label>
                <select className="input-sdsa" value={form.course_interest} onChange={set('course_interest')}>
                  <option value="26-Week Planned Digital Skills Program">26-Week Planned Digital Skills Program</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Submit Expression of Interest</Button>
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
