import { useState } from 'react';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, Card, Checkbox, InfoRow, Screen, Text } from '../../components';
import { useCurrentUser } from '../../contexts/AuthContext';
import { useAction, useRequest } from '../../hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { contractClauses, formatCurrency, formatDayMonth, formatTime, formatWeekdayDate, round2 } from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

const acceptedText = (iso?: string) => (iso ? `✓ Aceito em ${formatDayMonth(iso)} · ${formatTime(iso)}` : 'Aguardando aceite');

export function ContractScreen() {
  const styles = useStyles();
  const colors = useColors();
  const { role } = useCurrentUser();
  const { params } = useRoute<RouteProp<AppStackParamList, 'Contract'>>();
  const request = useRequest(() => api.orders.get(params.orderId), [params.orderId]);
  const [checked, setChecked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [accept, accepting] = useAction(async () => {
    request.setData(await api.orders.acceptContract(params.orderId));
  }, 'Não foi possível aceitar');

  const order = request.data;
  if (!order) return <Screen title="Contrato" loading={request.loading} error={request.error} onRetry={request.refetch} />;

  const mine = role === 'client' ? order.contract.clientAcceptedAt : order.contract.professionalAcceptedAt;
  const { freeCancelHours, penaltyPercent, depositPercent } = order.policy;
  const clauses = contractClauses(order);
  const shown = expanded ? clauses : clauses.slice(0, 3);
  const deposit = round2((order.total * depositPercent) / 100);

  const download = () =>
    Alert.alert('Baixar PDF', 'O PDF do contrato será gerado pelo servidor. Este botão será ligado quando a conexão com o back-end estiver pronta.');

  return (
    <Screen
      title="Contrato"
      footer={
        <>
          {!mine ? <Button title="Aceitar contrato" disabled={!checked} loading={accepting} onPress={() => accept()} /> : null}
          <Button title="Baixar PDF" variant="outline" onPress={download} />
        </>
      }
    >
      <Card>
        <InfoRow label="Serviço" value={order.serviceTitle} />
        <InfoRow label="Valor" value={order.total > 0 ? formatCurrency(order.total) : 'A definir'} />
        <InfoRow label="Data" value={`${formatWeekdayDate(order.scheduledAt)} · ${formatTime(order.scheduledAt)}`} />
        <InfoRow label="Cancelamento" value={`Grátis até ${freeCancelHours} h antes`} />
        <InfoRow label="Multa fora do prazo" value={`${penaltyPercent}% · ${formatCurrency(round2((order.total * penaltyPercent) / 100))}`} />
        <InfoRow label="Sinal" value={depositPercent > 0 ? `${depositPercent}% · ${formatCurrency(deposit)}` : 'Sem sinal'} />
      </Card>

      <Card>
        <Text style={styles.title}>Termos do serviço · versão {order.contract.version}</Text>
        {shown.map((clause, index) => (
          <Text key={clause} style={styles.clause}>
            {index + 1}. {clause}
          </Text>
        ))}
        <Button title={expanded ? 'Mostrar menos' : 'Ler contrato completo'} variant="link" fullWidth={false} style={styles.link} onPress={() => setExpanded((v) => !v)} />
      </Card>

      <Card>
        <InfoRow label="Cliente" value={acceptedText(order.contract.clientAcceptedAt)} valueColor={order.contract.clientAcceptedAt ? colors.success : colors.gold} />
        <InfoRow label="Profissional" value={acceptedText(order.contract.professionalAcceptedAt)} valueColor={order.contract.professionalAcceptedAt ? colors.success : colors.gold} />
      </Card>

      {!mine ? <Checkbox checked={checked} onChange={setChecked} label="Li e aceito o contrato deste pedido." /> : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  title: { ...typography.body, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  clause: { ...typography.body, fontSize: 14, color: colors.textMuted, marginBottom: spacing.sm },
  link: { alignSelf: 'flex-start', paddingHorizontal: 0 },
}));
