import { useState } from 'react';
import { Linking, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AlertBanner, Button, Card, Screen, Text } from '../../components';
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_WHATSAPP } from '../../config/env';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { makeStyles, useColors } from '../../theme/dynamic';

const FAQ = [
  { q: 'Como funciona o cancelamento?', a: 'Você pode cancelar sem multa até o prazo definido no contrato do pedido (por exemplo, 24 horas antes). Depois disso, pode haver multa. O valor aparece antes de você confirmar.' },
  { q: 'Como remarcar um serviço?', a: 'Abra o pedido e toque em "Propor nova data". A outra parte precisa aceitar. Reagendar não gera multa.' },
  { q: 'O que é o orçamento?', a: 'Para serviços fora da lista de preços fixos, você descreve o que precisa e o profissional responde com um valor. Você decide se aceita.' },
  { q: 'Como o profissional é verificado?', a: 'O profissional envia selfie, documento e comprovações. Nossa equipe analisa em até 48 horas e o selo aparece no perfil.' },
];

const PRIVACY = [
  'Coletamos apenas os dados necessários para conectar clientes e profissionais: nome, contato, endereço do serviço e, para profissionais, documentos de verificação.',
  'O endereço exato do cliente só é mostrado ao profissional depois que o pedido é aceito.',
  'Você pode pedir a correção ou a exclusão dos seus dados a qualquer momento pelo suporte.',
];

export function InfoScreen() {
  const styles = useStyles();
  const colors = useColors();
  const { params } = useRoute<RouteProp<AppStackParamList, 'Info'>>();
  const [open, setOpen] = useState<number | null>(null);

  if (params.kind === 'privacy') {
    return (
      <Screen title="Privacidade">
        <AlertBanner message="Resumo provisório. O texto oficial da política de privacidade será fornecido pela equipe do app." />
        {PRIVACY.map((p) => (
          <Card key={p}>
            <Text style={styles.text}>{p}</Text>
          </Card>
        ))}
      </Screen>
    );
  }

  return (
    <Screen title="Ajuda">
      {FAQ.map((item, index) => {
        const expanded = open === index;
        return (
          <Card key={item.q} onPress={() => setOpen(expanded ? null : index)}>
            <View style={styles.row}>
              <Text style={styles.question}>{item.q}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
            </View>
            {expanded ? <Text style={[styles.text, styles.answer]}>{item.a}</Text> : null}
          </Card>
        );
      })}
      <Text style={styles.heading}>Precisa de mais ajuda?</Text>
      <Button title="Falar pelo WhatsApp" onPress={() => Linking.openURL(`https://wa.me/${SUPPORT_WHATSAPP}`)} />
      <Button title="Enviar e-mail" variant="outline" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Ajuda%20-%20${encodeURIComponent(APP_NAME)}`)} />
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  question: { ...typography.body, fontWeight: '600', color: colors.text, flex: 1 },
  text: { ...typography.body, fontSize: 14, color: colors.textMuted },
  answer: { marginTop: spacing.sm },
  heading: { ...typography.subtitle, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
}));
