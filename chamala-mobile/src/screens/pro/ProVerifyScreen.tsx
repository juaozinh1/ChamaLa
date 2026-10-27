import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ProTabParamList } from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: pro-verify).
export function ProVerifyScreen({
  navigation,
}: BottomTabScreenProps<ProTabParamList, 'ProVerifyTab'>) {
  return (
    <ScreenPlaceholder
      title="Verificação de identidade"
      figmaScreen="pro-verify"
      description="Etapa 2 de 2: selfie, documento frente e verso, certificado, até 6 fotos de trabalhos e bio."
      actions={[
        { label: 'Enviar verificação', onPress: () => navigation.navigate('ProHomeTab') },
      ]}
    />
  );
}
