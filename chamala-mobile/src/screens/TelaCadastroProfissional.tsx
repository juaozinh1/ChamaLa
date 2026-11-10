import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Input, Button, AlertBanner } from '../components';

interface TelaCadastroProfissionalProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const TelaCadastroProfissional = ({
  onBack,
  onSuccess,
}: TelaCadastroProfissionalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password.trim() || !profession.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      // Chamada real ao backend:
      // await api.post('/api/v1/auth/register/professional', { name, email, password, phone, profession });
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Falha ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={globalStyles.sectionLink}>← Voltar para o Login</Text>
        </TouchableOpacity>

        <View style={globalStyles.headerLeftBlock}>
          <Text style={globalStyles.titleLeft}>Cadastro Profissional 🛠️</Text>
          <Text style={globalStyles.subtitleLeft}>
            Receba chamados de clientes próximos da sua região
          </Text>
        </View>

        {errorMessage ? (
          <View style={{ marginBottom: 16 }}>
            <AlertBanner message={errorMessage} variant="error" />
          </View>
        ) : null}

        <View style={globalStyles.formSection}>
          <Input
            label="Nome Completo"
            placeholder="Seu nome ou nome comercial"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Profissão / Especialidade"
            placeholder="Ex: Eletricista, Encanador, Pintor"
            value={profession}
            onChangeText={setProfession}
          />

          <Input
            label="Telefone / WhatsApp"
            placeholder="(81) 99999-9999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={globalStyles.formActions}>
            <Button
              title={loading ? 'Cadastrando...' : 'Criar Conta de Profissional'}
              onPress={handleCadastro}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};