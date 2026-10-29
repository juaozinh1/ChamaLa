import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView, View } from 'react-native';
import { Input, Button } from '../components';
import { colors, spacing, typography } from '../theme';

interface TelaCadastroProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export const TelaCadastro = ({ onRegisterSuccess, onNavigateToLogin, onBack }: TelaCadastroProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }
    Alert.alert('Sucesso', 'Cadastro concluído com sucesso!');
    onRegisterSuccess();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Voltar para o início</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha os seus dados para começar</Text>

      <Input
        label="Nome Completo"
        placeholder="João Silva"
        value={nome}
        onChangeText={setNome}
      />

      <Input
        label="E-mail"
        placeholder="joao@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Telemóvel / Telefone"
        placeholder="(11) 99999-9999"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Input
        label="Senha"
        placeholder="Mínimo de 6 dígitos"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button title="Cadastrar" onPress={handleRegister} />
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