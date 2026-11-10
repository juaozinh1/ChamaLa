import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success';

export interface AlertBannerProps {
  message: string;
  variant?: AlertVariant;
}

export const AlertBanner = ({ message, variant = 'info' }: AlertBannerProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          container: styles.errorContainer,
          text: styles.errorText,
        };
      case 'warning':
        return {
          container: styles.warningContainer,
          text: styles.warningText,
        };
      case 'success':
        return {
          container: styles.successContainer,
          text: styles.successText,
        };
      case 'info':
      default:
        return {
          container: styles.infoContainer,
          text: styles.infoText,
        };
    }
  };

  const currentStyle = getVariantStyles();

  return (
    <View style={[styles.container, currentStyle.container]}>
      <Text style={[styles.message, currentStyle.text]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  message: {
    ...typography.caption,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: colors.infoBg,
    borderColor: colors.border,
  },
  infoText: {
    color: colors.text,
  },
  warningContainer: {
    backgroundColor: colors.warningBg,
    borderColor: colors.gold,
  },
  warningText: {
    color: colors.text,
  },
  errorContainer: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
  },
  successContainer: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  successText: {
    color: colors.success,
  },
});