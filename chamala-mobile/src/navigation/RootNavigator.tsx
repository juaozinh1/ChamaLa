import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useSession } from '../contexts/SessionContext';
import { colors } from '../theme';
import { AuthStack } from './AuthStack';
import { ClientTabs } from './ClientTabs';
import { ProTabs } from './ProTabs';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
  },
};

// O papel do usuário decide qual navegação aparece. ADMIN usa o painel web, não o app.
export function RootNavigator() {
  const { role } = useSession();

  return (
    <NavigationContainer theme={theme}>
      {role === 'CLIENT' ? (
        <ClientTabs />
      ) : role === 'PROFESSIONAL' ? (
        <ProTabs />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
