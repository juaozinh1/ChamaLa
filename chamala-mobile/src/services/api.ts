import axios from 'axios';
import { Platform } from 'react-native';

// Endereço da API (porta 8085):
// - Navegador do PC (npm run web): sempre http://localhost:8085.
// - Celular ou emulador: EXPO_PUBLIC_API_URL do .env. Sem ele, usa
//   http://10.0.2.2:8085, que é o "localhost do PC" visto pelo emulador Android.
//   Celular físico: coloque o IP do PC na rede, ex. http://192.168.0.10:8085.
const ENV_URL = process.env.EXPO_PUBLIC_API_URL?.trim();

const BASE_URL =
  Platform.OS === 'web' ? 'http://localhost:8085' : ENV_URL || 'http://10.0.2.2:8085';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
