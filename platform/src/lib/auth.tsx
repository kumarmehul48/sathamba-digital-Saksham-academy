import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Profile, Role } from '../types/database';
import { API_BASE } from '../config';

interface StoredSession {
  role: Role;
  name: string;
  batch?: string;
  status?: string;
  designation?: string;
}

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  isStudent: boolean;
  isTrainer: boolean;
  isStaff: boolean;
  studentRecordId: string | null;
  signIn: (identifier: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (identifier: string) => Promise<{ error: string | null }>;
  session: StoredSession | null;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

const STAFF: Role[] = ['admin', 'super_admin'];
const KEY = 'sdsa_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as StoredSession);
    } catch { /* ignore corrupt storage */ }
    setLoading(false);
  }, []);

  const profile: Profile | null = session
    ? ({ id: 'sheet', full_name: session.name, role: session.role } as Profile)
    : null;

  async function signIn(identifier: string, password: string): Promise<{ error: string | null }> {
    try {
      const r = await fetch(`${API_BASE}/sdsaLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier.trim(), mobile: identifier.trim(), password }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) return { error: d.error || 'Login failed. Please try again.' };
      const s: StoredSession = { role: d.role, name: d.name, batch: d.batch || '', status: d.status || '', designation: d.designation || '' };
      localStorage.setItem(KEY, JSON.stringify(s));
      setSession(s);
      return { error: null };
    } catch {
      return { error: 'Network problem. Please check your internet and try again.' };
    }
  }

  async function signOut() {
    localStorage.removeItem(KEY);
    setSession(null);
  }

  async function resetPassword(_identifier: string): Promise<{ error: string | null }> {
    return {
      error: 'Password reset is managed by the academy. Please contact us on WhatsApp +91 70437 95279.',
    };
  }

  const value: AuthCtx = {
    profile,
    loading,
    isStudent: !!session && session.role === 'student',
    isTrainer: !!session && session.role === 'trainer',
    isStaff: !!session && STAFF.includes(session.role),
    studentRecordId: null,
    signIn,
    signOut,
    resetPassword,
    session,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
