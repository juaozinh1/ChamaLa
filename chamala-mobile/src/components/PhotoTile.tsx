import { Image, Pressable, View } from 'react-native';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type PhotoTileProps = {
  /** Foto escolhida. Sem ela, mostra o quadrado "+ Adicionar". */
  uri?: string;
  size?: number;
  /** Texto do quadrado vazio. Padrão: "Adicionar". */
  label?: string;
  onPress?: () => void;
  onRemove?: () => void;
};

// Fotos de trabalhos anteriores (até 6): monte a grade na tela com flexWrap + gap.
export function PhotoTile({ uri, size = 96, label = 'Adicionar', onPress, onRemove }: PhotoTileProps) {
  const styles = useStyles();
  const colors = useColors();
  const box = { width: size, height: size };

  if (uri) {
    return (
      <View style={box}>
        <Image
          source={{ uri }}
          style={[box, styles.image]}
          accessibilityIgnoresInvertColors
        />
        {onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remover foto"
            onPress={onRemove}
            hitSlop={8}
            style={styles.remove}
          >
            <Ionicons name="close-circle" size={24} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} foto`}
      onPress={onPress}
      style={({ pressed }) => [box, styles.add, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={28} color={colors.textMuted} />
      <Text style={styles.addText}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  image: { borderRadius: radius.lg },
  remove: {
    position: 'absolute',
    top: -spacing.sm,
    right: -spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.85 },
  addText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
}));
