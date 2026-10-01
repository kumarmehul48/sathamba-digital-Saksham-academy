import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Button, Alert } from '../../components/ui';
import type { Student } from '../../types/database';

export default function Profile() {
  const { profile } = useAuth();
  const [me, setMe] = useState<Student | null>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!profile) return;
    supabase.from('students').select('*, batches(*)').eq('profile_id', profile.id).single()
      .then(({ data }) => setMe(data as Student));
  }, [profile]);
  async function save(fields: Record<string, string>) {
    const { error } = await supabase.from('profiles').update(fields).eq('id', profile!.id);
    setMsg(error ? 'Could not save.' : 'Profile updated.');
  }
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-primary">My Profile</h1>
      {msg && <Alert tone="success">{msg}</Alert>}
      <Card>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Row k="Name" v={profile?.full_name} />
          <Row k="Student ID" v={me?.student_id} />
          <Row k="Course" v="26-Week Digital Skills Program" />
          <Row k="Batch" v={me?.batches?.name ?? 'To be assigned'} />
          <Row k="Admission Date" v={me?.admission_date} />
          <Row k="Role" v={profile?.role} />
        </div>
      </Card>
      <Card>
        <h3 className="font-bold text-primary mb-3">Contact Details (editable)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label-sdsa">Mobile</label><input className="input-sdsa" defaultValue={profile?.mobile ?? ''} onBlur={(e) => save({ mobile: e.target.value })} /></div>
          <div><label className="label-sdsa">Email (login)</label><input className="input-sdsa" value={profile?.email ?? ''} disabled /></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Name, batch and course changes are done by the admin office. For corrections, raise a <a href="/student/support" className="underline">support ticket</a>.</p>
      </Card>
    </div>
  );
}
function Row({ k, v }: { k: string; v?: string | null }) {
  return <div><p className="text-xs text-gray-400 uppercase font-bold">{k}</p><p className="font-semibold">{v ?? '—'}</p></div>;
}
