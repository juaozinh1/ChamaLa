import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, minTouchTarget, radius, spacing, textScale, typography } from '../theme';
import { useSession } from '../contexts/SessionContext';

export interface PlaceholderAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

interface Props {
  title: string;
  figmaScreen: string; // id da tela no protótipo, ex.: 'home'
  description: string;
  actions?: PlaceholderAction[];
}

// Tela provisória: reproduz a navegação do protótipo até a tela real ser implementada.
export function ScreenPlaceholder({
  title,
  figmaScreen,
  description,
  actions = [],
}: Props) {
  const { textSize } = useSession();
  const scale = textScale[textSize];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.title, styles.title, { fontSize: 24 * scale }]}>
          {title}
        </Text>
        <Text style={[typography.caption, styles.tag]}>Figma: {figmaScreen}</Text>
        <Text style={[typography.body, styles.body, { fontSize: 16 * scale }]}>
          {description}
        </Text>
        <View style={styles.actions}>
          {actions.map((action) => {
            const primary = action.variant !== 'secondary';
            return (
              <Pressable
                key={action.label}
                accessibilityRole="button"
                onPress={action.onPress}
                style={({ pressed }) => [
                  styles.button,
                  primary ? styles.buttonPrimary : styles.buttonSecondary,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    typography.button,
                    { color: primary ? colors.surface : colors.primary },
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  title: { color: colors.primary },
  tag: { color: colors.gold },
  body: { color: colors.textMuted },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  button: {
    minHeight: minTouchTarget + 4,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.7 },
});
