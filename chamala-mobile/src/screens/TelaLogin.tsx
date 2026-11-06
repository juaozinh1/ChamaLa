import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button } from '../components';
import { colors, spacing, typography } from '../theme';
import { api } from '../services/api';

interface TelaLoginProps {
  onLoginSuccess: (role: 'CLIENTE' | 'PROFISSIONAL') => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
}

export const TelaLogin = ({ onLoginSuccess, onNavigateToRegister, onBack }: TelaLoginProps) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      // Rota correta alinhada com o @RequestMapping("/api/v1/auth") do backend
      // Enviando 'password' em vez de 'senha' para o LoginRequest Java
      const response = await api.post('/api/v1/auth/login', {
        email: email.trim().toLowerCase(),
        password: senha,
      });

      const data = response.data;
      const token = data.token || 'temp-token';
      const roleVindaDoBanco = (data.usuario?.role || data.role || 'CLIENT').toUpperCase();

      // Normaliza para o tipo exigido pela interface ('CLIENTE' | 'PROFISSIONAL')
      const normalizedRole: 'CLIENTE' | 'PROFISSIONAL' =
        roleVindaDoBanco.includes('PROF') ? 'PROFISSIONAL' : 'CLIENTE';

      // 1. Salva dados localmente no dispositivo
      await AsyncStorage.setItem('@chamala:token', token);
      await AsyncStorage.setItem('@chamala:user', JSON.stringify(data.usuario || data));

      // 2. Configura o header das próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 3. Notifica a navegação principal
      onLoginSuccess(normalizedRole);

    } catch (error: any) {
      console.error('Erro de login:', error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Falha ao autenticar. Verifique o seu e-mail e senha.';
      Alert.alert('Erro no Login', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Voltar para o início</Text>
      </TouchableOpacity>

      <Text style={styles.title}>ChamaLá</Text>
      <Text style={styles.subtitle}>Acesse a sua conta</Text>

      <Input
        label="E-mail"
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Senha"
        placeholder="••••••••"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={onNavigateToRegister} style={styles.linkButton}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    ...typography.body,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  linkButton: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    ...typography.caption,
  },
});