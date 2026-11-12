import { Alert, View } from 'react-native';
import { Avatar, Button, Card, ListItem, Screen, Text } from '../../components';
import { useCurrentUser, useAuth } from '../../contexts/AuthContext';
import { useAppNavigation } from '../../navigation/hooks';
import { spacing, typography } from '../../theme';
import { makeStyles } from '../../theme/dynamic';

export function confirmSignOut(signOut: () => Promise<void>) {
  Alert.alert('Sair da conta?', 'Você precisará entrar novamente para usar o app.', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: () => void signOut() },
  ]);
}

export function ClientProfileScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const user = useCurrentUser();
  const { signOut } = useAuth();

  return (
    <Screen large title="Perfil">
      <Card>
        <View style={styles.header}>
          <Avatar name={user.name} uri={user.avatarUrl} size={64} />
          <View style={styles.flex}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.muted}>{user.email}</Text>
            <Text style={styles.muted}>{user.phone}</Text>
          </View>
          <Button title="Editar" size="sm" variant="soft" fullWidth={false} onPress={() => navigation.navigate('EditProfile')} />
        </View>
      </Card>

      <ListItem emoji="📋" title="Meus Pedidos" onPress={() => navigation.navigate('ClientTabs', { screen: 'Orders' })} />
      <ListItem emoji="⭐" title="Avaliações" onPress={() => navigation.navigate('Reviews')} />
      <ListItem emoji="📍" title="Endereços salvos" onPress={() => navigation.navigate('Addresses')} />
      <ListItem emoji="🔔" title="Notificações" onPress={() => navigation.navigate('Notifications')} />
      <ListItem left={<Text style={styles.aa}>Aa</Text>} title="Acessibilidade" onPress={() => navigation.navigate('Accessibility')} />
      <ListItem emoji="🔒" title="Privacidade" onPress={() => navigation.navigate('Info', { kind: 'privacy' })} />
      <ListItem emoji="❓" title="Ajuda" onPress={() => navigation.navigate('Info', { kind: 'help' })} />

      <View style={styles.signOut}>
        <Button title="Sair da conta" variant="link" fullWidth={false} onPress={() => confirmSignOut(signOut)} />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  name: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  aa: { ...typography.subtitle, color: colors.text },
  signOut: { alignItems: 'center' },
}));
