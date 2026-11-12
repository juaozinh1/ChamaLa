import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type RatingStarsProps = {
  value: number;
  /** Se informado, as estrelas são tocáveis (avaliação). Sem ele, só exibe. */
  onChange?: (value: number) => void;
  size?: number;
};

export function RatingStars({ value, onChange, size = 20 }: RatingStarsProps) {
  const styles = useStyles();
  const colors = useColors();
  // Arredonda para a meia estrela mais próxima: 4,8 vira 5 cheias; 4,6 vira 4 e meia.
  const rounded = Math.round(value * 2) / 2;
  return (
    <View style={styles.row} accessibilityLabel={`Nota ${String(value).replace('.', ',')} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = (
          <Ionicons
            name={n <= rounded ? 'star' : n - 0.5 <= rounded ? 'star-half' : 'star-outline'}
            size={size}
            color={colors.goldBright}
          />
        );
        return onChange ? (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
            accessibilityState={{ selected: n === value }}
            hitSlop={4}
            onPress={() => onChange(n)}
          >
            {icon}
          </Pressable>
        ) : (
          <View key={n}>{icon}</View>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(() => ({
  row: { flexDirection: 'row', gap: spacing.sm },
}));
