import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Input, Button, AlertBanner } from '../components';
import { api } from '../services/api';

interface TelaLoginProps {
  onLoginSuccess: (user: { id: string; name: string; role: 'CLIENT' | 'PROFESSIONAL' }) => void;
  onNavigateToCadastro: () => void;
  onNavigateToCadastroProfissional: () => void;
}

export const TelaLogin = ({
  onLoginSuccess,
  onNavigateToCadastro,
  onNavigateToCadastroProfissional,
}: TelaLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/v1/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      const { id, name, role } = response.data;
      const normalizedRole = role.includes('PROFESSIONAL') ? 'PROFESSIONAL' : 'CLIENT';

      onLoginSuccess({
        id,
        name,
        role: normalizedRole,
      });
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'E-mail ou senha incorretos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView
        contentContainerStyle={globalStyles.centeredContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.headerBlock}>
          <View style={globalStyles.logoContainer}>
            <Text style={{ fontSize: 36 }}>🛠️</Text>
          </View>
          <Text style={globalStyles.title}>ChamaLá</Text>
          <Text style={globalStyles.subtitle}>
            Conectando você aos melhores profissionais
          </Text>
        </View>

        {errorMessage ? (
          <View style={{ marginBottom: 16 }}>
            <AlertBanner message={errorMessage} variant="error" />
          </View>
        ) : null}

        <View style={globalStyles.formSection}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={globalStyles.formActions}>
            <Button
              title={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
              disabled={loading}
            />
          </View>
        </View>

        <View style={{ marginTop: 24, gap: 12 }}>
          <View style={globalStyles.footerNav}>
            <Text style={globalStyles.footerText}>Não tem conta de cliente?</Text>
            <TouchableOpacity onPress={onNavigateToCadastro}>
              <Text style={globalStyles.footerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.footerNav}>
            <Text style={globalStyles.footerText}>Quer prestar serviços?</Text>
            <TouchableOpacity onPress={onNavigateToCadastroProfissional}>
              <Text style={globalStyles.footerLink}>Cadastre-se como Profissional</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};