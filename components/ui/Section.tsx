import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';

export type SectionProps = {
  title: string;
  index: number;                  // order on the page for simple scroll animation
  scrollY: Animated.Value;        // shared scroll value from the parent
  children: React.ReactNode;
};

export default function Section({ title, index, scrollY, children }: SectionProps) {
  // Softer, shorter reveal so initial viewport is mostly visible
  const base = 120 + index * 220;

  const opacity = scrollY.interpolate({
    inputRange: [base - 80, base - 10, base + 40],
    outputRange: [0.9, 1, 1],
    extrapolate: 'clamp',
  });
  const translateY = scrollY.interpolate({
    inputRange: [base - 80, base + 40],
    outputRange: [4, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ marginTop: 18, opacity, transform: [{ translateY }] }}>
      <Text style={[Typo.h3, { color: Colors.text, marginBottom: 10 }]}>{title}</Text>
      <View>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
