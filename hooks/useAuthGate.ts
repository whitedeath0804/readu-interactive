import { useEffect } from "react";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import useAuthStore from "../store/useAuthStore";

export default function useAuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();
  const { isAuthenticated, isSubscribed } = useAuthStore();

  useEffect(() => {
    // Wait until the root navigator is mounted
    if (!navState?.key) return;

    const group = segments?.[0];
    const firstScreen = group === '(auth)' ? segments?.[1] : segments?.[0];
    const authSet = new Set([
      'welcome',
      'logIn',
      'forgot',
      'signIN',
      'phone-start',
      'phone',
      'payment',
      'onboarding',
    ]);
    const inAuthArea = group === '(auth)' || authSet.has(String(firstScreen ?? ''));

    if (!isAuthenticated) {
      if (!inAuthArea || firstScreen !== 'welcome') router.replace('/welcome');
      return;
    }

    if (isAuthenticated && !isSubscribed) {
      if (firstScreen !== 'payment') router.replace('/payment');
      return;
    }

    // Authenticated + subscribed: ensure we leave auth flow
    if (inAuthArea) {
      router.replace('/');
    }
  }, [navState?.key, segments, isAuthenticated, isSubscribed, router]);
}
