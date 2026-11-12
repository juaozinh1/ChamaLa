import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Screen, Text } from '../../components';
import { useAppNavigation } from '../../navigation/hooks';
import { radius, spacing, typography } from '../../theme';
import { makeStyles, useColors } from '../../theme/dynamic';

export function VerificationSentScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAppNavigation();

  return (
    <Screen
      scroll={false}
      contentStyle={styles.content}
    >
      <View style={styles.circle}>
        <Ionicons name="shield-checkmark-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>Verificação enviada!</Text>
      <Text style={styles.text}>
        Seus documentos estão em análise. Em até 48h você receberá o resultado por e-mail e notificação.
      </Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.star}>
            <Ionicons name="star" size={20} color={colors.gold} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>Perfil não verificado</Text>
            <Text style={styles.cardText}>Você já pode usar o app enquanto aguarda</Text>
          </View>
        </View>
      </Card>
      <Button
        title="Ir para o Painel"
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ProfessionalTabs' }] })}
      />
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: spacing.lg },
  circle: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.title, color: colors.text, textAlign: 'center' },
  text: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  card: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  star: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.warningBg, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  cardTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  cardText: { ...typography.caption, fontSize: 14, color: colors.textMuted },
}));
