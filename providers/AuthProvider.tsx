import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import getFirebaseAuth from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  PhoneAuthProvider,
  signInWithCredential,
  ApplicationVerifier,
  User,
  signInAnonymously,
} from 'firebase/auth';
import useAuthStore from '../store/useAuthStore';

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  signInPhoneStart: (phone: string, recaptcha?: ApplicationVerifier) => Promise<string>; // returns verificationId
  signInPhoneVerify: (verificationId: string, code: string) => Promise<void>;
  signInGuest: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getFirebaseAuth();
  const { setUser: setUserStore, clearUser } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
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
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUpEmail: async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
    },
    signOutUser: async () => {
      await signOut(auth);
    },
    sendReset: async (email) => {
      await sendPasswordResetEmail(auth, email);
    },
    signInPhoneStart: async (phone, recaptcha) => {
      // Note: In Expo, for native phone auth you typically use "expo-firebase-recaptcha".
      // Here we accept a RecaptchaVerifier instance created by the caller when on web.
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phone, recaptcha!);
      return verificationId;
    },
    signInPhoneVerify: async (verificationId, code) => {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
    },
    signInGuest: async () => {
      await signInAnonymously(auth);
    },
  }), [auth, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
