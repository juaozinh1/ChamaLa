import React, { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** Padding interno. Desligue (false) quando o conteúdo já tem o próprio padding. */
  padded?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

// Cartão plano, só com borda, como no Figma.
export function Card({
  children,
  onPress,
  padded = true,
  accessibilityLabel,
  style,
}: CardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          padded && styles.padded,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, padded && styles.padded, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  padded: { padding: spacing.lg },
  pressed: { opacity: 0.9 },
});
