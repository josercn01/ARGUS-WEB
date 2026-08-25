import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthUser, Role } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserProfile(email: string, displayName: string) {
    // Define super_admin para o seu e-mail ou gerencia via regra padrão 'editor'
    let role: Role = 'editor';
    
    // Se quiser definir e-mails específicos como super_admin, você pode mapear aqui:
    if (email.toLowerCase().includes('josercn') || email.toLowerCase().includes('nunes')) {
      role = 'super_admin';
    }

    setUser({ email, name: displayName, role });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email ?? '';
        const name =
          session.user.user_metadata?.full_name ??
          session.user.user_metadata?.name ??
          email;
        (async () => {
          await loadUserProfile(email, name);
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (session?.user) {
            const email = session.user.email ?? '';
            const name =
              session.user.user_metadata?.full_name ??
              session.user.user_metadata?.name ??
              email;
            await loadUserProfile(email, name);
          } else {
            setUser(null);
          }
          setLoading(false);
        })();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email profile',
        redirectTo: window.location.origin,
        queryParams: {
          tenant: '751d81cc-4c2c-4d22-ad41-440700d5dd0e',
        },
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
