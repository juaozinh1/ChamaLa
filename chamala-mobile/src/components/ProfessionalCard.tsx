import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { colors, radius, spacing, typography } from '../theme';

type ProfessionalCardProps = {
  name: string;
  /** Especialidade. Ex.: "Limpeza residencial" */
  profession: string;
  avatarUrl?: string;
  /** Emoji do avatar enquanto não há foto. Ex.: "👨" */
  avatarEmoji?: string;
  /** Nota média, de 0 a 5. */
  rating?: number;
  reviewsCount?: number;
  /** Distância ou bairro. Ex.: "1,2 km" */
  location?: string;
  /** Preço no canto superior direito. Ex.: "R$ 80/h" */
  priceLabel?: string;
  /** Profissional verificado (selo dourado). */
  verified?: boolean;
  onPress?: () => void;
};

export function ProfessionalCard({
  name,
  profession,
  avatarUrl,
  avatarEmoji,
  rating,
  reviewsCount,
  location,
  priceLabel,
  verified = false,
  onPress,
}: ProfessionalCardProps) {
  const label = [
    name,
    profession,
    rating !== undefined ? `nota ${rating.toFixed(1)}` : null,
    reviewsCount !== undefined ? `${reviewsCount} avaliações` : null,
    location,
    priceLabel,
    verified ? 'verificado' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Card onPress={onPress} accessibilityLabel={label}>
      <View style={styles.row}>
        <Avatar name={name} uri={avatarUrl} emoji={avatarEmoji} size={AVATAR} />

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {verified ? (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.gold}
                  style={styles.verified}
                />
              ) : null}
            </View>
            {priceLabel ? <Text style={styles.price}>{priceLabel}</Text> : null}
          </View>

          <Text style={styles.profession} numberOfLines={1}>
            {profession}
          </Text>

          <View style={styles.metaRow}>
            {rating !== undefined ? (
              <View style={styles.meta}>
                <Ionicons name="star" size={14} color={colors.goldBright} />
                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                {reviewsCount !== undefined ? (
                  <Text style={styles.metaText}>({reviewsCount})</Text>
                ) : null}
              </View>
            ) : null}
            {rating !== undefined && location ? <View style={styles.dot} /> : null}
            {location ? <Text style={styles.metaText}>{location}</Text> : null}
          </View>
        </View>
      </View>
    </Card>
  );
}

const AVATAR = 56;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  body: { flex: 1, marginLeft: spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nameRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  name: { ...typography.subtitle, color: colors.text, flexShrink: 1 },
  verified: { marginLeft: spacing.xs },
  price: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  profession: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center' },
  rating: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  metaText: { ...typography.caption, color: colors.textMuted, marginLeft: spacing.xs },
  dot: {
    width: 4,
    height: 4,
    borderRadius: radius.pill,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.border,
  },
});
