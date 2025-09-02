import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import * as Haptics from 'expo-haptics';

export default function LessonScreen() {
  const { courseId, lessonId } = useLocalSearchParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();

  const goBack = async () => {
    await Haptics.selectionAsync();
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={[Typo.h3, { color: Colors.text }]}>Lesson</Text>
      <Text style={[Typo.body2Regular, { color: Colors.textSecondary, marginTop: 6 }]}>Course: {courseId}</Text>
      <Text style={[Typo.body2Regular, { color: Colors.textSecondary }]}>Lesson: {lessonId}</Text>
      <Pressable onPress={goBack} style={styles.btn}>
        <Text style={[Typo.body2, { color: Colors.text }]}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  btn: { marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
});

