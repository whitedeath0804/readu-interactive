import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Neutral } from '@/constants/Colors';

type Props = { onPress?: () => void };

export default function UpButton({ onPress }: Props) {
  const handle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress?.();
  };
  return (
    <Pressable style={styles.btn} onPress={handle} accessibilityLabel="Scroll to top">
      <Svg width={22} height={22} viewBox="0 0 24 24">
        {/* Chevron up */}
        <Path d="M6 14l6-6 6 6" fill="none" stroke={Colors.text} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: Neutral.white10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
