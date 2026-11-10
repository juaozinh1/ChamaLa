import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';
import { Input, Button, AlertBanner, LeafletMapPicker } from '../components';
import { api } from '../services/api';

interface TelaCriarPedidoProps {
  clientId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const TelaCriarPedido = ({
  clientId,
  onBack,
  onSuccess,
}: TelaCriarPedidoProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addressReference, setAddressReference] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: -8.0578,
    lng: -34.8829, // Recife/PE
  });

  // Estado da data e hora agendada
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date(Date.now() + 3600000)); // Padrão: 1 hora à frente
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Manipulador do seletor nativo (Android/iOS)
  const onNativeDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      if (Platform.OS === 'android' && pickerMode === 'date') {
        // No Android, após escolher o dia, abre imediatamente o seletor de hora
        const updatedDate = new Date(selectedDate);
        updatedDate.setHours(scheduledDate.getHours(), scheduledDate.getMinutes());
        setScheduledDate(updatedDate);
        setPickerMode('time');
        setShowPicker(true);
      } else {
        setScheduledDate(selectedDate);
      }
    }
  };

  const handleOpenDatePicker = () => {
    setPickerMode('date');
    setShowPicker(true);
  };

  const handleOpenTimePicker = () => {
    setPickerMode('time');
    setShowPicker(true);
  };

  const handleCriarPedido = async () => {
    setErrorMessage('');

    if (!title.trim() || !description.trim()) {
      setErrorMessage('Informe o título e a descrição do serviço.');
      return;
    }

    try {
      setLoading(true);

      await api.post(`/api/v1/orders?clientId=${clientId}`, {
        title: title.trim(),
        description: description.trim(),
        addressReference: addressReference.trim(),
        latitude: coords.lat,
        longitude: coords.lng,
        categoryId: 1, // ID da categoria existente no banco
        scheduledAt: scheduledDate.toISOString(), // Envia Instant em ISO-8601
      });

      onSuccess();
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Falha ao publicar pedido no servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Formatação visual da data e hora
  const formattedDate = scheduledDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = scheduledDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={globalStyles.sectionLink}>← Voltar</Text>
        </TouchableOpacity>

        <View style={globalStyles.headerLeftBlock}>
          <Text style={globalStyles.titleLeft}>Criar Novo Pedido 📋</Text>
          <Text style={globalStyles.subtitleLeft}>
            Descreva o serviço, escolha a data/hora e o local no mapa
          </Text>
        </View>

        {errorMessage ? (
          <View style={{ marginBottom: 16 }}>
            <AlertBanner message={errorMessage} variant="error" />
          </View>
        ) : null}

        <View style={globalStyles.formSection}>
          <Input
            label="Título do Pedido"
            placeholder="Ex: Instalação de ar-condicionado"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Descrição dos Detalhes"
            placeholder="Descreva o que precisa ser feito..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* ================= SELETOR DE DATA E HORA ================= */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.subtitleLeft, { marginBottom: 8, fontWeight: 'bold' }]}>
              Data e Horário do Atendimento:
            </Text>

            {Platform.OS === 'web' ? (
              // Modo Web: Controles nativos do browser com calendário pop-up
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Dia</Text>
                  <input
                    type="date"
                    value={scheduledDate.toISOString().split('T')[0]}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        const newD = new Date(scheduledDate);
                        newD.setFullYear(year, month - 1, day);
                        setScheduledDate(newD);
                      }
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Hora</Text>
                  <input
                    type="time"
                    value={scheduledDate.toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [hours, minutes] = e.target.value.split(':').map(Number);
                        const newD = new Date(scheduledDate);
                        newD.setHours(hours, minutes);
                        setScheduledDate(newD);
                      }
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </View>
              </View>
            ) : (
              // Modo Mobile: Botões que acionam o DatePicker nativo do Android/iOS
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleOpenDatePicker}
                  style={{
                    flex: 1,
                    backgroundColor: '#f1f5f9',
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#cbd5e1',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#64748b' }}>📅 Data</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginTop: 4 }}>
                    {formattedDate}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenTimePicker}
                  style={{
                    flex: 1,
                    backgroundColor: '#f1f5f9',
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#cbd5e1',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#64748b' }}>⏰ Horário</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginTop: 4 }}>
                    {formattedTime}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Componente Modal Nativo (Mobile) */}
            {showPicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={scheduledDate}
                mode={pickerMode}
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={onNativeDateChange}
              />
            )}
          </View>

          <Input
            label="Ponto de Referência"
            placeholder="Ex: Próximo à praça / Bloco B, Apt 101"
            value={addressReference}
            onChangeText={setAddressReference}
          />

          <View style={{ marginVertical: 8 }}>
            <Text style={[globalStyles.subtitleLeft, { marginBottom: 6, fontWeight: 'bold' }]}>
              Selecione o local exato no mapa:
            </Text>
            <View style={{ height: 260, borderRadius: 8, overflow: 'hidden' }}>
              <LeafletMapPicker
                initialCoords={coords}
                onLocationSelected={(newCoords) => setCoords(newCoords)}
              />
            </View>
            <Text style={[globalStyles.subtitleLeft, { fontSize: 12, marginTop: 4 }]}>
              Lat: {coords.lat.toFixed(5)} | Lng: {coords.lng.toFixed(5)}
            </Text>
          </View>

          <View style={globalStyles.formActions}>
            <Button
              title={loading ? 'Publicando...' : 'Publicar Pedido'}
              onPress={handleCriarPedido}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};