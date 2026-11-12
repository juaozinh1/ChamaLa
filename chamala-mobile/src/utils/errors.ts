import axios from 'axios';

/** Extrai uma mensagem amigável de qualquer erro (Axios, Error ou texto). */
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (!error.response) return 'Sem conexão com o servidor. Verifique sua internet.';
    return fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
