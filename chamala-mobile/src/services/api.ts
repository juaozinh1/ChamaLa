import { create } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const ACCESS_TOKEN_KEY = 'chamala.accessToken';

// Defina EXPO_PUBLIC_API_URL no arquivo .env (veja .env.example).
// No emulador Android, o localhost do computador é http://10.0.2.2:8080.
export const api = create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/v1`,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
