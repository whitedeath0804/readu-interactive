import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";

export type Segment = string | { key: string; label: string };
type Size = "sm" | "md";

export type SegmentedPickerProps = {
  segments: Segment[];
  index?: number;                   // controlled
  defaultIndex?: number;            // uncontrolled
  onChange?: (i: number) => void;

  size?: Size;                      // sm: 36, md: 44
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;

  haptics?: boolean;                // default true
  animationMs?: number;             // default 200
  innerPadding?: number;            // default 8

  /** Optional overrides (all default to your tokens) */
  trackBg?: string;                 // default Neutral.white10
  trackBorder?: string;             // default Neutral.white10
  thumbBg?: string;                 // default Colors.primaryLight  ← per your request
  unselectedColor?: string;         // default Neutral.white10
};

const HEIGHT: Record<Size, number> = { sm: 36, md: 44 };

const getLabel = (s: Segment) => (typeof s === "string" ? s : s.label);
const getKey   = (s: Segment, i: number) =>
  typeof s === "string" ? `${s}-${i}` : s.key || `${s.label}-${i}`;

export default function SegmentedPicker({
  segments,
  index,
  defaultIndex = 0,
  onChange,
  size = "md",
  disabled,
  fullWidth = true,
  style,
  haptics = true,
  animationMs = 200,
  innerPadding = 8,
  // token defaults
  trackBg = Neutral.white30,
  trackBorder = Neutral.white30,
  thumbBg = Colors.primaryLight,         // <<< primary light as selected pill
  unselectedColor = Colors.textSecondary,
}: SegmentedPickerProps) {
  const count = segments.length;
  const controlled = typeof index === "number";
  const [innerIndex, setInnerIndex] = useState(defaultIndex);
  const curr = controlled ? (index as number) : innerIndex;

  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.max(0, Math.round(e.nativeEvent.layout.width));
    if (w !== width) setWidth(w);
  };

  // geometry
  const trackH = HEIGHT[size];
  const borderW = 1;
  const innerW = Math.max(0, width - innerPadding * 1 - borderW * 2);
  const segW = count > 0 ? innerW / count : 0;

  // animation
  const pos = useSharedValue(curr);
  useEffect(() => {
    pos.value = withTiming(curr, {
      duration: animationMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [curr, animationMs, pos]);

  const thumbA = useAnimatedStyle(() => ({
    transform: [{ translateX: segW * pos.value }],
    width: segW,
  }));

  const handleChange = (i: number) => {
    if (disabled || i === curr) return;
    if (!controlled) setInnerIndex(i);
    onChange?.(i);
    if (haptics) Haptics.selectionAsync();
  };

  // keep same font size for perfect centering; selected just increases weight
  const baseFont: any = Typo.body2; // your tokens (16/20)
  const centerLineHeight = baseFont?.lineHeight ?? 16;

  const selectedText   = [
    baseFont,
    centerText(centerLineHeight),
    { color: Colors.text, fontWeight: "600" as const },
  ];
  const unselectedText = [
    baseFont,
    centerText(centerLineHeight),
    { color: unselectedColor, fontWeight: "400" as const },
  ];

  return (
    <View
      accessibilityRole="tablist"
      onLayout={onLayout}
      style={[
        styles.wrap,
        { height: trackH, borderRadius: trackH / 2 },
        fullWidth && { alignSelf: "stretch" },
        style,
      ]}
    >
      {/* Track */}
      <View
        style={[
          styles.track,
          {
            height: trackH,
            borderRadius: trackH / 2,
            backgroundColor: trackBg,
            borderColor: trackBorder,
            borderWidth: 1,
            padding: innerPadding,
          },
          disabled && { opacity: 0.4 },
        ]}
      >
        {/* Thumb (selected pill) */}
        <Animated.View
          style={[
            styles.thumb,
            {
              height: trackH - innerPadding * 1,
              borderRadius: (trackH - innerPadding * 1) / 2,
              backgroundColor: thumbBg, // Colors.primaryLight
            },
            styles.thumbShadow,
            thumbA,
          ]}
        />

        {/* Labels / hit areas */}
        <View style={styles.row}>
          {segments.map((seg, i) => {
            const selected = i === curr;
            return (
              <Pressable
                key={getKey(seg, i)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={styles.segmentPress}
                onPress={() => handleChange(i)}
                disabled={disabled}
              >
                <Text
                  style={selected ? selectedText : unselectedText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling
                >
                  {getLabel(seg)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const centerText = (lh: number) => ({
  includeFontPadding: false,
  textAlignVertical: "center",
  lineHeight: lh,
});

const styles = StyleSheet.create({
  wrap: { justifyContent: "center" },
  track: {
    borderWidth: 1,
    overflow: "hidden",
    // soft, even base shadow so the pill doesn't look offset
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  thumb: { position: "absolute", left: 0, top: 0 },
  thumbShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: { flexDirection: "row", width: "100%", height: "100%" },
  segmentPress: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
});
