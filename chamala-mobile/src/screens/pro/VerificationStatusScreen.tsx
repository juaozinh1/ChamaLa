import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertBanner, Badge, Button, Card, Screen, Text } from '../../components';
import type { BadgeStatus } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { VerificationStatus } from '../../types';
import { makeStyles, useColors } from '../../theme/dynamic';

const BADGES: Record<VerificationStatus, { label: string; status: BadgeStatus }> = {
  unsubmitted: { label: 'Pendente', status: 'warning' },
  pending: { label: 'Em análise', status: 'info' },
  verified: { label: 'Verificado', status: 'success' },
  rejected: { label: 'Recusado', status: 'danger' },
};

type StepState = 'done' | 'current' | 'todo';

function TimelineStep({ state, title, text }: { state: StepState; title: string; text?: string }) {
  const styles = useStyles();
  const colors = useColors();
  const icon = state === 'done' ? 'checkmark-circle' : state === 'current' ? 'time-outline' : 'ellipse-outline';
  const color = state === 'done' ? colors.success : state === 'current' ? colors.gold : colors.border;
  return (
    <View style={styles.step}>
      <Ionicons name={icon} size={24} color={color} />
      <View style={styles.flex}>
        <Text style={[styles.stepTitle, state === 'todo' && styles.muted]}>{title}</Text>
        {text ? <Text style={styles.muted}>{text}</Text> : null}
      </View>
    </View>
  );
}

/** Aba "Verificação": acompanha o status (pendente, em análise, verificado ou recusado). */
export function VerificationStatusScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { user, setVerificationStatus } = useAuth();
  const request = useRequest(async () => {
    const status = await api.professional.verificationStatus();
    setVerificationStatus(status);
    return status;
  });
  const status: VerificationStatus = request.data ?? user?.verificationStatus ?? 'unsubmitted';
  const badge = BADGES[status];
  const start = () => navigation.navigate('ProfessionalVerification');

  return (
    <Screen large title="Verificação" loading={request.loading && !request.data} error={request.error} onRetry={request.refetch} refreshing={request.refreshing} onRefresh={request.refresh}>
      <Card>
        <View style={styles.statusRow}>
          <Text style={styles.cardTitle}>Status do perfil</Text>
          <Badge label={badge.label} status={badge.status} />
        </View>
      </Card>

      {status === 'unsubmitted' ? (
        <>
          <AlertBanner variant="warning" title="Verificação pendente" message="Envie seus documentos para aumentar sua credibilidade e receber mais solicitações." />
          <Button title="Iniciar verificação" onPress={start} />
        </>
      ) : null}
      {status === 'pending' ? (
        <AlertBanner message="Seus documentos estão em análise. Em até 48h você receberá o resultado por e-mail e notificação." />
      ) : null}
      {status === 'verified' ? (
        <AlertBanner variant="success" title="Perfil verificado" message="Seu selo aparece para os clientes e aumenta a confiança no seu trabalho." />
      ) : null}
      {status === 'rejected' ? (
        <>
          <AlertBanner variant="danger" title="Verificação recusada" message="Não foi possível validar seus documentos. Confira se as fotos estão nítidas e legíveis e envie novamente." />
          <Button title="Reenviar documentos" onPress={start} />
        </>
      ) : null}

      {status !== 'unsubmitted' ? (
        <Card>
          <TimelineStep state="done" title="Documentos enviados" />
          <TimelineStep state={status === 'pending' ? 'current' : 'done'} title="Em análise" text="Resposta em até 48 horas." />
          <TimelineStep state={status === 'pending' ? 'todo' : status === 'verified' ? 'done' : 'current'} title={status === 'rejected' ? 'Resultado: recusado' : 'Resultado'} />
        </Card>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.sm },
  stepTitle: { ...typography.body, fontWeight: '600', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  flex: { flex: 1 },
}));
