import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Card } from './Card';
import { colors, spacing, typography } from '../theme';

type SwitchRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// Ex.: "Disponível para serviços — Você está visível para novos clientes".
export function SwitchRow({ title, subtitle, value, onValueChange }: SwitchRowProps) {
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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  body: { flex: 1, marginRight: spacing.md },
  title: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
