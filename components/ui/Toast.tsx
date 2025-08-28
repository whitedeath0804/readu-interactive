import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable, SafeAreaView } from 'react-native';
import * as ColorsTokens from '../../constants/Colors';
import * as TypographyTokens from '../../constants/Typography';

export type ToastType = 'info' | 'success' | 'error';

export type ToastOptions = {
  type?: ToastType;
  title: string;
  desc?: string;
  duration?: number; // ms; 0 to persist until hide()
  action?: { label: string; onPress: () => void };
};

export type ToastItem = Required<Pick<ToastOptions, 'title'>> & {
  id: string;
  type: ToastType;
  desc?: string;
  duration?: number;
  action?: { label: string; onPress: () => void };
};

const Colors: any = ColorsTokens as any;
const Typography: any = TypographyTokens as any;

export default function ToastView({ items, onHide }: { items: ToastItem[]; onHide: (id: string) => void }) {
  return (
    <SafeAreaView pointerEvents="box-none" style={styles.container}>
      <View style={styles.stack} pointerEvents="box-none">
        {items.map((t) => (
          <Pressable key={t.id} onPress={() => onHide(t.id)} style={[styles.toast, getToneStyle(t.type)]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title]}>{t.title}</Text>
              {t.desc ? <Text style={styles.desc}>{t.desc}</Text> : null}
            </View>
            {t.action ? (
              <Pressable onPress={t.action.onPress} style={styles.action}>
                <Text style={styles.actionText}>{t.action.label}</Text>
              </Pressable>
            ) : null}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function getToneStyle(type: ToastType) {
  switch (type) {
    case 'success':
      return { backgroundColor: Colors.success ?? '#0F9D58' };
    case 'error':
      return { backgroundColor: Colors.error ?? '#D93025' };
    default:
      return { backgroundColor: Colors.surface ?? 'rgba(0,0,0,0.9)' };
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  stack: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 8, android: 8, default: 8 }),
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    color: Colors.onSurface ?? '#fff',
    fontSize: Typography.bodyLarge?.fontSize ?? 16,
    fontWeight: Typography.bodyLarge?.fontWeight ?? '600',
  },
  desc: {
    color: Colors.onSurfaceVariant ?? '#f5f5f5',
    marginTop: 2,
    fontSize: Typography.body?.fontSize ?? 14,
  },
  action: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

