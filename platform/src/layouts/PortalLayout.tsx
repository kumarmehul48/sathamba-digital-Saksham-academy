import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { asset } from '../config';

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', end: true },
  { to: '/student/announcements', label: 'Announcements' },
  { to: '/student/profile', label: 'My Profile' },
  { to: '/student/support', label: 'Help & Support' },
];

export function StudentLayout() {
  const { profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-primary text-white">
        <Link to="/" className="p-4 border-b border-white/10 flex items-center gap-2">
          <img src={asset("sdsa-badge.webp")} alt="SDSA Academy" className="w-9 h-9 rounded-full object-cover border border-accent/60" />
          <span className="font-extrabold">SDSA <span className="text-accent">Student Portal</span></span>
        </Link>
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
  { to: '/admin/dashboard', label: '🪙 Coin Console', end: true },
  { to: '/admin/logins', label: '🔑 Logins', end: true },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-60 shrink-0 hidden lg:flex flex-col bg-primary-dark text-white">
        <Link to="/admin/dashboard" className="p-4 border-b border-white/10 flex items-center gap-2">
          <img src={asset("sdsa-trust-logo.webp")} alt="SDSA Trust" className="w-9 h-9 rounded-full object-cover border border-accent/60" />
          <span className="font-extrabold">SDSA Trust <span className="text-accent">Admin</span></span>
        </Link>
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

export function TrustLayout() {
  const { profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-primary text-white">
        <Link to="/" className="p-4 border-b border-white/10 flex items-center gap-2">
          <img src={asset("sdsa-trust-logo.webp")} alt="SDSA Trust" className="w-9 h-9 rounded-full object-cover border border-accent/60" />
          <span className="font-extrabold">SDSA Trust <span className="text-accent">Portal</span></span>
        </Link>
        <nav className="flex-1 overflow-y-auto py-2">
          <NavLink to="/trust/dashboard" end className={({ isActive }) => `block px-4 py-2.5 text-sm ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>📊 Dashboard</NavLink>
          <NavLink to="/trust/posts" end className={({ isActive }) => `block px-4 py-2.5 text-sm ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>🤝 My Posts</NavLink>
          <NavLink to="/trust/coins" end className={({ isActive }) => `block px-4 py-2.5 text-sm ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>🪙 My Coins</NavLink>
          <NavLink to="/trust/profile" end className={({ isActive }) => `block px-4 py-2.5 text-sm ${isActive ? 'bg-white/15 font-bold text-accent' : 'hover:bg-white/10'}`}>👤 My Profile</NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-sm font-bold">{profile?.full_name}</p>
          <button onClick={signOut} className="mt-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">Logout</button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="md:hidden bg-primary text-white p-3 flex gap-2 overflow-x-auto text-sm">
          <NavLink to="/trust/dashboard" end className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/20 font-bold' : ''}`}>Dashboard</NavLink>
          <NavLink to="/trust/posts" end className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/20 font-bold' : ''}`}>My Posts</NavLink>
          <NavLink to="/trust/coins" end className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/20 font-bold' : ''}`}>My Coins</NavLink>
          <NavLink to="/trust/profile" end className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/20 font-bold' : ''}`}>My Profile</NavLink>
          <button onClick={signOut} className="px-3 py-1.5 rounded-lg">Logout</button>
        </div>
        <div className="container-sdsa py-6"><Outlet /></div>
      </div>
    </div>
  );
}
