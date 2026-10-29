// TELA TEMPORÁRIA DE TESTE: mostra todos os componentes base, agrupados pelas telas do Figma.
// Serve só para conferir a aparência no celular. Apague junto com a pasta de testes depois do FRONT-04.
import React, { ReactNode, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AlertBanner,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Input,
  ListItem,
  PhotoTile,
  ProfessionalCard,
  ProgressSteps,
  SearchInput,
  Select,
  StatCard,
  SwitchRow,
  Tabs,
  TextArea,
  UploadCard,
} from '../components';
import { colors, radius, spacing, typography } from '../theme';

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const CATEGORIES = [
  { name: 'Limpeza', emoji: '🧹', bg: '#EDF3FC' },
  { name: 'Elétrica', emoji: '⚡', bg: '#FDF9E4' },
  { name: 'Hidráulica', emoji: '🔧', bg: '#E8F5EA' },
  { name: 'Pintura', emoji: '🎨', bg: '#F9E6EC' },
  { name: 'Montagem', emoji: '🪑', bg: '#EEE7EF' },
  { name: 'Jardinagem', emoji: '🌿', bg: '#E8F5EA' },
];

const SPECIALTIES = [
  { label: 'Limpeza', value: 'limpeza' },
  { label: 'Elétrica', value: 'eletrica' },
  { label: 'Hidráulica', value: 'hidraulica' },
  { label: 'Pintura', value: 'pintura' },
];

const SLOTS = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'];

export function ComponentShowcase() {
  const [specialty, setSpecialty] = useState<string>();
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [filter, setFilter] = useState('proximo');
  const [slot, setSlot] = useState('09:00');
  const [tab, setTab] = useState('ativos');
  const [selfie, setSelfie] = useState<string>();
  const [front, setFront] = useState<string>();
  const [back, setBack] = useState<string | undefined>('verso.jpg');
  const [cert, setCert] = useState<string>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const addPhoto = () =>
    setPhotos((p) => (p.length < 6 ? [...p, `https://picsum.photos/seed/${p.length + 7}/200`] : p));

  const confirmCancel = () =>
    Alert.alert('Cancelar pedido?', 'Essa ação não pode ser desfeita.', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Cancelar pedido', style: 'destructive' },
    ]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Teste dos componentes</Text>

        <Section title="Boas-vindas" hint="Prints: tela de escolha de perfil">
          <Card>
            <Text style={styles.cardTitle}>Sou Profissional</Text>
            <Text style={styles.muted}>
              Cadastre seus serviços, atenda clientes na sua região e multiplique seus ganhos diários.
            </Text>
            <View style={styles.gapTop}>
              <Button title="Cadastrar meus Serviços" />
            </View>
          </Card>
          <Card>
            <Text style={styles.cardTitle}>Sou Cliente</Text>
            <Text style={styles.muted}>
              Crie sua conta para encontrar os melhores profissionais qualificados perto de você.
            </Text>
            <View style={styles.gapTop}>
              <Button title="Cadastrar minha Conta" variant="outline" />
            </View>
          </Card>
          <View style={styles.center}>
            <Text style={styles.muted}>
              Já tem conta? <Text style={styles.linkInline}>Entrar</Text>
            </Text>
          </View>
        </Section>

        <Section title="Cadastro de profissional" hint="Prints: etapa 1 de 2">
          <ProgressSteps steps={['Criação de Conta', 'Verificação']} currentStep={0} />
          <AlertBanner message="Após criar sua conta, você já poderá acessar o app. A verificação de identidade e qualificações é feita em uma segunda etapa." />
          <View>
            <Input label="Nome Completo" placeholder="Ex: Carlos Mendes" />
            <Input label="Telefone / WhatsApp" placeholder="(11) 98765-4321" keyboardType="phone-pad" />
            <Input label="E-mail" placeholder="carlos@email.com" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Senha" placeholder="Mínimo 8 caracteres" secureTextEntry />
            <Select
              label="Especialidade Principal"
              placeholder="Selecione sua especialidade"
              options={SPECIALTIES}
              value={specialty}
              onChange={setSpecialty}
            />
            <Input
              label="Campo com erro"
              placeholder="Ex: Camaragibe, Pernambuco"
              error="Informe sua área de atuação"
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
          <Button title="Criar Conta e Acessar" />
          <Button title="Criar Conta + Fazer Verificação agora" variant="outline" />
          <Text style={[styles.muted, styles.center]}>
            Ao continuar, você concorda com os <Text style={styles.linkInline}>Termos de Serviço</Text>.
          </Text>
        </Section>

        <Section title="Verificação de identidade" hint="Prints: etapa 2 de 2 (toque nos cartões para simular o envio)">
          <ProgressSteps steps={['Criação de Conta', 'Verificação']} currentStep={1} />
          <UploadCard
            title="Selfie (foto do rosto)"
            required
            icon="person-outline"
            description="Tire uma foto clara do seu rosto, bem iluminada"
            fileName={selfie}
            onPick={() => setSelfie(selfie ? undefined : 'selfie.jpg')}
            onRemove={() => setSelfie(undefined)}
          />
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.fieldLabel}>RG/CPF/CNH — Frente</Text>
              <UploadCard
                compact
                title="Frente do doc."
                icon="id-card-outline"
                fileName={front}
                onPick={() => setFront(front ? undefined : 'frente.jpg')}
                onRemove={() => setFront(undefined)}
              />
            </View>
            <View style={styles.flex}>
              <Text style={styles.fieldLabel}>RG/CPF/CNH — Verso</Text>
              <UploadCard
                compact
                title="Verso do doc."
                icon="reader-outline"
                fileName={back}
                onPick={() => setBack(back ? undefined : 'verso.jpg')}
                onRemove={() => setBack(undefined)}
              />
            </View>
          </View>
          <UploadCard
            title="Certificado ou Diploma"
            icon="document-text-outline"
            description="Certificado de curso, diploma ou carta de referência"
            fileName={cert}
            onPick={() => setCert(cert ? undefined : 'certificado.pdf')}
            onRemove={() => setCert(undefined)}
          />
          <UploadCard
            title="Upload com erro"
            icon="document-outline"
            description="Registro em conselho, alvará ou comprovante"
            error="Arquivo muito grande"
            onPick={() => {}}
          />
          <View>
            <Text style={styles.fieldLabel}>Fotos de Trabalhos Anteriores</Text>
            <Text style={[styles.muted, styles.gapBottom]}>Adicione até 6 fotos que demonstrem seu trabalho</Text>
            <View style={styles.photoGrid}>
              {photos.map((uri, i) => (
                <PhotoTile key={uri} uri={uri} onRemove={() => setPhotos((p) => p.filter((_, j) => j !== i))} />
              ))}
              {photos.length < 6 ? <PhotoTile onPress={addPhoto} /> : null}
            </View>
          </View>
          <TextArea
            label="Descrição Profissional"
            placeholder="Ex: Sou eletricista há 8 anos, especializado em instalações residenciais..."
            maxLength={500}
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Enviar para Verificação" />
          <Button title="Fazer isso depois" variant="link" />
        </Section>

        <Section title="Painel do profissional" hint="Print: Painel">
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.muted}>Bem-vindo de volta 👋</Text>
              <Text style={styles.title}>Carlos Mendes</Text>
            </View>
            <Avatar name="Carlos Mendes" size={52} indicatorColor={colors.goldBright} />
          </View>
          <AlertBanner
            variant="warning"
            title="Verificação pendente"
            message="Complete a verificação para aumentar sua credibilidade e receber mais solicitações."
            actionLabel="Verificar"
            onAction={() => {}}
          />
          <View style={styles.row}>
            <StatCard emoji="💰" value="R$ 640" label="Este mês" />
            <StatCard emoji="✅" value="8" label="Serviços" />
            <StatCard emoji="⭐" value="4.9★" label="Avaliação" />
          </View>
          <SwitchRow
            title="Disponível para serviços"
            subtitle="Você está visível para novos clientes"
            value={available}
            onValueChange={setAvailable}
          />
          <View style={styles.rowBetween}>
            <Text style={styles.sectionHeading}>Novas Solicitações</Text>
            <Badge label="2" status="solid" />
          </View>
          <Card>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Limpeza residencial</Text>
              <Text style={styles.price}>R$ 80,00</Text>
            </View>
            <Text style={styles.muted}>👤 Maria Souza</Text>
            <Text style={styles.muted}>📅 25/09 às 09:00 • 📍 Camaragibe</Text>
            <View style={[styles.row, styles.gapTop]}>
              <Button title="Aceitar" size="sm" fullWidth={false} style={styles.flex} />
              <Button title="Recusar" size="sm" variant="neutral" fullWidth={false} style={styles.flex} />
            </View>
          </Card>
        </Section>

        <Section title="Categorias de serviço" hint="Print: Categorias (os cartões abaixo são só para conferir as cores)">
          <SearchInput placeholder="Buscar categoria..." />
          <View style={styles.grid}>
            {CATEGORIES.map((c) => (
              <Card key={c.name} onPress={() => {}} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: c.bg }]}>
                  <Text style={styles.categoryEmoji}>{c.emoji}</Text>
                </View>
                <Text style={styles.categoryName}>{c.name}</Text>
              </Card>
            ))}
          </View>
        </Section>

        <Section title="Lista de profissionais" hint="Print: Limpeza (filtros + cartões)">
          <View style={styles.chipRow}>
            <Chip label="Mais próximo" selected={filter === 'proximo'} onPress={() => setFilter('proximo')} />
            <Chip label="Melhor avaliado" selected={filter === 'avaliado'} onPress={() => setFilter('avaliado')} />
            <Chip label="Menor preço" selected={filter === 'preco'} onPress={() => setFilter('preco')} />
          </View>
          <ProfessionalCard
            name="Carlos Mendes"
            profession="Limpeza residencial"
            avatarEmoji="👨"
            rating={4.9}
            reviewsCount={127}
            location="1,2 km"
            priceLabel="R$ 80/h"
            onPress={() => {}}
          />
          <ProfessionalCard
            name="Ana Paula Santos"
            profession="Limpeza pós-obra"
            avatarEmoji="👩"
            rating={4.8}
            reviewsCount={89}
            location="2,5 km"
            priceLabel="R$ 70/h"
            verified
            onPress={() => {}}
          />
        </Section>

        <Section title="Agendamento" hint="Print: Agendar Serviço (horários)">
          <Text style={styles.fieldLabel}>Horário</Text>
          <View style={styles.slotGrid}>
            {SLOTS.map((s) => (
              <Chip key={s} label={s} shape="rounded" selected={slot === s} onPress={() => setSlot(s)} style={styles.slot} />
            ))}
          </View>
        </Section>

        <Section title="Meus pedidos" hint="Print: Meus Pedidos">
          <Tabs
            tabs={[
              { key: 'ativos', label: 'Ativos' },
              { key: 'historico', label: 'Histórico' },
            ]}
            activeKey={tab}
            onChange={setTab}
          />
          <Card>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Limpeza Residencial</Text>
              <Badge label="Confirmado" status="info" />
            </View>
            <Text style={styles.muted}>👤 Carlos Mendes</Text>
            <Text style={styles.muted}>📅 24/09/2026</Text>
            <View style={styles.divider} />
            <View style={styles.rowBetween}>
              <Text style={styles.price}>R$ 160,00</Text>
              <Button title="Cancelar" size="sm" variant="dangerOutline" fullWidth={false} onPress={confirmCancel} />
            </View>
          </Card>
        </Section>

        <Section title="Perfil" hint="Prints: Perfil do cliente e do profissional">
          <Card>
            <View style={styles.profileRow}>
              <Avatar name="Vinícius Silva" size={64} />
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>Vinícius Silva</Text>
                <Text style={styles.muted}>vinicius.silva@gmail.com</Text>
                <Text style={styles.muted}>(11) 98765-4321</Text>
              </View>
              <Button title="Editar" size="sm" variant="soft" fullWidth={false} />
            </View>
          </Card>
          <Card>
            <View style={styles.profileRow}>
              <Avatar name="Carlos Mendes" size={64} />
              <View style={styles.flex}>
                <View style={styles.nameBadge}>
                  <Text style={styles.cardTitle}>Carlos Mendes</Text>
                  <Badge label="Pendente" status="warning" />
                </View>
                <Text style={styles.muted}>Limpeza • Camaragibe</Text>
                <Text style={styles.muted}>(81) 99876-5432</Text>
              </View>
            </View>
          </Card>
          <ListItem emoji="📋" title="Meus Pedidos" onPress={() => {}} />
          <ListItem emoji="⭐" title="Avaliações" onPress={() => {}} />
          <ListItem emoji="📍" title="Endereços salvos" onPress={() => {}} />
          <ListItem emoji="🔔" title="Notificações" onPress={() => {}} />
          <ListItem title="Limpeza completa" onPress={() => {}} />
          <View style={styles.center}>
            <Button title="Sair da conta" variant="link" fullWidth={false} />
          </View>
        </Section>

        <Section title="Estados e variações" hint="Extras que não aparecem nos prints">
          <View style={styles.chipRow}>
            <Badge label="Confirmado" status="info" />
            <Badge label="Concluído" status="success" />
            <Badge label="Pendente" status="warning" />
            <Badge label="Cancelado" status="danger" />
            <Badge label="Neutro" />
          </View>
          <Button title="Carregando..." loading />
          <Button title="Botão desabilitado" disabled />
          <Button
            title={loadingBtn ? 'Salvando...' : 'Tocar para simular loading'}
            loading={loadingBtn}
            onPress={() => {
              setLoadingBtn(true);
              setTimeout(() => setLoadingBtn(false), 1500);
            }}
          />
          <Button title="Cancelar pedido" variant="danger" />
          <AlertBanner message="Aviso informativo com ícone, sem título e sem botão." />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl * 2 },
  title: { ...typography.title, color: colors.text },
  hint: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  section: { marginTop: spacing.xxl },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    paddingBottom: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
    alignSelf: 'flex-start',
  },
  sectionBody: { marginTop: spacing.lg, gap: spacing.lg },
  sectionHeading: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  cardTitle: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  fieldLabel: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  price: { ...typography.subtitle, fontWeight: '700', color: colors.primary },
  linkInline: { color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' },
  center: { alignItems: 'center' },
  gapTop: { marginTop: spacing.lg },
  gapBottom: { marginBottom: spacing.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryEmoji: { fontSize: 24 },
  categoryName: { ...typography.body, fontWeight: '700', color: colors.text, flexShrink: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: { width: '31.5%' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  nameBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
});
