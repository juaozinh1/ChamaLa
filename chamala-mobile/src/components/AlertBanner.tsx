import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import type { IoniconName } from './icon';
import { Colors, radius, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type Variant = 'info' | 'warning' | 'danger' | 'success';

type AlertBannerProps = {
  /** info (azul): avisos. warning (amarelo): pendências. danger (vermelho): multas e erros. success (verde). */
  variant?: Variant;
  title?: string;
  message: string;
  /** Ícone à esquerda. Padrão por variante; use `false` para esconder (como nas telas de pedido). */
  icon?: IoniconName | false;
  /** Botão opcional à direita (ex.: "Verificar"). */
  actionLabel?: string;
  onAction?: () => void;
};

// Cores dos banners no Figma.
const getPalette = (
  colors: Colors,
): Record<Variant, { bg: string; border: string; title: string; icon: IoniconName; iconColor: string }> => ({
  info: { bg: colors.infoBg, border: colors.infoBorder, title: colors.primary, icon: 'alert-circle-outline', iconColor: colors.text },
  warning: { bg: colors.warningBg, border: colors.warningBorder, title: colors.gold, icon: 'star-outline', iconColor: colors.gold },
  danger: { bg: colors.dangerBg, border: colors.dangerBorder, title: colors.danger, icon: 'alert-circle-outline', iconColor: colors.danger },
  success: { bg: colors.successBg, border: colors.successBorder, title: colors.success, icon: 'checkmark-circle-outline', iconColor: colors.success },
});

export function AlertBanner({
  variant = 'info',
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: AlertBannerProps) {
  const styles = useStyles();
  const colors = useColors();
  const p = getPalette(colors)[variant];
  const iconName = icon === false ? null : (icon ?? p.icon);

  return (
    <View
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: p.bg, borderColor: p.border }]}
    >
      {iconName ? (
        <Ionicons name={iconName} size={22} color={p.iconColor} style={styles.icon} />
      ) : null}
      <View style={styles.body}>
        {title ? <Text style={[styles.title, { color: p.title }]}>{title}</Text> : null}
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

const useStyles = makeStyles((colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  icon: { marginRight: spacing.md, marginTop: 1 },
  body: { flex: 1 },
  title: { ...typography.body, fontWeight: '700' },
  message: { ...typography.body, fontSize: 14, color: colors.textMuted },
  action: { marginLeft: spacing.md },
}));
