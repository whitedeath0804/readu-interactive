import React, { useRef, useState } from 'react';
import { ImageBackground, View, Text } from 'react-native';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../../lib/firebase';
import { useRouter } from 'expo-router';
import { USE_RNFIREBASE } from '../../constants/firebaseProvider';

export default function PhoneStart() {
  const toast = useToast();
  const { signInPhoneStart } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<FirebaseRecaptchaVerifierModal>(null);

  async function onSend() {
    try {
      setLoading(true);
      const verifier = USE_RNFIREBASE ? undefined : (recaptchaRef.current as any);
      const verId = await signInPhoneStart(phone.trim(), verifier);
      toast.success('Кодът е изпратен');
      router.push({ pathname: '/(auth)/phone', params: { verificationId: verId, phone } });
    } catch (e: any) {
      toast.error('Грешка при изпращане', e?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      {!USE_RNFIREBASE && (
        <FirebaseRecaptchaVerifierModal ref={recaptchaRef} firebaseConfig={firebaseConfig} />
      )}
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 24 }}>Вход с телефон</Text>
        <View style={{ height: 16 }} />
        <Input value={phone} onChangeText={setPhone} placeholder="Телефонен номер" keyboardType="phone-pad" />
        <View style={{ height: 16 }} />
        <PrimaryButton disabled={loading || !phone} onPress={onSend}>Изпрати код</PrimaryButton>
      </View>
    </ImageBackground>
  );
}

