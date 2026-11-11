import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import {
  TelaLogin,
  TelaCadastro,
  TelaCadastroProfissional,
  TelaHome,
  TelaHomeProfissional,
  TelaCriarPedido,
} from './src/screens';

type ScreenState =
  | 'login'
  | 'cadastro_cliente'
  | 'cadastro_profissional'
  | 'home_cliente'
  | 'home_profissional'
  | 'criar_pedido';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('login');

  const handleLoginSuccess = (role: 'client' | 'professional') => {
    if (role === 'professional') {
      setCurrentScreen('home_profissional');
    } else {
      setCurrentScreen('home_cliente');
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <TelaLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentScreen('cadastro_cliente')}
            onNavigateToProfessionalRegister={() =>
              setCurrentScreen('cadastro_profissional')
            }
          />
        );

      case 'cadastro_cliente':
        return (
          <TelaCadastro
            onSuccess={() => setCurrentScreen('login')}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'cadastro_profissional':
        return (
          <TelaCadastroProfissional
            onSuccess={() => setCurrentScreen('login')}
          />
        );

      case 'home_cliente':
        return (
          <TelaHome
            onNavigateToNewOrder={() => setCurrentScreen('criar_pedido')}
            onNavigateToOrderDetails={(_orderId) => {}}
          />
        );

      case 'home_profissional':
        return (
          <TelaHomeProfissional
            onNavigateToOrderDetails={(_orderId) => {}}
          />
        );

      case 'criar_pedido':
        return <TelaCriarPedido />;

      default:
        return (
          <TelaLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentScreen('cadastro_cliente')}
            onNavigateToProfessionalRegister={() =>
              setCurrentScreen('cadastro_profissional')
            }
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {renderCurrentScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});