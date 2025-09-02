import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import PlanBadge from '@/components/ui/PlanBadge';
import Input from '@/components/ui/Input';
import CourseCard from '@/components/ui/CourseCard';
import { CoinsPill } from '@/components/ui/ReaduCoin';
import Svg, { Path } from 'react-native-svg';
import useAuthStore from '@/store/useAuthStore';
import GearIcon from '@/components/ui/GearIcon';
import Section from '@/components/ui/Section';
import { useRouter } from 'expo-router';

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const displayName = useAuthStore((s) => s.displayName) ?? 'приятелю';
  const [coins] = useState(25);

  const scrollY = useRef(new Animated.Value(0)).current;
  const greetOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0], extrapolate: 'clamp' });

  const lessonLabel = '16 урока';
  const courses = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        title: 'Learn English language online education course C1...',
        img: require('../../assets/images/readu-test-card.jpg'),
      })),
    [],
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />

      <ImageBackground
        source={require('../../assets/images/onboarding-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.55)' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* Header (scrolls with content) */}
          <View>
            <View style={[styles.rowBetween, { alignItems: 'center' }]}>
              <View style={[styles.row, { gap: 10, alignItems: 'center' }]}>
                <Image
                  source={require('../../assets/images/readu-logo-4.png')}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
                <PlanBadge label="Премиум" />
              </View>

              <View style={[styles.row, { gap: 10, alignItems: 'center' }]}>
                <CoinsPill value={coins} />
                <Pressable
                  style={styles.settingsBtn}
                  accessibilityLabel="Настройки"
                  onPress={() => {}}
                >
                  <GearIcon />
                </Pressable>
              </View>
            </View>

            <Animated.View style={{ marginTop: 14, opacity: greetOpacity }}>
              <Text style={[Typo.h2, { color: Colors.text }]}>Здрасти, {displayName}! Готов за учене?</Text>
              <Text style={[Typo.body2Regular, { color: Colors.textSecondary, marginTop: 6 }]}>
                Твоето учебно пътешествие започва тук, разгледай курсове.
              </Text>
            </Animated.View>

            {/* Search */}
            <View style={{ marginTop: 14, flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Търсене на курс…"
                  returnKeyType="search"
                  containerStyle={styles.inputBox}
                  style={{ color: Colors.text }}
                />
              </View>
              <Pressable accessibilityLabel="Филтър" style={styles.filterBtn} onPress={() => {}}>
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Path d="M4 7h16M7 12h10M10 17h4" stroke={Colors.text} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </Pressable>
            </View>
          </View>

          {/* Sections with reveal animation */}
          <Section title="Моите курсове" index={0} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              <CourseCard
                image={require('../../assets/images/readu-test-card.jpg')}
                title="Learn Calculations online education course. Lorem ipsum"
                lessonsLabel="32 урока"
                progress={0.45}
                progressLabel="45%"
              />
              <CourseCard
                image={require('../../assets/images/partial-react-logo.png')}
                title="Learn English language online education course C1..."
                lessonsLabel={lessonLabel}
              />
              <CourseCard
                image={require('../../assets/images/partial-react-logo.png')}
                title="Spanish course"
                lessonsLabel={lessonLabel}
              />
            </ScrollView>
          </Section>

          <Section title="Българска литература" index={1} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`lit-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="История" index={2} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`his-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="География" index={3} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`geo-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Химия" index={4} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`chem-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Биология" index={5} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`bio-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Математика" index={6} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`math-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Езици" index={7} scrollY={scrollY}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={`lang-${c.id}`} image={c.img} title={c.title} lessonsLabel={lessonLabel} />
              ))}
            </ScrollView>
          </Section>

          <Section title="AI Асистенти" index={8} scrollY={scrollY}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              {[
                { label: 'Математика AI', icon: (color: string) => <Path d="M4 12h16M12 4v16" stroke={color} strokeWidth={2} /> },
                { label: 'Езици AI', icon: (color: string) => <Path d="M4 7h16M7 12h10M9 17h6" stroke={color} strokeWidth={2} /> },
                { label: 'Наука AI', icon: (color: string) => <Path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" stroke={color} strokeWidth={2} fill="none" /> },
              ].map((it, idx) => (
                <View key={idx} style={{ alignItems: 'center', width: '31%' }}>
                  <Pressable style={styles.aiBtn} onPress={() => {}}>
                    <Svg width={28} height={28} viewBox="0 0 24 24">
                      {it.icon(Colors.text)}
                    </Svg>
                  </Pressable>
                  <Text style={[Typo.body3Regular, { color: Colors.textSecondary, marginTop: 6, textAlign: 'center' }]}>
                    {it.label}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  inputBox: {
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(14,20,25,0.85)',
    borderWidth: 0,
  },
  filterBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(14,20,25,0.85)',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(14,20,25,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  aiBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: 'rgba(14,20,25,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
