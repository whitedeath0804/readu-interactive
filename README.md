# READU Interactive – UI & Components Guide

This document describes how the UI in this app is structured, how the shared design tokens work, and how to use the reusable components across screens. It reflects the implementation in this repo as of now.

## Stack

- Expo + React Native with Expo Router
- TypeScript/TSX components
- Reanimated for subtle on‑enter animations
- expo‑haptics for tactile feedback
- Safe Area Context for insets

## Project Layout

- Screens (Expo Router): `app/`
  - `app/index.tsx` – splash handoff (routes to `/welcome`)
  - `app/(auth)/welcome.tsx` – marketing welcome
  - `app/(auth)/LogIn.tsx` – login form
  - `app/(auth)/SignIn.tsx` – registration (details + plan selection)
  - `app/(auth)/payment.tsx` – payment method and checkout
  - Layouts: `app/_layout.tsx`, `app/(auth)/_layout.tsx`, `app/(tabs)/_layout.tsx`
- Reusable UI: `components/ui/`
- Other components: `components/`
- Design tokens: `constants/`
  - `constants/Colors.ts`
  - `constants/Typography.ts`
  - `constants/elevation.ts`
  - `constants/features.ts`
  - `constants/authConfig.ts` (placeholders only)

## Design Tokens

Use tokens over raw values. They map to the current theme and ensure consistency.

- Colors (`constants/Colors.ts`)
  - Core: `primary`, `primaryLight`, `primaryDark`
  - Text: `text` (white), `textSecondary`, `textSecondaryDark`
  - Surfaces: `background`, `backgroundAlt`, `backgroundElevated`
  - Feedback: `success`, `error`
  - Borders: `border`, `borderLight`
  - Overlays: `overlay`
  - Brand gradient: `gradient: [start, end]`
- Typography (`constants/Typography.ts`)
  - Headings: `Typo.h1/h2/h3/h4/h4Regular`
  - Body: `Typo.body1/body2/body2Regular/body3/body3Regular`
  - Caption: `Typo.caption`
  - Each includes `fontFamily`, `fontSize`, `lineHeight`, `fontWeight`
- Elevation (`constants/elevation.ts`)
  - Presets: `Elevation.navbar`, `Elevation.courseCard`
  - Cross‑platform: sets `shadow*` and Android `elevation`
- Feature flags (`constants/features.ts`)
  - `ENABLE_GOOGLE`, `ENABLE_PHONE`, …
- Auth config (`constants/authConfig.ts`)
  - Placeholder env holders (client IDs etc.). Fill via secrets, don’t commit real keys.

Fonts are loaded in `app/_layout.tsx` (`Montserrat` + `Lato`).

## UI Components (components/ui)

Buttons
- `PrimaryButton` – filled, brand background.
- `SecondaryButton` – white surface, brand border, optional icon.
- `TertiaryButton` – text‑only (links like “Register now”).

Inputs
- `Input` – text field with optional left/right slots.
- `PasswordInput` – masked input with eye toggle.
- `CodeInput` – multi‑cell one‑time code entry.
- `Select` – popover select; anchored to field; accepts `{ key, label }[]`.

Selection & Navigation
- `Checkbox` – animated ring, semibold when checked.
- `SegmentedPicker` – 2‑tab selector with animated thumb; improved shadow backdrop.
- `CloseButton` – circular back/close (variants `back`/`close`).

Content & Misc
- `ThreeDotsMenu` – popup menu for actions.
- `SettingsMobileButton` – list row with chevron.
- `CourseCard`, `UpgradePromoCard` – sample content cards.
- New: `PlanCard` – plan presentation + CTA; supports `selected` border.
- New: `PlanBadge` – pill badge with brand gradient; used on payment.

All components use `Colors` and `Typo` tokens; most apply haptics on press and set accessible roles/labels.

## Screens & Flow

Welcome (`app/(auth)/welcome.tsx`)
- Background image + dark gradient overlay.
- Reanimated entrance for logo/title/subtitle/actions.
- Buttons: `PrimaryButton` → Log in, `SecondaryButton` → guest.
- Keyboard safe: `KeyboardAvoidingView` + `ScrollView` with `flexGrow: 1`.

Log In (`app/(auth)/LogIn.tsx`)
- Full‑page scrollable form.
- `Input` (identifier), `PasswordInput` (eye toggle), `Checkbox` Remember me.
- Inline link buttons with brand color (or use `TertiaryButton` where suitable).
- Submit enabled when identifier present and password ≥ 8.

Sign In (`app/(auth)/SignIn.tsx`)
- Two steps via `SegmentedPicker`:
  1) Details: `Input`(name/email/phone) + `PasswordInput`, `Checkbox`(remember), `Checkbox`(terms) + `TertiaryButton` link; `PrimaryButton` “Напред”.
  2) Plan selection: Two `PlanCard`s (Безплатен, Премиум). Selecting a card turns its border orange. CTA “Продължи”.
- Routes to payment with the plan as a router param: `/payment?plan=free|premium`.
- Responsive horizontal padding via `useWindowDimensions()` gutter.
- Keyboard safety: `KeyboardAvoidingView` (`keyboardVerticalOffset` ≈ header height), `ScrollView` with `flexGrow: 1`, and background press to dismiss.

Payment (`app/(auth)/payment.tsx`)
- Header with `CloseButton` and title “Payment method”.
- Selected plan: “Selected Plan:” + `PlanBadge` (brand gradient).
- Fields:
  - `Input` Card number
  - Row: `Input` MM/YY and `Input` CVC
  - `Select` Country (default Bulgaria)
  - `Input` ZIP code
  - `Checkbox` Save information for future payments
- CTA: `SecondaryButton` “Subscribe & Pay {price} BGM”, disabled until simple validation passes.
- Reads plan via `useLocalSearchParams()`; premium = 22.89 BGM; free = 0.00 (keeps CTA disabled).

Routing
- Expo Router; most navigation uses `router.push()` / `router.replace()`.
- Plan handoff: SignIn → Payment via query params; Payment displays a gradient `PlanBadge` accordingly.

## Patterns & Conventions

- Styling
  - Compose tokens first, then overrides: `[Typo.body2, { color: Colors.text }]`.
  - Use semantic colors (`Colors`) instead of raw hex; prefer `Typo.*` over ad‑hoc font styles.
- Keyboard
  - Wrap forms in `KeyboardAvoidingView` with a stable header offset.
  - `ScrollView` with `flexGrow: 1`; `keyboardDismissMode="on-drag"`.
- Haptics
  - Buttons and pickers trigger selection/impact via expo‑haptics (disabled on web).
- Accessibility
  - Components set `accessibilityRole`/`State` (e.g., `button`, `tab`, `checkbox`).
- Shadows
  - For translucent elements, render shadows on an opaque sibling backdrop (see `SegmentedPicker`’s `shadowWrap`).

## Quick Component Recipes

PlanCard (controlled selection)
```tsx
<PlanCard
  title="Premium"
  price="22.89 BGM"
  period="/ month"
  features={[
    { text: 'Full access to library', included: true },
    { text: 'AI chatbots (extended)', included: true },
  ]}
  selected={plan === 'premium'}
  onSelect={() => setPlan('premium')}
  ctaLabel="Continue"
  onPress={() => router.push({ pathname: '/payment', params: { plan: 'premium' } })}
/>
```

Select (country)
```tsx
const options = [
  { key: 'bg', label: 'Bulgaria' },
  { key: 'ro', label: 'Romania' },
];

<Select options={options} value={country} onChange={setCountry} placeholder="Country" />
```

Typography
```tsx
<Text style={[Typo.h2, { color: Colors.text }]}>Title</Text>
<Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>Helper</Text>
```

## Assets & Fonts

- Background: `assets/images/onboarding-bg.jpg`
- Logos: `assets/images/readu-logo-md.png`
- Fonts loaded in `app/_layout.tsx`:
  - `Montserrat-(Regular|SemiBold|Bold)`
  - `Lato-(Regular|Bold)`

## Extending

- Add tokens in `constants/*` and reference via `Colors` / `Typo` / `Elevation`.
- Add new components under `components/ui` following the token usage pattern.
- When introducing shadows on translucent elements, use an opaque `shadowWrap` sibling.

## Known Notes / TODOs

- Payment validation is minimal; integrate with a PSP SDK for real payments.
- `authConfig.ts` contains placeholders only; inject real secrets at runtime.
- i18n: Sign‑in copy uses Bulgarian; extract strings to a dictionary if full localization is needed.

---
For a focused reference on tokens, see `docs/Constants_Usage.md`.

