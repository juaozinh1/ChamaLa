import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientSignUpScreen } from '../screens/auth/ClientSignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ProfessionalSignUpScreen } from '../screens/auth/ProfessionalSignUpScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ClientSignUp" component={ClientSignUpScreen} />
      <Stack.Screen name="ProfessionalSignUp" component={ProfessionalSignUpScreen} />
    </Stack.Navigator>
  );
}
