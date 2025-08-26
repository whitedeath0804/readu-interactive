import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import * as Haptics from "expo-haptics";
import React, { useMemo, useRef, useState } from "react";
import {
    FlatList,
    LayoutRectangle,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    UIManager,
    View,
    ViewStyle,
    findNodeHandle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export type SelectOption = { key: string; label: string };

export type SelectProps = {
  options: SelectOption[];

  value?: string;                 // controlled
  defaultValue?: string;          // uncontrolled
  onChange?: (key: string) => void;

  placeholder?: string;           // e.g., "Select your country"
  disabled?: boolean;
  fullWidth?: boolean;

  // visuals
  radius?: number;                // field/menu radius (default 12)
  fieldHeight?: number;           // default 56
  itemHeight?: number;            // default 44
  style?: ViewStyle;              // wrapper style (row container)
  menuMaxHeight?: number;         // default 320
  testID?: string;
};

export default function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  disabled,
  fullWidth = true,
  radius = 12,
  fieldHeight = 56,
  itemHeight = 44,
  style,
  menuMaxHeight = 320,
  testID,
}: SelectProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState<string | undefined>(defaultValue);
  const current = isControlled ? value : inner;

  const selected = useMemo(
    () => options.find((o) => o.key === current),
    [options, current]
  );

  const wrapperRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);

  const openMenu = () => {
    if (disabled) return;
    // measure position on screen to anchor the popover
    const node = findNodeHandle(wrapperRef.current);
    if (node && UIManager.measureInWindow) {
      UIManager.measureInWindow(
        node,
        (x: number, y: number, w: number, h: number) => {
          setAnchor({ x, y, width: w, height: h });
          setOpen(true);
          if (Platform.OS !== "web") Haptics.selectionAsync();
        }
      );
    } else {
      // fallback — still open, menu will span width of field’s layout
      setOpen(true);
      if (Platform.OS !== "web") Haptics.selectionAsync();
    }
  };

  const closeMenu = () => setOpen(false);

  const commit = (key: string) => {
    if (!isControlled) setInner(key);
    onChange?.(key);
    closeMenu();
    if (Platform.OS !== "web") Haptics.selectionAsync();
  };

  return (
    <View
      ref={wrapperRef}
      style={[
        styles.wrapper,
        fullWidth && { alignSelf: "stretch" },
        style,
      ]}
      testID={testID}
    >
      {/* FIELD */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        accessibilityState={{ disabled: !!disabled, expanded: open }}
        onPress={openMenu}
        disabled={disabled}
        style={({ pressed }) => [
          styles.field,
          {
            height: fieldHeight,
            borderRadius: radius,
            backgroundColor: Colors.backgroundAlt,     // Black 2
            borderColor: open ? Colors.primaryLight : Neutral.white10,
          },
          pressed && !disabled ? { opacity: 0.9 } : null,
          disabled ? { opacity: 0.6 } : null,
        ]}
      >
        <Text
          style={[
            Typo.body2,
            { color: Colors.textSecondary, flex: 1 },
            !current && { opacity: 0.7 }, // placeholder disabled look
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.4}
          allowFontScaling
        >
          {selected ? selected.label : placeholder}
        </Text>

        {/* chevron */}
        <View style={styles.chevronBox}>
          <ChevronUpDown open={open} />
        </View>
      </Pressable>

      {/* MENU (Popover) */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={closeMenu}>
        {/* Backdrop to close on outside tap */}
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

        <View
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
        >
          <View
            style={[
              styles.menu,
              {
                top: (anchor?.y ?? 0) + (anchor?.height ?? fieldHeight) + 4,
                left: anchor?.x ?? 0,
                width: anchor?.width ?? "100%",
                borderRadius: radius,
                maxHeight: menuMaxHeight,
                backgroundColor: Colors.backgroundAlt, // Black 2
                borderColor: Neutral.white10,          // White/10
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(o) => o.key}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => {
                const isSelected = item.key === current;
                return (
                  <Pressable
                    onPress={() => commit(item.key)}
                    style={({ pressed }) => [
                      styles.item,
                      {
                        height: itemHeight,
                        borderRadius: radius - 2,
                        backgroundColor:
                          pressed || isSelected ? Neutral.white10 : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[Typo.body2, { color: Colors.textSecondary, flex: 1 }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.label}
                    </Text>

                    {isSelected ? (
                      <View style={styles.checkBox}>
                        <CheckIcon color={Colors.success} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
              contentContainerStyle={{ padding: 8 }}
              showsVerticalScrollIndicator
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

//the ticker SVG
export function ChevronUpDown({ open }: { open: boolean }) {
  // simple chevron that flips when open
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {open ? (
        <Path
          d="M6 15l6-6 6 6"
          fill="none"
          stroke={Colors.textSecondary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <Path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke={Colors.textSecondary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M5 13l4 4 10-10"
        fill="none"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: "flex-start" },
  field: {
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  chevronBox: { marginLeft: 8 },
  menu: {
    position: "absolute",
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkBox: { marginLeft: 8 },
});
