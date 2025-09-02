import React, { useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Colors, Neutral } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import { getCourse, countLessons, getCourseCoverSource } from '@/lib/courses';
import LessonPath from '@/components/course/LessonPath';
import UpButton from '@/components/ui/UpButton';
import * as Haptics from 'expo-haptics';
import Splash from '@/components/Splash';

export default function CourseScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const course = useMemo(() => getCourse(courseId ?? 'math-101'), [courseId]);
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showUp, setShowUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView | null>(null);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (e: any) => {
      const y = e.nativeEvent.contentOffset.y as number;
      setShowUp(y > 400);
    },
  });

  // No parallax — keep simple scroll

  if (!course) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[Typo.body2, { color: Colors.text }]}>Course not found</Text>
      </View>
    );
  }

  const totalLessons = countLessons(course);

  const handleOpenLesson = (lesson: { id: string; title: string }) => {
    Haptics.selectionAsync();
    router.push({ pathname: '/course/[courseId]/lesson/[lessonId]', params: { courseId: course.id, lessonId: lesson.id } });
  };

  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      {/* Static background (same as start) */}
      <ImageBackground
        source={require('@/assets/images/onboarding-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onLoadEnd={() => setLoading(false)}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} pointerEvents="none" />


      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={(r) => (scrollRef.current = (r as unknown as ScrollView) ?? null)}
          scrollEventThrottle={16}
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Header summary card */}
          <View style={{ padding: 16, paddingTop: 16 }}>
            <View style={{ backgroundColor: 'rgba(14,20,25,0.75)', borderRadius: 12, borderWidth: 1, borderColor: Neutral.white10, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={getCourseCoverSource(course)} style={{ width: 108, height: 84 }} resizeMode="cover" />
                <View style={{ flex: 1, padding: 12 }}>
                  <Text style={[Typo.body2, { color: Colors.text }]} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1, height: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      <View style={{ width: `${Math.round((course.progress ?? 0) * 100)}%`, height: '100%', backgroundColor: Colors.primaryLight, borderRadius: 6 }} />
                    </View>
                    <Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>{Math.round((course.progress ?? 0) * 100)}%</Text>
                    <Svg width={22} height={22} viewBox="0 0 24 24">
                      <Path d="M7 3h10l2 6-7 12L5 9l2-6z" fill="#F3E36F" stroke="#776C1E" strokeWidth={1.2} />
                    </Svg>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Title and summary */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[Typo.h3, { color: Colors.text, textAlign: 'center', marginBottom: 6 }]}>{totalLessons} урока общо</Text>
          </View>

          {/* Modules */}
          {course.modules.map((m, idx) => (
            <Animated.View
              key={m.id}
              style={{
                paddingHorizontal: 16,
                marginTop: idx === 0 ? 8 : 24,
                opacity: scrollY.interpolate({ inputRange: [idx * 180, idx * 180 + 140], outputRange: [0, 1], extrapolate: 'clamp' }),
                transform: [
                  {
                    translateY: scrollY.interpolate({ inputRange: [idx * 180, idx * 180 + 140], outputRange: [18, 0], extrapolate: 'clamp' }),
                  },
                ],
              }}
            >
              <Text style={[Typo.body2, { color: Colors.textSecondary, marginBottom: 8 }]}>{m.title}</Text>
              <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
              <LessonPath lessons={m.lessons as any} width={340} bubbleWidth={240} onPressLesson={handleOpenLesson} />
            </Animated.View>
          ))}
        </Animated.ScrollView>

        {/* Up button */}
        {showUp && (
          <View style={{ position: 'absolute', bottom: 24, right: 16 }}>
            <UpButton onPress={scrollToTop} />
          </View>
        )}
        {/* Loading Splash overlay */}
        {loading && (
          <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 20 }}>
            <Splash />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
