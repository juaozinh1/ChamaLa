import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ComponentShowcase } from './src/screens/ComponentShowcase';

// TEMPORÁRIO: mostra a tela de teste dos componentes. Será trocado pelo RootNavigator (FRONT-04).
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ComponentShowcase />
    </SafeAreaProvider>
  );
}
