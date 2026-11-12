import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { getErrorMessage } from '../utils/errors';

/**
 * Executa uma ação assíncrona (salvar, aceitar, cancelar...) com estado de loading e aviso de erro.
 * Devolve [run, loading]; `run` resolve true se deu certo e false se falhou.
 */
export function useAction<A extends unknown[]>(
  action: (...args: A) => Promise<unknown>,
  errorTitle = 'Não foi possível concluir',
) {
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const actionRef = useRef(action);
  actionRef.current = action;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (...args: A): Promise<boolean> => {
      setLoading(true);
      try {
        await actionRef.current(...args);
        return true;
      } catch (e) {
        Alert.alert(errorTitle, getErrorMessage(e));
        return false;
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [errorTitle],
  );

  return [run, loading] as const;
}
