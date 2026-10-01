import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import supabase, { isBackendConfigured } from './supabaseClient';
import type { Profile, Role } from '../types/database';

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  isStudent: boolean;
  isTrainer: boolean;
  isStaff: boolean;
  studentRecordId: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

const STAFF: Role[] = ['admin', 'super_admin'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentRecordId, setStudentRecordId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isBackendConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadProfile(); else setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) loadProfile(); else { setProfile(null); setStudentRecordId(null); }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setProfile(null); setLoading(false); return; }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(p as Profile);
      if (p?.role === 'student') {
        const { data: s } = await supabase.from('students').select('id').eq('profile_id', user.id).single();
        setStudentRecordId(s?.id ?? null);
      }
    } catch {
      setProfile(null);
      setStudentRecordId(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    if (!isBackendConfigured) {
      return { error: 'Backend setup pending: Supabase backend is not configured.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function resetPassword(email: string) {
    if (!isBackendConfigured) {
      return { error: 'Backend setup pending: Supabase backend is not configured.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error ? error.message : null };
  }

  async function signOut() {
    if (isBackendConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    setProfile(null);
    setStudentRecordId(null);
  }

  const value: AuthCtx = {
    profile, loading, studentRecordId,
    isStudent: profile?.role === 'student',
    isTrainer: profile?.role === 'trainer',
    isStaff: !!profile && STAFF.includes(profile.role),
    signIn, signOut, resetPassword,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
