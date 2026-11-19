import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget, spacing } from '../theme';

type ScreenHeaderProps = {
  title: string;
  /** Sem onBack, o botão de voltar não aparece. */
  onBack?: () => void;
  backLabel?: string;
};

/** Cabeçalho das telas empilhadas (voltar + título). Figma: Componentes › ScreenHeader (2:31). */
export function ScreenHeader({ title, onBack, backLabel = 'Voltar' }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          onPress={onBack}
          hitSlop={(minTouchTarget - ICON_SIZE) / 2}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={ICON_SIZE} color={colors.primary} />
        </Pressable>
      ) : null}
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
  title: { flex: 1, fontSize: 17, fontWeight: '600', color: colors.text },
});
