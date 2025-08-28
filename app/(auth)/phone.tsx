import React, { useRef, useState, useMemo } from 'react';
import { ImageBackground, View, Text } from 'react-native';
import CodeInput from '../../components/ui/CodeInput';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { useLocalSearchParams } from 'expo-router';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../../lib/firebase';
import { USE_RNFIREBASE } from '../../constants/firebaseProvider';

export default function PhoneVerify() {
  const { signInPhoneVerify, signInPhoneStart } = useAuth();
  const toast = useToast();
  const params = useLocalSearchParams<{ verificationId?: string; phone?: string }>();
  const [verificationId, setVerificationId] = useState<string>((params.verificationId as string) || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const phoneDisplay = useMemo(() => params.phone || '', [params.phone]);
  const recaptchaRef = useRef<FirebaseRecaptchaVerifierModal>(null);
  const [cooldown, setCooldown] = useState(0);

  async function onVerify() {
    try {
      setLoading(true);
      setError(null);
      await signInPhoneVerify(verificationId, code);
      toast.success('Телефонът е потвърден');
    } catch (e: any) {
      setError('Грешен код за потвърждение');
      toast.error('Грешен код за потвърждение');
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!params.phone || cooldown > 0) return;
    try {
      setCooldown(30);
      const verifier = USE_RNFIREBASE ? undefined : (recaptchaRef.current as any);
      const vid = await signInPhoneStart(params.phone as string, verifier);
      setVerificationId(vid);
      toast.success('Кодът е изпратен');
      const t = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (e: any) {
      setCooldown(0);
      toast.error('Грешка при изпращане', e?.message);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      {!USE_RNFIREBASE && (
        <FirebaseRecaptchaVerifierModal ref={recaptchaRef} firebaseConfig={firebaseConfig} />
      )}
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 24 }}>Код за потвърждение</Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>Въведи кода, изпратен на {phoneDisplay}</Text>

        <View style={{ height: 24 }} />
        <CodeInput cells={6} value={code} onChange={setCode} />
        {error ? <Text style={{ color: '#FF3B30', marginTop: 8 }}>{error}</Text> : null}

        <View style={{ height: 16 }} />
        <PrimaryButton disabled={loading || code.length < 6} onPress={onVerify}>Потвърди</PrimaryButton>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Не получи кода?{' '}
            <Text style={{ color: cooldown > 0 ? 'gray' : '#FF7A1A' }} onPress={onResend}>
              {cooldown > 0 ? `Изпрати отново след ${cooldown}с` : 'Изпрати отново'}
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

