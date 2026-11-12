import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { BookingScreen } from '../screens/client/BookingScreen';
import { ProfessionalProfileScreen } from '../screens/client/ProfessionalProfileScreen';
import { RequestQuoteScreen } from '../screens/client/RequestQuoteScreen';
import { CancellationPolicyScreen } from '../screens/pro/CancellationPolicyScreen';
import { MyServicesScreen } from '../screens/pro/MyServicesScreen';
import { PaymentDataScreen } from '../screens/pro/PaymentDataScreen';
import { ProfessionalVerificationScreen } from '../screens/pro/ProfessionalVerificationScreen';
import { RespondQuoteScreen } from '../screens/pro/RespondQuoteScreen';
import { ServiceFormScreen } from '../screens/pro/ServiceFormScreen';
import { ServicesDoneScreen } from '../screens/pro/ServicesDoneScreen';
import { VerificationSentScreen } from '../screens/pro/VerificationSentScreen';
import { AccessibilityScreen } from '../screens/shared/AccessibilityScreen';
import { AddressesScreen } from '../screens/shared/AddressesScreen';
import { CancelOrderScreen } from '../screens/shared/CancelOrderScreen';
import { ContractScreen } from '../screens/shared/ContractScreen';
import { EditProfileScreen } from '../screens/shared/EditProfileScreen';
import { InfoScreen } from '../screens/shared/InfoScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { OrderDetailScreen } from '../screens/shared/OrderDetailScreen';
import { ProposeNewDateScreen } from '../screens/shared/ProposeNewDateScreen';
import { ReviewServiceScreen } from '../screens/shared/ReviewServiceScreen';
import { ReviewsScreen } from '../screens/shared/ReviewsScreen';
import type { AppStackParamList } from '../types';
import { ClientTabs } from './ClientTabs';
import { ProfessionalTabs } from './ProfessionalTabs';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Área logada. Telas empilhadas aqui aparecem acima das abas, sem a barra inferior (como no Figma). */
export function AppNavigator() {
  const { user, startVerification, clearStartVerification } = useAuth();
  const isProfessional = user?.role === 'professional';

  // "Criar Conta + Fazer Verificação agora": o profissional abre direto na verificação.
  const initialRouteName: keyof AppStackParamList = isProfessional
    ? startVerification
      ? 'ProfessionalVerification'
      : 'ProfessionalTabs'
    : 'ClientTabs';

  useEffect(() => {
    if (startVerification) clearStartVerification();
  }, [startVerification, clearStartVerification]);

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      {isProfessional ? (
        <>
          <Stack.Screen name="ProfessionalTabs" component={ProfessionalTabs} />
          <Stack.Screen name="ProfessionalVerification" component={ProfessionalVerificationScreen} />
          <Stack.Screen name="VerificationSent" component={VerificationSentScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="RespondQuote" component={RespondQuoteScreen} />
          <Stack.Screen name="MyServices" component={MyServicesScreen} />
          <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
          <Stack.Screen name="CancellationPolicy" component={CancellationPolicyScreen} />
          <Stack.Screen name="ServicesDone" component={ServicesDoneScreen} />
          <Stack.Screen name="PaymentData" component={PaymentDataScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="ClientTabs" component={ClientTabs} />
          <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="RequestQuote" component={RequestQuoteScreen} />
          <Stack.Screen name="Addresses" component={AddressesScreen} />
        </>
      )}

      {/* compartilhadas pelos dois perfis */}
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Contract" component={ContractScreen} />
      <Stack.Screen
        name="CancelOrder"
        component={CancelOrderScreen}
        options={{ presentation: 'transparentModal', animation: 'slide_from_bottom', contentStyle: { backgroundColor: 'transparent' } }}
      />
      <Stack.Screen name="ProposeNewDate" component={ProposeNewDateScreen} />
      <Stack.Screen name="ReviewService" component={ReviewServiceScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  );
}
