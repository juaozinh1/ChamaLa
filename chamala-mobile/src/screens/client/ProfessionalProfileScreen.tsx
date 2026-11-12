import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Avatar, Button, Card, ListItem, RatingStars, Screen, SectionTitle, Text } from '../../components';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { radius, spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { formatCurrency, formatDayMonth } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

function Metric({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  return (
    <View style={styles.metric} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function ProfessionalProfileScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'ProfessionalProfile'>>();
  const detail = useRequest(() => api.catalog.professional(params.professionalId), [params.professionalId]);
  const reviews = useRequest(() => api.catalog.professionalReviews(params.professionalId), [params.professionalId]);
  const pro = detail.data;
  const services = (pro?.services ?? []).filter((s) => s.active && s.price > 0);

  return (
    <Screen
      title="Perfil do Profissional"
      loading={detail.loading && !pro}
      error={detail.error}
      onRetry={detail.refetch}
      footer={
        pro ? (
          <>
            <Button title="Contratar Serviço" onPress={() => navigation.navigate('Booking', { professionalId: pro.id })} />
            {pro.acceptsQuotes ? (
              <Button title="Pedir orçamento" variant="outline" onPress={() => navigation.navigate('RequestQuote', { professionalId: pro.id })} />
            ) : null}
          </>
        ) : null
      }
    >
      {pro ? (
        <>
          <Card>
            <View style={styles.header}>
              <Avatar name={pro.name} emoji={pro.emoji} size={72} />
              <View style={styles.flex}>
                <Text style={styles.name}>{pro.name}</Text>
                <Text style={styles.muted}>{pro.specialty}</Text>
                {pro.reviewsCount > 0 ? (
                  <View style={styles.ratingRow}>
                    <RatingStars value={pro.rating} size={16} />
                    <Text style={styles.rating}>
                      {pro.rating.toFixed(1)} <Text style={styles.muted}>({pro.reviewsCount} avaliações)</Text>
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.muted}>Novo na plataforma</Text>
                )}
              </View>
            </View>
            <View style={styles.metrics}>
              <Metric label="Distância" value={`${pro.distanceKm.toFixed(1).replace('.', ',')} km`} />
              <Metric label="Preço" value={`R$ ${pro.hourlyRate}/h`} />
              <Metric label="Trabalhos" value={String(pro.jobsCount)} />
            </View>
          </Card>

          <SectionTitle title="Serviços oferecidos" />
          {services.length > 0 ? (
            services.map((service) => (
              <ListItem
                key={service.id}
                title={service.title}
                right={<Text style={styles.price}>{formatCurrency(service.price)}</Text>}
                onPress={() => navigation.navigate('Booking', { professionalId: pro.id, serviceId: service.id })}
              />
            ))
          ) : (
            <Text style={styles.muted}>Atendimento por hora: {formatCurrency(pro.hourlyRate)}/h.</Text>
          )}

          <SectionTitle title="Avaliações recentes" />
          {(reviews.data ?? []).map((review) => (
            <Card key={review.id}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewName}>{review.authorName}</Text>
                <Text style={styles.muted}>{formatDayMonth(review.createdAt)}</Text>
              </View>
              <RatingStars value={review.rating} size={14} />
              <Text style={styles.reviewText}>{review.comment}</Text>
            </Card>
          ))}
          {reviews.data && reviews.data.length === 0 ? <Text style={styles.muted}>Ainda não há avaliações.</Text> : null}
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  name: { ...typography.title, fontSize: 22, color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  rating: { ...typography.body, fontWeight: '700', color: colors.text },
  metrics: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  metric: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.background },
  metricLabel: { ...typography.caption, color: colors.textMuted },
  metricValue: { ...typography.body, fontWeight: '700', color: colors.text, marginTop: 2 },
  price: { ...typography.body, fontWeight: '700', color: colors.primary },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  reviewName: { ...typography.body, fontWeight: '700', color: colors.text },
  reviewText: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
}));
