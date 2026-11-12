import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { IoniconName } from '../components';
import { typography } from '../theme';
import { useColors } from '../theme/dynamic';

/** Opções visuais comuns às abas do cliente e do profissional (acompanham o alto contraste). */
export function useTabScreenOptions(): BottomTabNavigationOptions {
  const colors = useColors();
  return useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarLabelStyle: { fontSize: typography.caption.fontSize - 1, fontWeight: '500' as const },
    }),
    [colors],
  );
}

export const tabIcon =
  (name: IoniconName): NonNullable<BottomTabNavigationOptions['tabBarIcon']> =>
  ({ color, size }) => <Ionicons name={name} size={size} color={color} />;
