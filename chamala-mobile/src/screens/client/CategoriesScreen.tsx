import { useState } from 'react';
import { View } from 'react-native';
import { CategoryCard, EmptyState, Screen, SearchInput } from '../../components';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing } from '../../theme';
import type { Category } from '../../types';
import { makeStyles } from '../../theme/dynamic';

export function CategoriesScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const [query, setQuery] = useState('');
  const categories = useRequest(() => api.catalog.categories());

  const filtered = (categories.data ?? []).filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const rows: Category[][] = [];
  for (let i = 0; i < filtered.length; i += 2) rows.push(filtered.slice(i, i + 2));

  const open = (category: Category) =>
    navigation.navigate('ClientTabs', {
      screen: 'Services',
      params: { screen: 'ProfessionalList', params: { categoryId: category.id, categoryName: category.name } },
    });

  return (
    <Screen
      large
      title="Categorias de Serviço"
      loading={categories.loading && !categories.data}
      error={categories.error}
      onRetry={categories.refetch}
      refreshing={categories.refreshing}
      onRefresh={categories.refresh}
    >
      <SearchInput placeholder="Buscar categoria..." value={query} onChangeText={setQuery} />
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((category) => (
            <CategoryCard key={category.id} category={category} onPress={() => open(category)} />
          ))}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
      {filtered.length === 0 ? <EmptyState emoji="🔍" title="Nenhuma categoria encontrada" message="Tente buscar por outro nome." /> : null}
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  row: { flexDirection: 'row', gap: spacing.md },
  spacer: { flex: 1 },
}));
