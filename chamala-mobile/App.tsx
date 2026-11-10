import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { TelaLogin } from './src/screens/TelaLogin';
import { TelaCadastro } from './src/screens/TelaCadastro';
import { TelaCadastroProfissional } from './src/screens/TelaCadastroProfissional';
import { TelaHome } from './src/screens/TelaHome';
import { TelaHomeProfissional } from './src/screens/TelaHomeProfissional';
import { TelaCriarPedido } from './src/screens/TelaCriarPedido';

interface UserSession {
  id: string;
  name: string;
  role: 'CLIENT' | 'PROFESSIONAL';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    if (user.role === 'PROFESSIONAL') {
      setCurrentScreen('homeProfissional');
    } else {
      setCurrentScreen('homeCliente');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <StatusBar style="dark" />

        {currentScreen === 'login' && (
          <TelaLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigateToCadastro={() => setCurrentScreen('cadastro')}
            onNavigateToCadastroProfissional={() => setCurrentScreen('cadastroProfissional')}
          />
        )}

        {currentScreen === 'cadastro' && (
          <TelaCadastro
            onBack={() => setCurrentScreen('login')}
            onSuccess={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'cadastroProfissional' && (
          <TelaCadastroProfissional
            onBack={() => setCurrentScreen('login')}
            onSuccess={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'homeCliente' && (
          <TelaHome
            onNavigateToNewOrder={() => setCurrentScreen('criarPedido')}
          />
        )}

        {currentScreen === 'homeProfissional' && (
          <TelaHomeProfissional />
        )}

        {currentScreen === 'criarPedido' && currentUser && (
          <TelaCriarPedido
            clientId={currentUser.id}
            onBack={() => setCurrentScreen('homeCliente')}
            onSuccess={() => setCurrentScreen('homeCliente')}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}