import React from "react";
import {
  ActivityIndicator,
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
import { Colors, Primary } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import { Elevation } from "@/constants/elevation";

type ButtonSize = "sm" | "lg";
type IconPlacement = "start" | "end";

type HapticsKind =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

type HapticsOn = "pressIn" | "press" | "release" | "longPress";

export type PrimaryButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPlacement?: IconPlacement;
  multiline?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;

  /** Haptics config */
  haptics?: boolean | HapticsKind;      // default: true ('selection')
  hapticsOn?: HapticsOn;                // default: 'pressIn'
};

const SIZES = {
  sm: { height: 44, padV: 12, padH: 16, label: Typo.body2 },
  lg: { height: 52, padV: 14, padH: 20, label: Typo.body1 },
} as const;

const RADIUS = 12;
const MIN_WIDTH = 62;
const ICON_GAP = 8;

function triggerHaptics(kind: HapticsKind) {
  // Avoid on web to keep clicks crisp
  if (Platform.OS === "web") return;

  switch (kind) {
    case "selection":
      Haptics.selectionAsync();
      break;
    case "light":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case "medium":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "heavy":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case "success":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case "warning":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case "error":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
  }
}

function containerStyle(
  state: PressableStateCallbackType,
  { size, fullWidth, disabled }: { size: ButtonSize; fullWidth?: boolean; disabled?: boolean }
): ViewStyle {
  const { height, padV, padH } = SIZES[size];
  const bg = disabled ? "#CFCFD4" : state.pressed ? Primary.dark : Colors.primary;

  return {
    minWidth: MIN_WIDTH,
    maxWidth: "100%",
    height,
    paddingVertical: padV,
    paddingHorizontal: padH,
    borderRadius: RADIUS,
    backgroundColor: bg,
    alignSelf: fullWidth ? "stretch" : "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...(disabled ? {} : Elevation.courseCard),
    opacity: disabled ? 0.7 : 1,
    overflow: "hidden",
    ...Platform.select({
      web: (state as any).focused
        ? { outlineStyle: "auto" as any, outlineColor: Colors.border }
        : {},
    }),
  };
}

export default function PrimaryButton({
  label,
  children,
  onPress,
  onLongPress,
  disabled,
  loading,
  fullWidth,
  size = "sm",
  icon,
  iconPlacement = "start",
  multiline = false,
  accessibilityLabel,
  testID,
  style,
  labelStyle,
  haptics = true,
  hapticsOn = "pressIn",
}: PrimaryButtonProps) {
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
      disabled={disabled || loading}
      android_ripple={{ color: "rgba(255,255,255,0.18)" }}
      style={(state) => [containerStyle(state, { size, fullWidth, disabled }), style]}
      testID={testID}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {(state) => (
        <View style={styles.row}>
          {icon && iconPlacement === "start" ? <View style={styles.iconBox}>{icon}</View> : null}

          {loading ? (
            <ActivityIndicator size="small" color={Colors.text} />
          ) : children ? (
            <View style={styles.childWrap}>{children}</View>
          ) : (
            <Text
              style={[SIZES[size].label, { color: Colors.text }, labelStyle]}
              numberOfLines={multiline ? undefined : 1}
              ellipsizeMode="tail"
              allowFontScaling
              maxFontSizeMultiplier={1.4}
            >
              {label}
            </Text>
          )}

          {icon && iconPlacement === "end" ? <View style={styles.iconBox}>{icon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    marginHorizontal: ICON_GAP / 2,
  },
  childWrap: {
    flexShrink: 1,
  },
});
