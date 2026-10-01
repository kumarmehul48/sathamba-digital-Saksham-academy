import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';

const FALLBACK = [
  { q: 'Who can join Sathamba Digital Saksham Academy (SDSA)?', a: 'Anyone interested in digital skills - students, job-seekers, community members, and local business owners. No prior computer experience is necessary.' },
  { q: 'What is the program duration?', a: 'A planned 26-week practical digital skills learning journey structured across 7 core modules.' },
  { q: 'Will students receive a certificate?', a: 'Yes. Students who complete the course requirements, practical projects, and evaluation milestones receive an SDSA completion certificate, publicly verifiable on this website.' },
  { q: 'Do students need to bring their own computer?', a: 'No prior equipment ownership is required to inquire. Practical learning sessions and guided exercises are conducted at the academy center.' },
  { q: 'What are the session timings and batch schedules?', a: 'Batch schedules and session timings are arranged based on cohort requirements and confirmed during enrolment inquiries.' },
  { q: 'Is AI training beginner-friendly?', a: 'Yes. AI tools are introduced as practical productivity aids, with equal emphasis on verification, safety, privacy, and responsible usage.' },
  { q: 'Who manages and operates the academy?', a: 'SDSA is managed and operated by Shivansh Digital Sagacity & Alleviation under its mission of Nurturing Wisdom, Sustaining Lives.' },
];

export default function Faq() {
  const [faqs, setFaqs] = useState(FALLBACK);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    supabase.from('website_content').select('content').eq('key', 'faq.list').single()
      .then(({ data }) => {
        const items = (data?.content as any)?.items;
        if (items?.length) setFaqs(items);
      });
  }, []);

  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-1">Frequently Asked Questions</h1>
        <p className="text-accent text-sm font-semibold">Sathamba Digital Saksham Academy (SDSA)</p>
      </div>
      <div className="container-sdsa section-pad max-w-3xl">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-gray-200">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center py-4 text-left font-bold text-primary">
              {f.q}<span className="text-accent-dark text-xl">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="pb-4 text-gray-600 text-sm leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
