import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget, spacing } from '../theme';
import type { IoniconName } from './icon';

export type FeedbackTone = 'success' | 'danger' | 'info';

export type FeedbackAction = {
  label: string;
  onPress: () => void;
  /** primary = azul sólido; secondary = contorno cinza; danger = contorno vermelho (Figma › Button). */
  variant?: 'primary' | 'secondary' | 'danger';
};

type FeedbackSheetProps = {
  visible: boolean;
  tone?: FeedbackTone;
  title: string;
  /** Destaque do card colorido, ex.: "Pedido publicado". */
  headline?: string;
  message: string;
  actions: FeedbackAction[];
  /** Fechar tocando fora ou no "voltar" do Android. Sem isso, a folha só fecha pelas ações. */
  onDismiss?: () => void;
};

const TONES: Record<FeedbackTone, { bg: string; fg: string; icon: IoniconName }> = {
  success: { bg: colors.successBg, fg: colors.success, icon: 'checkmark-circle' },
  danger: { bg: colors.dangerBg, fg: colors.danger, icon: 'alert-circle' },
  info: { bg: colors.infoBg, fg: colors.primary, icon: 'information-circle' },
};

/**
 * Folha inferior de confirmação/aviso. Segue a "BottomSheet" da tela
 * 09 · Cancelar pedido do Figma (overlay, alça, título, card colorido, botões).
 * Substitui o Alert.alert, que não aparece no app web.
 */
export function FeedbackSheet({
  visible,
  tone = 'success',
  title,
  headline,
  message,
  actions,
  onDismiss,
}: FeedbackSheetProps) {
  const t = TONES[tone];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss ?? (() => {})}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.overlay}
          onPress={onDismiss}
          accessibilityLabel={onDismiss ? 'Fechar' : undefined}
          disabled={!onDismiss}
        />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.grabber} />
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>

          <View style={[styles.card, { backgroundColor: t.bg }]}>
            <Ionicons name={t.icon} size={24} color={t.fg} />
            <View style={styles.cardText}>
              {headline ? (
                <Text style={[styles.headline, { color: t.fg }]}>{headline}</Text>
              ) : null}
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>

          {actions.map(({ label, onPress, variant = 'primary' }) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={onPress}
              style={({ pressed }) => [
                styles.button,
                BUTTONS[variant].box,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.buttonText, { color: BUTTONS[variant].text }]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const BUTTONS = {
  primary: { box: { backgroundColor: colors.primary }, text: colors.surface },
  secondary: {
    box: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    text: colors.primary,
  },
  danger: {
    box: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.danger },
    text: colors.danger,
  },
} as const;

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(18, 18, 18, 0.45)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: 14,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 28, color: colors.text },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
  },
  cardText: { flex: 1, gap: 6 },
  headline: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  message: { fontSize: 13, lineHeight: 18, color: colors.text },
  button: {
    minHeight: Math.max(48, minTouchTarget),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonText: { fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.85 },
});
