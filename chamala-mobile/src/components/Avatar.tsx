import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { Text } from './Text';

import { makeStyles } from '../theme/dynamic';

type AvatarProps = {
  name?: string;
  /** Foto. Tem prioridade sobre emoji e inicial. */
  uri?: string;
  /** Emoji sobre fundo azul-claro (listas de profissionais). */
  emoji?: string;
  size?: number;
  /** Bolinha no canto (ex.: dourada para verificação pendente). */
  indicatorColor?: string;
};

export function Avatar({ name = '', uri, emoji, size = 56, indicatorColor }: AvatarProps) {
  const styles = useStyles();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  const round = { width: size, height: size, borderRadius: size / 2 };
  const dot = Math.max(10, Math.round(size * 0.2));

  return (
    <View
      style={round}
      accessibilityRole="image"
      accessibilityLabel={name ? `Foto de ${name}` : 'Foto de perfil'}
    >
      {uri && !failed ? (
        <Image source={{ uri }} style={round} onError={() => setFailed(true)} />
      ) : emoji ? (
        <View style={[round, styles.center, styles.emojiBg]}>
          <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
        </View>
      ) : (
        <View style={[round, styles.center, styles.initialBg]}>
          <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
            {name.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      {indicatorColor ? (
        <View
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: indicatorColor,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  center: { alignItems: 'center', justifyContent: 'center' },
  emojiBg: { backgroundColor: colors.infoBg },
  initialBg: { backgroundColor: colors.primary },
  initial: { color: colors.surface, fontWeight: '700' },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.background,
  },
}));
