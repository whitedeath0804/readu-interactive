import React from 'react';
import { ImageBackground, Image, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as ColorsTokens from '../../constants/Colors';
import * as TypographyTokens from '../../constants/Typography';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';

const Colors: any = ColorsTokens as any;
const Typography: any = TypographyTokens as any;

export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Image source={require('../../assets/images/readu-logo-4.png')} style={{ width: 120, height: 120, marginBottom: 24 }} resizeMode="contain" />
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 24, fontWeight: '700', marginBottom: 16 }}>
          Учи по‑умно с обратна връзка от AI
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontSize: 14, marginBottom: 32 }}>
          Вземи бързи съвети, печели точки и получавай помощ.
        </Text>
        <PrimaryButton onPress={() => router.push('/(auth)/logIn')}>
          Вход
        </PrimaryButton>
        <View style={{ height: 12 }} />
        <SecondaryButton onPress={() => router.push('/(tabs)')}>Продължи като гост</SecondaryButton>
      </View>
    </ImageBackground>
  );
}

