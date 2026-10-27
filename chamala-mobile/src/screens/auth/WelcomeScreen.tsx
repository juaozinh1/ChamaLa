import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: welcome).
export function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'Welcome'>) {
  return (
    <ScreenPlaceholder
      title="Bem-vindo ao ChamaLÁ"
      figmaScreen="welcome"
      description="Escolha entre entrar, criar conta de cliente ou se cadastrar como profissional."
      actions={[
        { label: 'Entrar', onPress: () => navigation.navigate('Login') },
        {
          label: 'Criar conta',
          onPress: () => navigation.navigate('Register'),
          variant: 'secondary',
        },
        {
          label: 'Sou profissional',
          onPress: () => navigation.navigate('ProRegister'),
          variant: 'secondary',
        },
      ]}
    />
  );
}
