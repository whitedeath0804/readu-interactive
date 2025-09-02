import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, Marker } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import LessonBubble from './LessonBubble';
import type { Lesson } from '@/lib/courses';

type Props = {
  lessons: Lesson[];
  width?: number; // container width
  stepY?: number; // vertical distance between bubbles
  bubbleWidth?: number;
  onPressLesson?: (lesson: Lesson) => void;
};

/**
 * Renders an alternating left/right vertical path with dashed arrow connectors.
 * Layout is deterministic from lessons.length, so it’s safe for mock data.
 */
export default function LessonPath({ lessons, width = 340, stepY = 180, bubbleWidth = 230, onPressLesson }: Props) {
  const positions = useMemo(() => {
    const leftX = 20;
    const rightX = width - bubbleWidth - 20;
    return lessons.map((_, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? leftX : rightX;
      const y = i * stepY + 10;
      const cx = x + bubbleWidth / 2;
      return { x, y, cx, isLeft };
    });
  }, [lessons, width, bubbleWidth, stepY]);

  const height = (lessons.length - 1) * stepY + 120;

  return (
    <View style={{ width, height }}>
      {/* Dotted arrows overlay */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <Marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <Path d="M0,0 L6,3 L0,6 z" fill={Colors.primaryLight} />
          </Marker>
        </Defs>
        {positions.slice(0, -1).map((p, i) => {
          const n = positions[i + 1];
          const nextStatus = lessons[i + 1]?.status ?? 'unlocked';
          const strokeColor = nextStatus === 'locked' ? 'rgba(255,255,255,0.55)' : Colors.primaryLight;
          // cubic curve control points to make a nice S-curve
          const cp1x = p.cx + (p.isLeft ? 60 : -60);
          const cp1y = p.y + stepY * 0.35;
          const cp2x = n.cx + (p.isLeft ? -60 : 60);
          const cp2y = n.y - stepY * 0.35;
          const d = `M ${p.cx} ${p.y + 90} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${n.cx} ${n.y + 0}`;
          return (
            <Path
              key={`seg-${i}`}
              d={d}
              stroke={strokeColor}
              strokeWidth={3}
              strokeDasharray="6,8"
              fill="none"
              markerEnd={nextStatus === 'locked' ? undefined : 'url(#arrowHead)'}
            />
          );
        })}
        {/* Decorative small dots at start */}
        {positions[0] && <Circle cx={positions[0].cx} cy={positions[0].y + 90} r={3} fill={Colors.primaryLight} />}
      </Svg>

      {/* Bubbles */}
      {lessons.map((lsn, i) => {
        const p = positions[i];
        return (
          <View key={lsn.id} style={{ position: 'absolute', top: p.y, left: p.x }}>
            <LessonBubble
              title={lsn.title}
              stars={lsn.stars}
              status={lsn.status}
              color={lsn.color}
              width={bubbleWidth}
              onPress={() => onPressLesson?.(lsn)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({});
