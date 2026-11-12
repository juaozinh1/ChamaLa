import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { useTextScale } from '../contexts/AccessibilityContext';

/**
 * Text do app: aplica a escala de tamanho escolhida na tela Acessibilidade (normal, grande,
 * extra grande). Use este em vez do Text do react-native.
 * Textos aninhados sem fontSize próprio herdam o tamanho do texto pai, já escalado.
 */
export function Text({ style, ...rest }: TextProps) {
  const scale = useTextScale();
  if (scale === 1) return <RNText style={style} {...rest} />;

  const flat = StyleSheet.flatten(style) ?? {};
  if (!flat.fontSize) return <RNText style={style} {...rest} />;

  return (
    <RNText
      {...rest}
      style={[
        flat,
        { fontSize: flat.fontSize * scale },
        flat.lineHeight ? { lineHeight: flat.lineHeight * scale } : null,
      ]}
    />
  );
}
