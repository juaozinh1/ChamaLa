import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, minTouchTarget, radius } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { RequiredMark, FieldError, fieldErrorOutline } from '../components/FieldFeedback';
import { TextArea } from '../components/TextArea';
import { Chip } from '../components/Chip';
import { UploadCard } from '../components/UploadCard';
import { PhotoTile } from '../components/PhotoTile';
import { LeafletMapPicker } from '../components/LeafletMapPicker';
import { ScreenHeader } from '../components/ScreenHeader';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { useCriarPedidoForm } from '../hooks/useCriarPedidoForm';
import { api } from '../services/api';

type TelaCriarPedidoProps = {
  /** Volta para a Home sem publicar (usado pelo App.tsx). */
  onBack?: () => void;
  /** Chamado ao tocar em "Ver meus pedidos" depois de publicar (usado pelo App.tsx). */
  onSuccess?: () => void;
};

interface CategoryItem {
  id: string | number;
  name: string;
}

const DEFAULT_COORDS = {
  lat: -7.9408,
  lng: -34.8728,
};

function formatarDataBr(text: string): string {
  const limpo = text.replace(/\D/g, '').slice(0, 8);
  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 4) return `${limpo.slice(0, 2)}/${limpo.slice(2)}`;
  return `${limpo.slice(0, 2)}/${limpo.slice(2, 4)}/${limpo.slice(4)}`;
}

function formatarHoraBr(text: string): string {
  const limpo = text.replace(/\D/g, '').slice(0, 4);
  if (limpo.length <= 2) return limpo;
  return `${limpo.slice(0, 2)}:${limpo.slice(2)}`;
}

export const TelaCriarPedido: React.FC<TelaCriarPedidoProps> = ({
  onBack,
  onSuccess,
}) => {
  const [pedidoOk, setPedidoOk] = useState(false);
  const { toast, showToast } = useToast();

  const {
    categoriaId,
    setCategoriaId,
    descricao,
    setDescricao,
    fotos,
    handleAddPhoto,
    handleRemovePhoto,
    setLocalizacao,
    dataAgendada,
    setDataAgendada,
    horaAgendada,
    setHoraAgendada,
    submitting,
    fieldErrors,
    handleSubmit,
  } = useCriarPedidoForm({ onError: showToast });

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const response = await api.get('/api/v1/categories');
        if (isMounted) {
          setCategories(response.data);
        }
      } catch {
        if (isMounted) {
          setCategories([
            { id: 1, name: 'Hidráulica' },
            { id: 2, name: 'Elétrica' },
            { id: 3, name: 'Pintura' },
            { id: 4, name: 'Alvenaria' },
            { id: 5, name: 'Limpeza' },
          ]);
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Autorize o acesso às fotos para anexar imagens ao pedido.', 'info');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      handleAddPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Novo pedido"
        onBack={onBack}
        backLabel="Voltar para o início"
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Novo Pedido</Text>
          <Text style={styles.subtitle}>
            Preencha os dados do chamado para os profissionais disponíveis.
          </Text>
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Categoria do Serviço
            <RequiredMark />
          </Text>
          {loadingCategories ? (
            <ActivityIndicator
              color={colors.primary}
              size="small"
              style={styles.loader}
            />
          ) : (
            <View
              style={[
                styles.categoriesContainer,
                fieldErrors.categoria ? fieldErrorOutline : null,
              ]}
            >
              {categories.map((cat) => (
                <Chip
                  key={String(cat.id)}
                  label={cat.name}
                  selected={categoriaId === String(cat.id)}
                  onPress={() => setCategoriaId(String(cat.id))}
                />
              ))}
            </View>
          )}
          <FieldError message={fieldErrors.categoria} />
        </View>

        {/* Agendamento de Horário Comercial */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data e Horário do Atendimento</Text>
          <Text style={styles.helperText}>Dias úteis, das 08:00 às 18:00</Text>
          <View style={styles.scheduleInputs}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>
                Data (DD/MM/AAAA)
                <RequiredMark />
              </Text>
              <Input
                error={fieldErrors.data}
                value={dataAgendada}
                onChangeText={(text) => setDataAgendada(formatarDataBr(text))}
                placeholder="Ex: 12/11/2026"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.label}>
                Horário (HH:MM)
                <RequiredMark />
              </Text>
              <Input
                error={fieldErrors.hora}
                value={horaAgendada}
                onChangeText={(text) => setHoraAgendada(formatarHoraBr(text))}
                placeholder="Ex: 10:30"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Descrição da Demanda
            <RequiredMark />
          </Text>
          <TextArea
            error={fieldErrors.descricao}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva detalhadamente o problema ou serviço necessário..."
          />
        </View>

        {/* Fotos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagens de Apoio ({fotos.length}/5)</Text>
          <View style={styles.photosGrid}>
            {fotos.map((uri, index) => (
              <PhotoTile
                key={`${uri}-${index}`}
                uri={uri}
                onRemove={() => handleRemovePhoto(index)}
              />
            ))}
            {fotos.length < 5 ? (
              <UploadCard
                title="Adicionar Foto"
                description="Envie imagens do local ou do problema"
                onPick={handlePickImage}
              />
            ) : null}
          </View>
        </View>

        {/* Mapa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ponto de Atendimento
            <RequiredMark />
          </Text>
          <View
            style={[
              styles.mapWrapper,
              fieldErrors.localizacao ? styles.mapWrapperError : null,
            ]}
          >
            <LeafletMapPicker
              initialCoords={DEFAULT_COORDS}
              onLocationSelected={(coords: { lat: number; lng: number }) => {
                setLocalizacao(coords);
              }}
            />
          </View>
          <FieldError message={fieldErrors.localizacao} />
        </View>

        <Button
          title="Publicar Pedido"
          loading={submitting}
          onPress={() => handleSubmit(() => setPedidoOk(true))}
          style={styles.submitBtn}
        />
      </ScrollView>
      <FeedbackSheet
        visible={pedidoOk}
        title="Pedido feito!"
        headline={`Agendado para ${dataAgendada} às ${horaAgendada}`}
        message="Seu pedido foi publicado. Avisaremos quando um profissional da região aceitar."
        actions={[
          {
            label: 'Ver meus pedidos',
            onPress: () => {
              setPedidoOk(false);
              onSuccess?.();
            },
          },
        ]}
      />
      {toast}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  loader: {
    alignSelf: 'flex-start',
    marginVertical: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  scheduleInputs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputCol: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  photosGrid: {
    gap: spacing.sm,
  },
  mapWrapper: {
    height: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  mapWrapperError: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  submitBtn: {
    marginTop: spacing.md,
    minHeight: minTouchTarget,
  },
});
