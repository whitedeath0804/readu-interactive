// src/constants/colors.ts

// Primary brand colors
export const Primary = {
  main: "#FD6B23",   // main brand orange
  light: "#F4862A",  // lighter variant
  dark: "#D94C19",   // darker variant
};

// Success / Error states
export const Feedback = {
  success: "#0DC468", // success green
  error: "#FF4238",   // error red
};

// Neutral text + grayscale
export const Text = {
  secondary: "#CFCFD4", // light gray text
  secondaryDark: "#757575", // darker gray text
  white: "#FFFFFF",
};

export const Neutral = {
  white100: "#FFFFFF", // 100%
  white30: "rgba(255,255,255,0.3)",
  white10: "rgba(255,255,255,0.1)",

  black1: "#252525",
  black2: "#0F181C",
  overlay: "rgba(0,0,0,0.4)", // #000000 40%
};

// Accent colors
export const Accent = {
  gradientStart: "#EE2D31", // gradient start
  gradientEnd: "#F6892B",   // gradient end
  yellow: "#F9C136",
};

// Master export — semantic roles for components
export const Colors = {
  // Core brand
  primary: Primary.main,
  primaryLight: Primary.light,
  primaryDark: Primary.dark,

  // Feedback
  success: Feedback.success,
  error: Feedback.error,

  // Text
  text: Text.white,
  textSecondary: Text.secondary,
  textSecondaryDark: Text.secondaryDark,

  // Backgrounds
  background: Neutral.black1,
  backgroundAlt: Neutral.black2,
  backgroundElevated: "#1A1A1A", // custom mid background

  // Borders
  border: Text.secondaryDark,
  borderLight: Text.secondary,

  // Overlay
  overlay: Neutral.overlay,

  // Gradient + accents
  gradient: [Accent.gradientStart, Accent.gradientEnd] as const,
  yellow: Accent.yellow,
};
