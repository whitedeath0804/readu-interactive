import React, { useCallback, useState } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";

type Size = "sm" | "md" | "lg";

export type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (val: boolean) => void;
  size?: Size;                      // sm=24 md=28 lg=32
  disabled?: boolean;
  label?: React.ReactNode;
  multiline?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;                 // row wrapper
  boxStyle?: ViewStyle;              // square override
  haptics?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

const METRICS: Record<Size, { side: number; radius: number; border: number; icon: number; stroke: number }> = {
  sm: { side: 24, radius: 6,  border: 1.5, icon: 14, stroke: 2 },
  md: { side: 28, radius: 7,  border: 1.5, icon: 16, stroke: 2.25 },
  lg: { side: 32, radius: 8,  border: 1.5, icon: 18, stroke: 2.5 },
};

export default function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  size = "md",
  disabled,
  label,
  multiline = false,
  labelStyle,
  style,
  boxStyle,
  haptics = true,
  testID,
  accessibilityLabel,
}: CheckboxProps) {
  const isControlled = typeof checked === "boolean";
  const [inner, setInner] = useState(defaultChecked);
  const value = isControlled ? (checked as boolean) : inner;

  const toggle = useCallback(
    (_e?: GestureResponderEvent) => {
      if (disabled) return;
      const next = !value;
      if (!isControlled) setInner(next);
      onChange?.(next);
      if (haptics && Platform.OS !== "web") Haptics.selectionAsync();
    },
    [disabled, value, isControlled, onChange, haptics]
  );

  const m = METRICS[size];

  // Press ring (exact 0 0 0 3px white30)
  const p = useSharedValue(0);
  const onIn = () => !disabled && (p.value = withTiming(1, { duration: 90 }));
  const onOut = () => (p.value = withTiming(0, { duration: 120 }));
  const ringA = useAnimatedStyle(() => ({ opacity: p.value }));

  // Label styles: unchecked regular → checked semibold
  const regularLabel: TextStyle = (Typo as any).body2Regular ?? { ...Typo.body2, fontWeight: "400" as const };
  const boldLabel: TextStyle = Typo.body2;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel || (typeof label === "string" ? label : undefined)}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      onPress={toggle}
      onPressIn={onIn}
      onPressOut={onOut}
      disabled={disabled}
      style={[styles.row, { minHeight: m.side }, style]}
      testID={testID}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* Box wrapper = positioning context for ring */}
      <View style={[styles.boxWrap, { width: m.side, height: m.side, borderRadius: m.radius }]}>
        {/* the outline ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              borderRadius: m.radius + 3,
              borderWidth: 3,
              borderColor: Neutral.white30, // White/30
            },
            ringA,
          ]}
        />
        {/* the square box */}
        <View
          style={[
            {
              width: m.side,
              height: m.side,
              borderRadius: m.radius,
              backgroundColor: value ? Colors.success : Colors.backgroundAlt, // Black 2
              borderWidth: m.border,
              borderColor: value ? Colors.success : Neutral.white10,          // White/10
              alignItems: "center",
              justifyContent: "center",
            },
            boxStyle,
            disabled && { opacity: 0.7 },
          ]}
        >
          {value ? (
            <Svg width={m.icon} height={m.icon} viewBox="0 0 24 24">
              <Path
                d="M5 13l4 4 10-10"
                fill="none"
                stroke={Colors.text}
                strokeWidth={m.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : null}
        </View>
      </View>

      {/* Label */}
      {label != null ? (
        typeof label === "string" ? (
          <Text
            style={[value ? boldLabel : regularLabel, { color: Colors.text, marginLeft: 8 }, labelStyle]}
            numberOfLines={multiline ? undefined : 1}
            ellipsizeMode="tail"
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {label}
          </Text>
        ) : (
          <View style={{ marginLeft: 8, flexShrink: 1 }}>{label}</View>
        )
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start" },
  boxWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", top: -3, left: -3, right: -3, bottom: -3, opacity: 0 },
});
