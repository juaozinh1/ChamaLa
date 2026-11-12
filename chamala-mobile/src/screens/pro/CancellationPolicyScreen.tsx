import { useEffect, useRef, useState } from 'react';
import { Alert, Switch, View } from 'react-native';
import { AlertBanner, Button, Card, Input, Screen, Tabs, Text } from '../../components';
import { useAction, useRequest } from '../../hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import { formatCurrency, round2 } from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

const PENALTIES = [
  { key: '10', label: '10%' },
  { key: '15', label: '15%' },
  { key: '20', label: '20%' },
];
const EXAMPLE_PRICE = 200;

export function CancellationPolicyScreen() {
  const styles = useStyles();
  const request = useRequest(() => api.professional.policy());
  const [hours, setHours] = useState('24');
  const [penalty, setPenalty] = useState('15');
  const [depositOn, setDepositOn] = useState(false);
  const [depositPct, setDepositPct] = useState('20');
  const [errors, setErrors] = useState<{ hours?: string; deposit?: string }>({});

  const filled = useRef(false);
  useEffect(() => {
    const p = request.data;
    if (p && !filled.current) {
      filled.current = true;
      setHours(String(p.freeCancelHours));
      setPenalty(String(p.penaltyPercent));
      setDepositOn(p.depositEnabled);
      setDepositPct(String(p.depositPercent));
    }
  }, [request.data]);

  const hoursN = Number(hours);
  const penaltyN = Number(penalty);
  const depositN = Number(depositPct);
  const example = depositOn
    ? `Serviço de ${formatCurrency(EXAMPLE_PRICE)}: sinal de ${formatCurrency(round2((EXAMPLE_PRICE * depositN) / 100))}. `
    : `Serviço de ${formatCurrency(EXAMPLE_PRICE)} (sem sinal). `;

  const [save, saving] = useAction(async () => {
    const next: typeof errors = {};
    if (!Number.isInteger(hoursN) || hoursN < 0 || hoursN > 720) next.hours = 'Informe um número de horas entre 0 e 720';
    if (depositOn && (!Number.isInteger(depositN) || depositN < 1 || depositN > 100)) next.deposit = 'Informe um percentual entre 1 e 100';
    setErrors(next);
    if (Object.keys(next).length) return;
    await api.professional.savePolicy({ freeCancelHours: hoursN, penaltyPercent: penaltyN, depositEnabled: depositOn, depositPercent: depositOn ? depositN : 20 });
    Alert.alert('Política salva', 'Ela vale para os próximos pedidos.');
  }, 'Não foi possível salvar');

  return (
    <Screen
      title="Cancelamento e sinal"
      loading={request.loading && !request.data}
      error={request.error}
      onRetry={request.refetch}
      footer={<Button title="Salvar política" loading={saving} onPress={() => save()} />}
    >
      <Text style={styles.muted}>Vale para novos pedidos. Pedidos já confirmados seguem o contrato aceito.</Text>

      <Input
        label="Antecedência mínima para cancelar sem multa"
        value={hours}
        onChangeText={(t) => setHours(t.replace(/\D/g, ''))}
        keyboardType="number-pad"
        rightText="horas"
        error={errors.hours}
        containerStyle={{ marginBottom: 0 }}
      />

      <View>
        <Text style={styles.label}>Multa fora do prazo</Text>
        <Tabs tabs={PENALTIES} activeKey={penalty} onChange={setPenalty} />
      </View>

      <Card>
        <SwitchRowInline title="Cobrar sinal no agendamento" subtitle="Percentual abatido do valor final." value={depositOn} onChange={setDepositOn} />
        {depositOn ? (
          <View style={styles.deposit}>
            <Input
              label="Percentual do sinal"
              value={depositPct}
              onChangeText={(t) => setDepositPct(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
              rightText="%"
              error={errors.deposit}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        ) : null}
      </Card>

      <AlertBanner
        icon={false}
        title="Exemplo"
        message={`${example}Se o cliente cancelar com menos de ${hoursN || 0} h, a multa é de ${formatCurrency(round2((EXAMPLE_PRICE * penaltyN) / 100))}.`}
      />
    </Screen>
  );
}

// Linha com switch dentro de um Card (sem o cartão extra do SwitchRow).
function SwitchRowInline({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (v: boolean) => void }) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.switchRow}>
      <View style={styles.flex}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.muted}>{subtitle}</Text>
      </View>
      <Switch accessibilityLabel={title} value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.surface} ios_backgroundColor={colors.border} />
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  title: { ...typography.body, fontWeight: '700', color: colors.text },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deposit: { marginTop: spacing.lg },
}));
