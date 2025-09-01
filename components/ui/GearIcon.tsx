import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

export default function GearIcon({ size = 22, color = Colors.text }: { size?: number; color?: string }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.9 7.9 0 01-.2 1.8l2 1.6-2 3.4-2.3-1a8 8 0 01-3.1 1.8l-.4 2.4H9l-.4-2.4a8 8 0 01-3.1-1.8l-2.3 1-2-3.4 2-1.6A7.9 7.9 0 013 12c0-.6.1-1.2.2-1.8l-2-1.6 2-3.4 2.3 1A8 8 0 018.6 4.4L9 2h6l.4 2.4a8 8 0 013.1 1.8l2.3-1 2 3.4-2 1.6c.1.6.2 1.2.2 1.8z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
}

