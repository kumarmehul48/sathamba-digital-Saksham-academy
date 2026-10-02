import { useState } from 'react';

/* Bilingual (EN/GU) free-demo-class campaign funnel page.
   UTM params are captured and logged with the lead. */

const T = {
  badge: ['Admissions Open — Sathamba, Aravalli', 'પ્રવેશ શરૂ — સાઠંબા, અરવલ્લી'],
  h1: ['From zero to pro — a complete computer education, right here in Sathamba', 'શૂન્યથી પ્રો સુધી — સંપૂર્ણ કમ્પ્યુટર શિક્ષણ, સાઠંબામાં જ'],
  lead: [
    'SDSA Academy trains students, job-seekers, and shop owners on real computers — from switching on a PC to Tally, certificates and career guidance. Small batches, personal attention, fees a family can afford.',
    'SDSA એકેડમી વિદ્યાર્થીઓ, નોકરી શોધનારા અને દુકાનદારોને ખરેખર કમ્પ્યુટર પર તાલીમ આપે છે — PC ચાલુ કરવાથી લઈને Tally, સર્ટિફિકેટ અને કારકિર્દી માર્ગદર્શન સુધી. નાના બેચ, વ્યક્તિગત ધ્યાન, પરિવારને પોસાય તેવી ફી.',
  ],
  cta1: ['Book My Free Demo Class →', 'મારી મફત ડેમો ક્લાસ બુક કરો →'],
  cta2: ['See the Courses', 'કોર્સ જુઓ'],
  whyTitle: ['Today, computer skill is not optional — it is the entry ticket', 'આજે કમ્પ્યુટર કૌશલ્ય વૈકલ્પિક નથી — તે પ્રવેશ પત્ર છે'],
  whyKicker: ['Why this matters now', 'આ કેમ જરૂરી છે'],
  govTitle: ['Government job forms', 'સરકારી નોકરીના ફોર્મ'],
  govP: ['GPSC, Talati, Clerk, SSC — almost every application and much of the exam itself is online now. A student who cannot operate a computer is already behind.', 'GPSC, તલાટી, ક્લાર્ક, SSC — લગભગ દરેક અરજી અને પરીક્ષાનો મોટો ભાગ ઓનલાઇન છે. જે વિદ્યાર્થી કમ્પ્યુટર ચલાવી શકતો નથી તે પહેલેથી પાછળ છે.'],
  pvtTitle: ['Private jobs', 'પ્રાઇવેટ નોકરીઓ'],
  pvtP: ['Offices, showrooms, banks and clinics want staff who handle billing, data entry and digital payments from day one.', 'ઓફિસ, શોરૂમ, બેંક અને ક્લિનિક પહેલા દિવસથી બિલિંગ, ડેટા એન્ટ્રી અને ડિજિટલ પેમેન્ટ સંભાળી શકે તેવા કર્મચારી માંગે છે.'],
  bizTitle: ['Own business', 'પોતાનો ધંધો'],
  bizP: ['Shopkeepers need UPI, GST bills, online stock and accounting. Tally plus digital skills directly increase what a shop earns and saves.', 'દુકાનદારોને UPI, GST બિલ, ઓનલાઇન સ્ટોક અને એકાઉન્ટિંગ જોઈએ. Tally અને ડિજિટલ કૌશલ્ય દુકાનની કમાણી સીધી વધારે છે.'],
  colTitle: ['After 10th / 12th', '10માં / 12માં પછી'],
  colP: ['A 6-month computer certificate alongside college makes a resume stand out in interviews and internship applications.', 'કોલેજ સાથે 6 મહિનાનું કમ્પ્યુટર સર્ટિફિકેટ ઇન્ટરવ્યૂ અને ઇન્ટર્નશિપમાં રિઝ્યુમને અલગ ઓળખ આપે છે.'],
  coursesKicker: ['The Courses', 'કોર્સ'],
  coursesTitle: ['Pick your track — or go zero to pro', 'તમારો ટ્રેક પસંદ કરો — અથવા શૂન્યથી પ્રો સુધી'],
  offerKicker: ['Limited-Time Admission Offer', 'મર્યાદિત સમયની પ્રવેશ ઓફર'],
  offerTitle: ['Book a free demo class — sit at a computer, meet the teacher, then decide', 'મફત ડેમો ક્લાસ બુક કરો — કમ્પ્યુટર પર બેસો, શિક્ષકને મળો, પછી નક્કી કરો'],
  o1: ['One full demo class, completely free', 'એક સંપૂર્ણ ડેમો ક્લાસ, સંપૂર્ણ મફત'],
  o2: ['Free career counseling — which course fits your goal', 'મફત કારકિર્દી માર્ગદર્શન — તમારા લક્ષ્ય મુજબ કયો કોર્સ ફિટ બેસે'],
  o3: ['Batch timing that fits school / college / work', 'શાળા / કોલેજ / કામને બંધબેસે તેવું બેચ ટાઇમિંગ'],
  o4: ['Certificate + progress report for parents', 'સર્ટિફિકેટ + વાલિઓ માટે પ્રગતિ રિપોર્ટ'],
  formTitle: ['Book your free demo class', 'તમારી મફત ડેમો ક્લાસ બુક કરો'],
  formSub: ['Fill this and we will call you back with your batch timing.', 'આ ભરો, અમે તમને તમારું બેચ ટાઇમિંગ લઈને કૉલ કરીશું.'],
  fName: ['Your name *', 'તમારું નામ *'],
  fMobile: ['Mobile number *', 'મોબાઇલ નંબર *'],
  fCourse: ['Course of interest', 'રસનો કોર્સ'],
  fLoc: ['Village / City', 'ગામ / શહેર'],
  fMsg: ['Anything we should know? (optional)', 'કંઈ જણાવવું હોય? (વૈકલ્પિક)'],
  submit: ['Book My Free Demo →', 'મારી મફત ડેમો બુક કરો →'],
  sending: ['Saving…', 'સેવ થાય છે…'],
  done: ['✓ Done! We will call you with your batch timing.', '✓ થઈ ગયું! અમે તમને બેચ ટાઇમિંગ લઈને કૉલ કરીશું.'],
  fail: ['⚠ Something went wrong — please WhatsApp us directly.', '⚠ કંઈક ખોટું થયું — કૃપા કરીને સીધા WhatsApp કરો.'],
  fine: ['We reply within 24 hours. Your details stay private.', 'અમે 24 કલાકમાં જવાબ આપીએ છીએ. તમારી માહિતી ગોપનીય રહેશે.'],
  s1: ['26', '26'], s1l: ['weeks — zero to pro full course', 'અઠવાડિયા — શૂન્યથી પ્રો સંપૂર્ણ કોર્સ'],
  s2: ['1:10', '1:10'], s2l: ['teacher-student ratio, personal attention', 'શિક્ષક-વિદ્યાર્થી ગુણોત્તર, વ્યક્તિગત ધ્યાન'],
  s3: ['100%', '100%'], s3l: ['practice on real computers, not theory slides', 'સાચા કમ્પ્યુટર પર પ્રેક્ટિસ, ફક્ત થિયરી નહીં'],
  s4: ['Free', 'મફત'], s4l: ['demo class + career counseling session', 'ડેમો ક્લાસ + કારકિર્દી માર્ગદર્શન'],
};

const COURSES = [
  { ic: '🖥️', t: ['Computer Basics', 'Computer Basics'], d: ['Files, typing (English + Gujarati), internet, email — total confidence for a complete beginner.', 'કમ્પ્યુટર ચાલુ કરવું, ફાઇલ, ટાઇપિંગ (અંગ્રેજી + ગુજરાતી), ઇન્ટરનેટ, ઇમેલ — સંપૂર્ણ શરૂઆતથી આત્મવિશ્વાસ.'], w: ['4 weeks', '4 અઠવાડિયા'] },
  { ic: '📄', t: ['MS Office Pro', 'MS Office Pro'], d: ['Word, Excel and PowerPoint — the exact skills offices test in interviews.', 'Word, Excel અને PowerPoint — ઓફિસ ઇન્ટરવ્યૂમાં ચકાસાતા ચોક્કસ કૌશલ્ય.'], w: ['8 weeks', '8 અઠવાડિયા'] },
  { ic: '📊', t: ['Tally + GST', 'Tally + GST'], d: ['Accounting entries, GST bills, stock — the skill that gets you hired in any local business.', 'એકાઉન્ટિંગ એન્ટ્રી, GST બિલ, સ્ટોક — કોઈપણ સ્થાનિક ધંધામાં નોકરી અપાવે તેવું કૌશલ્ય.'], w: ['8 weeks', '8 અઠવાડિયા'] },
  { ic: '⌨️', t: ['Typing Speed', 'ટાઇપિંગ સ્પીડ'], d: ['Exam-level typing in English and Gujarati — speed + accuracy.', 'પરીક્ષા-સ્તરનું ટાઇપિંગ અંગ્રેજી અને ગુજરાતીમાં — ઝડપ + ચોકસાઇ.'], w: ['Daily practice', 'રોજની પ્રેક્ટિસ'] },
  { ic: '💳', t: ['Digital India Skills', 'ડિજિટલ ઇન્ડિયા કૌશલ્ય'], d: ['UPI, online forms, net banking, DigiLocker, safe browsing.', 'UPI, ઓનલાઇન ફોર્મ, નેટ બેંકિંગ, DigiLocker, સુરક્ષિત બ્રાઉઝિંગ.'], w: ['2 weeks', '2 અઠવાડિયા'] },
  { ic: '🏆', t: ['Zero to Pro (Full)', 'શૂન્યથી પ્રો (સંપૂર્ણ)'], d: ['Everything above in one 26-week journey + certificate + career counseling + interview preparation.', 'ઉપરનું બધું 26 અઠવાડિયાની એક યાત્રામાં + સર્ટિફિકેટ + કારકિર્દી માર્ગદર્શન + ઇન્ટરવ્યૂ તૈયારી.'], w: ['26 weeks — flagship', '26 અઠવાડિયા — ફ્લેગશિપ'] },
];

const COURSE_OPTIONS = ['Computer Basics', 'MS Office Pro', 'Tally + GST', 'Typing Speed', 'Digital India Skills', 'Zero to Pro — Full (26 weeks)'];

export default function Campaign() {
  const [gu, setGu] = useState(typeof window !== 'undefined' && localStorage.getItem('sdsa_lang') === 'gu');
  const t = (k: keyof typeof T) => T[k][gu ? 1 : 0];
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'fail'>('idle');
  const [form, setForm] = useState({ name: '', mobile: '', location: '', course_interest: '', message: '' });

  const setLang = (g: boolean) => {
    setGu(g);
    try { localStorage.setItem('sdsa_lang', g ? 'gu' : 'en'); } catch { /* noop */ }
  };

  const getUtm = () => {
    try {
      const p = new URLSearchParams(window.location.search);
      return [p.get('utm_source') || '', p.get('utm_medium') || '', p.get('utm_campaign') || ''].join('|');
    } catch { return ''; }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const utm = getUtm();
    const body = {
      ...form,
      form_type: 'enquiry',
      message: form.message + (utm ? ` [utm: ${utm}]` : ''),
    };
    try {
      const r = await fetch('https://superagent-d1c2e2a1.base44.app/functions/sdsaSubmitLead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d.ok === true) {
        setStatus('done');
        const msg = `Hi! I booked a free demo class.\nName: ${form.name}\nMobile: ${form.mobile}\nCourse: ${form.course_interest}\nVillage: ${form.location}`;
        window.open('https://wa.me/917043795279?text=' + encodeURIComponent(msg), '_blank');
        return;
      }
      throw new Error(d.error || 'failed');
    } catch {
      setStatus('fail');
    }
  };

  const input = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value }),
    className: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary',
  });

  return (
    <div className="bg-primary-50">
      {/* Language toggle */}
      <div className="fixed top-2 right-2 z-50 flex bg-white border border-gray-200 rounded-full overflow-hidden shadow-md">
        <button onClick={() => setLang(false)} className={`px-4 py-2 text-xs font-bold ${!gu ? 'bg-primary text-white' : 'text-primary'}`}>English</button>
        <button onClick={() => setLang(true)} className={`px-4 py-2 text-xs font-bold ${gu ? 'bg-primary text-white' : 'text-primary'}`}>ગુજરાતી</button>
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-16 sm:py-20 text-center px-4">
        <span className="inline-block bg-accent/20 border border-accent/50 text-accent px-4 py-1.5 rounded-full text-xs font-semibold mb-6">{t('badge')}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold max-w-3xl mx-auto leading-tight mb-5">{t('h1')}</h1>
        <p className="max-w-2xl mx-auto text-white/90 text-sm sm:text-base mb-8">{t('lead')}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="#join" className="bg-accent text-primary-dark font-bold px-7 py-3.5 rounded-xl hover:bg-accent-light transition">{t('cta1')}</a>
          <a href="#courses" className="border-2 border-white/50 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition">{t('cta2')}</a>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-white py-8">
        <div className="container-sdsa grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[{ n: t('s1'), l: t('s1l') }, { n: t('s2'), l: t('s2l') }, { n: t('s3'), l: t('s3l') }, { n: t('s4'), l: t('s4l') }].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/15 rounded-xl py-5 px-3">
              <b className="block text-2xl text-accent font-extrabold">{s.n}</b>
              <span className="text-xs text-white/85">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="py-16 px-4">
        <div className="container-sdsa">
          <p className="text-accent-dark font-bold text-xs uppercase tracking-widest mb-2">{t('whyKicker')}</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-8">{t('whyTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { ic: '🧾', t: t('govTitle'), p: t('govP') },
              { ic: '💼', t: t('pvtTitle'), p: t('pvtP') },
              { ic: '🏪', t: t('bizTitle'), p: t('bizP') },
              { ic: '🎓', t: t('colTitle'), p: t('colP') },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className="text-3xl">{c.ic}</span>
                <h3 className="font-bold text-primary mt-2 mb-1.5">{c.t}</h3>
                <p className="text-sm text-gray-600">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-16 bg-white px-4">
        <div className="container-sdsa">
          <p className="text-accent-dark font-bold text-xs uppercase tracking-widest mb-2">{t('coursesKicker')}</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-8">{t('coursesTitle')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((c, i) => (
              <div key={i} className="bg-primary-50 rounded-2xl border border-gray-100 p-6">
                <span className="text-3xl">{c.ic}</span>
                <h3 className="font-bold text-primary mt-2 mb-1.5">{gu ? c.t[1] : c.t[0]}</h3>
                <p className="text-sm text-gray-600">{gu ? c.d[1] : c.d[0]}</p>
                <span className="inline-block mt-3 bg-accent/20 text-accent-dark text-xs font-bold px-3 py-1 rounded-full border border-accent/40">{gu ? c.w[1] : c.w[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER + FORM */}
      <section id="join" className="py-16 px-4 bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-sdsa max-w-2xl">
          <p className="text-accent font-bold text-xs uppercase tracking-widest mb-2">{t('offerKicker')}</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">{t('offerTitle')}</h2>
          <ul className="space-y-2 mb-8 text-sm sm:text-base">
            {['o1', 'o2', 'o3', 'o4'].map((k, i) => (
              <li key={i} className="pl-7 relative">{t(k as keyof typeof T)}<span className="absolute left-0 text-accent font-bold">✓</span></li>
            ))}
          </ul>
          <form onSubmit={submit} className="bg-white text-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-extrabold text-primary mb-1">{t('formTitle')}</h3>
            <p className="text-xs text-gray-500 mb-5">{t('formSub')}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fName')}</label>
                <input {...input('name')} required minLength={2} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fMobile')}</label>
                <input {...input('mobile')} required placeholder="10-digit number" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fCourse')}</label>
                <select value={form.course_interest} onChange={(e) => setForm({ ...form, course_interest: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                  <option value="">—</option>
                  {COURSE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fLoc')}</label>
                <input {...input('location')} placeholder="Sathamba" />
              </div>
            </div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fMsg')}</label>
            <textarea {...input('message')} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary mb-4" />
            <button type="submit" disabled={status === 'sending'}
              className="w-full bg-accent text-primary-dark font-bold py-3.5 rounded-xl hover:bg-accent-light transition disabled:opacity-60">
              {status === 'sending' ? t('sending') : t('submit')}
            </button>
            {status === 'done' && <p className="mt-3 text-sm font-semibold text-green-700 text-center">{t('done')}</p>}
            {status === 'fail' && <p className="mt-3 text-sm font-semibold text-red-600 text-center">{t('fail')}</p>}
            <p className="mt-3 text-xs text-gray-400 text-center">{t('fine')}</p>
          </form>
        </div>
      </section>
    </div>
  );
}
