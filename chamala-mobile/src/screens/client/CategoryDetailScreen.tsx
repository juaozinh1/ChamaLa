import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientHomeStackParamList,
  ClientTabParamList,
} from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: category-detail).
export function CategoryDetailScreen({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientHomeStackParamList, 'CategoryDetail'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  // route.params.categoryId: categoria selecionada
  void route.params.categoryId;
  return (
    <ScreenPlaceholder
      title="Profissionais da categoria"
      figmaScreen="category-detail"
      description="Profissionais da categoria ordenados por distância e nota."
      actions={[
        {
          label: 'Ver profissional',
          onPress: () => navigation.navigate('Provider', { professionalId: 'demo' }),
        },
        { label: 'Voltar', onPress: () => navigation.goBack(), variant: 'secondary' },
      ]}
    />
  );
}
