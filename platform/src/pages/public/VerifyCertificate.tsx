import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import { Card, Button, Badge, Alert } from '../../components/ui';

interface Verified { certificate_number: string; student_name: string; course_title: string; issue_date: string; status: string; }

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [id, setId] = useState(certificateId ?? '');
  const [result, setResult] = useState<Verified | null>(null);
  const [checked, setChecked] = useState(false);
  async function check(e?: React.FormEvent) {
    e?.preventDefault(); setChecked(false); setResult(null);
    const num = id.trim().toUpperCase();
    const { data } = await supabase.from('certificate_verification').select('*').eq('certificate_number', num).maybeSingle();
    setResult((data as Verified) ?? null); setChecked(true);
  }
  useEffect(() => { if (certificateId) check(); }, [certificateId]);
  return (
    <div>
      <div className="bg-primary text-white py-14 text-center"><h1 className="text-3xl font-extrabold">Verify a Certificate</h1><p className="text-accent">Enter the certificate number printed on the certificate</p></div>
      <div className="container-sdsa section-pad max-w-xl">
        <Card>
          <form onSubmit={check} className="flex gap-2">
            <input className="input-sdsa" placeholder="e.g. SDSA-CERT-2026-0001" value={id} onChange={(e) => setId(e.target.value)} />
            <Button type="submit">Verify</Button>
          </form>
          {checked && (
            <div className="mt-6">
              {result ? (
                <Alert tone="success">
                  <div className="flex items-start justify-between gap-2 flex-wrap"><span className="font-extrabold">✓ Valid Certificate</span><Badge tone="success">{result.status}</Badge></div>
                  <div className="mt-3 text-sm space-y-1">
                    <p><b>Certificate No:</b> {result.certificate_number}</p>
                    <p><b>Student:</b> {result.student_name}</p>
                    <p><b>Course:</b> {result.course_title}</p>
                    <p><b>Issued:</b> {result.issue_date}</p>
                  </div>
                </Alert>
              ) : <Alert tone="error">No certificate found with this number. Please check the number or <Link to="/contact" className="underline font-semibold">contact us</Link>.</Alert>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
