import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { StatCard } from '../components/StatCard';
import { SwitchRow } from '../components/SwitchRow';
import { Tabs } from '../components/Tabs';
import { OrderCard } from '../components/OrderCard';
import { api } from '../services/api';

interface TelaHomeProfissionalProps {
  onNavigateToOrderDetails?: (orderId: string) => void;
}

export interface OrderItem {
  id: string;
  title: string;
  clientName: string;
  addressReference: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  description?: string;
  categoryName?: string;
  status?: string;
  scheduledAt?: string;
}

export const TelaHomeProfissional: React.FC<TelaHomeProfissionalProps> = ({
  onNavigateToOrderDetails,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'disponiveis' | 'em_andamento'>('disponiveis');

  const [availableOrders, setAvailableOrders] = useState<OrderItem[]>([]);
  const [inProgressOrders, setInProgressOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const carregarPedidos = useCallback(async () => {
    try {
      // Coordenadas padrão da base de atuação
      const lat = -7.9408;
      const lon = -34.8728;

      const response = await api.get('/api/v1/orders/nearby', {
        params: {
          lat,
          lon,
          closestFirst: true,
        },
      });

      const pedidosFormatados: OrderItem[] = (response.data || []).map((p: any) => ({
        id: String(p.id),
        title: p.title || 'Sem título',
        clientName: p.clientName || 'Cliente',
        addressReference: p.addressReference || 'Localização no mapa',
        distanceKm: typeof p.distanceKm === 'number' ? p.distanceKm : 0,
        latitude: typeof p.latitude === 'number' ? p.latitude : -7.9408,
        longitude: typeof p.longitude === 'number' ? p.longitude : -34.8728,
        description: p.description,
        categoryName: p.categoryName,
        status: p.status,
        scheduledAt: p.scheduledAt,
      }));

      setAvailableOrders(pedidosFormatados);
    } catch (err: any) {
      console.warn('Erro ao carregar chamados disponíveis:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  const handleAceitarPedido = async (order: OrderItem) => {
    try {
      setActionLoadingId(order.id);

      const userJson = await AsyncStorage.getItem('@chamala:user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user?.id) {
        Alert.alert('Erro', 'Identificação do profissional não encontrada. Faça login novamente.');
        return;
      }

      await api.post(`/api/v1/orders/${order.id}/accept`, {
        professionalId: user.id,
      });

      setAvailableOrders((prev) => prev.filter((item) => item.id !== order.id));
      setInProgressOrders((prev) => [{ ...order, status: 'ACCEPTED' }, ...prev]);

      Alert.alert('Sucesso', 'Pedido aceito! O status agora é Aceito (ACCEPTED).');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Falha ao aceitar pedido.';
      Alert.alert('Aviso', msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRecusarPedido = (orderId: string) => {
    Alert.alert(
      'Recusar Chamado',
      'Deseja dispensar este chamado da sua lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: () => {
            setAvailableOrders((prev) => prev.filter((item) => item.id !== orderId));
          },
        },
      ]
    );
  };

  const ordersToDisplay = selectedTab === 'disponiveis' ? availableOrders : inProgressOrders;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
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
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Painel Profissional</Text>
          <Text style={styles.title}>Atendimentos</Text>
        </View>

        <View style={styles.statusBox}>
          <SwitchRow
            title="Disponível para novos chamados"
            value={isAvailable}
            onValueChange={setIsAvailable}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statWrapper}>
          <StatCard
            emoji="⚡"
            label="Disponíveis"
            value={String(availableOrders.length)}
          />
        </View>
        <View style={styles.statWrapper}>
          <StatCard
            emoji="📋"
            label="Em Andamento"
            value={String(inProgressOrders.length)}
          />
        </View>
      </View>

      <Tabs
        tabs={[
          { key: 'disponiveis', label: `Disponíveis (${availableOrders.length})` },
          { key: 'em_andamento', label: `Em Andamento (${inProgressOrders.length})` },
        ]}
        activeKey={selectedTab}
        onChange={(key: string) => setSelectedTab(key as 'disponiveis' | 'em_andamento')}
      />

      <View style={styles.ordersSection}>
        {loading ? (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.feedbackText}>Buscando pedidos...</Text>
          </View>
        ) : ordersToDisplay.length === 0 ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.emptyTitle}>
              {selectedTab === 'disponiveis'
                ? 'Nenhum chamado aberto na região'
                : 'Nenhum serviço aceito em andamento'}
            </Text>
            <Text style={styles.feedbackText}>Puxe para baixo para atualizar a lista.</Text>
          </View>
        ) : (
          ordersToDisplay.map((demand) => {
            const isProcessing = actionLoadingId === demand.id;

            return (
              <View key={demand.id} style={styles.cardContainer}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onNavigateToOrderDetails?.(demand.id)}
                >
                  <OrderCard order={demand} />
                </Pressable>

                {selectedTab === 'disponiveis' && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.btnReject]}
                      onPress={() => handleRecusarPedido(demand.id)}
                      disabled={isProcessing}
                    >
                      <Text style={styles.btnRejectText}>Recusar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.btnAccept]}
                      onPress={() => handleAceitarPedido(demand)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.btnAcceptText}>Aceitar Pedido</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
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
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  statusBox: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statWrapper: {
    flex: 1,
    borderRadius: 0,
  },
  ordersSection: {
    gap: spacing.md,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 0,
    overflow: 'hidden',
  },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    minHeight: minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  btnReject: {
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  btnRejectText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },
  btnAccept: {
    backgroundColor: colors.primary,
  },
  btnAcceptText: {
    ...typography.caption,
    fontWeight: '700',
    color: '#fff',
  },
  feedbackContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  feedbackText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});