import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

/** Asterisco vermelho para rótulos de campos obrigatórios: <Text>Nome<RequiredMark /></Text>. */
export function RequiredMark() {
  return (
    <Text style={styles.required} accessibilityLabel="obrigatório">
      {' *'}
    </Text>
  );
}

/** Mensagem de erro embaixo de grupos que não são Input (chips, mapa). */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text style={styles.error} accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}

/** Contorno vermelho para destacar um grupo (chips, mapa) com erro. */
export const fieldErrorOutline = {
  borderWidth: 1.5,
  borderColor: colors.danger,
  borderRadius: 8,
  padding: spacing.sm,
} as const;

const styles = StyleSheet.create({
  required: { color: colors.danger, fontWeight: '700' },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
});
