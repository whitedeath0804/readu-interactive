# READU Interactive – UI & Components Guide

Short guide to structure, tokens, components, and screens. Updated for the latest Home screen, coins, animations, and payment input formatting/localization.

## Stack

- Expo + React Native with Expo Router
- TypeScript/TSX components
- Animated (RN) for lightweight scroll animations
- expo-haptics for tactile feedback
- Safe Area Context for insets

## Project Layout

- Screens (Expo Router): `app/`
  - `app/index.tsx` → redirects to `/(tabs)` (main app)
  - `app/(tabs)/index.tsx` – Home screen (main page)
  - `app/(auth)/welcome.tsx` – marketing welcome
  - `app/(auth)/LogIn.tsx` – login form
  - `app/(auth)/SignIn.tsx` – registration (details + plan selection)
  - `app/(auth)/payment.tsx` – payment method and checkout
  - Layouts: `app/_layout.tsx`, `app/(auth)/_layout.tsx`, `app/(tabs)/_layout.tsx`
- Reusable UI: `components/ui/`
- Design tokens: `constants/` (Colors, Typography, elevation)

## Design Tokens

Use tokens instead of raw values:

- Colors: `Colors.primary`, `Colors.text`, `Colors.background`, `Colors.gradient`, etc.
- Typography: `Typo.h1/h2/h3`, `Typo.body2`, `Typo.body3Regular`, etc.
- Elevation: shadow presets for cards and surfaces.

Fonts load in `app/_layout.tsx` (`Montserrat`, `Lato`).

## UI Components (components/ui)

- Buttons: `PrimaryButton`, `SecondaryButton`, `TertiaryButton`
- Inputs: `Input`, `PasswordInput`, `CodeInput`, `Select`
- Selection & Nav: `Checkbox`, `SegmentedPicker`, `CloseButton`, `SettingsMobileButton`
- Content: `CourseCard`, `UpgradePromoCard`, `PlanCard`, `PlanBadge`
- New components:
  - `ReaduCoin.tsx`: `ReaduCoinIcon` and `CoinsPill({ value })` for dynamic coin display.
  - `Section.tsx`: wrapper that gently reveals on scroll (fade/slide). Edit ranges there to tune strength.
  - `GearIcon.tsx`: reusable settings icon (SVG).

## Screens & Flow

Home (tabs) – `app/(tabs)/index.tsx`
- Full‑page Animated.ScrollView (header, greeting, search, sections all scroll).
- Header: logo + `PlanBadge`(“Премиум”), coins pill, settings button.
- Sections: horizontal carousels with a subtle reveal on scroll.
- Tab bar: hidden only on this page via per‑screen option in `app/(tabs)/_layout.tsx`.
- Bottom reach: content container uses `paddingBottom: insets.bottom` so it reaches the bottom edge.

Payment – `app/(auth)/payment.tsx`
- Bulgarian copy throughout.
- Inputs are numbers‑only where applicable:
  - Card number: digits only (max 19).
  - Expiry: auto‑formats “ММ/ГГ”.
  - CVC: digits only (max 4).
  - ZIP: digits only.
- Plan badge shows “Премиум/Безплатен”.
- CTA: “Абонирай се и плати {цена} BGM”.

Auth – `app/(auth)/LogIn.tsx`, `app/(auth)/SignIn.tsx`
- Standard forms with tokens and components. Sign‑In leads to Payment with `plan` param.

Routing
- Root (`app/index.tsx`) redirects to `/(tabs)`.
- Use `router.push/replace` for navigation.

## Tuning animations
- Section reveal is defined in `components/ui/Section.tsx`.
  - Current values are intentionally mild; adjust `translateY` and `inputRange` for more/less motion.

## Quick tips
- Coins value: control with `<CoinsPill value={number} />` or wire to a store.
- Keep new UI under `components/ui` and consume tokens from `constants`.

## Known notes / TODOs
- Payment validation is minimal; integrate with your PSP.
- Secrets are placeholders; inject at runtime (don’t commit).
- i18n: primary flows use Bulgarian; extract strings to a dictionary as needed.

