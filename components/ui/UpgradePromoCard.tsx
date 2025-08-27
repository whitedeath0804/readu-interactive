import React, { useCallback, useRef, useState, useMemo } from "react";
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
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import CloseButton from "@/components/ui/CloseButton";

type Props = {
  title?: React.ReactNode | string;
  subtitle?: React.ReactNode | string;

  logoSource?: ImageSourcePropType;
  logoComponent?: React.ReactNode;

  onPress?: () => void;
  onDismiss?: () => void;

  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  logoTint?: string;
  titleLines?: number;
  subtitleLines?: number;

  animateIn?: boolean;
  durationIn?: number;   // ms
  durationOut?: number;  // ms

  closeSize?: "sm" | "md";
};

export default function UpgradePromoCard({
  title,
  subtitle,
  logoSource,
  logoComponent,
  onPress,
  onDismiss,
  style,
  titleStyle,
  subtitleStyle,
  logoTint = Colors.text,
  titleLines,
  subtitleLines,
  animateIn = true,
  durationIn = 180,
  durationOut = 220,
  closeSize = "sm",
}: Props) {
  const [measuredH, setMeasuredH] = useState(0);
  const isClosingRef = useRef(false);

  // Жива височина според съдържанието
  const contentH = useSharedValue(0);
  const firstLayoutDone = useRef(false);

  // За dismiss: "замразена" височина + флаг
  const staticH = useSharedValue(0);
  const isClosingSV = useSharedValue(0); // 0=open, 1=closing

  // Анимации
  const progress = useSharedValue(animateIn ? 0 : 1); // 1=open, 0=collapsed
  const tx = useSharedValue(0);                       // хор. плъзгане
  const cardW = useSharedValue(0);                    // ширина за праг

  React.useEffect(() => {
    progress.value = animateIn ? withTiming(1, { duration: durationIn }) : 1;
  }, [animateIn, durationIn, progress]);

  const onLayout = (e: LayoutChangeEvent) => {
    if (isClosingRef.current) return; // не пречим на dismiss
    const { height, width } = e.nativeEvent.layout;

    if (!firstLayoutDone.current) {
      firstLayoutDone.current = true;
      setMeasuredH(height);
      contentH.value = height; // първоначално без tween
    } else if (height !== measuredH) {
      setMeasuredH(height);
      contentH.value = withTiming(height, { duration: 180 }); // плавна промяна при текст
    }

    cardW.value = width;
  };

  const finishDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const closeCard = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // замразяваме височината за устойчив dismiss
    const freeze = contentH.value || measuredH || 0;
    staticH.value = freeze;
    isClosingSV.value = 1;

    // плъзгане вляво + колапс
    tx.value = withTiming(-(cardW.value || 300), { duration: Math.min(durationOut, 220) });
    progress.value = withTiming(0, { duration: durationOut }, (fin) => {
      if (fin) runOnJS(finishDismiss)();
    });
  }, [durationOut, finishDismiss, measuredH, contentH, staticH, isClosingSV, tx, cardW, progress]);

  // --- Жестове ---
  const closeTap = Gesture.Tap()
    .maxDuration(250)
    .onEnd((_e, success) => {
      if (success) runOnJS(closeCard)();
    });

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      // само наляво
      const next = Math.min(0, e.translationX);
      tx.value = next;
    })
    .onEnd((e) => {
      const threshold = Math.max(40, cardW.value * 0.25);
      const velocityDismiss = e.velocityX < -800;
      const distanceDismiss = tx.value < -threshold;

      if (velocityDismiss || distanceDismiss) {
        tx.value = withTiming(-(cardW.value || 300), { duration: 160 });
        runOnJS(closeCard)();
      } else {
        tx.value = withTiming(0, { duration: 160 });
      }
    });

  // --- СТИЛОВЕ (единствената промяна е тук) ---
  const containerA = useAnimatedStyle(() => {
    // базова височина: замразена при dismiss, жива при отворено
    const baseH = isClosingSV.value ? staticH.value : contentH.value;

    // фактор от плъзгането: 1 → 0 когато tx от 0 → -cardW
    const w = cardW.value || 1;
    const dragRatioRaw = 1 + tx.value / w; // tx е отрицателен
    const dragRatio = Math.max(0, Math.min(1, dragRatioRaw));

    // комбиниран фактор: едновременно уважаваме progress (dismiss) и dragRatio (приплъзване)
    const heightFactor = progress.value * dragRatio;

    const height = baseH * heightFactor;
    const opacity = heightFactor;
    const scale = 0.98 + 0.02 * heightFactor;
    const marginV = 12 * heightFactor;

    return {
      opacity,
      height,
      marginVertical: marginV,
      transform: [{ scale }],
    };
  }, []);

  const slideA = useAnimatedStyle(() => {
    return { transform: [{ translateX: tx.value }] };
  });

  // --- Nodes ---
  const TitleNode = useMemo(() => {
    if (title == null) return null;
    return React.isValidElement(title) ? (
      title
    ) : (
      <Text
        style={[Typo.body1, styles.title, titleStyle]}
        numberOfLines={titleLines}
        allowFontScaling
        maxFontSizeMultiplier={1.4}
      >
        {String(title)}
      </Text>
    );
  }, [title, titleLines, titleStyle]);

  const SubtitleNode = useMemo(() => {
    if (subtitle == null) return null;
    return React.isValidElement(subtitle) ? (
      subtitle
    ) : (
      <Text
        style={[Typo.body3Regular, styles.subtitle, subtitleStyle]}
        numberOfLines={subtitleLines}
        allowFontScaling
        maxFontSizeMultiplier={1.4}
      >
        {String(subtitle)}
      </Text>
    );
  }, [subtitle, subtitleLines, subtitleStyle]);

  return (
    <Animated.View style={[styles.animatedWrap, containerA, style]}>
      {/* Swipe-to-dismiss на цялата карта */}
      <GestureDetector gesture={pan}>
        <Animated.View style={[slideA]}>
          <LinearGradient
            colors={Colors.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
            onLayout={onLayout}
          >
            {/* Съдържание (отделно от close) */}
            <Pressable
              disabled={!onPress}
              onPress={onPress}
              android_ripple={
                onPress ? { color: "rgba(255,255,255,0.08)", foreground: true } : undefined
              }
              style={styles.rowPressable}
            >
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
                  {TitleNode}
                  {SubtitleNode}
                </View>
              </View>
            </Pressable>

            {/* Close — най-отгоре и със собствен Tap */}
            <View style={styles.closePos} pointerEvents="box-none">
              <GestureDetector gesture={closeTap}>
                <Pressable
                  onPress={closeCard}
                  hitSlop={12}
                  style={({ pressed }) => [styles.closeTouch, pressed && { opacity: 0.7 }]}
                >
                  <CloseButton size={closeSize} />
                </Pressable>
              </GestureDetector>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrap: { overflow: "hidden" },

  card: {
    minHeight: 100,
    borderRadius: 12,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    overflow: "hidden",
  },

  rowPressable: { borderRadius: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoBox: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  logoImg: { width: 40, height: 40 },
  textCol: { flex: 1 },

  closePos: { position: "absolute", top: 8, right: 8, zIndex: 10, elevation: 10 },
  closeTouch: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },

  title: { color: Colors.text },
  subtitle: { color: Colors.text, opacity: 0.9, marginTop: 4 },
});
