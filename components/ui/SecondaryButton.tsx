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
import Svg, { Path } from "react-native-svg";

/** Built-in Google icon (24x24) */
export function GoogleLogo24({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.3h6.5c-.3 1.5-1.1 2.7-2.3 3.6v3h3.7c2.2-2 3.6-4.9 3.6-8.6z"/>
      <Path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.8-3l-3.7-3c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.7-2.1-6.6-5H1.6v3.2C3.6 21 7.5 24 12 24z"/>
      <Path fill="#FBBC05" d="M5.4 14.2c-.2-.7-.3-1.5-.3-2.2s.1-1.5.3-2.2V6.6H1.6C.8 8.2.3 10 .3 12s.5 3.8 1.3 5.4l3.8-3.2z"/>
      <Path fill="#EA4335" d="M12 4.7c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.1 0 12 0 7.5 0 3.6 3 1.6 7.4l3.8 3C6.3 6.8 8.9 4.7 12 4.7z"/>
    </Svg>
  );
}

type ButtonSize = "sm" | "md";
type IconPlacement = "start" | "end";
type HapticsKind = "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error";
type HapticsOn = "pressIn" | "press" | "release" | "longPress";
type LoadingPlacement = "replace" | "start" | "end" | "overlay";

export type SecondaryButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  loadingPlacement?: LoadingPlacement; // NEW: where to show spinner (default 'replace')
  spinnerSize?: "small" | "large";     // NEW: spinner size
  fullWidth?: boolean;
  size?: ButtonSize;                   // "sm" (44h) | "md" (52h)
  icon?: React.ReactNode;
  iconPlacement?: IconPlacement;       // "start" | "end"
  multiline?: boolean;                 // allow wrapping (auto-height)
  shrinkToFit?: boolean;               // single-line auto-shrink (default true)
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  radius?: number;                     // default 24

  haptics?: boolean | HapticsKind;     // default true ("selection")
  hapticsOn?: HapticsOn;               // default "pressIn"
};

const SIZES = {
  sm: { height: 44, padV: 12, padH: 16, label: Typo.body2 },
  md: { height: 52, padV: 14, padH: 20, label: Typo.body1 },
} as const;

const MIN_WIDTH = 62;
const ICON_GAP = 8;

function triggerHaptics(kind: HapticsKind) {
  if (Platform.OS === "web") return;
  const I = Haptics.ImpactFeedbackStyle;
  const N = Haptics.NotificationFeedbackType;
  if (kind === "selection") return Haptics.selectionAsync();
  if (kind === "light") return Haptics.impactAsync(I.Light);
  if (kind === "medium") return Haptics.impactAsync(I.Medium);
  if (kind === "heavy") return Haptics.impactAsync(I.Heavy);
  if (kind === "success") return Haptics.notificationAsync(N.Success);
  if (kind === "warning") return Haptics.notificationAsync(N.Warning);
  if (kind === "error") return Haptics.notificationAsync(N.Error);
}

function containerStyle(
  state: PressableStateCallbackType,
  {
    size, fullWidth, disabled, radius, multiline,
  }: { size: ButtonSize; fullWidth?: boolean; disabled?: boolean; radius: number; multiline: boolean }
): ViewStyle {
  const { height, padV, padH } = SIZES[size];
  const borderColor = disabled
    ? Colors.textSecondary
    : state.pressed
    ? Colors.primaryDark
    : Colors.primary;

  return {
    minWidth: MIN_WIDTH,
    maxWidth: "100%",
    ...(multiline ? { minHeight: height } : { height }), // grow if wrapping
    paddingVertical: padV,
    paddingHorizontal: padH,
    borderRadius: radius,
    backgroundColor: Colors.text, // white
    borderWidth: 1.5,
    borderColor,
    alignSelf: fullWidth ? "stretch" : "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.7 : 1,
    overflow: "hidden",
  };
}

export default function SecondaryButton({
  label,
  children,
  onPress,
  onLongPress,
  disabled,
  loading,
  loadingPlacement = "replace",
  spinnerSize = "small",
  fullWidth,
  size = "sm",
  icon,
  iconPlacement = "start",
  multiline = false,
  shrinkToFit = true,
  accessibilityLabel,
  testID,
  style,
  labelStyle,
  radius = 24,
  haptics = true,
  hapticsOn = "pressIn",
}: SecondaryButtonProps) {
  const hapticKind: HapticsKind = haptics === true ? "selection" : (haptics as HapticsKind);
  const shouldHaptic = () => !disabled && !loading && haptics;

  const handlePressIn = (e: GestureResponderEvent) => {
    if (shouldHaptic() && hapticsOn === "pressIn") triggerHaptics(hapticKind);
  };
  const handlePress = (e: GestureResponderEvent) => {
    if (shouldHaptic() && hapticsOn === "press") triggerHaptics(hapticKind);
    onPress?.(e);
  };
  const handlePressOut = () => {
    if (shouldHaptic() && hapticsOn === "release") triggerHaptics(hapticKind);
  };
  const handleLongPress = (e: GestureResponderEvent) => {
    if (shouldHaptic() && hapticsOn === "longPress") triggerHaptics(hapticKind);
    onLongPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      onPressIn={handlePressIn}
      onPress={handlePress}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      disabled={disabled || loading} // disable interaction while loading
      style={(state) => [containerStyle(state, { size, fullWidth, disabled, radius, multiline }), style]}
      testID={testID}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {(state) => {
        const textColor = disabled
          ? Colors.textSecondaryDark
          : state.pressed
          ? Colors.primaryDark
          : Colors.primary;

        // Helpers for different loading placements
        const Spinner = <ActivityIndicator size={spinnerSize} color={textColor} />;
        const showStartSpinner = loading && loadingPlacement === "start";
        const showEndSpinner = loading && loadingPlacement === "end";
        const replaceContent = loading && loadingPlacement === "replace";
        const overlaySpinner = loading && loadingPlacement === "overlay";

        return (
          <View style={styles.row}>
            {/* Start area: icon or spinner at start */}
            {showStartSpinner ? (
              <View style={styles.iconBox}>{Spinner}</View>
            ) : icon && iconPlacement === "start" ? (
              <View style={styles.iconBox}>{icon}</View>
            ) : null}

            {/* Main content */}
            {replaceContent ? (
              Spinner
            ) : children ? (
              <View style={styles.childWrap}>{children}</View>
            ) : (
              <Text
                style={[SIZES[size].label, styles.label, { color: textColor }, labelStyle]}
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

            {/* End area: icon or spinner at end */}
            {showEndSpinner ? (
              <View style={styles.iconBox}>{Spinner}</View>
            ) : icon && iconPlacement === "end" ? (
              <View style={styles.iconBox}>{icon}</View>
            ) : null}

            {/* Overlay spinner (keeps label visible) */}
            {overlaySpinner ? (
              <View pointerEvents="none" style={styles.overlay}>
                {Spinner}
              </View>
            ) : null}
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0, // critical for text shrink beside icon
  },
  iconBox: {
    marginRight: ICON_GAP,
  },
  childWrap: {
    flexShrink: 1,
    minWidth: 0,
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
