import { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { spacing, typography } from '../theme';
import { makeStyles } from '../theme/dynamic';

/** Título de seção ("Serviços oferecidos"), com um elemento opcional à direita (ex.: contador). */
export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {right}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  title: { ...typography.subtitle, fontWeight: '700', color: colors.text },
}));
