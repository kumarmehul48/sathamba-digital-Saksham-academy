import { NavLink, Outlet, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' }, { to: '/about', label: 'About' },
  { to: '/course', label: 'Course' }, { to: '/curriculum', label: 'Curriculum' },
  { to: '/student-life', label: 'Student Life' }, { to: '/gallery', label: 'Gallery' },
  { to: '/faq', label: 'FAQ' }, { to: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary text-white sticky top-0 z-40 shadow-md">
        <div className="container-sdsa flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold">
            <span className="w-10 h-10 grid place-items-center rounded-full bg-accent-dark text-primary-dark font-black text-sm">SDSA</span>
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
              <p className="text-xs font-bold text-accent-light">Managing Trust:</p>
              <p className="font-bold text-white text-sm">Shivansh Digital Sagacity & Alleviation</p>
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
    </div>
  );
}
