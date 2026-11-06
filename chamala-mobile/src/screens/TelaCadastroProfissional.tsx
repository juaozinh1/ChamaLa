import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView, View, ActivityIndicator } from 'react-native';
import { Input, Button, TextArea } from '../components';
import { colors, spacing, typography } from '../theme';
import { api } from '../services/api';

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
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !telefone.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios (Nome, E-mail, Telefone e Senha).');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/api/v1/auth/register', {
        name: nome,
        email: email.trim().toLowerCase(),
        password: senha,
        phone: telefone,
        role: 'PROFESSIONAL',
      });

      Alert.alert('Sucesso', 'Perfil profissional criado com sucesso!', [
        { text: 'Ir para o Login', onPress: onRegisterSuccess }
      ]);
    } catch (error: any) {
      console.error('Erro ao cadastrar profissional:', error);
      const msg = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Falha ao registrar profissional no servidor.';
      Alert.alert('Erro no Cadastro', msg);
    } finally {
      setLoading(false);
    }
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
        label="Nome Completo / Razão Social *"
        placeholder="Ex: Carlos Silva ou CS Reformas"
        value={nome}
        onChangeText={setNome}
      />

      <Input
        label="E-mail *"
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
        label="Telemóvel / WhatsApp *"
        placeholder="(81) 99999-9999"
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
        label="Senha de Acesso *"
        placeholder="Mínimo de 6 caracteres"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Button title="Criar Perfil Profissional" onPress={handleRegister} />
        )}
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