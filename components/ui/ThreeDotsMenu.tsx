import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  LayoutRectangle,
  findNodeHandle,
  UIManager,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, Neutral } from "@/constants/Colors";   // Neutral.white10 for 10% white
import { Typo } from "@/constants/Typography";

type Placement = "bottom-left" | "bottom-right" | "top-left" | "top-right";

export type ThreeDotsMenuItem = {
  key: string;
  label: string;
  destructive?: boolean;
  onPress?: () => void;
};

export type ThreeDotsMenuProps = {
  /** Controlled open; omit to use internal state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  items?: ThreeDotsMenuItem[];

  /** Where to place the menu relative to the trigger */
  placement?: Placement;         // default: "bottom-right"
  /** Extra px offsets applied after placement */
  offset?: { x?: number; y?: number };

  /** Accessibility */
  accessibilityLabel?: string;   // for the trigger
  testID?: string;
};

/** Small helper to measure trigger position in window coords */
function measureInWindow(viewRef: any): Promise<{ x: number; y: number; width: number; height: number; }> {
  return new Promise((resolve) => {
    const node = findNodeHandle(viewRef);
    if (!node) return resolve({ x: 0, y: 0, width: 0, height: 0 });
    UIManager.measureInWindow(node, (x, y, width, height) => resolve({ x, y, width, height }));
  });
}

export default function ThreeDotsMenu({
  open: openProp,
  onOpenChange,
  items = [
    { key: "default", label: "Set as default" },
    { key: "delete", label: "Delete", destructive: true },
  ],
  placement = "bottom-right",
  offset,
  accessibilityLabel = "More options",
  testID,
}: ThreeDotsMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : internalOpen;

  const triggerRef = useRef<View>(null);
  const [triggerFrame, setTriggerFrame] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [menuSize, setMenuSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const setOpen = useCallback(
    (next: boolean) => {
      if (isControlled) onOpenChange?.(next);
      else setInternalOpen(next);
    },
    [isControlled, onOpenChange]
  );

  const toggle = async () => {
    // haptic click
    if (Platform.OS !== "web") Haptics.selectionAsync();
    if (!open) {
      const frame = await measureInWindow(triggerRef.current);
      setTriggerFrame(frame);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // Compute absolute menu position inside the Modal
  const menuPosition = useMemo(() => {
    if (!triggerFrame) return { left: 0, top: 0 };
    const win = Dimensions.get("window");
    const pad = 8; // small separation from trigger

    // initial position based on placement
    let left = triggerFrame.x;
    let top = triggerFrame.y;

    switch (placement) {
      case "bottom-right":
        left = triggerFrame.x + triggerFrame.width - (menuSize.width || 108);
        top = triggerFrame.y + triggerFrame.height + pad;
        break;
      case "bottom-left":
        left = triggerFrame.x;
        top = triggerFrame.y + triggerFrame.height + pad;
        break;
      case "top-right":
        left = triggerFrame.x + triggerFrame.width - (menuSize.width || 108);
        top = triggerFrame.y - (menuSize.height || 68) - pad;
        break;
      case "top-left":
        left = triggerFrame.x;
        top = triggerFrame.y - (menuSize.height || 68) - pad;
        break;
    }

    // apply custom offsets (Figma showed ~ x:-88, y:24)
    if (offset?.x) left += offset.x;
    if (offset?.y) top += offset.y;

    // clamp to viewport
    const maxLeft = Math.max(0, win.width - (menuSize.width || 108) - 8);
    const maxTop = Math.max(0, win.height - (menuSize.height || 68) - 8);
    left = Math.min(Math.max(8, left), maxLeft);
    top = Math.min(Math.max(8, top), maxTop);

    return { left, top };
  }, [triggerFrame, placement, offset?.x, offset?.y, menuSize.width, menuSize.height]);

  const onSelect = (item: ThreeDotsMenuItem) => {
    setOpen(false);
    item.onPress?.();
  };

  return (
    <>
      {/* Trigger */}
      <Pressable
        ref={triggerRef}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.triggerBase,
          { backgroundColor: pressed || open ? Neutral.white10 : "transparent" },
        ]}
        testID={testID}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} // expand to ~44dp
      >
        {/* three dots */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Pressable>

      {/* Menu portal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        {/* overlay to close on outside tap */}
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          {/* stop propagation so presses inside menu don't close immediately */}
          <Pressable
            style={[styles.menu, { left: menuPosition.left, top: menuPosition.top }]}
            onPress={(e) => e.stopPropagation()}
            // measure size to keep inside viewport
            onLayout={(e) => setMenuSize(e.nativeEvent.layout as LayoutRectangle)}
          >
            {items.map((item) => {
              const color = item.destructive ? Colors.error : Colors.text;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [
                    styles.item,
                    { backgroundColor: pressed ? Neutral.white10 : "transparent" },
                  ]}
                >
                  <Text style={[Typo.body3, { color }]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const TRIGGER_SIZE = 20;

const styles = StyleSheet.create({
  triggerBase: {
    width: TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.text, // white dots
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  menu: {
    position: "absolute",
    minWidth: 108,
    maxWidth: 280,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.backgroundElevated ?? "#252525", // Black 1 surface
    borderWidth: 1,
    borderColor: Neutral.white10, // White/10p
    // subtle shadow (iOS/Web) + elevation (Android)
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    gap: 12,
  },
  item: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
