import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";

type Size = "sm" | "md";

export type InputProps = Omit<TextInputProps, "placeholderTextColor"> & {
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;          // stretch to parent width (default true)
  size?: Size;                  // "sm" 48dp, "md" 60dp (default)

  left?: React.ReactNode;       // optional left slot
  right?: React.ReactNode;      // optional right slot

  containerStyle?: ViewStyle;

  // Built-in keyboard avoiding (optional; for many inputs prefer screen-level KAV)
  avoidKeyboard?: boolean;      // default false
  keyboardVerticalOffset?: number; // header height offset when avoidKeyboard=true
};

const SIZES: Record<Size, { h: number; font: any }> = {
  sm: { h: 48, font: Typo.body2 }, // 16/20
  md: { h: 60, font: Typo.body2 }, // keep body2 for consistency
};

export default function Input({
  label,
  helperText,
  error,
  disabled,
  fullWidth = true,
  size = "md",
  left,
  right,
  containerStyle,
  style,
  value,
  onFocus,
  onBlur,
  avoidKeyboard = false,
  keyboardVerticalOffset = 0,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const d = SIZES[size];

  const borderColor = error
    ? Colors.error
    : focused
    ? Colors.primaryLight
    : Neutral.white10;

  const Field = (
    <View style={[styles.wrap, fullWidth && { alignSelf: "stretch" }]}>
      {label ? (
        <Text style={[Typo.body3Regular, styles.label, { color: Colors.textSecondary }]}>{label}</Text>
      ) : null}

      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.field,
          {
            height: d.h,
            borderColor,
            backgroundColor: Colors.backgroundAlt,
            opacity: disabled ? 0.6 : 1,
          },
          containerStyle,
        ]}
        accessibilityRole="none"
      >
        {left ? <View style={styles.side}>{left}</View> : null}

        <TextInput
          ref={inputRef}
          value={value}
          style={[d.font, styles.input, { color: Colors.text }, style]}
          placeholderTextColor={Colors.textSecondary}
          editable={!disabled}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          selectionColor={Colors.primaryLight}
          {...rest}
        />

        {right ? <View style={styles.side}>{right}</View> : null}
      </Pressable>

      {helperText ? (
        <Text
          style={[
            Typo.body3Regular,
            { marginTop: 6, color: error ? Colors.error : Colors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );

  if (!avoidKeyboard) return Field;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ alignSelf: fullWidth ? "stretch" : "auto" }}
    >
      {Field}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { marginLeft: 4 },
  field: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 0, // center text vertically
  },
  side: { marginHorizontal: 8 },
});
