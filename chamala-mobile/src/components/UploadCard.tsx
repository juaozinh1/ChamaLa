import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { IoniconName } from './icon';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

type UploadCardProps = {
  title: string;
  description?: string;
  /** Ícone do documento: 'person-outline' (selfie), 'id-card-outline' (frente)... */
  icon?: IoniconName;
  /** Mostra o asterisco vermelho de campo obrigatório. */
  required?: boolean;
  /** Nome do arquivo já escolhido. Se vazio, mostra o estado "sem arquivo". */
  fileName?: string;
  loading?: boolean;
  error?: string;
  /** Versão de meia largura (Frente / Verso): só o título, sem descrição. */
  compact?: boolean;
  /** Chamado ao tocar para escolher/trocar o arquivo (aqui entra a câmera ou o seletor). */
  onPick: () => void;
  onRemove?: () => void;
};

export function UploadCard({
  title,
  description,
  icon = 'cloud-upload-outline',
  required = false,
  fileName,
  loading = false,
  error,
  compact = false,
  onPick,
  onRemove,
}: UploadCardProps) {
  const hasFile = Boolean(fileName);
  const canRemove = hasFile && Boolean(onRemove);
  const subtitle = hasFile
    ? fileName
    : compact
      ? undefined
      : (description ?? 'Toque para enviar um arquivo');

  return (
    <View style={compact && styles.compactWrapper}>
      <View
        style={[styles.card, hasFile && styles.cardDone, error ? styles.cardError : null]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            hasFile
              ? `${title}: ${fileName}. Trocar arquivo`
              : `${title}${required ? ', obrigatório' : ''}. Enviar arquivo`
          }
          onPress={onPick}
          disabled={loading}
          style={({ pressed }) => [
            styles.main,
            compact ? styles.mainCompact : styles.mainFull,
            pressed && styles.pressed,
          ]}
        >
          <View style={[styles.iconBox, compact && styles.iconBoxCompact]}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons
                name={hasFile ? 'document-text' : icon}
                size={compact ? 22 : 26}
                color={hasFile ? colors.success : colors.primary}
              />
            )}
          </View>

          <View style={styles.body}>
            <Text style={compact ? styles.titleCompact : styles.title} numberOfLines={2}>
              {title}
              {required ? <Text style={styles.required}> *</Text> : null}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={compact ? 1 : 2}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {!hasFile ? (
            <View style={styles.plus}>
              <Ionicons name="add" size={22} color={colors.primary} />
            </View>
          ) : !canRemove ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          ) : null}
        </Pressable>

        {canRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remover ${title}`}
            onPress={onRemove}
            style={styles.remove}
          >
            <Ionicons name="close-circle" size={24} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  compactWrapper: { flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  cardDone: { borderStyle: 'solid', borderColor: colors.success },
  cardError: { borderColor: colors.danger },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  mainFull: { padding: spacing.lg },
  mainCompact: { padding: spacing.md },
  pressed: { opacity: 0.85 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.background,
  },
  iconBoxCompact: { width: 44, height: 44, marginRight: spacing.sm },
  body: { flex: 1 },
  title: { ...typography.body, fontWeight: '700', color: colors.text },
  titleCompact: { ...typography.caption, fontSize: 14, color: colors.textMuted },
  required: { color: colors.danger },
  subtitle: { ...typography.caption, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  plus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.background,
  },
  remove: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
});
