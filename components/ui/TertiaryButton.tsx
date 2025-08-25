import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";

type ButtonSize = "sm" | "md";
type HapticsKind = "light" | "medium" | "heavy" | "selection";
type HapticsOn = "pressIn" | "press" | "release" | "longPress";
type LoadingPlacement = "replace" | "start" | "end";

export type TertiaryButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;

  size?: ButtonSize;                 // "sm" (44dp) | "md" (52dp)
  fullWidth?: boolean;

  disabled?: boolean;
  loading?: boolean;
  loadingPlacement?: LoadingPlacement; // spinner position (default "replace")
  spinnerSize?: "small" | "large";

  underline?: boolean;               // force underline at rest (default false)
  multiline?: boolean;               // allow text wrap (auto-height)
  shrinkToFit?: boolean;             // single-line: auto-shrink a bit (default true)

  style?: ViewStyle;                 // container override
  labelStyle?: TextStyle;            // text override
  accessibilityLabel?: string;
  testID?: string;

  // Haptics
  haptics?: boolean | HapticsKind;   // default true ("selection")
  hapticsOn?: HapticsOn;             // default "pressIn"
};

const SIZES = {
  sm: { minH: 44, padV: 12, padH: 8, text: Typo.body2 },  // 16/20
  md: { minH: 52, padV: 14, padH: 10, text: Typo.body1 }, // 18/24
} as const;

function triggerHaptics(kind: HapticsKind) {
  if (Platform.OS === "web") return;
  const I = Haptics.ImpactFeedbackStyle;
  if (kind === "selection") Haptics.selectionAsync();
  else if (kind === "light") Haptics.impactAsync(I.Light);
  else if (kind === "medium") Haptics.impactAsync(I.Medium);
  else if (kind === "heavy") Haptics.impactAsync(I.Heavy);
}

function containerStyle(
  state: PressableStateCallbackType,
  {
    size,
    fullWidth,
    disabled,
  }: { size: ButtonSize; fullWidth?: boolean; disabled?: boolean }
): ViewStyle {
  const { minH, padV, padH } = SIZES[size];

  return {
    minHeight: minH,
    paddingVertical: padV,
    paddingHorizontal: padH,
    alignSelf: fullWidth ? "stretch" : "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // No background; text-only
    opacity: disabled ? 0.7 : 1,
  };
}

export default function TertiaryButton({
  label,
  children,
  onPress,
  onLongPress,

  size = "sm",
  fullWidth,

  disabled,
  loading,
  loadingPlacement = "replace",
  spinnerSize = "small",

  underline = false,
  multiline = false,
  shrinkToFit = true,

  style,
  labelStyle,
  accessibilityLabel,
  testID,

  haptics = true,
  hapticsOn = "pressIn",
}: TertiaryButtonProps) {
  const hapticKind: HapticsKind = haptics === true ? "selection" : (haptics as HapticsKind);
  const shouldHaptic = () => !disabled && !loading && !!haptics;

  const onPressIn = (e: GestureResponderEvent) => {
    if (shouldHaptic() && hapticsOn === "pressIn") triggerHaptics(hapticKind);
  };
  const onPressCb = (e: GestureResponderEvent) => {
    if (shouldHaptic() && hapticsOn === "press") triggerHaptics(hapticKind);
    onPress?.(e);
  };
  const onPressOut = () => {
    if (shouldHaptic() && hapticsOn === "release") triggerHaptics(hapticKind);
  };
  const onLongPressCb = (e: GestureResponderEvent) => {
    if (shouldHaptic() && hapticsOn === "longPress") triggerHaptics(hapticKind);
    onLongPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      onPressIn={onPressIn}
      onPress={onPressCb}
      onPressOut={onPressOut}
      onLongPress={onLongPressCb}
      disabled={disabled || loading}
      android_ripple={{ color: Colors.overlay }}
      style={(state) => [containerStyle(state, { size, fullWidth, disabled }), style]}
      testID={testID}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {(state) => {
        const color = disabled
          ? Colors.textSecondaryDark
          : state.pressed
          ? Colors.primaryDark   // pressed → primaryDark
          : Colors.primary;

        const Spinner = <ActivityIndicator size={spinnerSize} color={color} />;

        const showStart = loading && loadingPlacement === "start";
        const showEnd = loading && loadingPlacement === "end";
        const replace = loading && loadingPlacement === "replace";

        const textDeco =
          underline || state.pressed ? ("underline" as TextStyle["textDecorationLine"]) : "none";

        return (
          <View style={styles.row}>
            {showStart ? <View style={styles.start}>{Spinner}</View> : null}

            {replace ? (
              Spinner
            ) : children ? (
              <View style={styles.childWrap}>{children}</View>
            ) : (
              <Text
                style={[
                  SIZES[size].text,
                  styles.label,
                  { color, textDecorationLine: textDeco },
                  labelStyle,
                ]}
                numberOfLines={multiline ? undefined : 1}
                ellipsizeMode="tail"
                allowFontScaling
                maxFontSizeMultiplier={1.4}
                adjustsFontSizeToFit={!multiline && shrinkToFit}
                minimumFontScale={0.9}
              >
                {label}
              </Text>
            )}

            {showEnd ? <View style={styles.end}>{Spinner}</View> : null}
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  start: { marginRight: 8 },
  end: { marginLeft: 8 },
  childWrap: { flexShrink: 1, minWidth: 0 },
  label: { flexShrink: 1, minWidth: 0 },
});
