// app/_layout.tsx
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Stack, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
  });

  const navState = useRootNavigationState();

  // run the auth gate (see hook below: it waits for nav to be ready)

  useEffect(() => {
    if (fontsLoaded && navState?.key) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, navState?.key]);

  return (
    // <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      // <AppProviders>
        <>
          <StatusBar style="auto" />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
          </GestureHandlerRootView>
        </>
      // </AppProviders>
    // </StripeProvider>
  );
}
