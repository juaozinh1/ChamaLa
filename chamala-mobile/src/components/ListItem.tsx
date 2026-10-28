import React, { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Emoji decorativo à esquerda (como nos menus de Perfil). */
  emoji?: string;
  /** Qualquer elemento à esquerda: ícone, avatar etc. Tem prioridade sobre `emoji`. */
  left?: ReactNode;
  /** Algo à direita: Badge, texto etc. */
  right?: ReactNode;
  onPress?: () => void;
  /** Mostra a seta ">" quando o item é clicável. Padrão: true se houver onPress. */
  showChevron?: boolean;
  /** 'card' (padrão): cartão com borda, como no Figma. 'plain': linha sem borda. */
  variant?: 'card' | 'plain';
  style?: StyleProp<ViewStyle>;
};

export function ListItem({
  title,
  subtitle,
  emoji,
  left,
  right,
  onPress,
  showChevron,
  variant = 'card',
  style,
}: ListItemProps) {
  const chevron = showChevron ?? Boolean(onPress);
  const leading = left ?? (emoji ? <Text style={styles.emoji}>{emoji}</Text> : null);

  const content = (
    <>
      {leading ? (
        <View
          style={styles.left}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {leading}
        </View>
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
      {chevron ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      ) : null}
    </>
  );

  const rowStyle = [styles.row, variant === 'card' && styles.card];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [rowStyle, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[rowStyle, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTouchTarget + spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { backgroundColor: colors.background },
  left: { minWidth: 28, alignItems: 'center', marginRight: spacing.md },
  emoji: { fontSize: 22 },
  body: { flex: 1 },
  right: { marginLeft: spacing.md, marginRight: spacing.xs },
  title: { ...typography.body, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
