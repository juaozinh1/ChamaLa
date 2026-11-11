import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from '../components/Button';
import { SearchInput } from '../components/SearchInput';
import { Chip } from '../components/Chip';
import { Tabs } from '../components/Tabs';
import { OrderCard } from '../components/OrderCard';
import { ReviewModal } from '../components/ReviewModal';
import { api } from '../services/api';

const CATEGORIES = ['Todos', 'Hidráulica', 'Elétrica', 'Pintura', 'Alvenaria'];

interface TelaHomeProps {
  onNavigateToNewOrder?: () => void;
  onNavigateToOrderDetails?: (orderId: string) => void;
}

export interface ClientOrderItem {
  id: string;
  title: string;
  clientName: string;
  addressReference: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  categoryName?: string;
  status: 'OPEN' | 'ACCEPTED' | 'COMPLETED' | string;
  description?: string;
  scheduledAt?: string;
  professionalName?: string;
  reviewed?: boolean;
}

export const TelaHome: React.FC<TelaHomeProps> = ({
  onNavigateToNewOrder,
  onNavigateToOrderDetails,
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [clientName, setClientName] = useState('Cliente');
  const [orders, setOrders] = useState<ClientOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTab, setSelectedTab] = useState<'open' | 'accepted' | 'completed'>('open');

  // Controle do Modal de Avaliação
  const [reviewOrder, setReviewOrder] = useState<ClientOrderItem | null>(null);

  const carregarPedidos = useCallback(async () => {
    try {
      const userJson = await AsyncStorage.getItem('@chamala:user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (user?.name) {
        setClientName(user.name.split(' ')[0]);
      }

      if (!user?.id) {
        setOrders([]);
        return;
      }

      setClientId(user.id);

      const response = await api.get('/api/v1/orders/client', {
        params: { clientId: user.id },
      });

      const data: ClientOrderItem[] = (response.data || []).map((item: any) => ({
        id: String(item.id),
        title: item.title || 'Sem título',
        clientName: item.clientName || user.name || 'Cliente',
        addressReference: item.addressReference || 'Endereço cadastrado',
        distanceKm: typeof item.distanceKm === 'number' ? item.distanceKm : 0,
        latitude: typeof item.latitude === 'number' ? item.latitude : -7.9408,
        longitude: typeof item.longitude === 'number' ? item.longitude : -34.8728,
        categoryName: item.categoryName || 'Geral',
        status: item.status || 'OPEN',
        description: item.description,
        scheduledAt: item.scheduledAt,
        professionalName: item.professionalName || 'o profissional',
        reviewed: Boolean(item.reviewed),
      }));

      setOrders(data);
    } catch (err: any) {
      console.warn('Erro ao carregar pedidos do cliente:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  const openOrders = orders.filter((o) => o.status === 'OPEN');
  const acceptedOrders = orders.filter((o) => o.status === 'ACCEPTED');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  const currentTabList =
    selectedTab === 'open'
      ? openOrders
      : selectedTab === 'accepted'
      ? acceptedOrders
      : completedOrders;

  const filteredOrders = currentTabList.filter((order) => {
    const matchesCategory =
      selectedCategory === 'Todos' ||
      order.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      order.title.toLowerCase().includes(search.toLowerCase()) ||
      order.addressReference.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              carregarPedidos();
            }}
          />
        }
      >
        <View style={styles.topBar}>
          <View style={styles.greeting}>
            <Text style={styles.subGreeting}>Olá, {clientName}</Text>
            <Text style={styles.mainTitle}>Precisa de ajuda hoje?</Text>
          </View>
          <Button
            title="+ Novo Pedido"
            onPress={() => onNavigateToNewOrder?.()}
            style={styles.newOrderBtn}
          />
        </View>

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar meus pedidos..."
        />

        <View style={styles.categoriesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <Tabs
          tabs={[
            { key: 'open', label: `Abertos (${openOrders.length})` },
            { key: 'accepted', label: `Aceitos (${acceptedOrders.length})` },
            { key: 'completed', label: `Concluídos (${completedOrders.length})` },
          ]}
          activeKey={selectedTab}
          onChange={(key: string) =>
            setSelectedTab(key as 'open' | 'accepted' | 'completed')
          }
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedTab === 'open'
                ? 'Chamados Aguardando Profissional'
                : selectedTab === 'accepted'
                ? 'Chamados em Andamento'
                : 'Serviços Finalizados'}
            </Text>
            <Text style={styles.counterBadge}>{filteredOrders.length}</Text>
          </View>

          {loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.emptyDesc}>Carregando seus pedidos...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Você ainda não criou nenhum pedido</Text>
              <Text style={styles.emptyDesc}>
                Precisa de reparo, reforma ou instalação? Faça sua solicitação agora mesmo.
              </Text>
              <Button
                title="Criar Primeiro Pedido"
                onPress={() => onNavigateToNewOrder?.()}
                style={styles.emptyActionBtn}
              />
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                {selectedTab === 'open'
                  ? 'Nenhum pedido aguardando no momento'
                  : selectedTab === 'accepted'
                  ? 'Nenhum pedido aceito no momento'
                  : 'Nenhum serviço concluído ainda'}
              </Text>
              <Text style={styles.emptyDesc}>
                {search || selectedCategory !== 'Todos'
                  ? 'Nenhum resultado para os filtros selecionados.'
                  : 'Puxe para baixo para atualizar o status dos seus pedidos.'}
              </Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {filteredOrders.map((order) => (
                <View key={order.id} style={styles.orderCardWrapper}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onNavigateToOrderDetails?.(order.id)}
                  >
                    <OrderCard order={order} />
                  </Pressable>

                  {selectedTab === 'completed' && (
                    <View style={styles.reviewFooter}>
                      {order.reviewed ? (
                        <Text style={styles.reviewedBadge}>✓ Serviço Avaliado</Text>
                      ) : (
                        <TouchableOpacity
                          style={styles.rateButton}
                          onPress={() => setReviewOrder(order)}
                        >
                          <Text style={styles.rateButtonText}>
                            ★ Avaliar Profissional ({order.professionalName})
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {reviewOrder && (
        <ReviewModal
          visible={Boolean(reviewOrder)}
          orderId={reviewOrder.id}
          clientId={clientId}
          professionalName={reviewOrder.professionalName}
          onClose={() => setReviewOrder(null)}
          onSuccess={() => {
            setReviewOrder(null);
            carregarPedidos();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greeting: {
    flex: 1,
  },
  subGreeting: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  mainTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  newOrderBtn: {
    borderRadius: 0,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.md,
  },
  categoriesRow: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  counterBadge: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  ordersList: {
    gap: spacing.sm,
  },
  orderCardWrapper: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  reviewFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rateButton: {
    backgroundColor: '#EAB308',
    minHeight: minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  rateButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: '#111827',
  },
  reviewedBadge: {
    ...typography.caption,
    fontWeight: '700',
    color: '#16A34A',
    textAlign: 'right',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 0,
    gap: spacing.xs,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
  },
  emptyDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyActionBtn: {
    marginTop: spacing.md,
    borderRadius: 0,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
  },
});