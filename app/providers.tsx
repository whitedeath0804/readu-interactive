import React from 'react';
import { AuthProvider as WebAuthProvider } from '../providers/AuthProvider';
import { ToastProvider } from '../providers/ToastProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WebAuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </WebAuthProvider>
  );
}
