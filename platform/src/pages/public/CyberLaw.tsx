import { useState } from 'react';
import { cyberLawLesson1 } from '../../data/cyberLawLesson1';

/* Cyber Law Course (10 sessions, EN/GU) — cloned from kumarmehul48/cyber-law-course
   and integrated into the SDSA website. Lesson 1 ships with full content;
   sessions 2–10 are curriculum outlines. */

const sessions = [
  { en: 'Introduction to Cyber Law', gu: 'સાયબર કાયદાનો પરિચય',
    topics: ['Meaning, importance and scope of Cyber Law', 'Evolution of Cyber Law in India', 'International perspectives'] },
  { en: 'Information Technology Act, 2000', gu: 'માહિતી ટેકનોલોજી અધિનિયમ, 2000',
    topics: ['Objectives and key provisions of the IT Act', 'Important amendments', 'Practical examples and case studies'] },
  { en: 'Cyber Crimes and Legal Provisions', gu: 'સાયબર ગુનાઓ અને કાનૂની જોગવાઈઓ',
    topics: ['Hacking, phishing and identity theft', 'Relevant legal provisions and penalties', 'Cybercrime investigation and enforcement'] },
  { en: 'Data Protection and Privacy', gu: 'ડેટા સુરક્ષા અને ગોપનીયતા',
    topics: ['Indian data protection laws', 'Privacy rights and responsibilities', 'International privacy standards'] },
  { en: 'Cybersecurity and Digital Safety', gu: 'સાયબર સુરક્ષા અને ડિજિટલ સલામતી',
    topics: ['Cybersecurity policies and frameworks', 'Role of CERT-In', 'Practical cybersecurity best practices'] },
  { en: 'E-commerce and Digital Contracts', gu: 'ઈ-કોમર્સ અને ડિજિટલ કરારો',
    topics: ['Electronic records and digital signatures', 'E-commerce rules and online transactions', 'Online dispute resolution'] },
  { en: 'Intellectual Property in Cyberspace', gu: 'સાયબર જગતમાં બૌદ્ધિક સંપદા',
    topics: ['Copyright, trademarks and patents', 'Domain name disputes', 'Digital rights management'] },
  { en: 'Cybercrime Complaints and Bank Account Freezing', gu: 'સાયબર ગુનાની ફરિયાદ અને બેંક ખાતા ફ્રીઝ',
    topics: ['How to file a cybercrime complaint', 'Drafting complaints and preserving evidence', 'Police, cyber cell and bank procedures', 'Representations and remedies for frozen accounts'] },
  { en: 'Emerging Technologies and Legal Challenges', gu: 'નવી ટેકનોલોજી અને કાનૂની પડકારો',
    topics: ['Artificial Intelligence and legal issues', 'Blockchain and cryptocurrency', 'Internet of Things (IoT)'] },
  { en: 'Revision, Discussion and Career Guidance', gu: 'પુનરાવર્તન, ચર્ચા અને કારકિર્દી માર્ગદર્શન',
    topics: ['Course revision and doubt-solving', 'Practical insights and discussion', 'Career guidance and certificate instructions'] },
];

const T = {
  badge: ['New Course — Bilingual (EN + ગુજરાતી)', 'નવો કોર્સ — દ્વિભાષી (EN + ગુજરાતી)'],
  h1: ['Cyber Law Course — understand the law of the digital world', 'સાયબર કાયદો કોર્સ — ડિજિટલ દુનિયાનો કાયદો સમજો'],
  lead: ['A 10-session practical course on Indian Cyber Law, in simple English and Gujarati — for students, professionals, shop owners and anyone who lives online.',
    'ભારતીય સાયબર કાયદા પર 10 સત્રનો વ્યવહારુ કોર્સ, સરળ અંગ્રેજી અને ગુજરાતીમાં — વિદ્યાર્થીઓ, પ્રોફેશનલો, દુકાનદારો અને ઓનલાઇન જીવનારા દરેક માટે.'],
  cta1: ['Book My Seat →', 'મારી સીટ બુક કરો →'],
  cta2: ['See the 10 Sessions', '10 સત્ર જુઓ'],
  currKicker: ['The Curriculum', 'અભ્યાસક્રમ'],
  currTitle: ['Cyber Law, step by step — 10 sessions', 'સાયબર કાયદો, પગલું દર પગલું — 10 સત્ર'],
  topicsLabel: ['Topics covered', 'આ સત્રમાં શીખશો'],
  lesson1Btn: ['Read Session 1 (full lesson)', 'સત્ર 1 વાંચો (સંપૂર્ણ પાઠ)'],
  objectives: ['Learning objectives', 'અભ્યાસના હેતુઓ'],
  activity: ['Activity — think, then reveal the answer', 'પ્રવૃત્તિ — વિચારો, પછી જવાબ જુઓ'],
  showAnswer: ['Show answer', 'જવાબ જુઓ'],
  hideAnswer: ['Hide answer', 'જવાબ છુપાવો'],
  refs: ['References', 'સંદર્ભો'],
  whoTitle: ['Who is this course for', 'આ કોર્સ કોના માટે છે'],
  who1: ['Students — law, commerce and IT students building an edge', 'વિદ્યાર્થીઓ — કાયદો, કોમર્સ અને IT વિદ્યાર્થીઓ'],
  who2: ['Shop and business owners — UPI fraud, online scams, customer data', 'દુકાન અને ધંધા માલિકો — UPI ફ્રોડ, ઓનલાઇન સ્કેમ, ગ્રાહક ડેટા'],
  who3: ['Job-seekers — cyber law skills stand out in interviews', 'નોકરી શોધનારા — ઇન્ટરવ્યૂમાં સાયબર કાયદાનું જ્ઞાન અલગ ઓળખ આપે'],
  who4: ['Everyone — whose bank account or WhatsApp was ever misused', 'દરેક — જેનું બેંક ખાતું કે WhatsApp ક્યારેય ખોટું વપરાયું હોય'],
  moreComing: ['Full lessons for sessions 2–10 are added as the course grows.', 'સત્ર 2–10 ના સંપૂર્ણ પાઠ કોર્સ આગળ વધે તેમ ઉમેરાશે.'],
};

export default function CyberLaw() {
  const [gu, setGu] = useState(typeof window !== 'undefined' && localStorage.getItem('sdsa_lang') === 'gu');
  const [open, setOpen] = useState<number | null>(0);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [showAns, setShowAns] = useState(false);
  const t = (k: keyof typeof T) => T[k][gu ? 1 : 0];
  const setLang = (g: boolean) => { setGu(g); try { localStorage.setItem('sdsa_lang', g ? 'gu' : 'en'); } catch { /* noop */ } };

  return (
    <div className="bg-primary-50">
      <div className="fixed top-2 right-2 z-50 flex bg-white border border-gray-200 rounded-full overflow-hidden shadow-md">
        <button onClick={() => setLang(false)} className={`px-4 py-2 text-xs font-bold ${!gu ? 'bg-primary text-white' : 'text-primary'}`}>English</button>
        <button onClick={() => setLang(true)} className={`px-4 py-2 text-xs font-bold ${gu ? 'bg-primary text-white' : 'text-primary'}`}>ગુજરાતી</button>
      </div>

      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-16 sm:py-20 px-4 text-center">
        <span className="inline-block bg-accent/20 border border-accent/50 text-accent px-4 py-1.5 rounded-full text-xs font-semibold mb-6">⚖ {t('badge')}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold max-w-3xl mx-auto leading-tight mb-5">{t('h1')}</h1>
        <p className="max-w-2xl mx-auto text-white/90 text-sm sm:text-base mb-8">{t('lead')}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="https://wa.me/917043795279?text=Hi%2C%20I%20want%20to%20join%20the%20Cyber%20Law%20Course" target="_blank" rel="noreferrer" className="bg-accent text-primary-dark font-bold px-7 py-3.5 rounded-xl hover:bg-accent-light transition">{t('cta1')}</a>
          <a href="#curriculum" className="border-2 border-white/50 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition">{t('cta2')}</a>
        </div>
      </section>

      <section id="curriculum" className="py-16 px-4">
        <div className="container-sdsa max-w-3xl">
          <p className="text-accent-dark font-bold text-xs uppercase tracking-widest mb-2">{t('currKicker')}</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-8">{t('currTitle')}</h2>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                  <span className="text-accent-dark font-extrabold text-lg">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-bold text-primary text-sm sm:text-base">{gu ? s.gu : s.en}</span>
                  <span className="text-primary font-bold text-xl">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('topicsLabel')}</h3>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {s.topics.map((tp, j) => <li key={j} className="pl-5 relative">{tp}<span className="absolute left-0 text-accent-dark">✓</span></li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">{t('moreComing')}</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container-sdsa max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-8">{t('whoTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {['who1', 'who2', 'who3', 'who4'].map((k, i) => (
              <div key={i} className="bg-primary-50 rounded-xl border border-gray-100 p-5 text-sm text-gray-700">{t(k as keyof typeof T)}</div>
            ))}
          </div>
          <button onClick={() => setLessonOpen(!lessonOpen)} className="mt-10 bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary-dark transition">
            {lessonOpen ? '✕' : '📖'} {t('lesson1Btn')}
          </button>

          {lessonOpen && (() => {
            const L = cyberLawLesson1[gu ? 'gu' : 'en'];
            return (
              <article className="mt-6 bg-primary-50 rounded-2xl border border-gray-100 p-6 sm:p-8">
                <p className="text-accent-dark font-bold text-xs uppercase tracking-widest mb-1">{L.subtitle}</p>
                <h2 className="text-xl font-extrabold text-primary mb-4">{L.title}</h2>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('objectives')}</h3>
                <ul className="space-y-1.5 text-sm text-gray-700 mb-6">
                  {L.objectives.map((o, i) => <li key={i} className="pl-5 relative">{o}<span className="absolute left-0 text-accent-dark">✓</span></li>)}
                </ul>
                {L.sections.map((sec, i) => (
                  <div key={i} className="mb-6">
                    <h4 className="font-bold text-primary mb-2">{sec.heading}</h4>
                    {sec.paragraphs.map((p, j) => <p key={j} className="text-sm text-gray-700 mb-2 leading-relaxed">{p}</p>)}
                    {sec.bullets && (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {sec.bullets.map((b, j) => <li key={j} className="pl-5 relative">{b}<span className="absolute left-0 text-accent-dark">•</span></li>)}
                      </ul>
                    )}
                  </div>
                ))}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('activity')}</h4>
                  <p className="text-sm text-gray-700 mb-3">{L.activity.prompt}</p>
                  <button onClick={() => setShowAns(!showAns)} className="bg-accent/20 border border-accent/40 text-accent-dark font-bold text-xs px-4 py-2 rounded-full hover:bg-accent/30 transition">
                    {showAns ? t('hideAnswer') : t('showAnswer')}
                  </button>
                  {showAns && <p className="mt-3 text-sm text-gray-700 border-t border-gray-100 pt-3">{L.activity.answer}</p>}
                </div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('refs')}</h4>
                <ul className="text-sm space-y-1">
                  {L.references.map((r, i) => (
                    <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="text-primary underline hover:text-accent-dark">{r.label}</a></li>
                  ))}
                </ul>
              </article>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
