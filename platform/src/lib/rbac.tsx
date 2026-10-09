import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

function Loading() { return <div className="min-h-screen grid place-items-center text-primary font-semibold">Loading…</div>; }

// Har section apne hi login page par wapas jata hai — admin/trust kabhi student page par nahi.
function RequireAuth({ children, roles, loginPath = '/login' }: { children: ReactNode; roles?: string[]; loginPath?: string }) {
  const { profile, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loading />;
  if (!profile) return <Navigate to={loginPath} state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(profile.role)) return <Navigate to={loginPath} replace />;
  return <>{children}</>;
}

// Students can never access admin routes; admins skip student portal
export function StudentRoute({ children }: { children: ReactNode }) {
  return <RequireAuth roles={['student']} loginPath="/login">{children}</RequireAuth>;
}
export function StaffRoute({ children }: { children: ReactNode }) {
  // Admin portal sirf trust/admin roles ke liye — login bhi trust page se hi
  return <RequireAuth roles={['admin', 'super_admin']} loginPath="/trust/login">{children}</RequireAuth>;
}
export function StaffOrTrainerRoute({ children }: { children: ReactNode }) {
  return <RequireAuth roles={['admin', 'super_admin', 'trainer']} loginPath="/trust/login">{children}</RequireAuth>;
}

export function TrustRoute({ children }: { children: ReactNode }) {
  return <RequireAuth roles={['trust']} loginPath="/trust/login">{children}</RequireAuth>;
}
