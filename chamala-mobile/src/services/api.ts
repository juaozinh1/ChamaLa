import axios from 'axios';
import { Platform } from 'react-native';

// Para Web: localhost. Para Celular Físico/Expo Go: use o IP da sua máquina na rede (ex: http://192.168.1.15:8080)
const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8080' 
  : 'http://192.168.1.15:8080'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});