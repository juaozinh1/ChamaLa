import { Pressable, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Screen, Text } from '../../components';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { radius, spacing, TextSize, typography } from '../../theme';
import { makeStyles, useColors } from '../../theme/dynamic';

const SIZES: { key: TextSize; label: string; glyph: number }[] = [
  { key: 'normal', label: 'Padrão', glyph: 16 },
  { key: 'large', label: 'Grande', glyph: 20 },
  { key: 'extra-large', label: 'Extra', glyph: 24 },
];

export function AccessibilityScreen() {
  const styles = useStyles();
  const colors = useColors();
  const { textSize, setTextSize, highContrast, setHighContrast } = useAccessibility();

  return (
    <Screen title="Acessibilidade">
      <View style={styles.intro}>
        <View style={styles.introIcon}>
          <Text style={styles.introAa}>Aa</Text>
        </View>
        <Text style={styles.introText}>Ajuste a leitura do aplicativo de acordo com as suas necessidades.</Text>
      </View>

      <View>
        <Text style={styles.heading}>Tamanho do texto</Text>
        <Text style={styles.muted}>A alteração é aplicada em todas as telas.</Text>
      </View>
      <View style={styles.options} accessibilityRole="radiogroup">
        {SIZES.map((option) => {
          const selected = textSize === option.key;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Tamanho do texto: ${option.label}`}
              onPress={() => setTextSize(option.key)}
              style={[styles.option, selected && styles.optionOn]}
            >
              <Text style={[styles.glyph, { fontSize: option.glyph }, selected && styles.glyphOn]}>Aa</Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <View style={styles.checkSlot}>
                {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.heading}>Visualização</Text>
      <Card>
        <Text style={styles.previewTitle}>Exemplo de leitura</Text>
        <Text style={styles.previewText}>Encontre serviços de confiança perto de você com mais conforto e clareza.</Text>
      </Card>

      <Text style={styles.heading}>Contraste</Text>
      <Card>
        <View style={styles.contrastRow}>
          <View style={styles.flex}>
            <Text style={styles.previewTitle}>Alto contraste</Text>
            <Text style={styles.muted}>Reforça cores, textos e contornos para facilitar a visualização.</Text>
          </View>
          <Switch
            accessibilityLabel="Alto contraste"
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
            ios_backgroundColor={colors.border}
          />
        </View>
      </Card>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    backgroundColor: colors.infoBg,
  },
  introIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  introAa: { ...typography.body, fontWeight: '700', color: colors.text },
  introText: { ...typography.body, fontSize: 14, color: colors.text, flex: 1 },
  heading: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  options: { flexDirection: 'row', gap: spacing.md },
  option: {
    flex: 1,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionOn: { borderColor: colors.primary, borderWidth: 2 },
  glyph: { fontWeight: '700', color: colors.textMuted },
  glyphOn: { color: colors.primary },
  optionLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  checkSlot: { height: 20, marginTop: spacing.xs },
  previewTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  previewText: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  contrastRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
}));
