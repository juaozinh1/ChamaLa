import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from './Card';
import { colors, spacing, typography } from '../theme';

type StatCardProps = {
  emoji: string;
  /** Valor em destaque. Ex.: "R$ 640", "8", "4.9★" */
  value: string;
  /** Legenda. Ex.: "Este mês" */
  label: string;
};

// Três cards destes lado a lado formam a linha de métricas do Painel.
export function StatCard({ emoji, value, label }: StatCardProps) {
  return (
    <Card
      padded={false}
      accessibilityLabel={`${label}: ${value}`}
      style={styles.card}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  emoji: { fontSize: 26, marginBottom: spacing.sm },
  value: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  label: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
