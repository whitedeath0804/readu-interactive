import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Stars from './Stars';
import { Colors, Neutral } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';

export type LessonBubbleProps = {
  title: string;
  stars: number;
  status?: 'locked' | 'unlocked' | 'current' | 'completed';
  color?: string; // main edge glow color
  width?: number;
  onPress?: () => void;
};

export default function LessonBubble({ title, stars, status = 'unlocked', color = Colors.primaryLight, width = 220, onPress }: LessonBubbleProps) {
  const disabled = status === 'locked';
  const bgGradient: readonly [string, string] = status === 'locked'
    ? ([Colors.backgroundElevated, Colors.background] as const)
    : Colors.gradient;
  const ringGradient: readonly [string, string] = status === 'locked'
    ? (['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.35)'] as const)
    : Colors.gradient;

  const handlePress = async () => {
    if (!disabled) await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress?.();
  };

  return (
    <View style={{ alignItems: 'center', width }}>
      {status !== 'locked' && <Stars value={stars} style={{ marginBottom: 10 }} />}
      <Pressable
        disabled={disabled}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.pressable,
          { width, opacity: disabled ? 0.6 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        {/* Gradient border ring */}
        <LinearGradient
          colors={ringGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.borderRing, { width }]}
        >
          {/* Inner gradient fill */}
          <LinearGradient
            colors={bgGradient}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.innerFill}
          >
            {/* Soft top highlight */}
            <LinearGradient
              colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.highlight}
            />
            <Text style={[Typo.body2, { color: Colors.text, textAlign: 'center' }]} numberOfLines={2}>
              {title}
            </Text>
          </LinearGradient>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    height: 92,
    borderRadius: 26,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRing: {
    height: 92,
    borderRadius: 26,
    padding: 2,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  innerFill: {
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 46,
    opacity: 0.35,
  },
  innerBorder: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
});
