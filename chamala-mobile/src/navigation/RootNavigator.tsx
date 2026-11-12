import { useMemo } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { LoadingView } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useColors } from '../theme/dynamic';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

/** Escolhe entre o fluxo de login/cadastro e a área logada, conforme o AuthContext. */
export function RootNavigator() {
  const { user, isLoading } = useAuth();
  const colors = useColors();
  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    }),
    [colors],
  );

  if (isLoading) return <LoadingView />;

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AppNavigator key={user.id} /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
