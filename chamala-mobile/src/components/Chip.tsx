import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Text } from './Text';
import { minTouchTarget, radius, spacing, typography } from '../theme';
import { makeStyles } from '../theme/dynamic';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** 'pill' (padrão): filtros. 'rounded': horários do agendamento (08:00, 09:00...). */
  shape?: 'pill' | 'rounded';
  style?: StyleProp<ViewStyle>;
};

// Altura visual de 36; o hitSlop completa os 44 do RNF07.
const HEIGHT = 36;
const SLOP = (minTouchTarget - HEIGHT) / 2;

export function Chip({
  label,
  selected = false,
  onPress,
  shape = 'pill',
  style,
}: ChipProps) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={{ top: SLOP, bottom: SLOP }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        shape === 'rounded' && styles.rounded,
        selected && styles.chipSelected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  chip: {
    minHeight: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rounded: { borderRadius: radius.md, minHeight: 40 },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  pressed: { opacity: 0.85 },
  text: { ...typography.caption, fontSize: 14, fontWeight: '500', color: colors.text },
  textSelected: { color: colors.surface, fontWeight: '600' },
}));
