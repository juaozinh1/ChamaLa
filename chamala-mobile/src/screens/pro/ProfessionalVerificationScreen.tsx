import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, PhotoTile, ProgressSteps, Screen, Text, TextArea, UploadCard } from '../../components';
import { USE_MOCKS } from '../../config/env';
import { useAuth } from '../../contexts/AuthContext';
import { useAction } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { LocalFile } from '../../types';
import { askPhotoSource, pickDocument, pickPhoto, pickPhotos } from '../../utils/pickers';
import { SIGNUP_STEPS } from '../auth/ProfessionalSignUpScreen';
import { makeStyles } from '../../theme/dynamic';

const MAX_PHOTOS = 6;
const MAX_DESCRIPTION = 500;

export function ProfessionalVerificationScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { setVerificationStatus } = useAuth();
  const [selfie, setSelfie] = useState<LocalFile>();
  const [docFront, setDocFront] = useState<LocalFile>();
  const [docBack, setDocBack] = useState<LocalFile>();
  const [certificate, setCertificate] = useState<LocalFile>();
  const [extraDoc, setExtraDoc] = useState<LocalFile>();
  const [photos, setPhotos] = useState<LocalFile[]>([]);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ selfie?: string; docFront?: string; docBack?: string }>({});

  const goToTabs = () => navigation.reset({ index: 0, routes: [{ name: 'ProfessionalTabs' }] });
  const goBack = () => (navigation.canGoBack() ? navigation.goBack() : goToTabs());

  // A selfie usa a câmera frontal. No modo de testes (mock) também permite escolher da galeria,
  // porque emuladores nem sempre têm câmera.
  const takeSelfie = async () => {
    const source = await askPhotoSource('Selfie', USE_MOCKS);
    if (!source) return;
    const file = await pickPhoto(source, true);
    if (file) {
      setSelfie(file);
      setErrors((e) => ({ ...e, selfie: undefined }));
    }
  };

  const takeDocument = async (side: 'front' | 'back') => {
    const source = await askPhotoSource(side === 'front' ? 'Frente do documento' : 'Verso do documento');
    if (!source) return;
    const file = await pickPhoto(source);
    if (!file) return;
    if (side === 'front') {
      setDocFront(file);
      setErrors((e) => ({ ...e, docFront: undefined }));
    } else {
      setDocBack(file);
      setErrors((e) => ({ ...e, docBack: undefined }));
    }
  };

  const addPhotos = async () => {
    const files = await pickPhotos(MAX_PHOTOS - photos.length);
    if (files.length) setPhotos((current) => [...current, ...files].slice(0, MAX_PHOTOS));
  };

  const [send, sending] = useAction(async () => {
    const next: typeof errors = {};
    if (!selfie) next.selfie = 'Tire uma selfie para continuar';
    if (!docFront) next.docFront = 'Envie a frente do documento';
    if (!docBack) next.docBack = 'Envie o verso do documento';
    setErrors(next);
    if (!selfie || !docFront || !docBack) return;

    const status = await api.professional.submitVerification({
      selfie, docFront, docBack, certificate, extraDoc, workPhotos: photos,
      description: description.trim() || undefined,
    });
    setVerificationStatus(status);
    navigation.replace('VerificationSent');
  }, 'Não foi possível enviar');

  return (
    <Screen
      title="Verificação de Identidade"
      onBack={goBack}
      footer={
        <>
          <Button title="Enviar para Verificação" loading={sending} onPress={() => send()} />
          <Button title="Fazer isso depois" variant="link" disabled={sending} onPress={goToTabs} />
        </>
      }
    >
      <ProgressSteps steps={SIGNUP_STEPS} currentStep={1} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🪪 Verificação de Identidade</Text>
        <Text style={styles.muted}>Confirme quem você é com selfie e documento</Text>
      </View>

      <UploadCard
        required
        icon="person-outline"
        title="Selfie (foto do rosto)"
        description="Tire uma foto clara do seu rosto, bem iluminada"
        fileName={selfie?.name}
        error={errors.selfie}
        onPick={takeSelfie}
        onRemove={() => setSelfie(undefined)}
      />

      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.label}>RG/CPF/CNH — Frente</Text>
          <UploadCard compact icon="id-card-outline" title="Frente do doc." fileName={docFront?.name} error={errors.docFront} onPick={() => takeDocument('front')} onRemove={() => setDocFront(undefined)} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>RG/CPF/CNH — Verso</Text>
          <UploadCard compact icon="reader-outline" title="Verso do doc." fileName={docBack?.name} error={errors.docBack} onPick={() => takeDocument('back')} onRemove={() => setDocBack(undefined)} />
        </View>
      </View>
      <Text style={styles.muted}>✓ Documentos aceitos: RG, CPF, CNH ou Passaporte. Certifique-se que os dados estão legíveis.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎓 Comprovação de Qualificações</Text>
        <Text style={styles.muted}>Prove sua experiência com certificados e fotos</Text>
      </View>

      <UploadCard
        icon="document-text-outline"
        title="Certificado ou Diploma"
        description="Certificado de curso, diploma ou carta de referência"
        fileName={certificate?.name}
        onPick={async () => setCertificate((await pickDocument()) ?? certificate)}
        onRemove={() => setCertificate(undefined)}
      />
      <UploadCard
        icon="document-outline"
        title="Documento adicional (opcional)"
        description="Registro em conselho, alvará ou comprovante similar"
        fileName={extraDoc?.name}
        onPick={async () => setExtraDoc((await pickDocument()) ?? extraDoc)}
        onRemove={() => setExtraDoc(undefined)}
      />

      <View>
        <Text style={styles.label}>Fotos de Trabalhos Anteriores</Text>
        <Text style={[styles.muted, styles.gap]}>Adicione até 6 fotos que demonstrem seu trabalho</Text>
        <View style={styles.photos}>
          {photos.map((file, index) => (
            <PhotoTile key={file.uri} uri={file.uri} onRemove={() => setPhotos((current) => current.filter((_, i) => i !== index))} />
          ))}
          {photos.length < MAX_PHOTOS ? <PhotoTile onPress={addPhotos} /> : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✍️ Descrição Profissional</Text>
        <Text style={styles.muted}>Conte um pouco sobre você e sua experiência</Text>
      </View>
      <TextArea
        placeholder="Ex: Sou eletricista há 8 anos, especializado em instalações residenciais e comerciais. Tenho certificação NR-10 e já atendi mais de 200 clientes na região de Camaragibe."
        maxLength={MAX_DESCRIPTION}
        value={description}
        onChangeText={setDescription}
      />
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  section: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.lg },
  sectionTitle: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  gap: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
}));
