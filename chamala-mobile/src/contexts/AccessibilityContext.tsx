import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Colors, colors, highContrastColors, TextSize, textScale } from '../theme';

const SIZE_KEY = 'a11y.textSize';
const CONTRAST_KEY = 'a11y.highContrast';

type AccessibilityContextValue = {
  textSize: TextSize;
  /** Fator de escala do texto (1, 1.15 ou 1.3). */
  scale: number;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  /** Paleta atual (normal ou alto contraste). */
  colors: Colors;
};

const AccessibilityContext = createContext<AccessibilityContextValue>({
  textSize: 'normal',
  scale: 1,
  setTextSize: () => {},
  highContrast: false,
  setHighContrast: () => {},
  colors,
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [textSize, setSize] = useState<TextSize>('normal');
  const [highContrast, setContrast] = useState(false);

  // Restaura as preferências guardadas.
  useEffect(() => {
    SecureStore.getItemAsync(SIZE_KEY)
      .then((saved) => {
        if (saved === 'normal' || saved === 'large' || saved === 'extra-large') setSize(saved);
      })
      .catch(() => {});
    SecureStore.getItemAsync(CONTRAST_KEY)
      .then((saved) => setContrast(saved === '1'))
      .catch(() => {});
  }, []);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      textSize,
      scale: textScale[textSize],
      setTextSize: (size) => {
        setSize(size);
        SecureStore.setItemAsync(SIZE_KEY, size).catch(() => {});
      },
      highContrast,
      setHighContrast: (enabled) => {
        setContrast(enabled);
        SecureStore.setItemAsync(CONTRAST_KEY, enabled ? '1' : '0').catch(() => {});
      },
      colors: highContrast ? highContrastColors : colors,
    }),
    [textSize, highContrast],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export const useAccessibility = () => useContext(AccessibilityContext);
/** Fator de escala do texto escolhido na tela Acessibilidade (1, 1.15 ou 1.3). */
export const useTextScale = () => useContext(AccessibilityContext).scale;
