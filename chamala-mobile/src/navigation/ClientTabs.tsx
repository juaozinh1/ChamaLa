import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesScreen } from '../screens/client/CategoriesScreen';
import { ClientProfileScreen } from '../screens/client/ClientProfileScreen';
import { HomeScreen } from '../screens/client/HomeScreen';
import { OrdersScreen } from '../screens/client/OrdersScreen';
import { ProfessionalListScreen } from '../screens/client/ProfessionalListScreen';
import type { ClientTabParamList, ServicesStackParamList } from '../types';
import { tabIcon, useTabScreenOptions } from './tabOptions';

const Tabs = createBottomTabNavigator<ClientTabParamList>();
const ServicesStack = createNativeStackNavigator<ServicesStackParamList>();

// A lista de profissionais fica dentro da aba Serviços, então a barra inferior continua visível (como no Figma).
function ServicesNavigator() {
  return (
    <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
      <ServicesStack.Screen name="Categories" component={CategoriesScreen} />
      <ServicesStack.Screen name="ProfessionalList" component={ProfessionalListScreen} />
    </ServicesStack.Navigator>
  );
}

export function ClientTabs() {
  const screenOptions = useTabScreenOptions();
  return (
    <Tabs.Navigator screenOptions={screenOptions}>
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Início', tabBarIcon: tabIcon('home-outline') }} />
      <Tabs.Screen name="Services" component={ServicesNavigator} options={{ title: 'Serviços', tabBarIcon: tabIcon('grid-outline') }} />
      <Tabs.Screen name="Orders" component={OrdersScreen} options={{ title: 'Pedidos', tabBarIcon: tabIcon('document-text-outline') }} />
      <Tabs.Screen name="Profile" component={ClientProfileScreen} options={{ title: 'Perfil', tabBarIcon: tabIcon('person-outline') }} />
    </Tabs.Navigator>
  );
}
