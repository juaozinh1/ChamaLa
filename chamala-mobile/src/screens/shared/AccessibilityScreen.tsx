import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../../contexts/SessionContext';
import {
  colors,
  minTouchTarget,
  radius,
  spacing,
  textScale,
  typography,
  type TextSize,
} from '../../theme';

const OPTIONS: { value: TextSize; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grande' },
  { value: 'extra-large', label: 'Extra grande' },
];

// Figma: accessibility. Tamanho do texto (3 níveis) e alto contraste.
export function AccessibilityScreen() {
  const { textSize, setTextSize, highContrast, setHighContrast } = useSession();
  const scale = textScale[textSize];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={[typography.subtitle, styles.heading, { fontSize: 18 * scale }]}>
          Tamanho do texto
        </Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {OPTIONS.map((option) => {
            const selected = option.value === textSize;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setTextSize(option.value)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text
                  style={[
                    typography.body,
                    { color: selected ? colors.surface : colors.text },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.row}>
          <Text style={[typography.body, styles.label, { fontSize: 16 * scale }]}>
            Ativar alto contraste
          </Text>
          <Switch
            accessibilityLabel="Ativar alto contraste"
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.lg },
  heading: { color: colors.text },
  options: { flexDirection: 'row', gap: spacing.sm },
  option: {
    flex: 1,
    minHeight: minTouchTarget,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouchTarget,
  },
  label: { color: colors.text, flex: 1 },
});
