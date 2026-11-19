import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget } from '../theme';
import { Avatar } from './Avatar';

type AccountButtonProps = {
  /** Nome do usuário: mostra a inicial. Sem nome, mostra o ícone de pessoa. */
  name?: string;
  onPress?: () => void;
};

/** Atalho para "Minha conta" no topo das telas iniciais. */
export function AccountButton({ name, onPress }: AccountButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Minha conta"
      accessibilityHint="Abre seus dados e a opção de sair"
      onPress={onPress}
      style={({ pressed }) => [styles.touch, pressed && styles.pressed]}
    >
      {name?.trim() ? (
        <Avatar name={name} size={40} />
      ) : (
        <View style={styles.fallback}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  fallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoBg,
  },
});
