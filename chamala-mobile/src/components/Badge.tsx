import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Colors, radius, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

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

const getPalette = (colors: Colors): Record<BadgeStatus, { bg: string; fg: string }> => ({
  success: { bg: colors.successBg, fg: colors.success },
  warning: { bg: colors.warningBg, fg: colors.warningText },
  danger: { bg: colors.dangerBg, fg: colors.danger },
  info: { bg: colors.infoBg, fg: colors.primary },
  neutral: { bg: colors.border, fg: colors.text },
  solid: { bg: colors.primary, fg: colors.surface },
});

export function Badge({ label, status = 'neutral' }: BadgeProps) {
  const styles = useStyles();
  const colors = useColors();
  const { bg, fg } = getPalette(colors)[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  badge: {
    alignSelf: 'flex-start',
    minWidth: 24,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  text: { ...typography.caption, fontWeight: '600' },
}));
