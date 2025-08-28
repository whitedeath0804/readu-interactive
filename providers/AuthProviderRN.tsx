import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import type { User } from 'firebase/auth';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  signInPhoneStart: (phone: string) => Promise<string>;
  signInPhoneVerify: (verificationId: string, code: string) => Promise<void>;
  signInGuest: () => Promise<void>;
};

// Lazy requires avoid breaking builds when RNFirebase isn't installed yet
function authModule() {
  const mod = require('@react-native-firebase/auth');
  return mod.default();
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Keep a simple map to store phone confirmations by verificationId
const pending: Record<string, any> = {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null as any);
  const [loading, setLoading] = useState(true);
  const { setUser: setUserStore, clearUser } = useAuthStore();

  useEffect(() => {
    const unsub = authModule().onAuthStateChanged((u: any) => {
      setUser(u as User | null);
      if (u) {
        setUserStore({
          uid: u.uid,
          email: u.email ?? null,
          phoneNumber: u.phoneNumber ?? null,
          displayName: u.displayName ?? null,
          photoURL: u.photoURL ?? null,
        });
      } else {
        clearUser();
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signInEmail: async (email, password) => {
      await authModule().signInWithEmailAndPassword(email, password);
    },
    signUpEmail: async (name, email, password) => {
      const cred = await authModule().createUserWithEmailAndPassword(email, password);
      if (name) await cred.user.updateProfile({ displayName: name });
    },
    signOutUser: async () => {
      await authModule().signOut();
    },
    sendReset: async (email) => {
      await authModule().sendPasswordResetEmail(email);
    },
    signInPhoneStart: async (phone) => {
      const confirmation = await authModule().signInWithPhoneNumber(phone);
      const vid = confirmation.verificationId;
      pending[vid] = confirmation;
      return vid;
    },
    signInPhoneVerify: async (verificationId, code) => {
      const confirmation = pending[verificationId];
      if (!confirmation) throw new Error('Missing confirmation for verificationId');
      await confirmation.confirm(code);
      delete pending[verificationId];
    },
    signInGuest: async () => {
      await authModule().signInAnonymously();
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
