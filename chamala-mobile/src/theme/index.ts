export const colors = {
  primary: '#1E3A5F', // azul-marinho: botões, aba ativa
  gold: '#B8860B', // dourado: verificação, destaque
  goldBright: '#F0A500', // estrelas de avaliação
  background: '#F5F0E8', // fundo creme
  surface: '#FFFFFF', // cards
  border: '#DCD5CC',
  text: '#111111',
  textMuted: '#5E5A54',
  infoBg: '#E8F4FD', // badge "Confirmado", avisos
  warningBg: '#FFF8E1', // banner "Pendente"
  danger: '#C62828', // cancelar
  success: '#2E7D32',
  successBg: '#E8F5E9', // badge de sucesso
  dangerBg: '#FDECEA', // badge de erro/cancelado
  overlay: 'rgba(0, 0, 0, 0.5)', // fundo escuro do Select
  // Tokens adicionados com o modo de alto contraste:
  warningText: '#7A5B00', // texto sobre fundo amarelo claro
  infoBorder: '#BFD3E6',
  warningBorder: '#E6D58A',
  dangerBorder: '#EDB9B6',
  successBorder: '#B9DDBC',
  
};

/** Tipo de uma paleta de cores (a normal e a de alto contraste têm os mesmos nomes). */
export type Colors = typeof colors;

// Modo de alto contraste (tela Acessibilidade): fundo branco, texto quase preto, contornos escuros
// e dourado mais escuro para o texto ter contraste suficiente. Base medida no Figma.
export const highContrastColors: Colors = {
  primary: '#102A4C',
  gold: '#8A6400',
  goldBright: '#B26A00',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#6B6B6B',
  text: '#000000',
  textMuted: '#2F2F2F',
  infoBg: '#E8F4FD',
  warningBg: '#FFF8E1',
  danger: '#B00020',
  success: '#1B5E20',
  successBg: '#E8F5E9',
  dangerBg: '#FDECEA',
  overlay: 'rgba(0, 0, 0, 0.7)',
  warningText: '#5C4400',
  infoBorder: '#3B5F8A',
  warningBorder: '#8A6400',
  dangerBorder: '#B00020',
  successBorder: '#1B5E20',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};

// Tela de Acessibilidade do protótipo: três tamanhos de texto.
export type TextSize = 'normal' | 'large' | 'extra-large';
export const textScale: Record<TextSize, number> = {
  normal: 1,
  large: 1.15,
  'extra-large': 1.3,
};

// Alvo mínimo de toque (RNF07).
export const minTouchTarget = 44;