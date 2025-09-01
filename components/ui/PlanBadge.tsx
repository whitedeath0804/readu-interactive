import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';

export type PlanBadgeProps = {
  label: string;              // e.g., Premium | Free
  style?: ViewStyle;
};

export default function PlanBadge({ label, style }: PlanBadgeProps) {
  const gradient = Colors.gradient as [string, string];
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.badge, style]}
    >
      <Text style={[Typo.body3, styles.text]}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: Colors.text,
  },
});
