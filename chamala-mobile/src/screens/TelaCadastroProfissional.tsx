import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView, View } from 'react-native';
import { Input, Button, TextArea } from '../components';
import { colors, spacing, typography } from '../theme';

interface TelaCadastroProfissionalProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export const TelaCadastroProfissional = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onBack,
}: TelaCadastroProfissionalProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = () => {
    if (!nome || !email || !cpfCnpj || !telefone || !categoria || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    Alert.alert('Sucesso', 'Perfil profissional cadastrado com sucesso!');
    onRegisterSuccess();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Voltar para o início</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Registo Profissional</Text>
      <Text style={styles.subtitle}>
        Ofereça os seus serviços e receba chamados no ChamaLá
      </Text>

      <Input
        label="Nome Completo / Razão Social"
        placeholder="Ex: Carlos Silva ou CS Reformas"
        value={nome}
        onChangeText={setNome}
      />

      <Input
        label="E-mail"
        placeholder="carlos@exemplo.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="CPF ou CNPJ"
        placeholder="000.000.000-00"
        value={cpfCnpj}
        onChangeText={setCpfCnpj}
        keyboardType="numeric"
      />

      <Input
        label="Telemóvel / WhatsApp"
        placeholder="(11) 99999-9999"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Input
        label="Especialidade / Categoria Principal"
        placeholder="Ex: Eletricista, Encanador, Pintor..."
        value={categoria}
        onChangeText={setCategoria}
      />

      <TextArea
        label="Descrição dos seus serviços"
        placeholder="Fale brevemente sobre a sua experiência, área de atuação e diferenciais..."
        value={descricao}
        onChangeText={setDescricao}
      />

      <Input
        label="Senha de Acesso"
        placeholder="Mínimo de 6 caracteres"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button title="Criar Perfil Profissional" onPress={handleRegister} />
      </View>

      <TouchableOpacity onPress={onNavigateToLogin} style={styles.linkButton}>
        <Text style={styles.linkText}>Já tem uma conta? Inicie sessão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: colors.primary,
    ...typography.body,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  buttonWrapper: {
    marginTop: spacing.md,
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    ...typography.caption,
  },
});