import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, G, Path, Polygon, Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';

export function ReaduCoinIcon({ size = 24 }: { size?: number }) {
  const s = size;
  const r = s / 2;
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Defs>
        <SvgLinearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#EE2D31" />
          <Stop offset="100%" stopColor="#F6892B" />
        </SvgLinearGradient>
      </Defs>
      {/* Octagon */}
      <Polygon
        points="50,5 78,12 95,32 95,68 78,88 50,95 22,88 5,68 5,32 22,12"
        fill="url(#coinGrad)"
      />
      {/* subtle highlight */}
      <Circle cx="28" cy="28" r="6" fill="#fff" opacity={0.85} />
      <Circle cx="75" cy="74" r="5" fill="#fff" opacity={0.35} />
      {/* R letter */}
      <G>
        <SvgText
          x="50"
          y="60"
          fill="#FFFFFF"
          fontSize="40"
          fontWeight="700"
          fontFamily="Montserrat-Bold"
          textAnchor="middle"
        >
          R
        </SvgText>
      </G>
    </Svg>
  );
}

export function CoinsPill({ value, onPress, style }: { value: number; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.08)',
        },
        style,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <ReaduCoinIcon size={22} />
      <Text style={[Typo.body2, { color: Colors.text }]}>{value}</Text>
    </Pressable>
  );
}

export default ReaduCoinIcon;

