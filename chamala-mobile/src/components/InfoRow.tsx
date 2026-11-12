import { View } from 'react-native';
import { Text } from './Text';
import { spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type InfoRowProps = {
  label: string;
  value: string;
  /** Cor do valor (ex.: verde para "Aceito", vermelho para multa). */
  valueColor?: string;
  bold?: boolean;
};

/** Linha "rótulo ........ valor" usada nos cartões de detalhe, contrato e resumo. */
export function InfoRow({ label, value, valueColor, bold = true }: InfoRowProps) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor ?? colors.text }, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 3 },
  label: { ...typography.body, fontSize: 14, color: colors.textMuted, marginRight: spacing.md },
  value: { ...typography.body, fontSize: 14, flexShrink: 1, textAlign: 'right' },
  bold: { fontWeight: '700' },
}));
