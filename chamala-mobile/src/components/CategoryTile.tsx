import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import type { Category } from '../types';
import { radius, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

/** Ícone de categoria (emoji sobre fundo colorido) com o nome embaixo. Quatro por linha no Início. */
export function CategoryTile({ category, onPress }: { category: Category; onPress: () => void }) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Categoria ${category.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: category.color, borderColor: colors.border }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {category.name}
      </Text>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  tile: { width: '25%', alignItems: 'center', paddingVertical: spacing.xs },
  pressed: { opacity: 0.8 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emoji: { fontSize: 26 },
  name: { ...typography.caption, color: colors.text },
}));
