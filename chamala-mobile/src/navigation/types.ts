import type { NavigatorScreenParams } from '@react-navigation/native';

// Rotas mapeadas a partir das 16 telas do protótipo no Figma (ver docs/ROADMAP.md).

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ProRegister: undefined;
};

export type ClientHomeStackParamList = {
  Home: undefined;
  Categories: undefined;
  CategoryDetail: { categoryId: number };
  Provider: { professionalId: string };
  Booking: { professionalId: string };
};

export type ClientProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Accessibility: undefined;
};

export type ClientTabParamList = {
  HomeTab: NavigatorScreenParams<ClientHomeStackParamList>;
  CategoriesTab: NavigatorScreenParams<ClientHomeStackParamList>;
  OrdersTab: undefined;
  ProfileTab: NavigatorScreenParams<ClientProfileStackParamList>;
};

export type ProProfileStackParamList = {
  ProProfile: undefined;
  Accessibility: undefined;
};

export type ProTabParamList = {
  ProHomeTab: undefined;
  ProRequestsTab: undefined;
  ProVerifyTab: undefined;
  ProProfileTab: NavigatorScreenParams<ProProfileStackParamList>;
};
