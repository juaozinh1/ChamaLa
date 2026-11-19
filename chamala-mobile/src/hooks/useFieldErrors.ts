import { useCallback, useState } from 'react';

export type FieldErrors<F extends string> = Partial<Record<F, string>>;

/** Erros por campo de um formulário. clearError(campo) tira o realce quando a pessoa corrige. */
export function useFieldErrors<F extends string>() {
  const [errors, setErrors] = useState<FieldErrors<F>>({});

  const clearError = useCallback((field: F) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  return { errors, setErrors, clearError };
}

/** Texto do toast: a própria mensagem quando há um erro, ou um resumo quando há vários. */
export function resumoDosErros<F extends string>(errors: FieldErrors<F>): string | null {
  const mensagens = Object.values(errors).filter(Boolean) as string[];
  if (mensagens.length === 0) return null;
  if (mensagens.length === 1) return mensagens[0];
  return `Preencha os ${mensagens.length} campos destacados.`;
}
