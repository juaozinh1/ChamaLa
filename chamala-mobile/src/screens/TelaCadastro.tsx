import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Input, Button, AlertBanner } from '../components';

interface TelaCadastroProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToProfissionalRegister: () => void;
}

export const TelaCadastro = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToProfissionalRegister,
}: TelaCadastroProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Por favor, preencha os campos obrigatórios.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      onRegisterSuccess();
    } catch {
      setErrorMessage('Não foi possível realizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={globalStyles.headerLeftBlock}>
          <Text style={globalStyles.titleLeft}>Criar Conta</Text>
          <Text style={globalStyles.subtitleLeft}>Cadastre-se para solicitar serviços residenciais</Text>
        </View>

        {!!errorMessage && (
          <View style={{ marginBottom: 16 }}>
            <AlertBanner variant="error" message={errorMessage} />
          </View>
        )}

        <View style={globalStyles.formSection}>
          <Input label="Nome Completo *" placeholder="Ex: João Silva" value={name} onChangeText={setName} />
          <Input
            label="E-mail *"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input label="Telefone" placeholder="(81) 99999-9999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="Senha *" placeholder="Mínimo 6 caracteres" value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <View style={globalStyles.formActions}>
          <Button title="Criar Conta de Cliente" onPress={handleRegister} loading={isLoading} />
          <Button
            title="Quero prestar serviços (Profissional)"
            variant="outline"
            onPress={onNavigateToProfissionalRegister}
          />
        </View>

        <View style={globalStyles.footerNav}>
          <Text style={globalStyles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={globalStyles.footerLink}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};