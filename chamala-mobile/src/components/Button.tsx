import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

export type ButtonVariant =
  | 'primary' // azul-marinho sólido: ação principal
  | 'outline' // contorno azul-marinho: ação secundária
  | 'danger' // vermelho sólido: confirmações destrutivas
  | 'dangerOutline' // contorno vermelho: "Cancelar" nos cards de pedido
  | 'neutral' // contorno cinza: "Recusar"
  | 'gold' // dourado: "Verificar"
  | 'soft' // fundo creme: "Editar"
  | 'link'; // texto sublinhado: "Fazer isso depois", "Sair da conta"

export type ButtonSize = 'md' | 'sm';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Ocupa a largura toda. Em linhas com dois botões, use fullWidth={false} e style={{ flex: 1 }}. */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Borda rosada do botão "Cancelar" no Figma.
const DANGER_BORDER = '#EDB9B6';

const variants: Record<
  ButtonVariant,
  { container: ViewStyle; text: string; underline?: boolean }
> = {
  primary: { container: { backgroundColor: colors.primary }, text: colors.surface },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    text: colors.primary,
  },
  danger: { container: { backgroundColor: colors.danger }, text: colors.surface },
  dangerOutline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: DANGER_BORDER,
    },
    text: colors.danger,
  },
  neutral: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    text: colors.textMuted,
  },
  gold: { container: { backgroundColor: colors.gold }, text: colors.surface },
  soft: {
    container: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: colors.primary,
  },
  link: { container: { backgroundColor: 'transparent' }, text: colors.textMuted, underline: true },
};

// Botões pequenos têm 36 de altura visual; o hitSlop completa os 44 do RNF07.
const SM_HEIGHT = 36;
const SM_SLOP = (minTouchTarget - SM_HEIGHT) / 2;

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { container, text, underline } = variants[variant];
  const isLink = variant === 'link';
  const small = size === 'sm' && !isLink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      hitSlop={small ? { top: SM_SLOP, bottom: SM_SLOP } : undefined}
      style={({ pressed }) => [
        styles.base,
        small ? styles.sm : styles.md,
        container,
        isLink && styles.link,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <Text
          style={[
            typography.button,
            small && styles.textSm,
            { color: text },
            underline && styles.underline,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  md: { minHeight: 48, paddingHorizontal: spacing.xl },
  sm: { minHeight: SM_HEIGHT, paddingHorizontal: spacing.lg },
  link: { minHeight: minTouchTarget, paddingHorizontal: spacing.sm },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  textSm: { fontSize: 14 },
  underline: { textDecorationLine: 'underline', fontWeight: '400' },
});
