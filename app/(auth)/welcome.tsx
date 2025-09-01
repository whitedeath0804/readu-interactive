import React from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = () => router.push('/LogIn');
  const handleGuest = () => router.replace('/(tabs)');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ImageBackground
        source={require('../../assets/images/onboarding-bg.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.65)"]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={insets.top}
          >
            <ScrollView
              contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) }]}
              keyboardShouldPersistTaps="handled"
            >
          <Animated.View style={styles.content} entering={FadeIn.duration(600)}>
            <Image
              source={require('../../assets/images/readu-logo-md.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="READU Interactive logo"
            />

            <Text style={[Typo.h2, styles.title, { color: Colors.text }]}> 
              Учи по ефективен начин{Platform.OS === 'ios' ? '\n' : ' '}с AI-обратна връзка
            </Text>

            <Text style={[Typo.body3Regular, styles.subtitle, { color: Colors.textSecondary }]}> 
              Получавайте незабавни съвети, печелете точки, поддържайте своя напредък и ги използвайте, за да получите помощ от AI.
            </Text>
          </Animated.View>

          <Animated.View
            style={styles.actions}
            entering={FadeInUp.delay(150).duration(600)}
          >
            <PrimaryButton
              label="Log in"
              size="lg"
              fullWidth
              onPress={handleLogin}
            />

            <SecondaryButton
              label="Continue as a guest"
              size="md"
              radius={12}
              fullWidth
              onPress={handleGuest}
            />
          </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  bg: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between' },
  scroll: { flexGrow: 1, justifyContent: 'space-between' },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 12,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.95,
  },
  actions: {
    gap: 12,
    paddingHorizontal: 24,
  },
});
