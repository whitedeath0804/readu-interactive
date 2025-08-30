import React from 'react';
import { ImageBackground, Image, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';

export default function Onboarding() {
  const router = useRouter();
  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Image source={require('../../assets/images/readu-logo-4.png')} style={{ width: 132, height: 132, marginBottom: 24 }} resizeMode="contain" />
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
          Учи по‑умно с обратна връзка от AI
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontSize: 14, marginBottom: 28 }}>
          Вземи бързи съвети, печели точки и получавай помощ.
        </Text>
        <PrimaryButton onPress={() => router.push('/logIn')}>Вход</PrimaryButton>
        <View style={{ height: 12 }} />
        <SecondaryButton onPress={() => router.push('/')}>Продължи като гост</SecondaryButton>
      </View>
    </ImageBackground>
  );
}



