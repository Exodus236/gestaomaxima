import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_SESSION_KEY = 'rl_market_guest_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_SESSION_KEY) === 'true';
  });

  useEffect(() => {
    // 1. Obter sessão inicial do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_SESSION_KEY);
      }
      setLoading(false);
    });

    // 2. Escutar mudanças de autenticação (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_SESSION_KEY);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const normalizeEmail = (input: string): string => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed.includes('@')) {
      return trimmed;
    }
    return `${trimmed}@gmail.com`;
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = `E-mail ou senha incorretos para ${cleanEmail}.`;
        } else if (msg.includes('Email not confirmed')) {
          msg = 'E-mail pendente de confirmação. Verifique seu e-mail ou desative "Confirm email" nas configurações do Supabase.';
        }
        return { success: false, error: msg };
      }

      setUser(data.user);
      setSession(data.session);
      setIsGuest(false);
      localStorage.removeItem(GUEST_SESSION_KEY);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao realizar login.' };
    }
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    try {
      const cleanEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('User already registered')) {
          msg = 'Este e-mail já está cadastrado. Tente entrar.';
        } else if (msg.includes('Password should be at least')) {
          msg = 'A senha deve ter pelo menos 6 caracteres.';
        }
        return { success: false, error: msg };
      }

      // Se o usuário foi criado com sucesso mas não tem sessão ativa imediata, precisa confirmar e-mail
      const requiresEmailConfirmation = !data.session;

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        setIsGuest(false);
        localStorage.removeItem(GUEST_SESSION_KEY);
      }

      return { success: true, requiresEmailConfirmation };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao criar conta.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsGuest(false);
    localStorage.removeItem(GUEST_SESSION_KEY);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem(GUEST_SESSION_KEY, 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuest,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
