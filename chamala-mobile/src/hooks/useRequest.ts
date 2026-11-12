import { DependencyList, useCallback, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getErrorMessage } from '../utils/errors';

/**
 * Busca dados ao abrir a tela e de novo sempre que ela volta ao foco (por exemplo, ao voltar
 * de uma tela que alterou um pedido). Só mostra o indicador de carregamento na primeira busca.
 */
export function useRequest<T>(fetcher: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const mounted = useRef(true);
  const hasData = useRef(false);
  const lastKey = useRef('');

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (silent: boolean) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (!mounted.current) return;
      hasData.current = true;
      setData(result);
    } catch (e) {
      if (mounted.current) setError(getErrorMessage(e));
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const key = JSON.stringify(deps);
  useFocusEffect(
    useCallback(() => {
      const changed = lastKey.current !== key;
      lastKey.current = key;
      void run(hasData.current && !changed);
    }, [run, key]),
  );

  return {
    data,
    loading,
    refreshing,
    error,
    setData,
    refetch: () => run(false),
    /** Atualiza sem mostrar o indicador de carregamento (depois de aceitar, recusar etc.). */
    refetchSilent: () => run(true),
    refresh: () => {
      setRefreshing(true);
      return run(true);
    },
  };
}
