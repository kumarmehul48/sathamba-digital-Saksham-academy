import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Alert, Table, Td } from '../../components/ui';

// Website content management: edit homepage/about/contact/faq content without code changes.
export default function Content() {
  const [items, setItems] = useState<{ id: string; key: string; content: any }[]>([]);
  const [edit, setEdit] = useState<{ id: string; key: string; content: any } | null>(null);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const load = () => supabase.from('website_content').select('*').then(({ data }) => setItems((data ?? []) as any[]));
  useEffect(() => { load(); }, []);
  async function save() {
    if (!edit) return;
    let content = edit.content;
    try { content = JSON.parse(text); } catch { setMsg('Invalid JSON - check quotes/braces.'); return; }
    const { error } = await supabase.from('website_content').update({ content }).eq('id', edit.id);
    setMsg(error ? error.message : 'Content updated - live on the website.');
    if (!error) { setEdit(null); load(); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-primary">Website Content</h1>
      {msg && <Alert tone={msg.includes('updated') ? 'success' : 'error'}>{msg}</Alert>}
      <Card>
        <Table head={['Section (key)', 'Updated', 'Action']}>
          {items.map((c) => (
            <tr key={c.id}>
              <Td><b>{c.key}</b></Td>
              <Td className="text-xs text-gray-400">{c.content ? 'JSON' : '—'}</Td>
              <Td><button onClick={() => { setEdit(c); setText(JSON.stringify(c.content, null, 2)); }} className="text-xs font-bold text-primary hover:underline">Edit</button></Td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">Run supabase/seed.sql to create default content keys.</p>}
      </Card>
      {edit && (
        <Card>
          <h3 className="font-bold text-primary mb-2">Edit: {edit.key}</h3>
          <textarea rows={10} className="input-sdsa font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex gap-2 mt-3"><Button onClick={save}>Save Content</Button><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div>
        </Card>
      )}
    </div>
  );
}
