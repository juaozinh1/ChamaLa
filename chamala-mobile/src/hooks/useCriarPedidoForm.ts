import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { resumoDosErros, type FieldErrors } from './useFieldErrors';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export type CampoPedido = 'categoria' | 'data' | 'hora' | 'descricao' | 'localizacao';

type Options = {
  currentClientId?: string;
  /** Recebe as mensagens de erro (validação, limite de fotos, API) para exibir num toast. */
  onError?: (message: string) => void;
};

const DATA_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Agendamento: data futura, em dia útil, entre 08:00 e 18:00. */
function validarAgendamento(dataBr: string, horaStr: string): FieldErrors<CampoPedido> {
  const erros: FieldErrors<CampoPedido> = {};

  if (!dataBr) erros.data = 'Informe a data.';
  else if (!DATA_REGEX.test(dataBr)) erros.data = 'Use o formato DD/MM/AAAA.';

  if (!horaStr) erros.hora = 'Informe o horário.';
  else if (!HORA_REGEX.test(horaStr)) erros.hora = 'Use o formato HH:MM.';

  if (erros.data || erros.hora) return erros;

  const [, d, m, a] = dataBr.match(DATA_REGEX)!;
  const dia = Number(d);
  const mes = Number(m);
  const ano = Number(a);
  const [hora, minuto] = horaStr.split(':').map(Number);
  const alvo = new Date(ano, mes - 1, dia, hora, minuto, 0);

  if (
    mes < 1 ||
    mes > 12 ||
    alvo.getFullYear() !== ano ||
    alvo.getMonth() !== mes - 1 ||
    alvo.getDate() !== dia
  ) {
    erros.data = 'Essa data não existe no calendário.';
  } else if (alvo.getTime() <= Date.now()) {
    erros.data = 'Escolha uma data e horário futuros.';
  } else if (alvo.getDay() === 0 || alvo.getDay() === 6) {
    erros.data = 'Atendemos só em dias úteis (segunda a sexta).';
  }

  const minutos = hora * 60 + minuto;
  if (minutos < 8 * 60 || minutos > 18 * 60) {
    erros.hora = 'Escolha um horário entre 08:00 e 18:00.';
  }

  return erros;
}

export function useCriarPedidoForm({ currentClientId, onError }: Options = {}) {
  const [categoriaId, setCategoriaIdState] = useState<string | null>(null);
  const [descricao, setDescricaoState] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [localizacao, setLocalizacaoState] = useState<LocationCoords | null>(null);

  // Agendamento obrigatório no padrão DD/MM/AAAA e HH:MM
  const [dataAgendada, setDataAgendadaState] = useState(''); // Ex: 12/11/2026
  const [horaAgendada, setHoraAgendadaState] = useState(''); // Ex: 10:30

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CampoPedido>>({});

  const clearFieldError = useCallback((campo: CampoPedido) => {
    setFieldErrors((prev) => (prev[campo] ? { ...prev, [campo]: undefined } : prev));
  }, []);

  // Cada setter tira o realce do próprio campo quando a pessoa corrige.
  const setCategoriaId = (v: string | null) => {
    setCategoriaIdState(v);
    clearFieldError('categoria');
  };
  const setDescricao = (v: string) => {
    setDescricaoState(v);
    clearFieldError('descricao');
  };
  const setLocalizacao = (v: LocationCoords | null) => {
    setLocalizacaoState(v);
    clearFieldError('localizacao');
  };
  const setDataAgendada = (v: string) => {
    setDataAgendadaState(v);
    clearFieldError('data');
  };
  const setHoraAgendada = (v: string) => {
    setHoraAgendadaState(v);
    clearFieldError('hora');
  };

  const handleAddPhoto = (uri: string) => {
    if (fotos.length >= 5) {
      onError?.('Limite máximo de 5 fotos atingido.');
      return;
    }
    setFotos((prev) => [...prev, uri]);
  };

  const handleRemovePhoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validarFormulario = (): FieldErrors<CampoPedido> => ({
    ...(categoriaId ? {} : { categoria: 'Selecione uma categoria de serviço.' }),
    ...validarAgendamento(dataAgendada.trim(), horaAgendada.trim()),
    ...(descricao.trim() ? {} : { descricao: 'Descreva o serviço que você precisa.' }),
    ...(localizacao
      ? {}
      : { localizacao: 'Toque no mapa para marcar o local do atendimento.' }),
  });

  const handleSubmit = async (onSuccess: () => void) => {
    const erros = validarFormulario();
    setFieldErrors(erros);
    const resumo = resumoDosErros(erros);
    if (resumo) {
      onError?.(resumo);
      return;
    }

    try {
      setSubmitting(true);

      let resolvedClientId = currentClientId;

      if (!resolvedClientId) {
        const storedUserJson = await AsyncStorage.getItem('@chamala:user');
        if (storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          resolvedClientId = storedUser.id;
        }
      }

      if (!resolvedClientId) {
        onError?.('Sessão expirada. Faça login novamente.');
        return;
      }

      const generatedTitle =
        descricao.length > 40
          ? `${descricao.substring(0, 37).trim()}...`
          : descricao.trim();

      const [dia, mes, ano] = dataAgendada.trim().split('/');
      const [hora, min] = horaAgendada.trim().split(':');
      const scheduledAtIso = `${ano}-${mes}-${dia}T${hora}:${min}:00-03:00`;

      const payload = {
        clientId: resolvedClientId,
        title: generatedTitle,
        description: descricao.trim(),
        categoryId: Number(categoriaId),
        scheduledAt: scheduledAtIso,
        latitude: localizacao!.lat,
        longitude: localizacao!.lng,
        addressReference: 'Localização selecionada no mapa',
        photos: fotos,
      };

      await api.post('/api/v1/orders', payload);
      onSuccess();
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Falha ao registrar pedido no servidor.';
      onError?.(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    categoriaId,
    setCategoriaId,
    descricao,
    setDescricao,
    fotos,
    handleAddPhoto,
    handleRemovePhoto,
    localizacao,
    setLocalizacao,
    dataAgendada,
    setDataAgendada,
    horaAgendada,
    setHoraAgendada,
    submitting,
    fieldErrors,
    handleSubmit,
  };
}
