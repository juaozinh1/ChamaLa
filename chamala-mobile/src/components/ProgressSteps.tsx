import { View } from 'react-native';
import { Text } from './Text';
import { radius, spacing, typography } from '../theme';
import { makeStyles } from '../theme/dynamic';

type ProgressStepsProps = {
  /** Nomes das etapas, na ordem. Ex.: ['Criação de Conta', 'Verificação'] */
  steps: string[];
  /** Etapa atual, começando em 0. */
  currentStep: number;
};

// Uma barra por etapa + "Etapa X de N" à esquerda e o nome da etapa à direita.
export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  const styles = useStyles();
  const current = steps[currentStep] ?? '';

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Etapa ${currentStep + 1} de ${steps.length}: ${current}`}
      accessibilityValue={{ min: 1, max: steps.length, now: currentStep + 1 }}
    >
      <View style={styles.bars}>
        {steps.map((label, index) => (
          <View
            key={`${index}-${label}`}
            style={[styles.bar, index <= currentStep && styles.barOn]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.step}>
          Etapa {currentStep + 1} de {steps.length}
        </Text>
        <Text style={styles.name}>{current}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  bars: { flexDirection: 'row', gap: spacing.sm },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  barOn: { backgroundColor: colors.primary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  step: { ...typography.caption, fontWeight: '700', color: colors.primary },
  name: { ...typography.caption, color: colors.textMuted },
}));
