import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  ViewStyle,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import { Colors, Neutral } from "@/constants/Colors";

type Variant = "close" | "back";
type ButtonSize = "sm" | "md";
type HapticsKind = "selection" | "light" | "medium" | "heavy";

export type CloseButtonProps = {
  variant?: Variant;                  // "close" | "back"
  size?: ButtonSize;                  // "sm" (32) | "md" (44)
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
  haptics?: boolean | HapticsKind;    // default true ("selection")
};

const SIZES = {
  sm: { box: 32, icon: 16, stroke: 2 },
  md: { box: 44, icon: 20, stroke: 2.25 },
} as const;

function doHaptics(kind: HapticsKind | true | false | undefined) {
  if (!kind || Platform.OS === "web") return;
  if (kind === true || kind === "selection") Haptics.selectionAsync();
  else if (kind === "light") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (kind === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else if (kind === "heavy") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

function container(
  state: PressableStateCallbackType,
  { size, disabled }: { size: ButtonSize; disabled?: boolean }
): ViewStyle {
  const d = SIZES[size];
  return {
    width: d.box,
    height: d.box,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: state.pressed ? Neutral.white30 : Neutral.white10,
    opacity: disabled ? 0.7 : 1,
  };
}

function CloseIcon({ size = 16, stroke = 2, color = Colors.text }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </Svg>
  );
}

function BackIcon({ size = 20, stroke = 2, color = Colors.text }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 18l-6-6 6-6" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function CloseButton({
  variant = "close",
  size = "sm",
  onPress,
  onLongPress,
  disabled,
  style,
  accessibilityLabel,
  testID,
  haptics = true,
}: CloseButtonProps) {
  const d = SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (variant === "close" ? "Close" : "Back")}
      accessibilityState={{ disabled: !!disabled }}
      onPress={(e) => {
        doHaptics(haptics);
        onPress?.(e);
      }}
      onLongPress={onLongPress}
      disabled={disabled}
      style={(state) => [container(state, { size, disabled }), style]}
      testID={testID}
      // ensure comfortable tap target regardless of visual size
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {variant === "close" ? (
        <CloseIcon size={d.icon} stroke={d.stroke} />
      ) : (
        <BackIcon size={d.icon} stroke={d.stroke} />
      )}
    </Pressable>
  );
}
