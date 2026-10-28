import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

export type SelectOption = { label: string; value: string };

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
};

export function Select({
  label,
  placeholder = 'Selecione',
  options,
  value,
  onChange,
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <Text style={selected ? styles.value : styles.placeholder} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          {/* Captura o toque para que tocar na lista não feche o modal. */}
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={styles.option}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionSelected]}>
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
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
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  fieldError: { borderColor: colors.danger },
  value: { flex: 1, ...typography.body, color: colors.text },
  placeholder: { flex: 1, ...typography.body, color: colors.textMuted },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '60%',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  option: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionText: { ...typography.body, color: colors.text },
  optionSelected: { fontWeight: '700', color: colors.primary },
  separator: { height: 1, backgroundColor: colors.border },
});
