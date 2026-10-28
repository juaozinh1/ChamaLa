import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { colors, radius, spacing, typography } from '../theme';

type AlertBannerProps = {
  /** 'info' (azul): avisos. 'warning' (amarelo): "Verificação pendente". */
  variant?: 'info' | 'warning';
  title?: string;
  message: string;
  /** Botão opcional à direita (ex.: "Verificar"). */
  actionLabel?: string;
  onAction?: () => void;
};

// Bordas dos banners no Figma.
const INFO_BORDER = '#BFD3E6';
const WARNING_BORDER = '#E6D58A';

export function AlertBanner({
  variant = 'info',
  title,
  message,
  actionLabel,
  onAction,
}: AlertBannerProps) {
  const warning = variant === 'warning';

  return (
    <View
      accessibilityRole="alert"
      style={[styles.container, warning ? styles.warning : styles.info]}
    >
      <Ionicons
        name={warning ? 'star-outline' : 'alert-circle-outline'}
        size={22}
        color={warning ? colors.gold : colors.text}
        style={styles.icon}
      />
      <View style={styles.body}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.message}>{message}</Text>
      </View>
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          variant="gold"
          size="sm"
          fullWidth={false}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  info: { backgroundColor: colors.infoBg, borderColor: INFO_BORDER },
  warning: { backgroundColor: colors.warningBg, borderColor: WARNING_BORDER },
  icon: { marginRight: spacing.md, marginTop: 1 },
  body: { flex: 1 },
  title: { ...typography.body, fontWeight: '700', color: colors.gold },
  message: { ...typography.body, color: colors.textMuted },
  action: { marginLeft: spacing.md },
});
