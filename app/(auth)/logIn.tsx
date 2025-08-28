import React, { useState } from 'react';
import { ImageBackground, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Checkbox from '../../components/ui/Checkbox';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import GoogleLogo24 from '../../components/GoogleLogo24';
import { useAuth } from '../../providers/AuthProvider';
import useAuthStore from '../../store/useAuthStore';
import { useToast } from '../../providers/ToastProvider';
import { ENABLE_GOOGLE, ENABLE_PHONE } from '../../constants/features';

export default function LogIn() {
  const router = useRouter();
  const { signInEmail } = useAuth();
  const { rememberMe, setRememberMe } = useAuthStore();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    try {
      setLoading(true);
      await signInEmail(email.trim(), password);
      toast.success('Успешен вход');
      router.replace('/(tabs)');
    } catch (e: any) {
      toast.error('Неуспешен вход', e?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 24 }}>Вход</Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>Добре дошъл! Моля, въведи детайлите си.</Text>

        <View style={{ height: 16 }} />
        <Input value={email} onChangeText={setEmail} placeholder="Имейл или телефон" autoCapitalize="none" />
        <View style={{ height: 12 }} />
        <PasswordInput value={password} onChangeText={setPassword} placeholder="Парола" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <Pressable onPress={() => setRememberMe(!rememberMe)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox checked={rememberMe} onChange={setRememberMe} />
            <Text style={{ color: '#fff', marginLeft: 8 }}>Запомни ме</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(auth)/forgot')}>
            <Text style={{ color: '#FF7A1A', fontWeight: '600' }}>Забравена парола?</Text>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />
        <PrimaryButton disabled={loading} onPress={onLogin}>Вход</PrimaryButton>

        {(ENABLE_GOOGLE || ENABLE_PHONE) && (
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>или</Text>
          </View>
        )}

        {ENABLE_GOOGLE && (
          <SecondaryButton onPress={() => toast.error('Google входът е временно недостъпен')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <GoogleLogo24 />
              <Text style={{ marginLeft: 8 }}>Вход с Google</Text>
            </View>
          </SecondaryButton>
        )}

        {ENABLE_PHONE && (
          <>
            <View style={{ height: 12 }} />
            <SecondaryButton onPress={() => router.push('/(auth)/phone-start')}>
              Вход с телефон
            </SecondaryButton>
          </>
        )}

        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Нямаш акаунт?{' '}
            <Text style={{ color: '#FF7A1A' }} onPress={() => router.push('/(auth)/signIN')}>Регистрирай се</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

