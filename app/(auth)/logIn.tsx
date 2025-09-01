import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton, { GoogleLogo24 } from '@/components/ui/SecondaryButton';
import Checkbox from '@/components/ui/Checkbox';
import CloseButton from '@/components/ui/CloseButton';

export default function LogIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const canSubmit = useMemo(() => identifier.trim().length > 0 && password.length >= 8, [identifier, password]);

  const onBack = () => router.back();
  const onForgot = () => console.log('Forgot password');
  const onRegister = () => router.push('/(auth)/SignIn');
  const onGoogle = () => console.log('Login with Google');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('../../assets/images/onboarding-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.75)"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={insets.top + 12}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) }]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <CloseButton variant="back" size="sm" onPress={onBack} accessibilityLabel="Back" />
                <Text style={[Typo.h2, styles.headerTitle, { color: Colors.text }]}>Log in</Text>
              </View>
              <Text style={[Typo.body3Regular, styles.lead, { color: Colors.textSecondary }]}>Welcome back! Please enter your details.</Text>

              {/* Form */}
              <View style={styles.form}>
              <Input
                placeholder="Email or phone number"
                value={identifier}
                onChangeText={setIdentifier}
                textContentType="emailAddress"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />

              <PasswordInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
              />

              <View style={styles.rowBetween}>
                <Checkbox label="Remember me" size="sm" checked={remember} onChange={setRemember} />
                <Pressable onPress={onForgot} accessibilityRole="button">
                  <Text style={[Typo.body2, { color: Colors.primary }]}>Forgot password?</Text>
                </Pressable>
              </View>

              <PrimaryButton
                label="Log in"
                size="lg"
                fullWidth
                disabled={!canSubmit}
                onPress={() => console.log('Login submit')}
                style={styles.cta}
              />

              <View style={styles.centerRow}>
                <Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>Don’t have an account? </Text>
                <Pressable onPress={onRegister} accessibilityRole="button">
                  <Text style={[Typo.body3, { color: Colors.primary }]}>Register now</Text>
                </Pressable>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.rule} />
                <Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>or</Text>
                <View style={styles.rule} />
              </View>

              <SecondaryButton
                label="Log in with Google"
                size="md"
                icon={<GoogleLogo24 />}
                fullWidth
                onPress={onGoogle}
                radius={12}
              />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1, paddingHorizontal: 20, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  headerTitle: {},
  lead: { marginTop: 8 },
  scrollContent: { paddingBottom: 24 },
  form: { marginTop: 16, gap: 14 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  centerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight },
  cta: { marginTop: 2 },
});
