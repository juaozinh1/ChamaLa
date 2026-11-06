import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView, View, ActivityIndicator } from 'react-native';
import { Input, Button } from '../components';
import { colors, spacing, typography } from '../theme';
import { api } from '../services/api';

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
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/v1/auth/register', {
        name: nome,
        email: email.trim().toLowerCase(),
        password: senha,
        phone: telefone,
        role: 'CLIENT',
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso no ChamaLá!', [
        { text: 'OK', onPress: onRegisterSuccess }
      ]);

    } catch (error: any) {
      console.error('Erro de conexão ao cadastrar:', error);
      
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 8085.';

      Alert.alert('Falha no Cadastro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Voltar para o início</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha os seus dados para começar</Text>

      <Input
        label="Nome Completo *"
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <Input
        label="E-mail *"
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Telemóvel / Telefone"
        placeholder="(81) 99999-9999"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Input
        label="Senha *"
        placeholder="Mínimo de 6 dígitos"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Button title="Cadastrar" onPress={handleRegister} />
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
    padding: spacing.medium || 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: spacing.medium || 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text || '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: spacing.medium || 16,
  },
  buttonWrapper: {
    marginTop: spacing.medium || 16,
  },
  linkButton: {
    marginTop: spacing.medium || 16,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
  },
});