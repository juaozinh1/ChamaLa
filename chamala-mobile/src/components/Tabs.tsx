import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

export type TabItem = { key: string; label: string };

type TabsProps = {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

// Controle segmentado (Ativos | Histórico), como no Figma.
const HEIGHT = 36;
const SLOP = (minTouchTarget - HEIGHT) / 2;

export function Tabs({ tabs, activeKey, onChange }: TabsProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            hitSlop={{ top: SLOP, bottom: SLOP }}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    minHeight: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  tabActive: { backgroundColor: colors.primary },
  text: { ...typography.body, fontWeight: '600', color: colors.textMuted },
  textActive: { color: colors.surface, fontWeight: '700' },
});
