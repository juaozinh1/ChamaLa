import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Platform, ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TelaHome } from './src/screens/TelaHome';
import { TelaHomeProfissional } from './src/screens/TelaHomeProfissional';
import { TelaLogin } from './src/screens/TelaLogin';
import { TelaCadastro } from './src/screens/TelaCadastro';
import { TelaCadastroProfissional } from './src/screens/TelaCadastroProfissional';
import { colors } from './src/theme';
import { api } from './src/services/api';

type Route = 'HOME' | 'HOME_PRO' | 'LOGIN' | 'CADASTRO' | 'CADASTRO_PRO';
type UserRole = 'CLIENTE' | 'PROFISSIONAL';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('HOME');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('CLIENTE');
  const [loadingStorage, setLoadingStorage] = useState(true);

  const navigateTo = (newRoute: Route) => {
    setCurrentRoute(newRoute);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.pushState({ route: newRoute }, '', `?screen=${newRoute}`);
    }
  };

  // 1. Checa se o usuário já estava logado anteriormente
  useEffect(() => {
    const checkPersistedAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@chamala:token');
        const userJson = await AsyncStorage.getItem('@chamala:user');

        if (token && userJson) {
          const user = JSON.parse(userJson);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsLoggedIn(true);
          setUserRole(user.role);

          if (user.role === 'PROFISSIONAL') {
            setCurrentRoute('HOME_PRO');
          } else {
            setCurrentRoute('HOME');
          }
        }
      } catch (e) {
        console.error('Falha ao restaurar autenticação:', e);
      } finally {
        setLoadingStorage(false);
      }
    };

    checkPersistedAuth();
  }, []);

  // 2. Logout limpa os dados locais
  const handleLogout = async () => {
    await AsyncStorage.removeItem('@chamala:token');
    await AsyncStorage.removeItem('@chamala:user');
    delete api.defaults.headers.common['Authorization'];

    setIsLoggedIn(false);
    setUserRole('CLIENTE');
    navigateTo('HOME');
  };

  // 3. Redirecionamento após login bem-sucedido com base na role
  const handleLoginSuccess = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);

    if (role === 'PROFISSIONAL') {
      navigateTo('HOME_PRO');
    } else {
      navigateTo('HOME');
    }
  };

  if (loadingStorage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {currentRoute === 'HOME' && (
        <TelaHome
          isLoggedIn={isLoggedIn && userRole === 'CLIENTE'}
          onLogout={handleLogout}
          onNavigateToLogin={() => navigateTo('LOGIN')}
          onNavigateToRegister={() => navigateTo('CADASTRO')}
          onNavigateToPro={() => navigateTo('CADASTRO_PRO')}
        />
      )}

      {currentRoute === 'HOME_PRO' && (
        <TelaHomeProfissional onLogout={handleLogout} />
      )}

      {currentRoute === 'LOGIN' && (
        <TelaLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => navigateTo('CADASTRO')}
          onBack={() => navigateTo('HOME')}
        />
      )}

      {currentRoute === 'CADASTRO' && (
        <TelaCadastro
          onRegisterSuccess={() => navigateTo('LOGIN')}
          onNavigateToLogin={() => navigateTo('LOGIN')}
          onBack={() => navigateTo('HOME')}
        />
      )}

      {currentRoute === 'CADASTRO_PRO' && (
        <TelaCadastroProfissional
          onRegisterSuccess={() => navigateTo('LOGIN')}
          onNavigateToLogin={() => navigateTo('LOGIN')}
          onBack={() => navigateTo('HOME')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});