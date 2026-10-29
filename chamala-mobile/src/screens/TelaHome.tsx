import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Card, SearchInput } from '../components';
import { colors, spacing, typography } from '../theme';

interface TelaHomeProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateToPro: () => void;
}

export const TelaHome = ({
  isLoggedIn,
  onLogout,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToPro,
}: TelaHomeProps) => {
  const [busca, setBusca] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Só busca categorias se o usuário estiver autenticado
  useEffect(() => {
    if (!isLoggedIn) return;

    const carregarCategorias = async () => {
      try {
        setLoading(true);
        setCategorias([
          { id: 1, name: 'Eletricista' },
          { id: 2, name: 'Encanador' },
          { id: 3, name: 'Pintor' },
          { id: 4, name: 'Limpeza' },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, [isLoggedIn]);

  // ==========================================
  // ESTADO 1: USUÁRIO DESLOGADO (VISITANTE)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <View style={styles.guestContainer}>
        <Text style={styles.guestLogo}>ChamaLá</Text>
        <Text style={styles.guestSubtitle}>
          Conectando você aos melhores profissionais e serviços da sua região.
        </Text>

        <View style={styles.guestActions}>
          <Button
            title="Acessar minha conta"
            onPress={onNavigateToLogin}
          />

          <View style={styles.spacingSm} />

          <Button
            title="Criar conta de cliente"
            onPress={onNavigateToRegister}
            variant="outline"
          />
        </View>

        <TouchableOpacity style={styles.proBanner} onPress={onNavigateToPro}>
          <View style={styles.proBannerInfo}>
            <Text style={styles.proTitle}>É um prestador de serviços?</Text>
            <Text style={styles.proSubtitle}>Cadastre-se e receba pedidos no app</Text>
          </View>
          <Text style={styles.proAction}>Cadastrar →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==========================================
  // ESTADO 2: USUÁRIO LOGADO
  // ==========================================
  const categoriasFiltradas = categorias.filter((c) =>
    c.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Início</Text>
        <Button title="Sair" onPress={onLogout} variant="outline" size="sm" />
      </View>

      <SearchInput
        placeholder="Procurar serviços ou categorias..."
        value={busca}
        onChangeText={setBusca}
      />

      <Text style={styles.sectionTitle}>Categorias Disponíveis</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={categoriasFiltradas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.cardText}>{item.name}</Text>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos para visitante (deslogado)
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  guestLogo: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
    fontSize: 32,
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  guestActions: {
    marginBottom: spacing.xl,
  },
  spacingSm: {
    height: spacing.sm,
  },

  // Estilos para usuário logado
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardText: {
    ...typography.body,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  // Banner profissional
  proBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proBannerInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  proTitle: {
    ...typography.subtitle,
    color: colors.primary,
    fontSize: 14,
  },
  proSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  proAction: {
    ...typography.subtitle,
    color: colors.primary,
    fontSize: 14,
  },
});
