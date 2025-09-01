import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import CloseButton from '@/components/ui/CloseButton';
import SegmentedPicker from '@/components/ui/SegmentedPicker';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Checkbox from '@/components/ui/Checkbox';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PlanCard from '@/components/ui/PlanCard';
import TertiaryButton from '@/components/ui/TertiaryButton';

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gutter = Math.round(Math.min(28, Math.max(16, width * 0.05)));

  // tabs: 0 details, 1 plan
  const [tab, setTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | 'gold' | undefined>();

  // form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);

  // --- KEYBOARD FIX: listen and pad bottom dynamically (no 3rd-party, works iOS & Android)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      // subtract bottom inset so we don't double-pad on iOS with home indicator
      setKeyboardHeight(Math.max(0, h - insets.bottom));
    };
    const onHide = () => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [insets.bottom]);
  // ----------------------------------------------------

  const emailOk = /.+@.+\..+/.test(email);
  const phoneOk = phone.trim().length >= 7; // basic len check
  const canNext = useMemo(
    () => name.trim().length > 1 && emailOk && phoneOk && password.length >= 8 && agree,
    [name, emailOk, phoneOk, password, agree]
  );

  const onRegister = () => setTab(1);
  const onBack = () => router.back();
  const gotoPayment = (plan: 'free' | 'premium') =>
    router.push({ pathname: '/payment', params: { plan } });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('../../assets/images/onboarding-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.75)']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={[styles.safe, { paddingHorizontal: gutter }]}>
        {/* Tap empty areas to dismiss keyboard */}
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: Math.max(insets.bottom + 24, 24) + keyboardHeight, // << dynamic
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="always"
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <CloseButton variant="back" size="sm" onPress={onBack} accessibilityLabel="Back" />
              <Text style={[Typo.h2, styles.headerTitle, { color: Colors.text }]}>
                Регистрация
              </Text>
            </View>
            <Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>
              Присъедини се! Създай своя акаунт по-долу.
            </Text>

            {/* Segmented */}
            <View style={{ marginTop: 16 }}>
              <SegmentedPicker
                segments={['Данни за вход', 'Избери план']}
                index={tab}
                onChange={setTab}
              />
            </View>

            {tab === 0 ? (
              <View style={{ gap: 14, marginTop: 16 }}>
                <Input placeholder="Име" value={name} onChangeText={setName} returnKeyType="next" />
                <Input
                  placeholder="Имейл"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                />
                <Input
                  placeholder="Телефонен номер"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  returnKeyType="next"
                />
                <PasswordInput placeholder="Парола" value={password} onChangeText={setPassword} />

                <View style={styles.rowBetween}>
                  <Checkbox
                    size="sm"
                    label="Запомни ме"
                    checked={remember}
                    onChange={setRemember}
                  />
                </View>

                <View style={styles.rowInline}>
                  <Checkbox size="sm" checked={agree} onChange={setAgree} />
                  <Text style={[Typo.body2, { color: Colors.textSecondary }]}>
                    {' '}
                    Съгласявам се с{' '}
                  </Text>
                  <TertiaryButton
                    size="sm"
                    label="Условията и Правилата"
                    onPress={() => console.log('Terms')}
                  />
                </View>

                <PrimaryButton
                  label="Напред"
                  size="lg"
                  disabled={!canNext}
                  fullWidth
                  onPress={onRegister}
                  style={{ marginTop: 2 }}
                />

                <View style={styles.centerRow}>
                  <Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>
                    Вече имаш акаунт?{' '}
                  </Text>
                  <TertiaryButton size="sm" label="Вход" onPress={() => router.back()} />
                </View>
              </View>
            ) : (
              <View style={{ gap: 16, marginTop: 16 }}>
                <PlanCard
                  title="Безплатен"
                  price="00.00 BGM"
                  period="/ месец"
                  features={[
                    { text: 'Пълен достъп до видео и упражнения', included: true },
                    { text: 'Ограничен достъп до AI чатботове', included: false },
                    { text: 'Ограничени езици (само C1)', included: false },
                  ]}
                  ctaLabel="Продължи"
                  selected={selectedPlan === 'free'}
                  onSelect={() => setSelectedPlan('free')}
                  onPress={() => gotoPayment('free')}
                />

                <PlanCard
                  title="Премиум"
                  price="22.89 BGM"
                  period="/ месец"
                  features={[
                    { text: 'Пълен достъп до видео и упражнения', included: true },
                    { text: 'Разширен достъп до AI чатботове', included: true },
                    { text: 'Достъп до всички езици', included: true },
                  ]}
                  highlight
                  ctaLabel="Продължи"
                  selected={selectedPlan === 'premium'}
                  onSelect={() => setSelectedPlan('premium')}
                  onPress={() => gotoPayment('premium')}
                  style={{ marginBottom: 8 }}
                />
              </View>
            )}
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  headerTitle: {},
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  centerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  rowInline: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
});
