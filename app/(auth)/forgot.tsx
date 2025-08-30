import React, { useState } from 'react';
import { ImageBackground, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';

export default function Forgot() {
  const router = useRouter();
  const { sendReset } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSend() {
    try {
      setLoading(true);
      await sendReset(email.trim());
      toast.success('Кодът е изпратен');
      router.push('/logIn');
    } catch (e: any) {
      toast.error('Грешка при изпращане', e?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 24 }}>Забравена парола?</Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>Ще изпратим код за потвърждение на имейла или телефона ти.</Text>
        <View style={{ height: 16 }} />
        <Input value={email} onChangeText={setEmail} placeholder="Имейл или телефонен номер" />
        <View style={{ height: 16 }} />
        <PrimaryButton disabled={loading} onPress={onSend}>Изпрати код</PrimaryButton>
      </View>
    </ImageBackground>
  );
}

