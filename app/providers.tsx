import React from 'react';
import { AuthProvider as WebAuthProvider } from '../providers/AuthProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { USE_RNFIREBASE } from '../constants/firebaseProvider';

function getAuthProviderComponent() {
  if (USE_RNFIREBASE) {
    try {
      const mod = require('../providers/AuthProviderRN');
      return mod.AuthProvider || mod.default || WebAuthProvider;
    } catch {
      // Fallback if RNFirebase not installed yet
      return WebAuthProvider;
    }
  }
  return WebAuthProvider;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const AuthComp = getAuthProviderComponent();
  return (
    <AuthComp>
      <ToastProvider>{children}</ToastProvider>
    </AuthComp>
  );
}
