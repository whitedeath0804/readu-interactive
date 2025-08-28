import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import useAuthStore from '../store/useAuthStore';

// Call from app/_layout.tsx to gate routes.
export default function useAuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isSubscribed } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated) {
      if (!inAuthGroup) router.replace('/welcome');
      return;
    }
    // Authenticated but not subscribed: allow auth flow and payment
    if (isAuthenticated && !isSubscribed) {
      // If trying to access tabs, push to payment
      if (!inAuthGroup) router.replace('/(auth)/payment');
      return;
    }
    // Authenticated and subscribed
    if (isAuthenticated && isSubscribed && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [segments, isAuthenticated, isSubscribed]);
}

