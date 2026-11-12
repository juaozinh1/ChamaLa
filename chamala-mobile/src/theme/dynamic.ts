import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import type { Colors } from './index';

/** Paleta atual: normal ou de alto contraste, conforme a tela Acessibilidade. */
export const useColors = (): Colors => useAccessibility().colors;

/**
 * Cria estilos que acompanham a paleta atual.
 *
 *   const useStyles = makeStyles((colors) => ({ box: { backgroundColor: colors.surface } }));
 *   function Box() { const styles = useStyles(); return <View style={styles.box} />; }
 *
 * Fica fora do `theme/index.ts` de propósito, para não criar dependência circular com o contexto.
 */
type Style = ViewStyle | TextStyle | ImageStyle;

export function makeStyles<T extends Record<string, Style>>(factory: (colors: Colors) => T) {
  return function useStyles(): T {
    const colors = useColors();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
