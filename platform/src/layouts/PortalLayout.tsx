import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', end: true },
  { to: '/student/profile', label: 'My Profile' },
  { to: '/student/course', label: 'My Course' },
  { to: '/student/workbooks', label: 'My Workbooks' },
  { to: '/student/assignments', label: 'My Assignments' },
  { to: '/student/attendance', label: 'My Attendance' },
  { to: '/student/assessments', label: 'My Assessments' },
  { to: '/student/results', label: 'My Results' },
  { to: '/student/portfolio', label: 'My Portfolio' },
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/announcements', label: 'Announcements' },
  { to: '/student/support', label: 'Help & Support' },
];

export function StudentLayout() {
  const { profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-primary text-white">
        <Link to="/" className="p-4 font-extrabold border-b border-white/10">SDSA <span className="text-accent">Student Portal</span></Link>
        <nav className="flex-1 overflow-y-auto py-2">
          {studentNav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `block px-4 py-2.5 text-sm ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-sm font-bold">{profile?.full_name}</p>
          <button onClick={signOut} className="mt-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">Logout</button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="md:hidden bg-primary text-white p-3 flex gap-2 overflow-x-auto text-sm">
          {studentNav.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/20 font-bold' : ''}`}>{n.label}</NavLink>)}
        </div>
        <div className="container-sdsa py-6"><Outlet /></div>
      </div>
    </div>
  );
}

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/admissions', label: 'Admissions' },
  { to: '/admin/batches', label: 'Batches' },
  { to: '/admin/trainers', label: 'Trainers' },
  { to: '/admin/curriculum', label: 'Curriculum' },
  { to: '/admin/workbooks', label: 'Workbooks' },
  { to: '/admin/assignments', label: 'Assignments' },
  { to: '/admin/attendance', label: 'Attendance' },
  { to: '/admin/assessments', label: 'Assessments' },
  { to: '/admin/results', label: 'Results' },
  { to: '/admin/portfolio', label: 'Portfolio Review' },
  { to: '/admin/certificates', label: 'Certificates' },
  { to: '/admin/announcements', label: 'Announcements' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/content', label: 'Website Content' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/settings', label: 'Settings' },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-60 shrink-0 hidden lg:flex flex-col bg-primary-dark text-white">
        <Link to="/admin/dashboard" className="p-4 font-extrabold border-b border-white/10">SDSA <span className="text-accent">Admin</span></Link>
        <nav className="flex-1 overflow-y-auto py-2 text-[13px]">
          {adminNav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `block px-4 py-2 ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-sm font-bold">{profile?.full_name}</p>
          <p className="text-[10px] uppercase tracking-wide text-accent">{profile?.role}</p>
          <button onClick={signOut} className="mt-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">Logout</button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-primary-dark text-white p-3 flex gap-2 overflow-x-auto text-xs">
          {adminNav.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/20 font-bold' : ''}`}>{n.label}</NavLink>)}
        </div>
        <div className="p-4 sm:p-6"><Outlet /></div>
      </div>
    </div>
  );
}
