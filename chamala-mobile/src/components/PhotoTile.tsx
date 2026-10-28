import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type PhotoTileProps = {
  /** Foto escolhida. Sem ela, mostra o quadrado "+ Adicionar". */
  uri?: string;
  size?: number;
  onPress?: () => void;
  onRemove?: () => void;
};

// Fotos de trabalhos anteriores (até 6): monte a grade na tela com flexWrap + gap.
export function PhotoTile({ uri, size = 96, onPress, onRemove }: PhotoTileProps) {
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
      accessibilityLabel="Adicionar foto"
      onPress={onPress}
      style={({ pressed }) => [box, styles.add, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={28} color={colors.textMuted} />
      <Text style={styles.addText}>Adicionar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
