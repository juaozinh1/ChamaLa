// Design tokens do protótipo ChamaLÁ no Figma Make (src/App.tsx).
// Os nomes vêm do tema original do repositório; os valores foram alinhados ao Figma.
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
  successBg: '#E8F5E9',            // badge de sucesso
  dangerBg: '#FDECEA',             // badge de erro/cancelado
  overlay: 'rgba(0, 0, 0, 0.5)',   // fundo escuro do Select
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
