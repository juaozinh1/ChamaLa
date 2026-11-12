import { Alert, Switch, View } from 'react-native';
import { Button, Card, EmptyState, Screen, Text } from '../../components';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { ServiceOffering } from '../../types';
import { formatCurrency, getErrorMessage } from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

export function MyServicesScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAppNavigation();
  const request = useRequest(() => api.professional.services());
  const data = request.data;

  const failed = (e: unknown) => Alert.alert('Não foi possível salvar', getErrorMessage(e));

  const toggleService = async (service: ServiceOffering, active: boolean) => {
    if (!data) return;
    request.setData({ ...data, services: data.services.map((s) => (s.id === service.id ? { ...s, active } : s)) });
    try {
      await api.professional.saveService({ ...service, active });
    } catch (e) {
      request.setData(data);
      failed(e);
    }
  };

  const toggleQuotes = async (value: boolean) => {
    if (!data) return;
    request.setData({ ...data, acceptsQuotes: value });
    try {
      await api.professional.setAcceptsQuotes(value);
    } catch (e) {
      request.setData(data);
      failed(e);
    }
  };

  return (
    <Screen
      title="Meus serviços"
      loading={request.loading && !data}
      error={request.error}
      onRetry={request.refetch}
      refreshing={request.refreshing}
      onRefresh={request.refresh}
      footer={<Button title="+ Adicionar serviço" onPress={() => navigation.navigate('ServiceForm', {})} />}
    >
      <Text style={styles.muted}>Serviços com preço fixo aparecem no seu perfil e podem ser agendados direto.</Text>

      {(data?.services ?? []).map((service) => (
        <Card key={service.id} onPress={() => navigation.navigate('ServiceForm', { serviceId: service.id })}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.muted}>
                {formatCurrency(service.price)} · <Text style={service.active ? styles.muted : styles.paused}>{service.active ? 'Ativo' : 'Pausado'}</Text>
              </Text>
            </View>
            <Switch
              accessibilityLabel={`${service.title}: ${service.active ? 'ativo' : 'pausado'}`}
              value={service.active}
              onValueChange={(v) => toggleService(service, v)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>
        </Card>
      ))}
      {data && data.services.length === 0 ? <EmptyState emoji="🛠️" title="Nenhum serviço cadastrado" message='Toque em "+ Adicionar serviço" para criar o primeiro.' /> : null}

      {data ? (
        <Card>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.title}>Aceitar pedidos de orçamento</Text>
              <Text style={styles.muted}>Para serviços fora da lista, o cliente descreve e você responde com o valor.</Text>
            </View>
            <Switch
              accessibilityLabel="Aceitar pedidos de orçamento"
              value={data.acceptsQuotes}
              onValueChange={toggleQuotes}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { ...typography.body, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  paused: { ...typography.body, fontSize: 14, color: colors.gold },
}));
