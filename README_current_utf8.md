# READU Interactive â€“ UI & Components Guide

This document describes how the UI in this app is structured, how the shared design tokens work, and how to use the reusable components across screens. It reflects the implementation in this repo as of now.

## Stack

- Expo + React Native with Expo Router
- TypeScript/TSX components
- Reanimated for subtle onâ€‘enter animations
- expoâ€‘haptics for tactile feedback
- Safe Area Context for insets

## Project Layout

- Screens (Expo Router): `app/`
  - `app/index.tsx` â€“ splash handoff (routes to `/welcome`)
  - `app/(auth)/welcome.tsx` â€“ marketing welcome
  - `app/(auth)/LogIn.tsx` â€“ login form
  - `app/(auth)/SignIn.tsx` â€“ registration (details + plan selection)
  - `app/(auth)/payment.tsx` â€“ payment method and checkout
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
  - Crossâ€‘platform: sets `shadow*` and Android `elevation`
- Feature flags (`constants/features.ts`)
  - `ENABLE_GOOGLE`, `ENABLE_PHONE`, â€¦
- Auth config (`constants/authConfig.ts`)
  - Placeholder env holders (client IDs etc.). Fill via secrets, donâ€™t commit real keys.

Fonts are loaded in `app/_layout.tsx` (`Montserrat` + `Lato`).

## UI Components (components/ui)

Buttons
- `PrimaryButton` â€“ filled, brand background.
- `SecondaryButton` â€“ white surface, brand border, optional icon.
- `TertiaryButton` â€“ textâ€‘only (links like â€œRegister nowâ€).

Inputs
- `Input` â€“ text field with optional left/right slots.
- `PasswordInput` â€“ masked input with eye toggle.
- `CodeInput` â€“ multiâ€‘cell oneâ€‘time code entry.
- `Select` â€“ popover select; anchored to field; accepts `{ key, label }[]`.

Selection & Navigation
- `Checkbox` â€“ animated ring, semibold when checked.
- `SegmentedPicker` â€“ 2â€‘tab selector with animated thumb; improved shadow backdrop.
- `CloseButton` â€“ circular back/close (variants `back`/`close`).

Content & Misc
- `ThreeDotsMenu` â€“ popup menu for actions.
- `SettingsMobileButton` â€“ list row with chevron.
- `CourseCard`, `UpgradePromoCard` â€“ sample content cards.
- New: `PlanCard` â€“ plan presentation + CTA; supports `selected` border.
- New: `PlanBadge` â€“ pill badge with brand gradient; used on payment.

All components use `Colors` and `Typo` tokens; most apply haptics on press and set accessible roles/labels.

## Screens & Flow

Welcome (`app/(auth)/welcome.tsx`)
- Background image + dark gradient overlay.
- Reanimated entrance for logo/title/subtitle/actions.
- Buttons: `PrimaryButton` â†’ Log in, `SecondaryButton` â†’ guest.
- Keyboard safe: `KeyboardAvoidingView` + `ScrollView` with `flexGrow: 1`.

Log In (`app/(auth)/LogIn.tsx`)
- Fullâ€‘page scrollable form.
- `Input` (identifier), `PasswordInput` (eye toggle), `Checkbox` Remember me.
- Inline link buttons with brand color (or use `TertiaryButton` where suitable).
- Submit enabled when identifier present and password â‰¥ 8.

Sign In (`app/(auth)/SignIn.tsx`)
- Two steps via `SegmentedPicker`:
  1) Details: `Input`(name/email/phone) + `PasswordInput`, `Checkbox`(remember), `Checkbox`(terms) + `TertiaryButton` link; `PrimaryButton` â€œÐÐ°Ð¿Ñ€ÐµÐ´â€.
  2) Plan selection: Two `PlanCard`s (Ð‘ÐµÐ·Ð¿Ð»Ð°Ñ‚ÐµÐ½, ÐŸÑ€ÐµÐ¼Ð¸ÑƒÐ¼). Selecting a card turns its border orange. CTA â€œÐŸÑ€Ð¾Ð´ÑŠÐ»Ð¶Ð¸â€.
- Routes to payment with the plan as a router param: `/payment?plan=free|premium`.
- Responsive horizontal padding via `useWindowDimensions()` gutter.
- Keyboard safety: `KeyboardAvoidingView` (`keyboardVerticalOffset` â‰ˆ header height), `ScrollView` with `flexGrow: 1`, and background press to dismiss.

Payment (`app/(auth)/payment.tsx`)
- Header with `CloseButton` and title â€œPayment methodâ€.
- Selected plan: â€œSelected Plan:â€ + `PlanBadge` (brand gradient).
- Fields:
  - `Input` Card number
  - Row: `Input` MM/YY and `Input` CVC
  - `Select` Country (default Bulgaria)
  - `Input` ZIP code
  - `Checkbox` Save information for future payments
- CTA: `SecondaryButton` â€œSubscribe & Pay {price} BGMâ€, disabled until simple validation passes.
- Reads plan via `useLocalSearchParams()`; premium = 22.89 BGM; free = 0.00 (keeps CTA disabled).

Routing
- Expo Router; most navigation uses `router.push()` / `router.replace()`.
- Plan handoff: SignIn â†’ Payment via query params; Payment displays a gradient `PlanBadge` accordingly.

## Patterns & Conventions

- Styling
  - Compose tokens first, then overrides: `[Typo.body2, { color: Colors.text }]`.
  - Use semantic colors (`Colors`) instead of raw hex; prefer `Typo.*` over adâ€‘hoc font styles.
- Keyboard
  - Wrap forms in `KeyboardAvoidingView` with a stable header offset.
  - `ScrollView` with `flexGrow: 1`; `keyboardDismissMode="on-drag"`.
- Haptics
  - Buttons and pickers trigger selection/impact via expoâ€‘haptics (disabled on web).
- Accessibility
  - Components set `accessibilityRole`/`State` (e.g., `button`, `tab`, `checkbox`).
- Shadows
  - For translucent elements, render shadows on an opaque sibling backdrop (see `SegmentedPicker`â€™s `shadowWrap`).

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
- i18n: Signâ€‘in copy uses Bulgarian; extract strings to a dictionary if full localization is needed.

---
For a focused reference on tokens, see `docs/Constants_Usage.md`.


