import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AlertBanner } from '../components/AlertBanner';
import { api } from '../services/api';

function formatarTelefone(text: string): string {
  const limpo = text.replace(/\D/g, '').slice(0, 11);
  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
  return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
}

export const TelaCadastro: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validarEmail = (emailStr: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr.trim());
  };

  const handleCadastrar = async () => {
    if (!nome.trim()) {
      setError('Informe seu nome completo.');
      return;
    }

    if (!email.trim() || !validarEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    const apenasDigitosTelefone = telefone.replace(/\D/g, '');
    if (apenasDigitosTelefone.length < 10) {
      setError('Informe um número de telefone com DDD válido.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        phone: apenasDigitosTelefone,
        password: senha,
      };

      await api.post('/api/v1/auth/register/client', payload);

      Alert.alert(
        'Conta Criada com Sucesso!',
        'Seu cadastro foi realizado. Faça login para continuar.',
        [
          {
            text: 'Ir para o Login',
            onPress: () => {
              if (navigation?.navigate) {
                navigation.navigate('Login');
              } else if (navigation?.goBack) {
                navigation.goBack();
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Não foi possível concluir o cadastro.';
      setError(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Cadastre-se para solicitar serviços e orçamentos na sua região.
        </Text>
      </View>

      {error ? <AlertBanner message={error} /> : null}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <Input
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Maria Souza"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Ex: cliente@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone / WhatsApp</Text>
          <Input
            value={telefone}
            onChangeText={(t) => setTelefone(formatarTelefone(t))}
            placeholder="(81) 98765-4321"
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <Input
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <Input
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Repita a senha"
            secureTextEntry
          />
        </View>

        <Button
          title="Cadastrar"
          loading={submitting}
          onPress={handleCadastrar}
          style={styles.submitBtn}
        />
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
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
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
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  submitBtn: {
    marginTop: spacing.sm,
    minHeight: minTouchTarget,
    borderRadius: 0,
  },
});