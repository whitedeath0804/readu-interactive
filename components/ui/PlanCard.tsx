import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';
import { Elevation } from '@/constants/elevation';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Svg, { Circle, Path } from 'react-native-svg';

export type PlanFeature = { text: string; included: boolean };

export type PlanCardProps = {
  title: string;
  price: string;        // e.g., "00.00 BGM"
  period?: string;      // e.g., "/ month"
  features: PlanFeature[];
  ctaLabel?: string;
  onPress?: () => void;
  style?: ViewStyle;
  highlight?: boolean;  // draws an accent border
  selected?: boolean;   // visual selection state
  onSelect?: () => void;
};

export default function PlanCard({
  title,
  price,
  period = '/ month',
  features,
  ctaLabel = 'Continue',
  onPress,
  style,
  highlight,
  selected,
  onSelect,
}: PlanCardProps) {
  const isControlled = typeof selected === 'boolean';
  const [innerSel, setInnerSel] = useState(false);
  const sel = isControlled ? (selected as boolean) : innerSel;

  return (
    <Pressable
      onPress={() => {
        if (!isControlled) setInnerSel((v) => !v);
        onSelect?.();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: !!sel }}
      style={({ pressed }) => [
        styles.card,
        highlight ? styles.cardHighlight : null,
        sel ? styles.cardSelected : null,
        sel ? { borderColor: Colors.primary } : null,
        pressed ? { opacity: 0.95 } : null,
        style,
      ]}
    >
      <Text style={[Typo.h3, styles.title, { color: highlight ? Colors.primary : Colors.text }]}>{title}</Text>

      <View style={styles.priceRow}>
        <Text style={[Typo.h2, { color: Colors.text }]}>{price}</Text>
        <Text style={[Typo.body2, { color: Colors.textSecondary }]}> {period}</Text>
      </View>

      <View style={styles.list}>
        {features.map((f, idx) => (
          <View key={idx} style={styles.itemRow}>
            {f.included ? <CheckIcon /> : <CrossIcon />}
            <Text style={[Typo.body2, { color: Colors.text, flex: 1 }]}>{f.text}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton label={ctaLabel} fullWidth size="lg" onPress={onPress} />
    </Pressable>
  );
}

function CheckIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
      <Circle cx="12" cy="12" r="11" fill="none" stroke={Colors.text} strokeWidth={1.5} opacity={0.6} />
      <Path d="M7 12.5l3 3 7-7" fill="none" stroke={Colors.success} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CrossIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
      <Circle cx="12" cy="12" r="11" fill="none" stroke={Colors.text} strokeWidth={1.5} opacity={0.6} />
      <Path d="M8 8l8 8M16 8l-8 8" fill="none" stroke={Colors.error} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    ...Elevation.courseCard,
  },
  cardHighlight: {
    borderColor: Colors.primary,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  title: {
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  list: { gap: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
});
