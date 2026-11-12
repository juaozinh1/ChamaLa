import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorView, LoadingView } from './StateViews';
import { minTouchTarget, spacing, typography } from '../theme';
import { makeStyles, useColors } from '../theme/dynamic';

type ScreenProps = {
  children?: ReactNode;
  /** Título. Com `large`, aparece grande e sem barra (telas das abas). */
  title?: string;
  large?: boolean;
  /** Mostra a seta de voltar. Padrão: true quando há para onde voltar e não é `large`. */
  back?: boolean;
  onBack?: () => void;
  headerRight?: ReactNode;
  /** Barra fixa de ações no rodapé (botões). */
  footer?: ReactNode;
  /** Conteúdo rolável (padrão). Use false para telas com lista própria (FlatList). */
  scroll?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Estrutura padrão de tela: cabeçalho (voltar + título), corpo com rolagem, teclado que não cobre
 * os campos, rodapé fixo com ações, e os estados de carregamento e erro.
 */
export function Screen({
  children,
  title,
  large = false,
  back,
  onBack,
  headerRight,
  footer,
  scroll = true,
  loading = false,
  error,
  onRetry,
  refreshing,
  onRefresh,
  contentStyle,
}: ScreenProps) {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const showBack = back ?? (!large && navigation.canGoBack());
  const handleBack = onBack ?? (() => navigation.goBack());
  const hasFooter = Boolean(footer) && !loading && !error;

  const body = loading ? (
    <LoadingView />
  ) : error ? (
    <ErrorView message={error} onRetry={onRetry} />
  ) : scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        {title && !large ? (
          <View style={styles.header}>
            {showBack ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                hitSlop={8}
                onPress={handleBack}
                style={styles.back}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
            ) : null}
            <Text style={styles.headerTitle} numberOfLines={1} accessibilityRole="header">
              {title}
            </Text>
            {headerRight}
          </View>
        ) : null}
        {title && large ? (
          <Text style={styles.largeTitle} accessibilityRole="header">
            {title}
          </Text>
        ) : null}

        {body}

        {hasFooter ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  back: {
    width: minTouchTarget,
    height: minTouchTarget,
    marginLeft: -spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.subtitle, flex: 1, color: colors.text },
  largeTitle: {
    ...typography.title,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
}));
