import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, minTouchTarget, radius } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { RequiredMark, FieldError, fieldErrorOutline } from '../components/FieldFeedback';
import {
  useFieldErrors,
  resumoDosErros,
  type FieldErrors,
} from '../hooks/useFieldErrors';
import { Chip } from '../components/Chip';
import { LeafletMapPicker } from '../components/LeafletMapPicker';
import { api } from '../services/api';

interface CategoryItem {
  id: string | number;
  name: string;
}

type Campo = 'nome' | 'email' | 'telefone' | 'senha' | 'confirmarSenha' | 'categorias';

const DEFAULT_COORDS = {
  lat: -7.9408,
  lng: -34.8728,
};

function formatarTelefone(text: string): string {
  const limpo = text.replace(/\D/g, '').slice(0, 11);
  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
  return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
}

type TelaCadastroProfissionalProps = {
  navigation?: any;
  /** Chamado depois do cadastro, ao tocar em "Ir para o Login" (usado pelo App.tsx). */
  onSuccess?: () => void;
  /** Volta para o login sem cadastrar (usado pelo App.tsx). */
  onNavigateToLogin?: () => void;
};

export const TelaCadastroProfissional: React.FC<TelaCadastroProfissionalProps> = ({
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

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>(DEFAULT_COORDS);
  const [submitting, setSubmitting] = useState(false);
  const { errors, setErrors, clearError } = useFieldErrors<Campo>();
  const { toast, showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const res = await api.get('/api/v1/categories');
        if (isMounted) {
          setCategories(res.data);
        }
      } catch {
        if (isMounted) {
          setCategories([
            { id: 1, name: 'Hidráulica' },
            { id: 2, name: 'Elétrica' },
            { id: 3, name: 'Pintura' },
            { id: 4, name: 'Alvenaria' },
            { id: 5, name: 'Limpeza' },
          ]);
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCategory = (id: number) => {
    clearError('categorias');
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const validarEmail = (emailStr: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr.trim());
  };

  const handleCadastrar = async () => {
    const apenasDigitosTelefone = telefone.replace(/\D/g, '');
    const erros: FieldErrors<Campo> = {};

    if (!nome.trim()) erros.nome = 'Informe o seu nome completo.';
    if (!email.trim()) erros.email = 'Informe seu e-mail.';
    else if (!validarEmail(email)) erros.email = 'Informe um endereço de e-mail válido.';
    if (apenasDigitosTelefone.length < 10)
      erros.telefone = 'Informe um telefone com DDD válido.';
    if (senha.length < 6) erros.senha = 'A senha deve ter no mínimo 6 caracteres.';
    if (!confirmarSenha) erros.confirmarSenha = 'Repita a senha.';
    else if (senha !== confirmarSenha) erros.confirmarSenha = 'As senhas não coincidem.';
    if (selectedCategoryIds.length === 0)
      erros.categorias = 'Selecione ao menos uma especialidade.';

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
        categoryIds: selectedCategoryIds,
        latitude: coords.lat,
        longitude: coords.lng,
      };

      await api.post('/api/v1/auth/register/professional', payload);

      setCadastroOk(true);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Não foi possível concluir o cadastro. Tente novamente.';
      showToast(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Cadastro profissional"
        onBack={voltar}
        backLabel="Voltar para o login"
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro Profissional</Text>
          <Text style={styles.subtitle}>
            Receba chamados de clientes próximos à sua base de atendimento.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados de Acesso</Text>

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
              placeholder="Ex: Carlos Silva"
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
              placeholder="Ex: profissional@email.com"
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Especialidades / Categorias
            <RequiredMark />
          </Text>
          <Text style={styles.helperText}>
            Selecione todas as áreas em que você pode atender chamados.
          </Text>
          {loadingCategories ? (
            <ActivityIndicator
              color={colors.primary}
              size="small"
              style={styles.loader}
            />
          ) : (
            <View
              style={[
                styles.categoriesContainer,
                errors.categorias ? fieldErrorOutline : null,
              ]}
            >
              {categories.map((cat) => {
                const numId = Number(cat.id);
                const selected = selectedCategoryIds.includes(numId);
                return (
                  <Chip
                    key={String(cat.id)}
                    label={cat.name}
                    selected={selected}
                    onPress={() => toggleCategory(numId)}
                  />
                );
              })}
            </View>
          )}
          <FieldError message={errors.categorias} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Base de Atendimento</Text>
          <Text style={styles.helperText}>
            Toque no mapa para definir o ponto central de onde você calcula as distâncias
            dos chamados.
          </Text>
          <View style={styles.mapWrapper}>
            <LeafletMapPicker
              initialCoords={coords}
              onLocationSelected={(newCoords: { lat: number; lng: number }) => {
                setCoords(newCoords);
              }}
            />
          </View>
        </View>

        <Button
          title="Concluir Cadastro"
          loading={submitting}
          onPress={handleCadastrar}
          style={styles.submitBtn}
        />
      </ScrollView>
      <FeedbackSheet
        visible={cadastroOk}
        title="Cadastro concluído"
        headline="Seu perfil profissional foi criado"
        message="Entre com seu e-mail e senha para acessar o painel. Envie seus documentos na aba Verificação para começar a receber pedidos."
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
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  loader: {
    alignSelf: 'flex-start',
    marginVertical: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  mapWrapper: {
    height: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  submitBtn: {
    marginTop: spacing.md,
    minHeight: minTouchTarget,
  },
});
