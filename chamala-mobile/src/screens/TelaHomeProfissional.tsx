import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, Card } from '../components';
import { colors, spacing, typography } from '../theme';

interface Chamado {
  id: string;
  cliente: string;
  servico: string;
  endereco: string;
  horario: string;
  valorEstimado: string;
}

interface TelaHomeProfissionalProps {
  onLogout: () => void;
  onNavigateToPerfil?: () => void;
}

export const TelaHomeProfissional = ({
  onLogout,
  onNavigateToPerfil,
}: TelaHomeProfissionalProps) => {
  const [isDisponivel, setIsDisponivel] = useState(true);
  const [chamados, setChamados] = useState<Chamado[]>([
    {
      id: '1',
      cliente: 'Mariana Souza',
      servico: 'Instalação de Tomada e Disjuntor',
      endereco: 'Rua das Flores, 120 - Centro',
      horario: 'Hoje às 15:30',
      valorEstimado: 'R$ 150,00',
    },
    {
      id: '2',
      cliente: 'Lucas Ferreira',
      servico: 'Troca de Chuveiro Elétrico',
      endereco: 'Av. Brasil, 450, Apto 32',
      horario: 'Amanhã às 10:00',
      valorEstimado: 'R$ 120,00',
    },
  ]);

  const handleAceitar = (id: string) => {
    Alert.alert('Chamado Aceito', 'O cliente será notificado da sua confirmação.');
    setChamados((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRecusar = (id: string) => {
    Alert.alert('Chamado Recusado', 'O pedido foi retirado da sua lista.');
    setChamados((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Profissional 👋</Text>
          <Text style={styles.subtitle}>Painel de Atendimentos</Text>
        </View>
        <Button title="Sair" onPress={onLogout} variant="outline" size="sm" />
      </View>

      {/* Switch de Disponibilidade */}
      <View style={[styles.statusCard, isDisponivel ? styles.statusOnline : styles.statusOffline]}>
        <View style={styles.statusInfo}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isDisponivel ? '#10B981' : '#6B7280' },
            ]}
          />
          <Text style={styles.statusText}>
            {isDisponivel ? 'Disponível para novos chamados' : 'Pausado (Invisível para clientes)'}
          </Text>
        </View>
        <Switch
          value={isDisponivel}
          onValueChange={setIsDisponivel}
          trackColor={{ false: '#D1D5DB', true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Métricas Rápidas */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricNumber}>{chamados.length}</Text>
          <Text style={styles.metricLabel}>Pendentes</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricNumber}>12</Text>
          <Text style={styles.metricLabel}>Realizados</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricNumber}>R$ 1.480</Text>
          <Text style={styles.metricLabel}>Este mês</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Chamados Recebidos</Text>

      {/* Lista de Pedidos */}
      <FlatList
        data={chamados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.chamadoCard}>
            <View style={styles.chamadoHeader}>
              <Text style={styles.clienteName}>{item.cliente}</Text>
              <Text style={styles.valorBadge}>{item.valorEstimado}</Text>
            </View>

            <Text style={styles.servicoText}>{item.servico}</Text>
            <Text style={styles.detailText}>📍 {item.endereco}</Text>
            <Text style={styles.detailText}>⏰ {item.horario}</Text>

            <View style={styles.chamadoActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.recusarBtn]}
                onPress={() => handleRecusar(item.id)}
              >
                <Text style={styles.recusarBtnText}>Recusar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.aceitarBtn]}
                onPress={() => handleAceitar(item.id)}
              >
                <Text style={styles.aceitarBtnText}>Aceitar Chamado</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum chamado pendente no momento.</Text>
            <Text style={styles.emptySubtext}>
              Mantenha o status "Disponível" para receber novos pedidos na sua região.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  greeting: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 18,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  statusOnline: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusOffline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricNumber: {
    ...typography.subtitle,
    color: colors.primary,
    fontSize: 16,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  chamadoCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  chamadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  clienteName: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 16,
  },
  valorBadge: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  servicoText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  chamadoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recusarBtn: {
    backgroundColor: '#FEE2E2',
  },
  recusarBtnText: {
    ...typography.caption,
    color: '#EF4444',
    fontWeight: '600',
  },
  aceitarBtn: {
    backgroundColor: colors.primary,
  },
  aceitarBtnText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});