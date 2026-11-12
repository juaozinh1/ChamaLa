import { View } from 'react-native';
import { Card, EmptyState, RatingStars, Screen, Text } from '../../components';
import { useCurrentUser } from '../../contexts/AuthContext';
import { useRequest } from '../../hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import { formatDate } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

/** Cliente: avaliações que ele fez. Profissional: avaliações recebidas. */
export function ReviewsScreen() {
  const styles = useStyles();
  const { role } = useCurrentUser();
  const isPro = role === 'professional';
  const request = useRequest(() => (isPro ? api.professional.reviewsReceived() : api.account.reviewsGiven()), [role]);
  const reviews = request.data ?? [];
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <Screen
      title={isPro ? 'Avaliações recebidas' : 'Avaliações'}
      loading={request.loading && !request.data}
      error={request.error}
      onRetry={request.refetch}
      refreshing={request.refreshing}
      onRefresh={request.refresh}
    >
      {isPro && reviews.length > 0 ? (
        <Card>
          <View style={styles.summary}>
            <Text style={styles.average}>{average.toFixed(1)}</Text>
            <View>
              <RatingStars value={average} size={18} />
              <Text style={styles.muted}>{reviews.length} avaliações</Text>
            </View>
          </View>
        </Card>
      ) : null}
      {reviews.map((review) => (
        <Card key={review.id}>
          <View style={styles.top}>
            <Text style={styles.name}>{isPro ? review.authorName : (review.professionalName ?? 'Profissional')}</Text>
            <Text style={styles.muted}>{formatDate(review.createdAt)}</Text>
          </View>
          {!isPro && review.serviceTitle ? <Text style={styles.muted}>{review.serviceTitle}</Text> : null}
          <View style={styles.stars}>
            <RatingStars value={review.rating} size={14} />
          </View>
          {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
        </Card>
      ))}
      {request.data && reviews.length === 0 ? (
        <EmptyState emoji="⭐" title="Nenhuma avaliação ainda" message={isPro ? 'Quando clientes avaliarem seus serviços, elas aparecem aqui.' : 'Depois de concluir um serviço, você pode avaliar o profissional.'} />
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  average: { ...typography.title, fontSize: 40, color: colors.primary },
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  name: { ...typography.body, fontWeight: '700', color: colors.text, flex: 1 },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  stars: { marginVertical: spacing.xs },
  comment: { ...typography.body, color: colors.textMuted },
}));
