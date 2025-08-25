import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import CloseButton from "@/components/ui/CloseButton";

type Props = {
  title?: string;
  subtitle?: string;
  logoSource?: ImageSourcePropType;    // PNG is fine; tint only works if transparent
  logoComponent?: React.ReactNode;     // custom JSX/SVG
  onPress?: () => void;                // tap the card surface
  /** Called when the close animation fully finishes (good place to unmount) */
  onDismiss?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  logoTint?: string;
  /** Animate appearing on mount */
  animateIn?: boolean;
  /** Animation timings (ms) */
  durationIn?: number;
  durationOut?: number;
};

export default function UpgradePromoCard({
  title = "Повече с Gold",
  subtitle = "неограничен достъп до лекции, упражнения и 3D модели. AI БЕЗ ограничения",
  logoSource,
  logoComponent,
  onPress,
  onDismiss,
  style,
  titleStyle,
  subtitleStyle,
  logoTint = Colors.text,
  animateIn = true,
  durationIn = 180,
  durationOut = 200,
}: Props) {
  // Measure natural height so we can collapse smoothly
  const [measuredH, setMeasuredH] = useState<number | null>(null);
  const measuredOnce = useRef(false);

  const progress = useSharedValue(animateIn ? 0 : 1); // 0 -> hidden, 1 -> shown
  const closing = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => {
    if (measuredOnce.current) return;
    measuredOnce.current = true;
    const h = e.nativeEvent.layout.height;
    setMeasuredH(h);
    if (animateIn) {
      progress.value = withTiming(1, { duration: durationIn });
    }
  };

  const closeCard = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, { duration: durationOut }, (finished) => {
      if (finished && onDismiss) runOnJS(onDismiss)();
    });
  }, [durationOut, onDismiss, progress]);

  const containerA = useAnimatedStyle(() => {
    // If we know the height, animate it; otherwise fade/scale only
    const scale = 0.98 + 0.02 * progress.value;  // 0.98 → 1.00
    const opacity = progress.value;
    const height = measuredH ? measuredH * progress.value : undefined;
    const marginV = measuredH ? 12 * progress.value : undefined; // optional soft collapse margin
    return {
      opacity,
      transform: [{ scale }],
      height,
      marginVertical: marginV,
    };
  }, [measuredH]);

  return (
    <Animated.View
      style={[styles.animatedWrap, containerA, style]}
      // We still need overflow hidden for height collapse
    >
      <Pressable onPress={onPress} disabled={!onPress} style={styles.wrap}>
        <LinearGradient
          colors={Colors.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
          onLayout={onLayout}
        >
          {/* Close button (white10 → white30 handled inside CloseButton) */}
          <View style={styles.closePos}>
            <CloseButton size="sm" onPress={closeCard} />
          </View>

          {/* Content */}
          <View style={styles.row}>
            <View style={styles.logoBox}>
              {logoComponent ? (
                logoComponent
              ) : logoSource ? (
                <Image
                  source={logoSource}
                  style={[styles.logoImg, { tintColor: logoTint }]}
                  resizeMode="contain"
                />
              ) : null}
            </View>

            <View style={styles.textCol}>
              <Text style={[Typo.body1, styles.title, titleStyle]}>{title}</Text>
              <Text style={[Typo.body3Regular, styles.subtitle, subtitleStyle]}>{subtitle}</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrap: {
    overflow: "hidden",
  },
  wrap: { width: "100%" },
  card: {
    minHeight: 100,
    borderRadius: 12,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    overflow: "hidden",
  },
  closePos: { position: "absolute", top: 8, right: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoBox: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  logoImg: { width: 40, height: 40 },
  textCol: { flex: 1 },
  title: { color: Colors.text },
  subtitle: { color: Colors.text, opacity: 0.9, marginTop: 4 },
});
