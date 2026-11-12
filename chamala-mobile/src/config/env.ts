// Configuração do app. Para ligar ao back-end: defina EXPO_PUBLIC_API_URL no arquivo .env
// e mude USE_MOCKS para false (ou defina EXPO_PUBLIC_USE_MOCKS=false).
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
export const USE_MOCKS = (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') !== 'false';

// Nome do app em um único lugar (ainda não decidido: ChamaLÁ ou ServiçoJá).
export const APP_NAME = 'ChamaLÁ';
export const APP_SLOGAN = 'A solução rápida para as demandas do seu lar.';

// Contatos de suporte: PLACEHOLDERS, trocar pelos reais antes de publicar.
export const SUPPORT_EMAIL = 'suporte@exemplo.com.br';
export const SUPPORT_WHATSAPP = '5581999999999';

// Regras de negócio assumidas a partir do Figma (confirmar com o back).
export const PROMO_DISCOUNT_PERCENT = 20; // desconto exibido no resumo do agendamento por hora
export const TIME_SLOTS = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'];
export const DEFAULT_POLICY = { freeCancelHours: 24, penaltyPercent: 15, depositPercent: 0 };