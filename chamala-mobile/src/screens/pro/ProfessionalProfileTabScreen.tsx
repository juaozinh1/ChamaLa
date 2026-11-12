import { View } from 'react-native';
import { Avatar, Badge, Button, Card, ListItem, Screen, Text } from '../../components';
import type { BadgeStatus } from '../../components';
import { useAuth, useCurrentUser } from '../../contexts/AuthContext';
import { useAppNavigation } from '../../navigation/hooks';
import { spacing, typography } from '../../theme';
import type { VerificationStatus } from '../../types';
import { confirmSignOut } from '../client/ClientProfileScreen';
import { makeStyles } from '../../theme/dynamic';

const BADGE: Record<VerificationStatus, { label: string; status: BadgeStatus }> = {
  unsubmitted: { label: 'Pendente', status: 'warning' },
  pending: { label: 'Pendente', status: 'warning' },
  verified: { label: 'Verificado', status: 'success' },
  rejected: { label: 'Recusado', status: 'danger' },
};

export function ProfessionalProfileTabScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const user = useCurrentUser();
  const { signOut } = useAuth();
  const badge = BADGE[user.verificationStatus ?? 'unsubmitted'];

  return (
    <Screen large title="Meu Perfil">
      <Card>
        <View style={styles.header}>
          <Avatar name={user.name} uri={user.avatarUrl} size={72} />
          <View style={styles.flex}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}</Text>
              <Badge label={badge.label} status={badge.status} />
            </View>
            <Text style={styles.muted}>
              {user.specialty ?? 'Profissional'}
              {user.area ? ` • ${user.area.split(',')[0]}` : ''}
            </Text>
            <Text style={styles.muted}>{user.phone}</Text>
          </View>
        </View>
        <View style={styles.edit}>
          <Button title="Editar perfil" size="sm" variant="soft" fullWidth={false} onPress={() => navigation.navigate('EditProfile')} />
        </View>
      </Card>

      <ListItem emoji="🪪" title="Verificação de Identidade" onPress={() => navigation.navigate('ProfessionalTabs', { screen: 'VerificationStatus' })} />
      <ListItem emoji="🛠️" title="Meus serviços" onPress={() => navigation.navigate('MyServices')} />
      <ListItem emoji="📅" title="Cancelamento e sinal" onPress={() => navigation.navigate('CancellationPolicy')} />
      <ListItem emoji="📋" title="Serviços Realizados" onPress={() => navigation.navigate('ServicesDone')} />
      <ListItem emoji="⭐" title="Avaliações recebidas" onPress={() => navigation.navigate('Reviews')} />
      <ListItem emoji="💳" title="Dados de pagamento" onPress={() => navigation.navigate('PaymentData')} />
      <ListItem emoji="🔔" title="Notificações" onPress={() => navigation.navigate('Notifications')} />
      <ListItem left={<Text style={styles.aa}>Aa</Text>} title="Acessibilidade" onPress={() => navigation.navigate('Accessibility')} />
      <ListItem emoji="❓" title="Suporte" onPress={() => navigation.navigate('Info', { kind: 'help' })} />

      <View style={styles.signOut}>
        <Button title="Sair da conta" variant="link" fullWidth={false} onPress={() => confirmSignOut(signOut)} />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
  name: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  edit: { marginTop: spacing.md, alignItems: 'flex-start' },
  aa: { ...typography.subtitle, color: colors.text },
  signOut: { alignItems: 'center' },
}));
