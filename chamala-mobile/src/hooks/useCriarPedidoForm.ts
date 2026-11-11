import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export function useCriarPedidoForm(currentClientId?: string) {
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [localizacao, setLocalizacao] = useState<LocationCoords | null>(null);

  // Agendamento obrigatório no padrão DD/MM/AAAA e HH:MM
  const [dataAgendada, setDataAgendada] = useState(''); // Ex: 12/11/2026
  const [horaAgendada, setHoraAgendada] = useState(''); // Ex: 10:30

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPhoto = (uri: string) => {
    if (fotos.length >= 5) {
      setError('Limite máximo de 5 fotos atingido.');
      return;
    }
    setFotos((prev) => [...prev, uri]);
    setError(null);
  };

  const handleRemovePhoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validarHorarioComercial = (dataBr: string, horaStr: string): string | null => {
    const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!dataRegex.test(dataBr) || !horaRegex.test(horaStr)) {
      return 'Formato inválido. Use DD/MM/AAAA para data e HH:MM para horário (ex: 12/11/2026 e 10:30).';
    }

    const matchData = dataBr.match(dataRegex)!;
    const dia = Number(matchData[1]);
    const mes = Number(matchData[2]);
    const ano = Number(matchData[3]);

    const [hora, minuto] = horaStr.split(':').map(Number);

    if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
      return 'Data inválida.';
    }

    const dataHoraAlvo = new Date(ano, mes - 1, dia, hora, minuto, 0);

    if (
      dataHoraAlvo.getFullYear() !== ano ||
      dataHoraAlvo.getMonth() !== mes - 1 ||
      dataHoraAlvo.getDate() !== dia
    ) {
      return 'Data informada não existe no calendário.';
    }

    if (dataHoraAlvo.getTime() <= Date.now()) {
      return 'O agendamento deve ser para uma data e horário futuros.';
    }

    // 0 = Domingo, 6 = Sábado
    const diaSemana = dataHoraAlvo.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      return 'Agendamentos são restritos a dias úteis (segunda a sexta-feira).';
    }

    // Horário comercial: 08:00 às 18:00
    const minutosTotais = hora * 60 + minuto;
    const inicioComercial = 8 * 60; // 08:00
    const fimComercial = 18 * 60;   // 18:00

    if (minutosTotais < inicioComercial || minutosTotais > fimComercial) {
      return 'O horário de agendamento deve ser entre 08:00 e 18:00.';
    }

    return null;
  };

  const validarFormulario = () => {
    if (!categoriaId) return 'Selecione uma categoria de serviço.';
    if (!descricao.trim()) return 'Informe a descrição do serviço.';
    if (!localizacao) return 'Marque a localização do atendimento no mapa.';

    if (!dataAgendada.trim() || !horaAgendada.trim()) {
      return 'Informe a data e o horário para o agendamento.';
    }

    const erroComercial = validarHorarioComercial(dataAgendada.trim(), horaAgendada.trim());
    if (erroComercial) return erroComercial;

    return null;
  };

  const handleSubmit = async (onSuccess: () => void) => {
    const validacao = validarFormulario();
    if (validacao) {
      setError(validacao);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let resolvedClientId = currentClientId;

      if (!resolvedClientId) {
        const storedUserJson = await AsyncStorage.getItem('@chamala:user');
        if (storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          resolvedClientId = storedUser.id;
        }
      }

      if (!resolvedClientId) {
        setError('Sessão expirada. Faça login novamente.');
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
      setError(apiMessage);
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
    error,
    handleSubmit,
  };
}