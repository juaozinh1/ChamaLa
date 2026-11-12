import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ClientSignUp: undefined;
  ProfessionalSignUp: undefined;
};

export type ServicesStackParamList = {
  Categories: undefined;
  ProfessionalList: { categoryId: string; categoryName: string };
};

export type ClientTabParamList = {
  Home: undefined;
  Services: NavigatorScreenParams<ServicesStackParamList> | undefined;
  Orders: undefined;
  Profile: undefined;
};

export type ProfessionalTabParamList = {
  Dashboard: undefined;
  Requests: undefined;
  VerificationStatus: undefined;
  Profile: undefined;
};

export type InfoKind = 'help' | 'privacy';

/** Telas empilhadas acima das abas (sem barra inferior). Compartilhadas entre os dois perfis. */
export type AppStackParamList = {
  ClientTabs: NavigatorScreenParams<ClientTabParamList> | undefined;
  ProfessionalTabs: NavigatorScreenParams<ProfessionalTabParamList> | undefined;
  // cliente
  ProfessionalProfile: { professionalId: string };
  Booking: { professionalId: string; serviceId?: string };
  RequestQuote: { professionalId: string };
  Addresses: undefined;
  // profissional
  ProfessionalVerification: undefined;
  VerificationSent: undefined;
  RespondQuote: { orderId: string };
  MyServices: undefined;
  ServiceForm: { serviceId?: string };
  CancellationPolicy: undefined;
  ServicesDone: undefined;
  PaymentData: undefined;
  // compartilhadas
  OrderDetail: { orderId: string };
  Contract: { orderId: string };
  CancelOrder: { orderId: string };
  ProposeNewDate: { orderId: string };
  ReviewService: { orderId: string };
  Reviews: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Accessibility: undefined;
  Info: { kind: InfoKind };
};
