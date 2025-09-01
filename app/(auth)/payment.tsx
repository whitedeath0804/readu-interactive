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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import CloseButton from '@/components/ui/CloseButton';
import PlanBadge from '@/components/ui/PlanBadge';
import Input from '@/components/ui/Input';
import SecondaryButton from '@/components/ui/SecondaryButton';
import Checkbox from '@/components/ui/Checkbox';
import Select, { SelectOption } from '@/components/ui/Select';

const COUNTRIES: SelectOption[] = [
  { key: 'bg', label: 'Bulgaria' },
  { key: 'ro', label: 'Romania' },
  { key: 'gr', label: 'Greece' },
  { key: 'de', label: 'Germany' },
  { key: 'fr', label: 'France' },
];

export default function Payment() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { plan } = useLocalSearchParams<{ plan?: string }>();
  const isPremium = plan === 'premium';
  const planLabel = isPremium ? 'Premium' : plan === 'free' ? 'Free' : '—';
  const price = isPremium ? 22.89 : 0;

  // fields
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('bg');
  const [zip, setZip] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  // keyboard-safe padding (works iOS & Android without KAV jank)
  const [kb, setKb] = useState(0);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKb(Math.max(0, h - insets.bottom)); // avoid double padding with home indicator
    };
    const onHide = () => setKb(0);

    const s = Keyboard.addListener(showEvt, onShow);
    const hdl = Keyboard.addListener(hideEvt, onHide);
    return () => {
      s.remove();
      hdl.remove();
    };
  }, [insets.bottom]);

  const valid = useMemo(() => {
    const onlyDigits = (s: string) => s.replace(/\D/g, '');
    const cardOk = onlyDigits(card).length >= 12;
    const expOk = /^\d{2}\/\d{2}$/.test(exp);
    const cvcOk = /^\d{3,4}$/.test(cvc);
    const zipOk = zip.trim().length >= 3;
    return cardOk && expOk && cvcOk && zipOk;
  }, [card, exp, cvc, zip]);

  const handlePay = () => {
    // integrate payment SDK here
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ImageBackground
        source={require('../../assets/images/onboarding-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.78)']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={[styles.safe, { paddingHorizontal: 20 }]}>
        {/* tap outside to dismiss keyboard */}
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom + 24, 24) + kb,
              paddingTop: 4,
              rowGap: 0,
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="always"
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <CloseButton variant="back" size="sm" onPress={() => router.back()} />
              <Text style={[Typo.h2, styles.headerTitle, { color: Colors.text }]}>
                Payment method
              </Text>
            </View>

            {/* Selected plan */}
            <Text style={[Typo.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
              Selected Plan:
            </Text>
            <PlanBadge label={planLabel} style={{ marginTop: 6 }} />

            {/* Fields */}
            <View style={{ marginTop: 16, gap: 14 }}>
              <Input
                placeholder="Card number"
                value={card}
                onChangeText={setCard}
                keyboardType="number-pad"
                textContentType="creditCardNumber"
                returnKeyType="next"
                containerStyle={styles.fieldContainer}
                style={styles.fieldText}
              />

              <View style={{ flexDirection: 'row', columnGap: 12 }}>
                <Input
                  placeholder="MM/YY"
                  value={exp}
                  onChangeText={setExp}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  style={[styles.fieldText, { textAlign: 'center' }]}
                />
                <Input
                  placeholder="CVC"
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  style={[styles.fieldText, { textAlign: 'center' }]}
                />
              </View>

              {/* Country select */}
              <View style={{}}>
                <Select
                  options={COUNTRIES}
                  value={country}
                  onChange={setCountry}
                  placeholder="Country"
                  // If your Select supports containerStyle, uncomment the next line:
                  // containerStyle={styles.fieldContainer}
                />
              </View>

              <Input
                placeholder="ZIP code"
                value={zip}
                onChangeText={setZip}
                returnKeyType="done"
                containerStyle={styles.fieldContainer}
                style={styles.fieldText}
              />

              <Checkbox
                size="sm"
                checked={saveInfo}
                onChange={setSaveInfo}
                label="Save information for future payments"
              />
            </View>

            {/* CTA */}
            <View style={{ marginTop: 16 }}>
              <SecondaryButton
                fullWidth
                size="md"
                label={`Subscribe & Pay ${price.toFixed(2)} BGM`}
                disabled={!valid || price <= 0}
                onPress={handlePay}
                radius={14}
              />
            </View>
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  headerTitle: {},
  // visual match to dark rounded inputs in the mock
  fieldContainer: {
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(14, 20, 25, 0.85)',
    borderWidth: 0,
    overflow: 'hidden',
  },
  fieldText: {
    // ensure good legibility over the dark bg
    color: Colors.text,
  },
});
