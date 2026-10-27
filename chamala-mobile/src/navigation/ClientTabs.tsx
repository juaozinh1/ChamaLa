import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  ClientHomeStackParamList,
  ClientProfileStackParamList,
  ClientTabParamList,
} from './types';
import { colors } from '../theme';
import { HomeScreen } from '../screens/client/HomeScreen';
import { CategoriesScreen } from '../screens/client/CategoriesScreen';
import { CategoryDetailScreen } from '../screens/client/CategoryDetailScreen';
import { ProviderScreen } from '../screens/client/ProviderScreen';
import { BookingScreen } from '../screens/client/BookingScreen';
import { OrdersScreen } from '../screens/client/OrdersScreen';
import { ProfileScreen } from '../screens/client/ProfileScreen';
import { EditProfileScreen } from '../screens/client/EditProfileScreen';
import { AccessibilityScreen } from '../screens/shared/AccessibilityScreen';

const HomeStack = createNativeStackNavigator<ClientHomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ClientProfileStackParamList>();
const Tab = createBottomTabNavigator<ClientTabParamList>();

// A mesma pilha atende as abas Início e Serviços; muda só a tela inicial.
function HomeStackNavigator({
  initialRouteName = 'Home',
}: {
  initialRouteName?: keyof ClientHomeStackParamList;
}) {
  return (
    <HomeStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerTintColor: colors.primary }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Serviços' }}
      />
      <HomeStack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        options={{ title: 'Profissionais' }}
      />
      <HomeStack.Screen
        name="Provider"
        component={ProviderScreen}
        options={{ title: 'Profissional' }}
      />
      <HomeStack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Agendar' }}
      />
    </HomeStack.Navigator>
  );
}

function CategoriesStackNavigator() {
  return <HomeStackNavigator initialRouteName="Categories" />;
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerTintColor: colors.primary }}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar perfil' }}
      />
      <ProfileStack.Screen
        name="Accessibility"
        component={AccessibilityScreen}
        options={{ title: 'Acessibilidade' }}
      />
    </ProfileStack.Navigator>
  );
}

// Abas do cliente no protótipo: Início, Serviços, Pedidos, Perfil.
export function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Início' }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStackNavigator}
        options={{ title: 'Serviços' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ title: 'Pedidos' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
