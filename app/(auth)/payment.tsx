import React, { useState } from 'react';
import { ImageBackground, View, Text, Pressable } from 'react-native';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { presentPaymentSheet, STRIPE_PUBLISHABLE_KEY } from '../../lib/stripe-client';
import { useToast } from '../../providers/ToastProvider';
import useAuthStore from '../../store/useAuthStore';

export default function Payment() {
  const toast = useToast();
  const { uid, email, setSubscription } = useAuthStore();
  const [serverUrl, setServerUrl] = useState('http://localhost:4242');
  const [loading, setLoading] = useState(false);

  async function onPay() {
    try {
      setLoading(true);
      await presentPaymentSheet(serverUrl, { userId: uid ?? undefined, email: email ?? undefined, plan: 'premium' });
      setSubscription({ isSubscribed: true, plan: 'premium' });
      toast.success('Плащането е успешно');
    } catch (e: any) {
      toast.error('Неуспешно плащане', e?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 24 }}>Метод на плащане</Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>Избран план: <Text style={{ color: '#FF7A1A', fontWeight: '700' }}>Премиум</Text></Text>

        <View style={{ height: 16 }} />
        <Input value={serverUrl} onChangeText={setServerUrl} placeholder="URL на локалния сървър (http://localhost:4242)" />

        <View style={{ height: 16 }} />
        <PrimaryButton disabled={loading} onPress={onPay}>Продължи</PrimaryButton>
      </View>
    </ImageBackground>
  );
}
