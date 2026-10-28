import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type TextAreaProps = Omit<TextInputProps, 'multiline'> & {
  label?: string;
  error?: string;
  /** Limite de caracteres. Também mostra o contador "n/max". */
  maxLength?: number;
  minHeight?: number;
};

export function TextArea({
  label,
  error,
  maxLength,
  minHeight = 120,
  value,
  style,
  ...rest
}: TextAreaProps) {
  const length = value?.length ?? 0;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        multiline
        accessibilityLabel={label}
        textAlignVertical="top"
        placeholderTextColor={colors.textMuted}
        maxLength={maxLength}
        value={value}
        style={[styles.input, { minHeight }, error ? styles.inputError : null, style]}
        {...rest}
      />
      <View style={styles.footer}>
        <Text style={styles.error}>{error ?? ''}</Text>
        {maxLength ? (
          <Text style={styles.counter}>
            {length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  error: { ...typography.caption, color: colors.danger, flexShrink: 1 },
  counter: { ...typography.caption, color: colors.textMuted },
});
