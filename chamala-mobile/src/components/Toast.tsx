import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import type { IoniconName } from './icon';

export type ToastTone = 'danger' | 'success' | 'info';

const TONES: Record<
  ToastTone,
  { bg: string; border: string; fg: string; icon: IoniconName }
> = {
  danger: {
    bg: colors.dangerBg,
    border: colors.danger,
    fg: colors.danger,
    icon: 'alert-circle',
  },
  success: {
    bg: colors.successBg,
    border: colors.success,
    fg: colors.success,
    icon: 'checkmark-circle',
  },
  info: {
    bg: colors.infoBg,
    border: colors.primary,
    fg: colors.primary,
    icon: 'information-circle',
  },
};

const DURATION_MS = 4000;
const ANIM_MS = 180;
const useNativeDriver = Platform.OS !== 'web';

type ToastProps = {
  message: string;
  tone: ToastTone;
  /** Distância do topo da tela (abaixo do ScreenHeader, por padrão). */
  top: number;
  onHide: () => void;
};

/**
 * Aviso flutuante que aparece sobre a tela e some sozinho em 4 s (ou ao tocar).
 * Visual do card de alerta da folha "09 · Cancelar pedido" do Figma.
 */
function Toast({ message, tone, top, onHide }: ToastProps) {
  const [anim] = useState(() => new Animated.Value(0));
  const t = TONES[tone];

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: ANIM_MS, useNativeDriver }).start();
    const timer = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: ANIM_MS, useNativeDriver }).start(
        ({ finished }) => finished && onHide(),
      );
    }, DURATION_MS);
    return () => clearTimeout(timer);
  }, [anim, onHide]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrap, { top, opacity: anim, transform: [{ translateY }] }]}
    >
      <Pressable
        onPress={onHide}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
        accessibilityHint="Toque para fechar"
        style={[styles.card, { backgroundColor: t.bg, borderColor: t.border }]}
      >
        <Ionicons name={t.icon} size={22} color={t.fg} />
        <Text style={[styles.text, { color: t.fg }]}>{message}</Text>
        <Ionicons name="close" size={18} color={t.fg} />
      </Pressable>
    </Animated.View>
  );
}

/**
 * const { toast, showToast } = useToast();
 * showToast('Informe a descrição.');  // e renderize {toast} por último no View raiz da tela.
 */
export function useToast({ top = 68 }: { top?: number } = {}) {
  const [current, setCurrent] = useState<{
    id: number;
    message: string;
    tone: ToastTone;
  } | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = 'danger') => {
    setCurrent({ id: Date.now(), message, tone });
  }, []);
  const hideToast = useCallback(() => setCurrent(null), []);

  const toast = current ? (
    <Toast
      key={current.id}
      message={current.message}
      tone={current.tone}
      top={top}
      onHide={hideToast}
    />
  ) : null;

  return { toast, showToast, hideToast };
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
});
