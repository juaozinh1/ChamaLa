import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList, AuthStackParamList } from '../types';

/** Navegação tipada para as telas da área logada (também funciona dentro das abas). */
export const useAppNavigation = () =>
  useNavigation<NativeStackNavigationProp<AppStackParamList>>();

export const useAuthNavigation = () =>
  useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
