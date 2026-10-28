import { View, Text } from 'react-native';
import { colors, typography } from './src/theme';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={[typography.title, { color: colors.primary }]}>ServiçoJá</Text>
    </View>
  );
}