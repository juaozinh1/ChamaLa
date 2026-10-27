import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientHomeStackParamList,
  ClientTabParamList,
} from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: categories).
export function CategoriesScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientHomeStackParamList, 'Categories'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  return (
    <ScreenPlaceholder
      title="Serviços"
      figmaScreen="categories"
      description="Lista e busca das 8 categorias."
      actions={[
        {
          label: 'Abrir Elétrica',
          onPress: () => navigation.navigate('CategoryDetail', { categoryId: 2 }),
        },
      ]}
    />
  );
}
