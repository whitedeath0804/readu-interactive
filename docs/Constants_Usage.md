# Design Tokens Usage (App Constants)

This guide shows how to use the shared design tokens exported from the constants folder. Authentication constants are out of scope and not covered here.

## Files

- `constants/Colors.ts:1` — semantic color palette and gradient
- `constants/Typography.ts:1` — text styles (font family, size, weight, line height)
- `constants/elevation.ts:1` — cross‑platform shadows/elevation presets

## Importing

```ts
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import { Elevation } from '@/constants/elevation';
```

## Colors

- Use semantic keys from `Colors` instead of raw hex values.
- Available examples: `primary`, `primaryLight`, `primaryDark`, `success`, `error`, `text`, `textSecondary`, `background`, `backgroundAlt`, `border`, `gradient`.
- Gradient usage with `expo-linear-gradient`:

```tsx
import { LinearGradient } from 'expo-linear-gradient';
<LinearGradient colors={Colors.gradient as [string, string]} style={{ flex: 1 }} />
```

Recommended patterns:

- Backgrounds: `style={{ backgroundColor: Colors.background }}`
- Text: `style={[Typo.body2, { color: Colors.text }]}`
- Borders: `style={{ borderColor: Colors.border }}`

## Typography

- Token sets are grouped by role: `h1`, `h2`, `h3`, `h4`, `h4Regular`, `body1`, `body2`, `body2Regular`, `body3`, `body3Regular`, `caption`.
- Each token includes `fontFamily`, `fontSize`, `lineHeight`, and `fontWeight` aligned to loaded fonts (see `app/_layout.tsx:1`).
- Apply via spread first, then add overrides:

```tsx
<Text style={[Typo.body1, { color: Colors.text, textAlign: 'center' }]}>Hello</Text>
```

- Prefer `Regular` variants instead of manually overriding weights. If a `Regular` variant is missing, you can derive one locally: `{ ...Typo.body2, fontWeight: '400' as const }`.

## Elevation (Shadows)

- Use preset shadows for consistent depth across iOS and Android.
- Presets include `Elevation.navbar` and `Elevation.courseCard`. They inject `elevation` on Android automatically.

```tsx
<View style={[styles.card, Elevation.courseCard]} />
```

## Example Component

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import { Elevation } from '@/constants/elevation';

export function ExampleCard() {
  return (
    <View style={[styles.card, Elevation.courseCard]}> 
      <Text style={[Typo.h3, { color: Colors.text }]}>Title</Text>
      <Text style={[Typo.body3Regular, { color: Colors.textSecondary }]}>Subtitle</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
});
```

## Do / Don’t

- Do: compose tokens with arrays/spreads: `[Typo.body2, { color: Colors.text }]`.
- Do: use `Colors` semantic values instead of raw hex strings.
- Do: prefer token variants (e.g., `body2Regular`) over ad‑hoc overrides.
- Don’t: mutate token objects (e.g., never `Typo.body2.fontSize = 18`).
- Don’t: import base palettes (`Primary`, `Neutral`) directly; use `Colors`.
- Don’t: rely on `fontSizeRem` at runtime; it’s informational only.

## Extending Tokens

- Add new roles to the relevant file and export through the top‑level object (`Colors`, `Typo`, `Elevation`). Keep names semantic (role‑based) rather than component‑specific when possible.

