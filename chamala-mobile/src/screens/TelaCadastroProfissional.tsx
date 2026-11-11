import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AlertBanner } from '../components/AlertBanner';
import { Chip } from '../components/Chip';
import { LeafletMapPicker } from '../components/LeafletMapPicker';
import { api } from '../services/api';

interface CategoryItem {
  id: string | number;
  name: string;
}

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

export const TelaCadastroProfissional: React.FC<{ navigation?: any }> = ({ navigation }) => {
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const res = await api.get('/categories');
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
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validarEmail = (emailStr: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr.trim());
  };

  const handleCadastrar = async () => {
    if (!nome.trim()) {
      setError('Informe o seu nome completo.');
      return;
    }

    if (!email.trim() || !validarEmail(email)) {
      setError('Informe um endereço de e-mail válido.');
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

    if (selectedCategoryIds.length === 0) {
      setError('Selecione ao menos uma especialidade de atendimento.');
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
        categoryIds: selectedCategoryIds,
        latitude: coords.lat,
        longitude: coords.lng,
      };

      await api.post('/api/v1/auth/register/professional', payload);

      Alert.alert(
        'Conta Criada com Sucesso!',
        'Seu cadastro profissional foi realizado. Faça login para acessar o painel.',
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
        'Não foi possível concluir o cadastro. Tente novamente.';
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
        <Text style={styles.title}>Cadastro Profissional</Text>
        <Text style={styles.subtitle}>
          Receba chamados de clientes próximos à sua base de atendimento.
        </Text>
      </View>

      {error ? <AlertBanner message={error} /> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados de Acesso</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <Input
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Carlos Silva"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Ex: profissional@email.com"
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Especialidades / Categorias</Text>
        <Text style={styles.helperText}>
          Selecione todas as áreas em que você pode atender chamados.
        </Text>
        {loadingCategories ? (
          <ActivityIndicator color={colors.primary} size="small" style={styles.loader} />
        ) : (
          <View style={styles.categoriesContainer}>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Base de Atendimento</Text>
        <Text style={styles.helperText}>
          Toque no mapa para definir o ponto central de onde você calcula as distâncias dos chamados.
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
    borderRadius: 0,
    overflow: 'hidden',
  },
  submitBtn: {
    marginTop: spacing.md,
    minHeight: minTouchTarget,
    borderRadius: 0,
  },
});