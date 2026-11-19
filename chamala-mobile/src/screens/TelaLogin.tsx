import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import type { IoniconName } from '../components/icon';
import {
  useFieldErrors,
  resumoDosErros,
  type FieldErrors,
} from '../hooks/useFieldErrors';
import { api } from '../services/api';

const LOGO = require('../../assets/images/logo-symbol-transparent.png');

type Campo = 'email' | 'senha';

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

/** Atalho de cadastro: ícone, título, descrição e seta. */
function OpcaoCadastro({
  icon,
  title,
  description,
  onPress,
}: {
  icon: IoniconName;
  title: string;
  description: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
    >
      <View style={styles.optionIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export const TelaLogin: React.FC<TelaLoginProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToProfessionalRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, setErrors, clearError } = useFieldErrors<Campo>();
  const { toast, showToast } = useToast({ top: 16 });

  const handleLogin = async () => {
    const erros: FieldErrors<Campo> = {};
    if (!email.trim()) erros.email = 'Informe seu e-mail.';
    if (!password.trim()) erros.senha = 'Informe sua senha.';

    setErrors(erros);
    const resumo = resumoDosErros(erros);
    if (resumo) {
      showToast(resumo);
      return;
    }

    try {
      setLoading(true);

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

      onLoginSuccess?.(isProfessional ? 'professional' : 'client');
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'E-mail ou senha incorretos.';
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.column}>
          {/* Marca */}
          <View style={styles.brand}>
            <Image
              source={LOGO}
              style={styles.logo}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
              accessible={false}
            />
            <Text style={styles.brandName} accessibilityRole="header">
              Chama<Text style={styles.brandAccent}>LÁ</Text>
            </Text>
            <Text style={styles.tagline}>Profissionais de confiança perto de você</Text>
          </View>

          {/* Login */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Entrar na sua conta</Text>
              <Text style={styles.cardSubtitle}>
                Peça serviços ou atenda chamados na sua região.
              </Text>
            </View>

            <Input
              label="E-mail"
              leftIcon="mail-outline"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearError('email');
              }}
              error={errors.email}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              containerStyle={styles.input}
            />

            <Input
              label="Senha"
              leftIcon="lock-closed-outline"
              rightIcon={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
              rightIconLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              onRightIconPress={() => setMostrarSenha((v) => !v)}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearError('senha');
              }}
              error={errors.senha}
              placeholder="Sua senha"
              secureTextEntry={!mostrarSenha}
              autoComplete="password"
              onSubmitEditing={handleLogin}
              returnKeyType="go"
              containerStyle={styles.input}
            />

            <Button title="Entrar" loading={loading} onPress={handleLogin} />
          </View>

          {/* Cadastro */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Novo por aqui?</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.options}>
            <OpcaoCadastro
              icon="person-outline"
              title="Preciso de um serviço"
              description="Crie sua conta de cliente"
              onPress={onNavigateToRegister}
            />
            <OpcaoCadastro
              icon="construct-outline"
              title="Sou profissional"
              description="Cadastre-se para receber pedidos"
              onPress={onNavigateToProfessionalRegister}
            />
          </View>
        </View>
      </ScrollView>
      {toast}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  // Limita a largura no navegador/tablet.
  column: { width: '100%', maxWidth: 440, alignSelf: 'center', gap: spacing.xl },

  brand: { alignItems: 'center', gap: spacing.xs },
  logo: { width: 96, height: 92, marginBottom: spacing.sm },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandAccent: { color: colors.gold },
  tagline: { ...typography.body, color: colors.textMuted, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.xs,
    ...shadow.card,
  },
  cardHeader: { gap: spacing.xs, marginBottom: spacing.md },
  cardTitle: {
    ...typography.subtitle,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: { ...typography.caption, fontSize: 14, color: colors.textMuted },
  input: { marginBottom: spacing.md },

  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },

  options: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    minHeight: 72,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionPressed: { backgroundColor: colors.infoBg, borderColor: colors.primary },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoBg,
  },
  optionText: { flex: 1, gap: 2 },
  optionTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  optionDescription: { ...typography.caption, fontSize: 14, color: colors.textMuted },
});
