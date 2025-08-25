import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import Svg, { Path } from "react-native-svg";

type HapticsKind = "selection" | "light" | "medium" | "heavy";

export type SettingsMobileButtonProps = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;

  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;          // allow text wrap
  shrinkToFit?: boolean;        // single-line auto-shrink (default true)

  left?: React.ReactNode;       // optional leading icon/content
  right?: React.ReactNode;      // optional trailing icon; defaults to chevron

  style?: ViewStyle;            // container override
  labelStyle?: TextStyle;

  accessibilityLabel?: string;
  testID?: string;

  haptics?: boolean | HapticsKind; // default true ("selection")
};

const HEIGHT = 56;
const PAD = 16;
const GAP = 8;
const RADIUS = 12;

function containerStyle(
  state: PressableStateCallbackType,
  { fullWidth, disabled }: { fullWidth?: boolean; disabled?: boolean }
): ViewStyle {
  return {
    minHeight: HEIGHT,
    paddingHorizontal: PAD,
    paddingVertical: PAD, // matches Figma "Hug(56)" with 16/16
    borderRadius: RADIUS,
    backgroundColor: state.pressed ? Colors.backgroundAlt : Colors.background, // pressed=Black2, default=Black1
    alignSelf: fullWidth ? "stretch" : "flex-start",
    opacity: disabled ? 0.7 : 1,
    overflow: "hidden",
  };
}

function ChevronRight({ size = 20, color = Colors.text }: { size?: number; color?: string }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function SettingsMobileButton({
  label,
  onPress,
  onLongPress,
  disabled,
  fullWidth = true,
  multiline = false,
  shrinkToFit = true,
  left,
  right,
  style,
  labelStyle,
  accessibilityLabel,
  testID,
  haptics = true,
}: SettingsMobileButtonProps) {
  const doHaptic = () => {
    if (!haptics || disabled || Platform.OS === "web") return;
    if (haptics === true || haptics === "selection") Haptics.selectionAsync();
    else if (haptics === "light") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (haptics === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (haptics === "heavy") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: !!disabled }}
      onPress={(e) => {
        doHaptic();
        onPress?.(e);
      }}
      onLongPress={onLongPress}
      disabled={disabled}
      style={(state) => [containerStyle(state, { fullWidth, disabled }), styles.row, style]}
      testID={testID}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {/* Left side (icon + label) */}
      <View style={[styles.left, { gap: GAP }]}>
        {left}
        <Text
          style={[Typo.body2, styles.label, { color: Colors.text }, labelStyle]}
          numberOfLines={multiline ? undefined : 1}
          ellipsizeMode="tail"
          allowFontScaling
          maxFontSizeMultiplier={1.4}
          adjustsFontSizeToFit={!multiline && shrinkToFit}
          minimumFontScale={0.9}
        >
          {label}
        </Text>
      </View>

      {/* Right side (chevron) */}
      <View style={styles.right}>
        {right ?? <ChevronRight />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0, // allow label to shrink
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
  },
  right: {
    marginLeft: GAP,
    alignItems: "center",
    justifyContent: "center",
  },
});
