import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import { Colors } from '@/constants/Colors';

type Props = {
  value: number; // 0..5
  size?: number;
  color?: string;
  mutedColor?: string;
  gap?: number;
  style?: any;
};

const Star = ({ filled, size = 16, color = Colors.yellow, mutedColor = 'rgba(255,255,255,0.55)' }: { filled: boolean; size?: number; color?: string; mutedColor?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 3l2.7 5.5 6.1.9-4.4 4.2 1 6.1L12 16.9 6.6 19.7l1-6.1L3.2 9.4l6.1-.9z"
      fill={filled ? color : mutedColor}
      stroke={filled ? 'transparent' : 'rgba(0,0,0,0.0)'}
      strokeWidth={0}
    />
  </Svg>
);

export default function Stars({ value, size = 16, color = Colors.yellow, mutedColor = 'rgba(255,255,255,0.3)', gap = 6, style }: Props) {
  const int = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <View style={[{ flexDirection: 'row', gap }, style]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < int} size={size} color={color} mutedColor={mutedColor as any} />
      ))}
    </View>
  );
}
