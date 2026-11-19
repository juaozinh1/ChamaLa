import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from '../components/Button';
import { ScreenHeader } from '../components/ScreenHeader';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { RequiredMark } from '../components/FieldFeedback';
import {
  useFieldErrors,
  resumoDosErros,
  type FieldErrors,
} from '../hooks/useFieldErrors';
import { api } from '../services/api';

type Campo = 'nome' | 'email' | 'telefone' | 'senha' | 'confirmarSenha';

function formatarTelefone(text: string): string {
  const limpo = text.replace(/\D/g, '').slice(0, 11);
  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
  return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
}

type TelaCadastroProps = {
  navigation?: any;
  /** Chamado depois do cadastro, ao tocar em "Ir para o Login" (usado pelo App.tsx). */
  onSuccess?: () => void;
  /** Volta para o login sem cadastrar (usado pelo App.tsx). */
  onNavigateToLogin?: () => void;
};

export const TelaCadastro: React.FC<TelaCadastroProps> = ({
  navigation,
  onSuccess,
  onNavigateToLogin,
}) => {
  const [cadastroOk, setCadastroOk] = useState(false);

  const voltar =
    onNavigateToLogin ?? (navigation?.goBack ? () => navigation.goBack() : undefined);

  const irParaLogin = () => {
    setCadastroOk(false);
    if (onSuccess) {
      onSuccess();
    } else if (navigation?.navigate) {
      navigation.navigate('Login');
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { errors, setErrors, clearError } = useFieldErrors<Campo>();
  const { toast, showToast } = useToast();

  const validarEmail = (emailStr: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr.trim());
  };

  const handleCadastrar = async () => {
    const apenasDigitosTelefone = telefone.replace(/\D/g, '');
    const erros: FieldErrors<Campo> = {};

    if (!nome.trim()) erros.nome = 'Informe seu nome completo.';
    if (!email.trim()) erros.email = 'Informe seu e-mail.';
    else if (!validarEmail(email)) erros.email = 'Informe um e-mail válido.';
    if (apenasDigitosTelefone.length < 10)
      erros.telefone = 'Informe um telefone com DDD válido.';
    if (senha.length < 6) erros.senha = 'A senha deve ter no mínimo 6 caracteres.';
    if (!confirmarSenha) erros.confirmarSenha = 'Repita a senha.';
    else if (senha !== confirmarSenha) erros.confirmarSenha = 'As senhas não coincidem.';

    setErrors(erros);
    const resumo = resumoDosErros(erros);
    if (resumo) {
      showToast(resumo);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        phone: apenasDigitosTelefone,
        password: senha,
      };

      await api.post('/api/v1/auth/register/client', payload);

      setCadastroOk(true);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Não foi possível concluir o cadastro.';
      showToast(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Criar conta" onBack={voltar} backLabel="Voltar para o login" />
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

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome Completo
              <RequiredMark />
            </Text>
            <Input
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                clearError('nome');
              }}
              error={errors.nome}
              placeholder="Ex: Maria Souza"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-mail
              <RequiredMark />
            </Text>
            <Input
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearError('email');
              }}
              error={errors.email}
              placeholder="Ex: cliente@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Telefone / WhatsApp
              <RequiredMark />
            </Text>
            <Input
              value={telefone}
              onChangeText={(t) => {
                setTelefone(formatarTelefone(t));
                clearError('telefone');
              }}
              error={errors.telefone}
              placeholder="(81) 98765-4321"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Senha
              <RequiredMark />
            </Text>
            <Input
              value={senha}
              onChangeText={(t) => {
                setSenha(t);
                clearError('senha');
              }}
              error={errors.senha}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirmar Senha
              <RequiredMark />
            </Text>
            <Input
              value={confirmarSenha}
              onChangeText={(t) => {
                setConfirmarSenha(t);
                clearError('confirmarSenha');
              }}
              error={errors.confirmarSenha}
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
      <FeedbackSheet
        visible={cadastroOk}
        title="Cadastro concluído"
        headline="Sua conta foi criada"
        message="Agora é só entrar com seu e-mail e senha para pedir serviços na sua região."
        actions={[{ label: 'Ir para o login', onPress: irParaLogin }]}
      />
      {toast}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  },
});
