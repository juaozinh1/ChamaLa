import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, Button, CategoryTile, Card, Screen, SearchInput, Text } from '../../components';
import { PROMO_DISCOUNT_PERCENT } from '../../config/env';
import { useAuth } from '../../contexts/AuthContext';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { radius, spacing, typography } from '../../theme';
import { firstName, formatCurrency, formatDate, statusInfo } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

export function HomeScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const categories = useRequest(() => api.catalog.categories());
  const orders = useRequest(() => api.orders.list());

  const goServices = () => navigation.navigate('ClientTabs', { screen: 'Services' });
  const goOrders = () => navigation.navigate('ClientTabs', { screen: 'Orders' });
  const goProfile = () => navigation.navigate('ClientTabs', { screen: 'Profile' });

  const recent = [...(orders.data ?? [])]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 2);

  return (
    <Screen
      loading={categories.loading && !categories.data}
      error={categories.error}
      onRetry={categories.refetch}
      refreshing={categories.refreshing}
      onRefresh={() => Promise.all([categories.refresh(), orders.refresh()])}
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.greeting}>Olá, {firstName(user?.name ?? '')} 👋</Text>
          <Text style={styles.title}>O que você precisa?</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir meu perfil" hitSlop={8} onPress={goProfile}>
          <Avatar name={user?.name} uri={user?.avatarUrl} size={44} />
        </Pressable>
      </View>

      <Pressable accessibilityRole="search" accessibilityLabel="Buscar serviço" onPress={goServices}>
        <View pointerEvents="none">
          <SearchInput editable={false} placeholder="Buscar serviço..." />
        </View>
      </Pressable>

      <View style={styles.promo}>
        <Ionicons name="construct" size={92} color="rgba(255,255,255,0.14)" style={styles.promoIcon} />
        <Text style={styles.promoSmall}>Oferta especial</Text>
        <Text style={styles.promoTitle}>{PROMO_DISCOUNT_PERCENT}% off no primeiro serviço contratado</Text>
        <Button title="Ver serviços" variant="outline" size="sm" fullWidth={false} style={styles.promoButton} onPress={goServices} />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.section}>Categorias</Text>
        <Button title="Ver todas" variant="link" fullWidth={false} onPress={goServices} />
      </View>
      <View style={styles.grid}>
        {(categories.data ?? []).map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            onPress={() =>
              navigation.navigate('ClientTabs', {
                screen: 'Services',
                params: { screen: 'ProfessionalList', params: { categoryId: category.id, categoryName: category.name } },
              })
            }
          />
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.section}>Pedidos recentes</Text>
        <Button title="Ver todos" variant="link" fullWidth={false} onPress={goOrders} />
      </View>
      {recent.map((order) => {
        const { label, badge } = statusInfo(order.status, 'client');
        return (
          <Card key={order.id} onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}>
            <View style={styles.orderTop}>
              <Text style={styles.orderTitle} numberOfLines={1}>
                {order.serviceTitle}
              </Text>
              <Badge label={label} status={badge} />
            </View>
            <Text style={styles.muted}>
              {order.professionalName} • {formatDate(order.scheduledAt)}
            </Text>
            <Text style={styles.price}>{order.total > 0 ? formatCurrency(order.total) : 'Aguardando valor'}</Text>
          </Card>
        );
      })}
      {orders.data && recent.length === 0 ? <Text style={styles.muted}>Você ainda não fez nenhum pedido.</Text> : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { ...typography.body, fontSize: 14, color: colors.textMuted },
  title: { ...typography.title, fontSize: 22, color: colors.text },
  promo: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  promoIcon: { position: 'absolute', right: spacing.lg, top: spacing.lg },
  promoSmall: { ...typography.caption, color: colors.infoBg },
  promoTitle: { ...typography.subtitle, fontWeight: '700', color: colors.surface, marginTop: 2, marginBottom: spacing.md, maxWidth: '70%' },
  promoButton: { alignSelf: 'flex-start' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.md },
  orderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  orderTitle: { ...typography.body, fontWeight: '700', color: colors.text, flex: 1 },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  price: { ...typography.body, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },
}));
