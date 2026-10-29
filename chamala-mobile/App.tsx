import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TelaHome } from './src/screens/TelaHome';
import { TelaLogin } from './src/screens/TelaLogin';
import { TelaCadastro } from './src/screens/TelaCadastro';
import { TelaCadastroProfissional } from './src/screens/TelaCadastroProfissional';
import { colors } from './src/theme';

type Route = 'HOME' | 'LOGIN' | 'CADASTRO' | 'CADASTRO_PRO';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('HOME');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função centralizada para navegar e registrar no histórico do navegador
  const navigateTo = (newRoute: Route) => {
    setCurrentRoute(newRoute);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.pushState({ route: newRoute }, '', `?screen=${newRoute}`);
    }
  };

  // Escuta o botão de "Voltar" do próprio navegador
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Define o estado inicial da URL
    window.history.replaceState({ route: 'HOME' }, '', '?screen=HOME');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.route) {
        setCurrentRoute(event.state.route);
      } else {
        setCurrentRoute('HOME');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {currentRoute === 'HOME' && (
        <TelaHome
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            setIsLoggedIn(false);
            navigateTo('HOME');
          }}
          onNavigateToLogin={() => navigateTo('LOGIN')}
          onNavigateToRegister={() => navigateTo('CADASTRO')}
          onNavigateToPro={() => navigateTo('CADASTRO_PRO')}
        />
      )}

      {currentRoute === 'LOGIN' && (
        <TelaLogin
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            navigateTo('HOME');
          }}
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
          onRegisterSuccess={() => navigateTo('HOME')}
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
});