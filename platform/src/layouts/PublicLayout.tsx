import { NavLink, Outlet, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' }, { to: '/about', label: 'About' },
  { to: '/course', label: 'Course' }, { to: '/curriculum', label: 'Curriculum' },
  { to: '/student-life', label: 'Student Life' }, { to: '/gallery', label: 'Gallery' },
  { to: '/faq', label: 'FAQ' }, { to: '/contact', label: 'Contact' }, { to: '/campaign', label: 'Free Demo' },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary text-white sticky top-0 z-40 shadow-md">
        <div className="container-sdsa flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold">
            <img src="sdsa-badge.webp" alt="SDSA logo" className="w-10 h-10 rounded-full object-cover bg-accent-dark" />
            <span className="leading-tight text-sm sm:text-base">
              Sathamba Digital Saksham Academy (SDSA)
              <span className="block text-[11px] font-semibold text-white/90">સાઠંબા ડિજિટલ સક્ષમ એકેડમી</span>
              <span className="block text-[10px] font-medium text-accent">Learn • Practice • Apply • Grow | શીખીએ • પ્રેક્ટિસ કરીએ • આગળ વધીએ</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/apply" className="hidden sm:inline-block bg-accent-dark text-primary-dark font-bold text-sm px-4 py-2 rounded-lg hover:bg-accent">Inquire / Apply</Link>
            <Link to="/login" className="border border-white/70 text-sm px-4 py-2 rounded-lg hover:bg-white hover:text-primary">Student Login</Link>
          </div>
        </div>
        <nav className="border-t border-white/10">
          <div className="container-sdsa flex gap-1 overflow-x-auto py-1.5 text-sm">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-primary-dark text-gray-300 text-sm">
        <div className="container-sdsa grid sm:grid-cols-3 gap-8 py-10">
          <div>
            <p className="font-extrabold text-white text-base mb-1">Sathamba Digital Saksham Academy (SDSA)</p>
            <p className="text-xs text-white/80 mb-2 font-semibold">સાઠંબા ડિજિટલ સક્ષમ એકેડમી</p>
            <p className="text-accent text-xs mb-3 font-semibold">Learn • Practice • Apply • Grow | શીખીએ • પ્રેક્ટિસ કરીએ • આગળ વધીએ</p>
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex items-center gap-2">
                <img src="sdsa-trust-logo.webp" alt="Trust logo" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-accent-light">Managing Trust:</p>
                  <p className="font-bold text-white text-sm">Shivansh Digital Sagacity & Alleviation</p>
                </div>
              </div>
              <p className="text-xs text-accent italic">Nurturing Wisdom, Sustaining Lives</p>
            </div>
            <p className="mt-3 text-xs">Sathamba, Aravalli District, Gujarat</p>
            <p className="text-xs text-gray-400">સાઠંબા, અરવલ્લી જિલ્લો, ગુજરાત</p>
          </div>
          <div>
            <p className="font-bold text-white mb-2">Explore</p>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/course" className="hover:text-accent">26-Week Planned Course</Link></li>
              <li><Link to="/curriculum" className="hover:text-accent">Curriculum</Link></li>
              <li><Link to="/gallery" className="hover:text-accent">Gallery</Link></li>
              <li><Link to="/apply" className="hover:text-accent">Inquire / Apply</Link></li>
              <li><Link to="/campaign" className="hover:text-accent">Free Demo Class</Link></li>
              <li><Link to="/login" className="hover:text-accent">Student Login</Link></li>
              <li><Link to="/verify-certificate" className="hover:text-accent">Verify Certificate</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-2">Contact & Information</p>
            <ul className="space-y-1.5 text-xs">
              <li>WhatsApp: +91 70437 95279</li>
              <li>Email: kumarmehul48@gmail.com</li>
              <li><Link to="/contact" className="hover:text-accent">Contact form</Link></li>
              <li className="pt-2"><Link to="/privacy" className="hover:text-accent">Privacy Policy (Draft)</Link> · <Link to="/terms" className="hover:text-accent">Terms & Conditions (Draft)</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Sathamba Digital Saksham Academy (SDSA). Managed by Shivansh Digital Sagacity & Alleviation (Nurturing Wisdom, Sustaining Lives). All rights reserved.
        </div>
      </footer>
      <a href="https://wa.me/917043795279" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
         className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition grid place-items-center">
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.6.8 5 2.3 7L4 29l7.2-2.2c1.9 1 4 1.6 6.2 1.6h.5c6.6 0 12-5.4 12-12S23.1 3 16.6 3H16zm.1 22.4c-2 0-3.9-.5-5.5-1.6l-.4-.2-4.3 1.3 1.3-4.2-.3-.4C5.6 18.6 5 16.9 5 15c0-6 4.9-10.9 11-10.9h.1c6 0 10.9 4.9 10.9 10.9s-4.9 10.4-10.9 10.4zm6.2-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3z"/></svg>
      </a>
    </div>
  );
}
