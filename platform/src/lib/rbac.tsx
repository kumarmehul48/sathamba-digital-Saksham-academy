import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

function Loading() { return <div className="min-h-screen grid place-items-center text-primary font-semibold">Loading…</div>; }

export function RequireAuth({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { profile, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loading />;
  if (!profile) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(profile.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Students can never access admin routes; admins skip student portal
export function StudentRoute({ children }: { children: ReactNode }) {
  return <RequireAuth roles={['student']}>{children}</RequireAuth>;
}
export function StaffRoute({ children }: { children: ReactNode }) {
  return <RequireAuth roles={['admin', 'super_admin']}>{children}</RequireAuth>;
}
export function StaffOrTrainerRoute({ children }: { children: ReactNode }) {
  return <RequireAuth roles={['admin', 'super_admin', 'trainer']}>{children}</RequireAuth>;
}
