import { ComponentRef, forwardRef, useState } from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import type { IoniconName } from './icon';
import { useTextScale } from '../contexts/AccessibilityContext';
import { radius, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

/** Tipo do ref do TextInput. Derivado do componente para funcionar em qualquer versão do React Native. */
export type TextInputRef = ComponentRef<typeof TextInput>;

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  /** Ícone à esquerda (ex.: 'search-outline'). */
  leftIcon?: IoniconName;
  /** Texto fixo à direita, como unidade (ex.: "horas", "%"). */
  rightText?: string;
  /** Estilo do contêiner. O padrão deixa 16 de espaço embaixo; use { marginBottom: 0 } para remover. */
  containerStyle?: StyleProp<ViewStyle>;
};

// forwardRef permite focar o próximo campo: ref.current?.focus() no onSubmitEditing.
export const Input = forwardRef<TextInputRef, InputProps>(function Input(
  { label, error, helperText, leftIcon, rightText, containerStyle, style, onFocus, onBlur, ...rest },
  ref,
) {
  const styles = useStyles();
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const scale = useTextScale();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          error ? styles.fieldError : null,
        ]}
      >
        {leftIcon ? (
          <Ionicons name={leftIcon} size={20} color={colors.textMuted} style={styles.icon} />
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={error ?? helperText}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { fontSize: typography.body.fontSize * scale }, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const useStyles = makeStyles((colors) => ({
  container: { marginBottom: spacing.lg },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  fieldFocused: { borderColor: colors.primary },
  fieldError: { borderColor: colors.danger },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: spacing.sm },
  rightText: { ...typography.body, color: colors.textMuted, marginLeft: spacing.sm },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  helper: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
}));
