// src/constants/typography.ts

// 1rem = 16px (Figma standard)
const REM = 16;

export const Typo = {
  // --- Headings ---
  h1: {
    fontFamily: "Montserrat-Bold", // Poppins replaced with Montserrat
    fontSize: 32,
    fontSizeRem: 2,
    lineHeight: 48,
    fontWeight: "600" as const,
  },
  h2: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    fontSizeRem: 1.5,
    lineHeight: 36,
    fontWeight: "600" as const,
  },
  h3: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    fontSizeRem: 1.25,
    lineHeight: 28,
    fontWeight: "600" as const,
  },

  // H4 has both 600 and 400 variants
  h4: {
    fontFamily: "Lato-Bold", // Semibold fallback
    fontSize: 20,
    fontSizeRem: 1.25,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4Regular: {
    fontFamily: "Lato-Regular",
    fontSize: 20,
    fontSizeRem: 1.25,
    lineHeight: 28,
    fontWeight: "400" as const,
  },

  // --- Body text ---
  body1: {
    fontFamily: "Lato-Bold",
    fontSize: 18,
    fontSizeRem: 1.125,
    lineHeight: 24,
    fontWeight: "600" as const,
  },

  body2: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    fontSizeRem: 1,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
  body2Regular: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontSizeRem: 1,
    lineHeight: 20,
    fontWeight: "400" as const,
  },

  body3: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontSizeRem: 0.875,
    lineHeight: 18,
    fontWeight: "600" as const,
  },
  body3Regular: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontSizeRem: 0.875,
    lineHeight: 20,
    fontWeight: "400" as const,
  },

  // --- Caption ---
  caption: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontSizeRem: 0.75,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
};
