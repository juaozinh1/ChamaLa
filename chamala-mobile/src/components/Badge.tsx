import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export type BadgeStatus =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'solid'; // azul-marinho sólido: contadores, ex.: "2" em Novas Solicitações

type BadgeProps = {
  label: string;
  status?: BadgeStatus;
};

// Dourado escuro só para texto: o `colors.gold` sobre amarelo claro não tem contraste suficiente.
// Se preferir, mova para o tema como `colors.warning`.
const WARNING_TEXT = '#7A5B00';

const palette: Record<BadgeStatus, { bg: string; fg: string }> = {
  success: { bg: colors.successBg, fg: colors.success },
  warning: { bg: colors.warningBg, fg: WARNING_TEXT },
  danger: { bg: colors.dangerBg, fg: colors.danger },
  info: { bg: colors.infoBg, fg: colors.primary },
  neutral: { bg: colors.border, fg: colors.text },
  solid: { bg: colors.primary, fg: colors.surface },
};

export function Badge({ label, status = 'neutral' }: BadgeProps) {
  const { bg, fg } = palette[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    minWidth: 24,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  text: { ...typography.caption, fontWeight: '600' },
});
