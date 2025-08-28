import React from "react";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import { Elevation } from "@/constants/elevation"; // uses your elevation tokens

type Size = "sm" | "md";

export type CourseCardProps = {
  image: ImageSourcePropType;
  title: string;
  lessonsLabel?: string;

  /** 0..1; when undefined the bar is hidden */
  progress?: number;
  /** show auto-computed percent label when `progress` is set (default true) */
  showPercent?: boolean;
  /** override the right-side label (e.g., "45%") */
  progressLabel?: string;
  /** customize colors if needed */
  progressColor?: string; // default Colors.primaryLight
  trackColor?: string;    // default Neutral.white10

  size?: Size;           // default "md"
  width?: number;
  height?: number;
  style?: ViewStyle;

  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
};

const PRESETS = {
  sm: { width: 184, height: 216, imageH: 108, radius: 16, pad: 12 },
  md: { width: 224, height: 240, imageH: 128, radius: 16, pad: 12 },
} as const;

function cardStyle(
  state: PressableStateCallbackType,
  {
    radius,
    width,
    height,
    disabled,
  }: { radius: number; width: number; height: number; disabled?: boolean }
): ViewStyle {
  const pressed = state.pressed;
  return {
    width,
    height,
    borderRadius: radius,
    backgroundColor: Colors.background, // Black 1
    borderWidth: 1,
    borderColor: pressed ? Neutral.white30 : Neutral.white10,
    overflow: "hidden",
    opacity: disabled ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.985 : 1 }],
    ...(pressed ? Elevation.courseCardPressed : Elevation.courseCard),
    ...Platform.select({
      web: (state as any).focused
        ? { outlineStyle: "auto" as any, outlineColor: Colors.primaryLight }
        : {},
    }),
  };
}

/** Soft white glow halo behind the card (token-driven). */
function Glow({
  radius,
}: {
  radius: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        {
          borderRadius: radius,
          // white glow
          shadowColor: Colors.text,  // white100
          shadowOpacity: 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          // Android fallback: a subtle translucent ring
          backgroundColor: "transparent",
          elevation: 0, // keep main lift in the card itself
        },
      ]}
    />
  );
}

export default function CourseCard({
  image,
  title,
  lessonsLabel,
  progress,
  showPercent = true,
  progressLabel,
  progressColor = Colors.primaryLight,
  trackColor = Neutral.white10,
  size = "md",
  width,
  height,
  style,
  onPress,
  disabled,
}: CourseCardProps) {
  const p = PRESETS[size];
  const W = width ?? p.width;
  const H = height ?? p.height;

  const hasProgress = typeof progress === "number";
  const clamped = hasProgress ? Math.max(0, Math.min(1, progress!)) : 0;
  const autoLabel = `${Math.round(clamped * 100)}%`;
  const rightLabel = progressLabel ?? (showPercent && hasProgress ? autoLabel : undefined);

  const handlePress = (e: GestureResponderEvent) => {
    if (!disabled) Haptics.selectionAsync();
    onPress?.(e);
  };

  return (
    <View style={[{ width: W, height: H, borderRadius: p.radius }, style]}>
      {/* Glow halo underlay */}
      <Glow radius={p.radius} />

      {/* Actual card */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: !!disabled }}
        onPress={handlePress}
        disabled={disabled}
        style={(s) => [StyleSheet.absoluteFill, cardStyle(s, { radius: p.radius, width: W, height: H, disabled })]}
      >
        {(state) => (
          <>
            {/* Cover */}
            <Image source={image} resizeMode="cover" style={{ width: "100%", height: p.imageH }} />

            {/* Body */}
            <View style={{ flex: 1, padding: p.pad, gap: 8 }}>
              <Text
                style={[
                  Typo.body2,
                  { color: Colors.text },
                  state.pressed && { textDecorationLine: "underline", textDecorationColor: Colors.text },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {title}
              </Text>

              {!!lessonsLabel && (
                <Text
                  style={[
                    (Typo as any).body3Regular ?? { ...Typo.body3, fontWeight: "400" as const },
                    { color: Neutral.white30 },
                  ]}
                  numberOfLines={1}
                >
                  {lessonsLabel}
                </Text>
              )}

              {hasProgress && (
                <View style={styles.progressRow}>
                  <View
                    style={[
                      styles.progressTrack,
                      { backgroundColor: trackColor },
                    ]}
                    accessibilityRole="progressbar"
                    accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${clamped * 100}%`, backgroundColor: progressColor },
                      ]}
                    />
                  </View>

                  {!!rightLabel && (
                    <Text
                      style={[
                        (Typo as any).body3Regular ?? { ...Typo.body3, fontWeight: "400" as const },
                        { color: Neutral.white30 },
                      ]}
                    >
                      {rightLabel}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
