import { useState } from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Chip, EmptyState, ProfessionalCard, Screen } from '../../components';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing } from '../../theme';
import type { ProfessionalSort, ServicesStackParamList } from '../../types';
import { makeStyles } from '../../theme/dynamic';

const SORTS: { key: ProfessionalSort; label: string }[] = [
  { key: 'nearest', label: 'Mais próximo' },
  { key: 'rating', label: 'Melhor avaliado' },
  { key: 'price', label: 'Menor preço' },
];

export function ProfessionalListScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<ServicesStackParamList, 'ProfessionalList'>>();
  const [sort, setSort] = useState<ProfessionalSort>('nearest');
  const list = useRequest(() => api.catalog.professionals({ categoryId: params.categoryId, sort }), [params.categoryId, sort]);

  return (
    <Screen
      title={params.categoryName}
      loading={list.loading && !list.data}
      error={list.error}
      onRetry={list.refetch}
      refreshing={list.refreshing}
      onRefresh={list.refresh}
    >
      <View style={styles.chips}>
        {SORTS.map((s) => (
          <Chip key={s.key} label={s.label} selected={sort === s.key} onPress={() => setSort(s.key)} />
        ))}
      </View>
      {(list.data ?? []).map((pro) => (
        <ProfessionalCard
          key={pro.id}
          name={pro.name}
          profession={pro.specialty}
          avatarEmoji={pro.emoji}
          rating={pro.reviewsCount > 0 ? pro.rating : undefined}
          reviewsCount={pro.reviewsCount > 0 ? pro.reviewsCount : undefined}
          location={`${pro.distanceKm.toFixed(1).replace('.', ',')} km`}
          priceLabel={`R$ ${pro.hourlyRate}/h`}
          verified={pro.verified}
          onPress={() => navigation.navigate('ProfessionalProfile', { professionalId: pro.id })}
        />
      ))}
      {list.data && list.data.length === 0 ? (
        <EmptyState emoji="🧰" title="Nenhum profissional por aqui" message="Ainda não há profissionais nesta categoria. Volte em breve!" />
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
}));
