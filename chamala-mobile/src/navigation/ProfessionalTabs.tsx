import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/pro/DashboardScreen';
import { ProfessionalProfileTabScreen } from '../screens/pro/ProfessionalProfileTabScreen';
import { RequestsScreen } from '../screens/pro/RequestsScreen';
import { VerificationStatusScreen } from '../screens/pro/VerificationStatusScreen';
import type { ProfessionalTabParamList } from '../types';
import { tabIcon, useTabScreenOptions } from './tabOptions';

const Tabs = createBottomTabNavigator<ProfessionalTabParamList>();

export function ProfessionalTabs() {
  const screenOptions = useTabScreenOptions();
  return (
    <Tabs.Navigator screenOptions={screenOptions}>
      <Tabs.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Painel', tabBarIcon: tabIcon('grid-outline') }} />
      <Tabs.Screen name="Requests" component={RequestsScreen} options={{ title: 'Solicitações', tabBarIcon: tabIcon('document-text-outline') }} />
      <Tabs.Screen name="VerificationStatus" component={VerificationStatusScreen} options={{ title: 'Verificação', tabBarIcon: tabIcon('shield-checkmark-outline') }} />
      <Tabs.Screen name="Profile" component={ProfessionalProfileTabScreen} options={{ title: 'Perfil', tabBarIcon: tabIcon('person-outline') }} />
    </Tabs.Navigator>
  );
}
