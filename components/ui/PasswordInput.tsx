import React, { useEffect, useRef, useState } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Neutral } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";

export type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;

  /** New */
  autoFocus?: boolean;            // default true
  autoFocusDelay?: number;        // default 200ms
  avoidKeyboard?: boolean;        // default false (use true if you prefer internal KAV)
  keyboardVerticalOffset?: number; // e.g., header height
};

export default function PasswordInput({
  label,
  helperText,
  error,
  disabled,
  fullWidth = true,
  containerStyle,
  style,
  value,
  autoFocus = true,
  autoFocusDelay = 200,
  avoidKeyboard = false,
  keyboardVerticalOffset = 0,
  ...rest
}: PasswordInputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // gentle autofocus after mount so layout is ready
  useEffect(() => {
    if (!autoFocus || disabled) return;
    const t = setTimeout(() => inputRef.current?.focus(), autoFocusDelay);
    return () => clearTimeout(t);
  }, [autoFocus, autoFocusDelay, disabled]);

  const borderColor = error
    ? Colors.error
    : focused
    ? Colors.primaryLight
    : Neutral.white10;

  const iconColor = Colors.textSecondary;

  const Field = (
    <View style={[styles.wrap, fullWidth && { alignSelf: "stretch" }]}>
      {label ? (
        <Text style={[Typo.body3Regular, styles.label, { color: Colors.text }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            borderColor,
            backgroundColor: Colors.backgroundAlt,
            opacity: disabled ? 0.6 : 1,
          },
          containerStyle,
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          style={[Typo.body2, styles.input, { color: Colors.text }, style]}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={!visible}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          selectionColor={Colors.primaryLight}
          returnKeyType="done"
          {...rest}
        />

        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={12}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Hide password" : "Show password"}
          style={styles.iconBtn}
        >
          <MaterialCommunityIcons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={iconColor}
          />
        </Pressable>
      </View>

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

  // Optional internal keyboard avoiding
  if (avoidKeyboard) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {Field}
      </KeyboardAvoidingView>
    );
  }
  return Field;
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { marginLeft: 4 },
  field: {
    height: 60,            // spec
    borderRadius: 12,      // spec
    borderWidth: 1,        // spec
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  iconBtn: { marginLeft: 8 },
});
