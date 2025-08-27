import React, { useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextStyle,
  View,
  ViewStyle,
  Platform,
  useWindowDimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";

export type CodeInputProps = {
  cells?: number;                    // boxes (default 6)
  charsPerCell?: number;             // digits per box (default 1)

  value?: string;                    // controlled
  defaultValue?: string;             // uncontrolled
  onChange?: (code: string) => void;
  onFulfill?: (code: string) => void;

  error?: boolean;
  disabled?: boolean;

  /** When true, component computes cell size from available width */
  autoSize?: boolean;                // default true
  /** Bounds for auto sizing (dp) */
  minCellSize?: number;              // default 40
  maxCellSize?: number;              // default 64
  minGap?: number;                   // default 8
  maxGap?: number;                   // default 16

  /** If autoSize=false, you can provide explicit dimensions */
  cellSize?: number;                 // default 64 (when autoSize=false)
  gap?: number;                      // default 12 (when autoSize=false)

  radius?: number;                   // default 12
  textStyle?: TextStyle;
  style?: ViewStyle;

  showCaret?: boolean;               // default true
  testID?: string;
};

export default function CodeInput({
  cells = 6,
  charsPerCell = 1,
  value,
  defaultValue,
  onChange,
  onFulfill,
  error,
  disabled,

  autoSize = true,
  minCellSize = 40,
  maxCellSize = 64,
  minGap = 8,
  maxGap = 16,

  cellSize: fixedCellSize = 64,
  gap: fixedGap = 12,

  radius = 12,
  textStyle,
  style,
  showCaret = true,
  testID,
}: CodeInputProps) {
  const capacity = cells * charsPerCell;
  const controlled = typeof value === "string";
  const [inner, setInner] = useState<string>(
    defaultValue?.replace(/\D/g, "").slice(0, capacity) || ""
  );
  const code = controlled ? (value as string) : inner;

  const inputRef = useRef<RNTextInput>(null);
  const [focused, setFocused] = useState(false);

  // ---------- Responsive sizing ----------
  const { width: screenW } = useWindowDimensions();
  const [containerW, setContainerW] = useState<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.max(0, Math.round(e.nativeEvent.layout.width));
    if (w !== containerW) setContainerW(w);
  };

  const availableW = containerW ?? Math.floor(screenW); // fallback before first layout
  let gap = fixedGap;
  let cellSize = fixedCellSize;

  if (autoSize && availableW > 0) {
    // Try to find a cell size and gap that fit in available width
    // Start with max sizes and shrink as needed
    gap = maxGap;
    cellSize = maxCellSize;

    // total width needed = cells*cell + (cells-1)*gap
    const needed = (c: number, g: number) => cells * c + (cells - 1) * g;

    // If it doesn't fit, reduce gap first (to minGap)
    while (needed(cellSize, gap) > availableW && gap > minGap) gap -= 1;

    // If still too wide, reduce cell size down to minCellSize
    while (needed(cellSize, gap) > availableW && cellSize > minCellSize) cellSize -= 1;

    // Last resort: if still wider, clamp to available by shrinking equally
    if (needed(cellSize, gap) > availableW) {
      const totalGap = (cells - 1) * gap;
      cellSize = Math.max(minCellSize, Math.floor((availableW - totalGap) / cells));
    }
  }

  // font size ties to cell
  const fontSize = Math.round(cellSize * 0.42);
  const caretH = Math.round(cellSize * 0.5);

  // ---------- Data splitting ----------
  const activeCell = Math.min(Math.floor(code.length / charsPerCell), cells - 1);
  const segments = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < cells; i++) {
      const from = i * charsPerCell;
      arr.push(code.slice(from, from + charsPerCell));
    }
    return arr;
  }, [code, cells, charsPerCell]);

  function setCode(next: string) {
    const numeric = next.replace(/\D/g, "").slice(0, capacity);
    if (!controlled) setInner(numeric);
    onChange?.(numeric);
    if (numeric.length === capacity) {
      if (Platform.OS !== "web") Haptics.selectionAsync();
      onFulfill?.(numeric);
    }
  }

  function focusInput() {
    if (disabled) return;
    inputRef.current?.focus();
  }

  return (
    <View
      style={[styles.root, { gap }, style, { alignSelf: "stretch" }]}
      testID={testID}
      onLayout={onLayout}
    >
      {/* Hidden capture input */}
      <RNTextInput
        ref={inputRef}
        value={code}
        onChangeText={(t) => setCode(t)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoCapitalize="none"
        autoCorrect={false}
        caretHidden
        style={styles.hiddenInput}
        maxLength={capacity}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
      />

      {/* Cells */}
      {Array.from({ length: cells }).map((_, i) => {
        const filled = segments[i].length > 0;
        const isActive = focused && activeCell === i && !disabled;
        const borderColor = error
          ? Colors.error
          : isActive
          ? Colors.primaryLight
          : Neutral.white10;

        return (
          <Pressable
            key={i}
            onPress={focusInput}
            disabled={disabled}
            style={({ pressed }) => [
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                borderRadius: radius,
                borderColor,
                backgroundColor: Colors.backgroundAlt, // Black 2
                opacity: disabled ? 0.6 : 1,
              },
              pressed && !disabled && { transform: [{ scale: 0.98 }] },
              styles.cellShadow,
            ]}
          >
            <View style={styles.cellInner}>
              {filled ? (
                <Text
                  style={[
                    { fontSize },            // font scales with cell
                    Typo.body1,              // weight/lineHeight base
                    { color: Colors.text, lineHeight: fontSize * 1.25 },
                    textStyle,
                  ]}
                  numberOfLines={1}
                  allowFontScaling
                >
                  {segments[i]}
                </Text>
              ) : isActive && showCaret ? (
                <View style={{ width: 2, height: caretH, backgroundColor: Colors.text, borderRadius: 1 }} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
    zIndex: -1,
  },
  cell: {
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cellInner: { alignItems: "center", justifyContent: "center" },
  cellShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
