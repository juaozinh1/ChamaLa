import axios from 'axios';
import { Platform } from 'react-native';

// Se estiver rodando no navegador do PC, usa localhost na porta 8085
// Se for emulador Android, usa 10.0.2.2 na porta 8085
const BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:8085'
  : 'http://10.0.2.2:8085';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}); 