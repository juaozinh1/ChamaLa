import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AlertBanner } from '../components/AlertBanner';
import { TextArea } from '../components/TextArea';
import { Chip } from '../components/Chip';
import { UploadCard } from '../components/UploadCard';
import { PhotoTile } from '../components/PhotoTile';
import { LeafletMapPicker } from '../components/LeafletMapPicker';
import { useCriarPedidoForm } from '../hooks/useCriarPedidoForm';
import { api } from '../services/api';

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

export const TelaCriarPedido: React.FC = () => {
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
    error,
    handleSubmit,
  } = useCriarPedidoForm();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const response = await api.get('/categories');
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
      Alert.alert(
        'Permissão necessária',
        'Autorize o acesso às fotos para comprovar a demanda.'
      );
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

      {error ? <AlertBanner message={error} /> : null}

      {/* Categoria */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categoria do Serviço</Text>
        {loadingCategories ? (
          <ActivityIndicator color={colors.primary} size="small" style={styles.loader} />
        ) : (
          <View style={styles.categoriesContainer}>
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
      </View>

      {/* Agendamento de Horário Comercial */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data e Horário do Atendimento</Text>
        <Text style={styles.helperText}>Dias úteis, das 08:00 às 18:00</Text>
        <View style={styles.scheduleInputs}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Data (DD/MM/AAAA)</Text>
            <Input
              value={dataAgendada}
              onChangeText={(text) => setDataAgendada(formatarDataBr(text))}
              placeholder="Ex: 12/11/2026"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Horário (HH:MM)</Text>
            <Input
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
        <Text style={styles.sectionTitle}>Descrição da Demanda</Text>
        <TextArea
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
        <Text style={styles.sectionTitle}>Ponto de Atendimento</Text>
        <View style={styles.mapWrapper}>
          <LeafletMapPicker
            initialCoords={DEFAULT_COORDS}
            onLocationSelected={(coords: { lat: number; lng: number }) => {
              setLocalizacao(coords);
            }}
          />
        </View>
      </View>

      <Button
        title="Publicar Pedido"
        loading={submitting}
        onPress={() =>
          handleSubmit(() => {
            Alert.alert('Sucesso', 'Pedido agendado e publicado com sucesso!');
          })
        }
        style={styles.submitBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 0,
    overflow: 'hidden',
  },
  submitBtn: {
    marginTop: spacing.md,
    minHeight: minTouchTarget,
    borderRadius: 0,
  },
});