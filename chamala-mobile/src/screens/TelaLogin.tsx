import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AlertBanner } from '../components/AlertBanner';
import { api } from '../services/api';

interface LoginResponseData {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface TelaLoginProps {
  onLoginSuccess?: (role: 'client' | 'professional') => void;
  onNavigateToRegister?: () => void;
  onNavigateToProfessionalRegister?: () => void;
}

export const TelaLogin: React.FC<TelaLoginProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToProfessionalRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha seu e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Chamada ao endpoint correto no Spring Boot
      const response = await api.post<LoginResponseData>('/api/v1/auth/login', {
        email: email.trim(),
        password,
      });

      // Salva a sessão completa no dispositivo para recuperar o clientId e token depois
      await AsyncStorage.setItem('@chamala:user', JSON.stringify(response.data));

      const userRole = response.data.role;

      const isProfessional =
        userRole?.toUpperCase() === 'PROFESSIONAL' ||
        userRole?.toUpperCase() === 'PRESTADOR' ||
        userRole?.toLowerCase() === 'professional';

      if (isProfessional) {
        onLoginSuccess?.('professional');
      } else {
        onLoginSuccess?.('client');
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'E-mail ou senha incorretos.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.badge}>CHAMALÁ</Text>
        <Text style={styles.title}>Acessar Plataforma</Text>
        <Text style={styles.subtitle}>
          Entre com sua conta para solicitar ou prestar serviços.
        </Text>
      </View>

      {error ? <AlertBanner message={error} /> : null}

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>E-mail</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Senha</Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha secreta"
            secureTextEntry
          />
        </View>

        <Button
          title="Entrar"
          loading={loading}
          onPress={handleLogin}
          style={styles.loginBtn}
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={onNavigateToRegister}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Ainda não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onNavigateToProfessionalRegister}
          style={styles.linkButton}
        >
          <Text style={styles.professionalLinkText}>
            Quero prestar serviços como profissional
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  badge: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  loginBtn: {
    marginTop: spacing.sm,
    borderRadius: 0,
    minHeight: minTouchTarget,
  },
  footer: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  linkButton: {
    minHeight: minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.textMuted,
  },
  linkBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  professionalLinkText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
    textDecorationLine: 'underline',
  },
});