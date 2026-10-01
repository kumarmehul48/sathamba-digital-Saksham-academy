import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Card, Badge, Button, Empty, Modal, Alert } from '../../components/ui';
import { fmtDate } from '../../lib/utils';
import type { Assignment, Submission } from '../../types/database';

export default function Assignments() {
  const { studentRecordId } = useAuth();
  const [items, setItems] = useState<{ assignment: Assignment; submission: Submission | null }[]>([]);
  const [open, setOpen] = useState<Assignment | null>(null);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const load = () => {
    supabase.from('assignments').select('*, weeks(week_number, title)').order('created_at')
      .then(async ({ data: asg }) => {
        if (!studentRecordId) return;
        const { data: subs } = await supabase.from('submissions').select('*').eq('student_id', studentRecordId);
        const map = new Map((subs ?? []).map((s: any) => [s.assignment_id, s]));
        setItems((asg ?? []).map((a: any) => ({ assignment: a as Assignment, submission: (map.get(a.id) as Submission) ?? null })));
      });
  };
  useEffect(load, [studentRecordId]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!open || !studentRecordId) return; setMsg('');
    let fileUrl: string | null = null;
    if (file) {
      const path = `${(await supabase.auth.getUser()).data.user!.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('submissions').upload(path, file);
      if (error) { setMsg('File upload failed: ' + error.message); return; }
      fileUrl = path;
    }
    const { error } = await supabase.from('submissions').upsert({
      assignment_id: open.id, student_id: studentRecordId, content, file_url: fileUrl, status: 'submitted',
    }, { onConflict: 'assignment_id,student_id' });
    setMsg(error ? 'Submit failed.' : 'Submitted! Your trainer will review it.');
    if (!error) { setOpen(null); load(); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">My Assignments</h1>
      {items.length === 0 ? <Empty text="No assignments yet - they will appear week by week." /> :
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(({ assignment: a, submission: s }) => (
            <Card key={a.id}>
              <div className="flex justify-between"><Badge tone="primary">Week {String(a.weeks?.week_number ?? 0).padStart(2, '0')}</Badge>
                <Badge tone={!s ? 'gray' : s.status === 'graded' ? 'success' : 'accent'}>{!s ? 'Not submitted' : s.status === 'graded' ? `Graded: ${s.score}/${a.max_score}` : 'Submitted'}</Badge></div>
              <h3 className="font-bold text-primary mt-2">{a.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{a.description?.slice(0, 100)}</p>
              <p className="text-xs text-gray-400 mt-1">Due: {fmtDate(a.due_date)}</p>
              {s?.feedback && <p className="text-xs bg-green-50 text-green-800 p-2 rounded mt-2">Trainer: {s.feedback}</p>}
              {!s && <button onClick={() => { setOpen(a); setContent(''); setFile(null); setMsg(''); }} className="btn-primary !text-xs !px-3 !py-1.5 mt-3">Submit</button>}
            </Card>
          ))}
        </div>}
      <Modal open={!!open} title={open?.title ?? ''} onClose={() => setOpen(null)}>
        <form onSubmit={submit} className="space-y-3">
          {msg && <Alert tone={msg.startsWith('Sub') ? 'success' : 'error'}>{msg}</Alert>}
          <p className="text-sm text-gray-600">{open?.description}</p>
          <div><label className="label-sdsa">Your answer / notes</label><textarea rows={3} className="input-sdsa" value={content} onChange={(e) => setContent(e.target.value)} /></div>
          <div><label className="label-sdsa">Attach file (max 10 MB)</label><input type="file" className="input-sdsa" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <Button type="submit" className="w-full">Submit Assignment</Button>
        </form>
      </Modal>
    </div>
  );
}
