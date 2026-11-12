import { Switch, View } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type SwitchRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// Ex.: "Disponível para serviços — Você está visível para novos clientes".
export function SwitchRow({ title, subtitle, value, onValueChange }: SwitchRowProps) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Switch
          accessibilityLabel={title}
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
          ios_backgroundColor={colors.border}
        />
      </View>
    </Card>
  );
}

const useStyles = makeStyles((colors) => ({
  row: { flexDirection: 'row', alignItems: 'center' },
  body: { flex: 1, marginRight: spacing.md },
  title: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
}));
