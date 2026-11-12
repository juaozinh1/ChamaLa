import { ActivityIndicator, View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

export function LoadingView() {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.center} accessibilityLabel="Carregando" accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const styles = useStyles();
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={styles.title}>Não foi possível carregar</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <View style={styles.action}>
          <Button title="Tentar de novo" onPress={onRetry} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

export function EmptyState({
  emoji = '📭',
  title,
  message,
}: {
  emoji?: string;
  title: string;
  message?: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.empty}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  emoji: { fontSize: 40, marginBottom: spacing.md },
  title: { ...typography.subtitle, color: colors.text, textAlign: 'center' },
  text: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },
  action: { marginTop: spacing.lg },
}));
