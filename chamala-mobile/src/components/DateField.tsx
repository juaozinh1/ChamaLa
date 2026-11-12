import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import { addDays, formatChipDay, formatWeekdayDate, isSameDay, startOfDay } from '../utils/format';
import { minTouchTarget, radius, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type DatePickerModalProps = {
  visible: boolean;
  selected?: Date | null;
  /** Quantos dias à frente mostrar (a partir de `from`). */
  days?: number;
  from?: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
};

/** Seletor de data simples (próximos dias), sem dependências nativas. */
export function DatePickerModal({
  visible,
  selected,
  days = 42,
  from = new Date(),
  onClose,
  onSelect,
}: DatePickerModalProps) {
  const styles = useStyles();
  const colors = useColors();
  const options = useMemo(
    () => Array.from({ length: days }, (_, i) => addDays(startOfDay(from), i)),
    [days, from],
  );

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Escolha a data</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" hitSlop={8} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.grid}>
            {options.map((day) => {
              const active = selected ? isSameDay(day, selected) : false;
              return (
                <Pressable
                  key={day.toISOString()}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    onSelect(day);
                    onClose();
                  }}
                  style={[styles.day, active && styles.dayOn]}
                >
                  <Text style={[styles.dayText, active && styles.dayTextOn]}>{formatChipDay(day)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

type DateFieldProps = {
  label?: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
};

/** Campo de data (abre o seletor). Ex.: "Qui, 05/11/2026". */
export function DateField({ label, value, onChange, placeholder = 'Selecione a data', error }: DateFieldProps) {
  const styles = useStyles();
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? formatWeekdayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <DatePickerModal visible={open} selected={value} onClose={() => setOpen(false)} onSelect={onChange} />
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: { marginBottom: spacing.lg },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
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
  value: { ...typography.body, color: colors.text },
  placeholder: { ...typography.body, color: colors.textMuted },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: {
    maxHeight: '70%',
    padding: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  sheetTitle: { ...typography.subtitle, color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.lg },
  day: {
    minHeight: minTouchTarget,
    minWidth: '30%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dayOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { ...typography.body, fontSize: 14, color: colors.text },
  dayTextOn: { color: colors.surface, fontWeight: '700' },
}));
