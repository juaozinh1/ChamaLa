export const colors = {
  primary: '#243A5E', // azul-marinho (botões, tab ativa)
  gold: '#B8892B', // dourado (verificação, destaque)
  background: '#F3EFE9', // bege de fundo
  surface: '#FFFFFF', // cards
  border: '#E0DAD2',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
  infoBg: '#E8F1FA', // badge "Confirmado", avisos
  warningBg: '#FDF5DD', // banner "Pendente"
  danger: '#C62828', // cancelar
  success: '#2E7D32', // desconto
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },};