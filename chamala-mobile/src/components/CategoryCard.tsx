import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import type { Category } from '../types';
import { radius, spacing, typography } from '../theme';
import { makeStyles } from '../theme/dynamic';

/** Cartão de categoria (emoji sobre fundo colorido + nome). Dois por linha na tela Serviços. */
export function CategoryCard({ category, onPress }: { category: Category; onPress: () => void }) {
  const styles = useStyles();
  return (
    <Card
      padded={false}
      onPress={onPress}
      accessibilityLabel={`Categoria ${category.name}`}
      style={styles.card}
    >
      <View style={[styles.icon, { backgroundColor: category.color }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {category.name}
      </Text>
    </Card>
  );
}

const useStyles = makeStyles((colors) => ({
  card: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, flex: 1 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: { fontSize: 24 },
  name: { ...typography.body, fontWeight: '700', color: colors.text, flexShrink: 1 },
}));
