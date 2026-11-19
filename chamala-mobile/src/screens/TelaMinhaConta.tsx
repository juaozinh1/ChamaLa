import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ScreenHeader } from '../components/ScreenHeader';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { RequiredMark } from '../components/FieldFeedback';
import { useToast } from '../components/Toast';
import {
  useFieldErrors,
  resumoDosErros,
  type FieldErrors,
} from '../hooks/useFieldErrors';
import { api } from '../services/api';

const SESSION_KEY = '@chamala:user';

type Perfil = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

type Campo = 'nome' | 'telefone' | 'senhaAtual' | 'novaSenha' | 'confirmarSenha';

type TelaMinhaContaProps = {
  /** Volta para a tela inicial (Home do cliente ou do profissional). */
  onBack?: () => void;
  /** Chamado depois de sair da conta (ou se não houver sessão salva). */
  onLogout?: () => void;
};

function formatarTelefone(text: string): string {
  const limpo = text.replace(/\D/g, '').slice(0, 11);
  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
  return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
}

function mensagemDaApi(err: any, padrao: string): string {
  return err?.response?.data?.message || err?.response?.data?.error || padrao;
}

export const TelaMinhaConta: React.FC<TelaMinhaContaProps> = ({ onBack, onLogout }) => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const { errors, setErrors, clearError } = useFieldErrors<Campo>();
  const { toast, showToast } = useToast();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const sessao = await AsyncStorage.getItem(SESSION_KEY);
        const id = sessao ? JSON.parse(sessao)?.id : null;
        if (!id) {
          onLogout?.();
          return;
        }
        const { data } = await api.get<Perfil>(`/api/v1/users/${id}`);
        if (!ativo) return;
        setPerfil(data);
        setNome(data.name ?? '');
        setTelefone(formatarTelefone(data.phone ?? ''));
      } catch (err) {
        if (ativo)
          setErroCarregar(mensagemDaApi(err, 'Não foi possível carregar sua conta.'));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [onLogout]);

  const trocandoSenha = Boolean(senhaAtual || novaSenha || confirmarSenha);

  const salvar = async () => {
    if (!perfil) return;

    const erros: FieldErrors<Campo> = {};
    if (!nome.trim()) erros.nome = 'Informe seu nome completo.';
    const digitos = telefone.replace(/\D/g, '');
    if (digitos.length < 10) erros.telefone = 'Informe um telefone com DDD válido.';
    if (trocandoSenha) {
      if (!senhaAtual) erros.senhaAtual = 'Informe sua senha atual.';
      if (novaSenha.length < 6)
        erros.novaSenha = 'A nova senha deve ter no mínimo 6 caracteres.';
      if (!confirmarSenha) erros.confirmarSenha = 'Repita a nova senha.';
      else if (novaSenha !== confirmarSenha)
        erros.confirmarSenha = 'As senhas não coincidem.';
    }

    setErrors(erros);
    const resumo = resumoDosErros(erros);
    if (resumo) {
      showToast(resumo);
      return;
    }

    try {
      setSalvando(true);
      const { data } = await api.put<Perfil>(`/api/v1/users/${perfil.id}`, {
        name: nome.trim(),
        phone: digitos,
        ...(trocandoSenha ? { currentPassword: senhaAtual, newPassword: novaSenha } : {}),
      });

      setPerfil(data);
      setNome(data.name);
      setTelefone(formatarTelefone(data.phone ?? ''));
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

      // Mantém o nome da sessão salva em dia (usado na saudação da Home).
      const sessao = await AsyncStorage.getItem(SESSION_KEY);
      if (sessao) {
        await AsyncStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ ...JSON.parse(sessao), name: data.name }),
        );
      }

      showToast(
        trocandoSenha ? 'Dados e senha atualizados.' : 'Dados atualizados.',
        'success',
      );
    } catch (err: any) {
      const msg = mensagemDaApi(err, 'Não foi possível salvar as alterações.');
      if (err?.response?.status === 403) setErrors({ senhaAtual: msg });
      showToast(msg);
    } finally {
      setSalvando(false);
    }
  };

  const sair = async () => {
    setConfirmarSaida(false);
    await AsyncStorage.removeItem(SESSION_KEY);
    onLogout?.();
  };

  const tipoConta =
    perfil?.role?.toUpperCase() === 'PROFESSIONAL' ? 'Profissional' : 'Cliente';

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Minha conta"
        onBack={onBack}
        backLabel="Voltar para o início"
      />

      {carregando ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : !perfil ? (
        <View style={styles.content}>
          <Text style={styles.loadError}>{erroCarregar ?? 'Conta não encontrada.'}</Text>
          <Button title="Sair da conta" variant="dangerOutline" onPress={sair} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profileCard}>
            <Avatar name={perfil.name} size={56} />
            <View style={styles.profileText}>
              <Text style={styles.profileName} numberOfLines={1}>
                {perfil.name}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {perfil.email}
              </Text>
              <Text style={styles.roleBadge}>{tipoConta}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados pessoais</Text>

            <Text style={styles.label}>
              Nome completo
              <RequiredMark />
            </Text>
            <Input
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                clearError('nome');
              }}
              error={errors.nome}
              autoCapitalize="words"
            />

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
              keyboardType="phone-pad"
              maxLength={15}
            />

            <Text style={styles.label}>E-mail</Text>
            <Input
              value={perfil.email}
              editable={false}
              helperText="O e-mail é usado para entrar e não pode ser alterado."
              style={styles.readOnly}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alterar senha</Text>
            <Text style={styles.helper}>
              Opcional. Preencha só se quiser trocar a senha.
            </Text>

            <Text style={styles.label}>Senha atual</Text>
            <Input
              value={senhaAtual}
              onChangeText={(t) => {
                setSenhaAtual(t);
                clearError('senhaAtual');
              }}
              error={errors.senhaAtual}
              secureTextEntry
            />

            <Text style={styles.label}>Nova senha</Text>
            <Input
              value={novaSenha}
              onChangeText={(t) => {
                setNovaSenha(t);
                clearError('novaSenha');
              }}
              error={errors.novaSenha}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar nova senha</Text>
            <Input
              value={confirmarSenha}
              onChangeText={(t) => {
                setConfirmarSenha(t);
                clearError('confirmarSenha');
              }}
              error={errors.confirmarSenha}
              secureTextEntry
            />
          </View>

          <Button title="Salvar alterações" loading={salvando} onPress={salvar} />
          <Button
            title="Sair da conta"
            variant="dangerOutline"
            onPress={() => setConfirmarSaida(true)}
          />
        </ScrollView>
      )}

      <FeedbackSheet
        visible={confirmarSaida}
        tone="danger"
        title="Sair da conta?"
        headline="Você vai voltar para a tela inicial"
        message="Para usar o app de novo, é só entrar com seu e-mail e senha."
        onDismiss={() => setConfirmarSaida(false)}
        actions={[
          { label: 'Sair', variant: 'danger', onPress: sair },
          {
            label: 'Cancelar',
            variant: 'secondary',
            onPress: () => setConfirmarSaida(false),
          },
        ]}
      />
      {toast}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: spacing.xxl },
  content: { padding: spacing.lg, gap: spacing.xl },
  loadError: { ...typography.body, color: colors.danger },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  profileText: { flex: 1, gap: 2 },
  profileName: { ...typography.subtitle, color: colors.text },
  profileEmail: { ...typography.caption, color: colors.textMuted },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.infoBg,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  section: { gap: spacing.xs },
  sectionTitle: { ...typography.subtitle, color: colors.text, marginBottom: spacing.xs },
  helper: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  label: { ...typography.caption, fontWeight: '700', color: colors.text },
  readOnly: { color: colors.textMuted },
});
