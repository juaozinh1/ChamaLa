import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Screen, Text } from '../../components';
import { APP_NAME, APP_SLOGAN } from '../../config/env';
import { useAuthNavigation } from '../../navigation/hooks';
import { radius, spacing, typography } from '../../theme';
import { makeStyles, useColors } from '../../theme/dynamic';

export function WelcomeScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAuthNavigation();

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel={APP_NAME}
        />
        <Text style={styles.slogan}>{APP_SLOGAN}</Text>
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: colors.infoBg }]}>
            <Ionicons name="briefcase-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Sou Profissional</Text>
        </View>
        <Text style={styles.cardText}>
          Cadastre seus serviços, atenda clientes na sua região e multiplique seus ganhos diários.
        </Text>
        <Button title="Cadastrar meus Serviços" onPress={() => navigation.navigate('ProfessionalSignUp')} />
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
            <Ionicons name="person-outline" size={24} color={colors.textMuted} />
          </View>
          <Text style={styles.cardTitle}>Sou Cliente</Text>
        </View>
        <Text style={styles.cardText}>
          Crie sua conta para encontrar os melhores profissionais qualificados perto de você.
        </Text>
        <Button title="Cadastrar minha Conta" variant="outline" onPress={() => navigation.navigate('ClientSignUp')} />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.muted}>Já tem conta? </Text>
        <Pressable accessibilityRole="link" hitSlop={12} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Entrar</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { paddingTop: spacing.xxl },
  hero: { alignItems: 'center', marginBottom: spacing.md },
  logo: { width: 220, height: 204 },
  slogan: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardTitle: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  cardText: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
  muted: { ...typography.body, color: colors.textMuted },
  link: { ...typography.body, fontWeight: '700', color: colors.primary, textDecorationLine: 'underline' },
}));
