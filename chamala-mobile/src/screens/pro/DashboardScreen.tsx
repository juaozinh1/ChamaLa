import { Alert, Pressable, View } from 'react-native';
import { AlertBanner, Avatar, Badge, EmptyState, RequestCard, Screen, SectionTitle, StatCard, SwitchRow, Text } from '../../components';
import { useCurrentUser } from '../../contexts/AuthContext';
import { useOrderActions, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import { formatCurrency, getErrorMessage } from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

export function DashboardScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAppNavigation();
  const user = useCurrentUser();
  const dash = useRequest(() => api.professional.dashboard());
  const actions = useOrderActions(() => dash.refetchSilent());
  const data = dash.data;

  const toggleAvailability = async (value: boolean) => {
    if (!data) return;
    dash.setData({ ...data, available: value });
    try {
      await api.professional.setAvailability(value);
    } catch (e) {
      dash.setData(data);
      Alert.alert('Não foi possível atualizar', getErrorMessage(e));
    }
  };

  const verification = data?.verificationStatus;
  const verify = () => navigation.navigate('ProfessionalVerification');

  return (
    <Screen
      loading={dash.loading && !data}
      error={dash.error}
      onRetry={dash.refetch}
      refreshing={dash.refreshing}
      onRefresh={dash.refresh}
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.muted}>Bem-vindo de volta 👋</Text>
          <Text style={styles.name}>{user.name}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir meu perfil"
          hitSlop={8}
          onPress={() => navigation.navigate('ProfessionalTabs', { screen: 'Profile' })}
        >
          <Avatar name={user.name} uri={user.avatarUrl} size={52} indicatorColor={verification && verification !== 'verified' ? colors.goldBright : undefined} />
        </Pressable>
      </View>

      {data ? (
        <>
          {verification === 'unsubmitted' ? (
            <AlertBanner variant="warning" title="Verificação pendente" message="Complete a verificação para aumentar sua credibilidade e receber mais solicitações." actionLabel="Verificar" onAction={verify} />
          ) : null}
          {verification === 'pending' ? <AlertBanner title="Verificação em análise" message="Recebemos seus documentos. O resultado sai em até 48h." /> : null}
          {verification === 'rejected' ? (
            <AlertBanner variant="danger" title="Verificação recusada" message="Revise seus documentos e envie novamente." actionLabel="Reenviar" onAction={verify} />
          ) : null}

          <View style={styles.stats}>
            <StatCard emoji="💰" value={formatCurrency(data.monthEarnings).replace(',00', '')} label="Este mês" />
            <StatCard emoji="✅" value={String(data.servicesCount)} label="Serviços" />
            <StatCard emoji="⭐" value={data.rating > 0 ? `${data.rating.toFixed(1)}★` : '—'} label="Avaliação" />
          </View>

          <SwitchRow
            title="Disponível para serviços"
            subtitle={data.available ? 'Você está visível para novos clientes' : 'Você não aparece para novos clientes'}
            value={data.available}
            onValueChange={toggleAvailability}
          />

          <SectionTitle title="Novas Solicitações" right={data.pending.length > 0 ? <Badge label={String(data.pending.length)} status="solid" /> : undefined} />
          {data.pending.map((order) => (
            <RequestCard
              key={order.id}
              order={order}
              busy={actions.busyId === order.id}
              onOpen={() => navigation.navigate('OrderDetail', { orderId: order.id })}
              onAccept={() => actions.accept(order.id)}
              onDecline={() => actions.decline(order.id)}
              onRespondQuote={() => navigation.navigate('RespondQuote', { orderId: order.id })}
            />
          ))}
          {data.pending.length === 0 ? <EmptyState emoji="📭" title="Nenhuma solicitação nova" message="Quando um cliente pedir um serviço, ele aparece aqui." /> : null}
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muted: { ...typography.body, color: colors.textMuted },
  name: { ...typography.title, color: colors.text },
  stats: { flexDirection: 'row', gap: spacing.md },
}));
