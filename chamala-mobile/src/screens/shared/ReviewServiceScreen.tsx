import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Badge, Button, Card, RatingStars, Screen, Text, TextArea } from '../../components';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { formatDate } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

const LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

export function ReviewServiceScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'ReviewService'>>();
  const request = useRequest(() => api.orders.get(params.orderId), [params.orderId]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [send, loading] = useAction(async () => {
    await api.orders.review(params.orderId, { rating, comment: comment.trim() || undefined });
    Alert.alert('Obrigado!', 'Sua avaliação foi enviada.');
    navigation.goBack();
  }, 'Não foi possível enviar a avaliação');

  const order = request.data;

  return (
    <Screen
      title="Avaliar serviço"
      loading={request.loading && !order}
      error={request.error}
      onRetry={request.refetch}
      footer={<Button title="Enviar avaliação" disabled={rating === 0} loading={loading} onPress={() => send()} />}
    >
      {order ? (
        <>
          <Card>
            <View style={styles.top}>
              <Text style={styles.name}>{order.professionalName}</Text>
              <Badge label="Concluído" status="success" />
            </View>
            <Text style={styles.muted}>
              {order.serviceTitle}
              {order.specialty ? ` · ${order.specialty}` : ''}
            </Text>
            <Text style={styles.muted}>Concluído em {formatDate(order.scheduledAt)}</Text>
          </Card>

          <Text style={styles.question}>Como foi o serviço?</Text>
          <RatingStars value={rating} onChange={setRating} size={40} />
          <Text style={styles.ratingText}>{rating > 0 ? `${rating} de 5 · ${LABELS[rating]}` : 'Toque nas estrelas para avaliar'}</Text>

          <TextArea label="Comentário (opcional)" placeholder="Conte como foi a experiência" maxLength={300} value={comment} onChangeText={setComment} minHeight={96} />
          <Text style={styles.muted}>A avaliação aparece no perfil do profissional com seu primeiro nome e a inicial do sobrenome.</Text>
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { ...typography.subtitle, fontWeight: '700', color: colors.text, flex: 1 },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  question: { ...typography.subtitle, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  ratingText: { ...typography.body, fontWeight: '600', color: colors.gold, marginTop: -spacing.xs },
}));
