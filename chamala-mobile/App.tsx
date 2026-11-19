import React, { useCallback, useState } from 'react';
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
  TelaMinhaConta,
} from './src/screens';

type HomeScreen = 'home_cliente' | 'home_profissional';

type ScreenState =
  | 'login'
  | 'cadastro_cliente'
  | 'cadastro_profissional'
  | HomeScreen
  | 'criar_pedido'
  | 'minha_conta';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('login');
  // Tela inicial de quem está logado: para onde "Minha conta" volta.
  const [home, setHome] = useState<HomeScreen>('home_cliente');

  const handleLoginSuccess = (role: 'client' | 'professional') => {
    const destino: HomeScreen =
      role === 'professional' ? 'home_profissional' : 'home_cliente';
    setHome(destino);
    setCurrentScreen(destino);
  };

  // Estável entre renderizações: TelaMinhaConta usa como dependência de efeito.
  const handleLogout = useCallback(() => {
    setHome('home_cliente');
    setCurrentScreen('login');
  }, []);

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
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'home_cliente':
        return (
          <TelaHome
            onNavigateToNewOrder={() => setCurrentScreen('criar_pedido')}
            onNavigateToOrderDetails={(_orderId) => {}}
            onNavigateToAccount={() => setCurrentScreen('minha_conta')}
          />
        );

      case 'home_profissional':
        return (
          <TelaHomeProfissional
            onNavigateToOrderDetails={(_orderId) => {}}
            onNavigateToAccount={() => setCurrentScreen('minha_conta')}
          />
        );

      case 'minha_conta':
        return (
          <TelaMinhaConta onBack={() => setCurrentScreen(home)} onLogout={handleLogout} />
        );

      case 'criar_pedido':
        return (
          <TelaCriarPedido
            onBack={() => setCurrentScreen('home_cliente')}
            onSuccess={() => setCurrentScreen('home_cliente')}
          />
        );

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
