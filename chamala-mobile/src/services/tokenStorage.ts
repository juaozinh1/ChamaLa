import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth.token';

// Token de acesso guardado de forma segura (Keychain no iOS, Keystore no Android).
export const tokenStorage = {
  async get(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  async set(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      /* sem token guardado */
    }
  },
};
