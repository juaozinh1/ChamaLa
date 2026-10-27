import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProProfileStackParamList, ProTabParamList } from './types';
import { colors } from '../theme';
import { ProHomeScreen } from '../screens/pro/ProHomeScreen';
import { ProRequestsScreen } from '../screens/pro/ProRequestsScreen';
import { ProVerifyScreen } from '../screens/pro/ProVerifyScreen';
import { ProProfileScreen } from '../screens/pro/ProProfileScreen';
import { AccessibilityScreen } from '../screens/shared/AccessibilityScreen';

const ProfileStack = createNativeStackNavigator<ProProfileStackParamList>();
const Tab = createBottomTabNavigator<ProTabParamList>();

function ProProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerTintColor: colors.primary }}>
      <ProfileStack.Screen
        name="ProProfile"
        component={ProProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Accessibility"
        component={AccessibilityScreen}
        options={{ title: 'Acessibilidade' }}
      />
    </ProfileStack.Navigator>
  );
}

// Abas do profissional no protótipo: Painel, Solicitações, Verificação, Perfil.
export function ProTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="ProHomeTab"
        component={ProHomeScreen}
        options={{ title: 'Painel' }}
      />
      <Tab.Screen
        name="ProRequestsTab"
        component={ProRequestsScreen}
        options={{ title: 'Solicitações' }}
      />
      <Tab.Screen
        name="ProVerifyTab"
        component={ProVerifyScreen}
        options={{ title: 'Verificação' }}
      />
      <Tab.Screen
        name="ProProfileTab"
        component={ProProfileStackNavigator}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
