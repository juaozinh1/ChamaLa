import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export const globalStyles = StyleSheet.create({
  // ==========================================
  // Containers & Layouts
  // ==========================================
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  centeredContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowGapSm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowGapMd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  // ==========================================
  // Headers & Brand
  // ==========================================
  headerBlock: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  headerLeftBlock: {
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  titleLeft: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  subtitleLeft: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // ==========================================
  // Cards & Boxes
  // ==========================================
  cardBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardHighlight: {
    backgroundColor: colors.infoBg,
    borderColor: colors.primary,
  },

  // ==========================================
  // Formulários & Campos
  // ==========================================
  formSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  formActions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldHalf: {
    flex: 1,
  },

  // ==========================================
  // Seções da Home & Listagens
  // ==========================================
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  sectionLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  horizontalChipsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  // ==========================================
  // Map & Media Blocks (Leaflet)
  // ==========================================
  mapContainer: {
    height: 260,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },

  // ==========================================
  // Badges & Distâncias
  // ==========================================
  distanceTag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  distanceText: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.textMuted,
  },

  // ==========================================
  // Rodapés & Alternadores de tela
  // ==========================================
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
});