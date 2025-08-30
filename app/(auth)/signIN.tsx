import React, { useMemo, useState } from 'react';
import { ImageBackground, View, Text, Pressable, ScrollView } from 'react-native';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Checkbox from '../../components/ui/Checkbox';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'expo-router';

type Step = 'details' | 'plan';

export default function SignIN() {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<'free' | 'premium'>('free');

  const { signUpEmail } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const canNext = useMemo(() => !!name && !!email && !!password && agree, [name, email, password, agree]);

  async function onNext() {
    if (!canNext) return;
    setStep('plan');
  }

  async function onContinue() {
    try {
      setLoading(true);
      await signUpEmail(name, email.trim(), password);
      toast.success('Акаунтът е създаден');
      if (plan === 'premium') {
        router.push('/payment');
      } else {
        router.replace('/');
      }
    } catch (e: any) {
      toast.error('Неуспешна регистрация', e?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/onboarding-bg.jpg')} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 24 }}>Регистрация</Text>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', marginTop: 16, marginBottom: 8 }}>
          <Pressable onPress={() => setStep('details')} style={{ marginRight: 16 }}>
            <Text style={{ color: step === 'details' ? '#FF7A1A' : '#fff', fontWeight: '700' }}>Данни за вход</Text>
          </Pressable>
          <Pressable onPress={() => setStep('plan')}>
            <Text style={{ color: step === 'plan' ? '#FF7A1A' : '#fff', fontWeight: '700' }}>Избери план</Text>
          </Pressable>
        </View>
        <View style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <View style={{ height: 2, backgroundColor: '#FF7A1A', width: step === 'details' ? '35%' : '70%' }} />

        {step === 'details' ? (
          <View>
            <View style={{ height: 16 }} />
            <Input value={name} onChangeText={setName} placeholder="Име" />
            <View style={{ height: 12 }} />
            <Input value={email} onChangeText={setEmail} placeholder="Имейл" autoCapitalize="none" />
            <View style={{ height: 12 }} />
            <Input value={phone} onChangeText={setPhone} placeholder="Телефон" keyboardType="phone-pad" />
            <View style={{ height: 12 }} />
            <PasswordInput value={password} onChangeText={setPassword} placeholder="Парола" />
            <View style={{ height: 12 }} />
            <Pressable onPress={() => setRemember(!remember)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Checkbox checked={remember} onChange={setRemember} />
              <Text style={{ color: '#fff', marginLeft: 8 }}>Запомни ме</Text>
            </Pressable>
            <Pressable onPress={() => setAgree(!agree)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox checked={agree} onChange={setAgree} />
              <Text style={{ color: '#fff', marginLeft: 8 }}>Съгласен съм с <Text style={{ color: '#FF7A1A' }}>Правила и условия</Text></Text>
            </Pressable>
            <View style={{ height: 16 }} />
            <PrimaryButton disabled={!canNext} onPress={onNext}>Напред</PrimaryButton>
          </View>
        ) : (
          <View>
            <View style={{ height: 16 }} />
            {/* Free card */}
            <Pressable onPress={() => setPlan('free')} style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, borderRadius: 16, borderColor: plan==='free' ? '#FF7A1A' : 'transparent', borderWidth: 1 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Безплатен</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>0.00 BGN / месец</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>• Достъп до видео и упражнения</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>• Ограничен достъп до AI чатботи</Text>
            </Pressable>
            <View style={{ height: 12 }} />
            {/* Premium card */}
            <Pressable onPress={() => setPlan('premium')} style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, borderRadius: 16, borderColor: plan==='premium' ? '#FF7A1A' : 'transparent', borderWidth: 1 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Премиум</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>22.89 BGN / месец</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>• Пълен достъп до съдържание</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>• Повече AI инструменти</Text>
            </Pressable>
            <View style={{ height: 16 }} />
            <PrimaryButton disabled={loading} onPress={onContinue}>Продължи</PrimaryButton>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

