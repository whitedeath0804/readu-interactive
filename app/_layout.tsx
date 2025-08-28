import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React from 'react';

import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppProviders from './providers';
import { STRIPE_PUBLISHABLE_KEY } from '../lib/stripe-client';
import { StripeProvider } from '@stripe/stripe-react-native';
import useAuthGate from '@/hooks/useAuthGate';

export default function RootLayout() {
  const [loaded] = useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  // Route gating: unauth -> (auth)/welcome, unpaid -> (auth)/payment
  useAuthGate?.();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AppProviders>
        <StatusBar style="auto" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </AppProviders>
    </StripeProvider>
  );
}
