import { Link } from 'react-router-dom';
import { MODULES, WEEKS } from '../../data/curriculum';
import { Card, Badge } from '../../components/ui';

const learn = [
  { t: 'Digital Foundation', d: 'Computers, operating system, typing - starting step by step from basics.' },
  { t: 'Internet & Digital Safety', d: 'Browsers, email, search, and staying safe online.' },
  { t: 'Office Productivity', d: 'Word processing, spreadsheets, and presentations for study and daily tasks.' },
  { t: 'Cloud & Online Productivity', d: 'Cloud storage, online tools, and digital file organization.' },
  { t: 'AI Skills', d: 'Practical AI tools for learning, writing, and productivity - responsibly and thoughtfully.' },
  { t: 'Practical Projects', d: 'Plan, build, and present a structured digital project.' },
  { t: 'Portfolio & Skill Readiness', d: 'Evidence of your practical work, certificate verification, and learning portfolio.' },
];

const benefits = [
  'Practical computer confidence', 'Office productivity skills', 'Internet safety awareness', 'Digital communication',
  'Practical AI tools usage', 'Project experience', 'Digital portfolio development', 'Structured learning path',
];

const method = ['Concept', 'Demonstration', 'Practice', 'Application', 'Review'];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-b from-primary to-primary-light text-white">
        <div className="container-sdsa py-16 sm:py-24 text-center">
          <p className="text-accent font-semibold mb-2 tracking-wide text-sm sm:text-base">SATHAMBA DIGITAL SAKSHAM ACADEMY (SDSA)</p>
          <p className="text-white/90 text-sm font-semibold mb-3">સાઠંબા ડિજિટલ સક્ષમ એકેડમી</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">Digital Skills for Community Empowerment</h1>
          <p className="text-lg text-accent font-bold mb-1">શીખીએ • પ્રેક્ટિસ કરીએ • આગળ વધીએ</p>
          <p className="max-w-2xl mx-auto text-gray-200 mb-4 font-semibold text-sm sm:text-base">Learn • Practice • Apply • Grow</p>
          <div className="inline-block bg-white/10 backdrop-blur border border-accent/40 rounded-xl px-4 py-2 mb-6">
            <p className="text-xs text-accent-light font-medium">Managed & Operated by</p>
            <p className="text-sm font-extrabold text-white flex items-center gap-2 justify-center"><img src="sdsa-trust-logo.webp" alt="trust" className="w-6 h-6 rounded-full inline-block" />Shivansh Digital Sagacity & Alleviation</p>
            <p className="text-xs text-accent italic">Nurturing Wisdom, Sustaining Lives</p>
          </div>
          <p className="max-w-2xl mx-auto text-gray-300 mb-8 text-sm sm:text-base">Digital Skills • Computer Education • AI Skills • Practical Learning - a planned practical 26-week journey in Sathamba, Aravalli district, Gujarat.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/curriculum" className="btn-accent">Explore 26-Week Course</Link>
            <Link to="/apply" className="btn-primary !bg-white !text-primary">Inquire / Apply</Link>
            <Link to="/login" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary">Student Login</Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-pad">
        <div className="container-sdsa grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="h-section">About SDSA</h2>
            <p className="text-gray-600">Sathamba Digital Saksham Academy (SDSA) is a practical digital education initiative in Sathamba, Aravalli district, Gujarat. We believe digital skills are essential for everyone - students, job-seekers, local businesses, and community members.</p>
            <p className="text-gray-600 mt-3">Our planned practical 26-week program guides learners step by step: computer fundamentals, office tools, internet safety, cloud application, and practical AI usage - emphasized through hands-on practice and real project work.</p>
            <Link to="/about" className="btn-outline mt-6 inline-block">Know More</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center"><p className="text-4xl font-extrabold text-primary">26</p><p className="text-sm text-gray-500">Planned Weeks</p></Card>
            <Card className="text-center"><p className="text-4xl font-extrabold text-primary">7</p><p className="text-sm text-gray-500">Learning Modules</p></Card>
            <Card className="text-center"><p className="text-4xl font-extrabold text-primary">100%</p><p className="text-sm text-gray-500">Practical Orientation</p></Card>
            <Card className="text-center"><p className="text-4xl font-extrabold text-primary">Hands-on</p><p className="text-sm text-gray-500">Guided Learning</p></Card>
          </div>
        </div>
      </section>

      {/* DEDICATED ABOUT MANAGING TRUST SECTION */}
      <section className="section-pad bg-surface border-y border-gray-200">
        <div className="container-sdsa text-center max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <img src="sdsa-trust-logo.webp" alt="Shivansh Digital Sagacity & Alleviation" className="w-20 h-20 rounded-full object-cover border-2 border-accent" />
            <div>
              <Badge tone="accent">Managing Trust</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mt-2 mb-1">Shivansh Digital Sagacity & Alleviation</h2>
            </div>
          </div>
          <p className="text-accent font-bold mb-4">Nurturing Wisdom, Sustaining Lives</p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Sathamba Digital Saksham Academy (SDSA) is managed and operated by <b>Shivansh Digital Sagacity & Alleviation</b>. The managing trust is dedicated to expanding access to digital knowledge, encouraging thoughtful application of technology, and supporting rural and regional development. Through education and practical skill building, the trust strives toward nurturing wisdom and sustaining lives across Sathamba and surrounding regions.
          </p>
        </div>
      </section>

      {/* WHAT STUDENTS LEARN */}
      <section className="section-pad">
        <div className="container-sdsa">
          <h2 className="h-section text-center">What Students Learn</h2>
          <p className="text-center text-gray-500 mb-10">7 core modules in a structured 26-week sequence</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {learn.map((m, i) => (
              <Card key={m.t} className="hover:shadow-md transition">
                <Badge tone="accent">Module {i + 1}</Badge>
                <h3 className="font-bold text-primary mt-2 mb-1">{m.t}</h3>
                <p className="text-sm text-gray-600">{m.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 26-WEEK TIMELINE */}
      <section className="section-pad bg-surface">
        <div className="container-sdsa">
          <h2 className="h-section text-center">The Planned 26-Week Learning Journey</h2>
          <p className="text-center text-gray-500 mb-10">From Week 01 to Week 26 - a structured path</p>
          <div className="grid md:grid-cols-2 gap-6">
            {MODULES.map((m) => (
              <Card key={m.module} className="border-l-4 border-l-accent-dark">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-primary">Module {m.module}: {m.title}</h3>
                  <Badge tone="primary">Weeks {String(m.start).padStart(2, '0')}-{String(m.end).padStart(2, '0')}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {WEEKS.filter((w) => w.module === m.module).map((w) => (
                    <Link key={w.week} to={`/curriculum/week/${w.week}`} className="text-xs bg-primary-50 text-primary font-semibold px-2.5 py-1 rounded-lg hover:bg-accent-light">W{String(w.week).padStart(2, '0')}</Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="section-pad bg-primary text-white">
        <div className="container-sdsa text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Learning Methodology</h2>
          <p className="text-gray-300 mb-8">Concept → Demonstration → Practice → Application → Review</p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            {method.map((s, i) => (
              <span key={s} className="flex items-center gap-2 sm:gap-4">
                <span className="bg-white/10 border border-accent/50 px-4 py-2 rounded-lg font-semibold text-sm">{i + 1}. {s}</span>
                {i < method.length - 1 && <span className="text-accent font-bold">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section-pad">
        <div className="container-sdsa">
          <h2 className="h-section text-center">Program Benefits</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 bg-primary-50 rounded-lg p-4 text-sm font-semibold text-primary">✓ {b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS + PORTFOLIO */}
      <section className="section-pad bg-surface">
        <div className="container-sdsa grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="h-section">Practical Learning & Projects</h2>
            <p className="text-gray-600">In Module 6 (Weeks 21-23), students plan and work on practical projects to apply digital concepts. Project topics center around practical needs such as digital catalogues, presentations, budget workbooks, and study guides.</p>
          </div>
          <div>
            <h2 className="h-section">Portfolio & Completion</h2>
            <p className="text-gray-600">Students compile evidence of completed assignments and projects into a digital portfolio. Upon successful course completion, students receive an SDSA completion certificate, verifiable on this website.</p>
            <Link to="/verify-certificate" className="btn-outline mt-5 inline-block">Verify a Certificate</Link>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="section-pad">
        <div className="container-sdsa">
          <h2 className="h-section text-center">Academy Activities</h2>
          <p className="text-center text-gray-500 mb-8">Glimpse into learning, sessions, projects, and events</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Classroom', 'Student Activities', 'Projects', 'Events'].map((c) => (
              <Link key={c} to="/gallery" className="bg-primary text-white rounded-xl h-32 grid place-items-center font-bold hover:bg-primary-light transition">{c}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent-dark">
        <div className="container-sdsa py-12 text-center">
          <h2 className="text-2xl font-extrabold text-primary-dark mb-2">Interested in joining the planned 26-week program?</h2>
          <p className="text-primary-dark/80 mb-6">Submit your expression of interest or reach out for course details in Sathamba.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/apply" className="btn-primary">Inquire / Apply</Link>
            <Link to="/contact" className="btn-outline !border-primary-dark !text-primary-dark hover:!bg-primary hover:text-white">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
