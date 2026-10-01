import { Badge } from '../../components/ui';

export default function About() {
  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-2">About SDSA</h1>
        <p className="text-white/90 font-semibold text-base mb-1">Sathamba Digital Saksham Academy (SDSA) | સાઠંબા ડિજિટલ સક્ષમ એકેડમી</p>
        <p className="text-accent text-sm font-semibold">Learn • Practice • Apply • Grow | શીખીએ • પ્રેક્ટિસ કરીએ • આગળ વધીએ</p>
      </div>

      <div className="container-sdsa section-pad space-y-12">
        {/* MANAGING TRUST DEDICATED SECTION */}
        <div className="card-sdsa p-8 bg-primary-50 border-l-8 border-l-accent-dark">
          <Badge tone="accent">Managing Trust</Badge>
          <h2 className="text-2xl font-extrabold text-primary mt-2 mb-1">Shivansh Digital Sagacity & Alleviation</h2>
          <p className="text-accent-dark font-extrabold text-base mb-4">Nurturing Wisdom, Sustaining Lives</p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
            Sathamba Digital Saksham Academy (SDSA) is managed and operated by <b>Shivansh Digital Sagacity & Alleviation</b>. The trust is committed to fostering digital empowerment, facilitating accessible computer education, and driving community progress in Sathamba and the broader Aravalli district.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Guided by its motto <i>"Nurturing Wisdom, Sustaining Lives"</i>, Shivansh Digital Sagacity & Alleviation designs practical learning initiatives that enable individuals to build meaningful digital skills, gain confidence, and apply technology effectively in their academic, personal, and professional endeavors.
          </p>
        </div>

        {/* OVERVIEW & VISION & MISSION */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Introduction</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Sathamba Digital Saksham Academy (SDSA) is a practical digital education initiative based in Sathamba, Aravalli district, Gujarat. We focus on structured skill-building where learning is driven by hands-on exercises, guided application, and real project experience over a planned 26-week practical program.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Vision</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                A digitally empowered community in Sathamba and surrounding regions, where students, job-seekers, local entrepreneurs, and families can confidently use technology for education, work, and daily life.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Mission</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                To provide accessible, structured, and practical digital education across 26 planned weeks - spanning computer basics, office productivity, internet safety, cloud application, and practical AI skills.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Key Objectives</h2>
              <ul className="list-disc pl-5 text-gray-600 text-sm sm:text-base space-y-1.5">
                <li>Build foundational computer operating confidence from step zero</li>
                <li>Develop practical proficiency in office productivity software</li>
                <li>Enhance digital safety and internet navigation awareness</li>
                <li>Introduce practical and responsible AI application tools</li>
                <li>Foster portfolio development and verifiable completion credentials</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card-sdsa p-6 bg-surface">
              <h2 className="text-xl font-extrabold text-primary mb-2">Learning Philosophy</h2>
              <p className="text-accent-dark font-extrabold text-sm mb-2">Learn • Practice • Apply • Grow</p>
              <p className="text-gray-700 text-sm">
                Our pedagogical approach uses a structured 5-step loop: Concept → Demonstration → Practice → Application → Review. Short conceptual introductions are followed by extensive guided practice.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Teaching Methodology</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Focused batch sizes, interactive practical sessions, weekly task assignments, continuous trainer feedback, and modular practical reviews to ensure steady skill development.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Digital Empowerment</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Digital literacy is a core life capability. SDSA aims to make technology welcoming and practical for learners of all backgrounds, including students, job-seekers, and local business owners.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary mb-2">Responsible AI Approach</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Artificial Intelligence is introduced as an everyday practical tool for productivity and learning, alongside critical training in output verification, safety, privacy, and ethics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
