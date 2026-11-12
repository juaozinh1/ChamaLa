import { Alert, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, FormInput, Screen, Text } from '../../components';
import { useAuth, useCurrentUser } from '../../contexts/AuthContext';
import { useAction } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { spacing, typography } from '../../theme';
import { EditProfileForm, editProfileSchema, maskPhone } from '../../utils';
import { askPhotoSource, pickPhoto } from '../../utils/pickers';
import { makeStyles } from '../../theme/dynamic';

export function EditProfileScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const user = useCurrentUser();
  const { updateProfile, changePassword, updateAvatar } = useAuth();
  const isPro = user.role === 'professional';
  const { control, handleSubmit } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      area: user.area ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [changePhoto, changingPhoto] = useAction(async () => {
    const source = await askPhotoSource('Foto de perfil');
    if (!source) return;
    const file = await pickPhoto(source, true);
    if (file) await updateAvatar(file);
  }, 'Não foi possível alterar a foto');

  const [save, saving] = useAction(async (values: EditProfileForm) => {
    // A senha vem primeiro: se a senha atual estiver errada, nada é salvo pela metade.
    if (values.newPassword) await changePassword(values.currentPassword, values.newPassword);
    await updateProfile({ name: values.name, phone: values.phone, email: values.email, area: values.area });
    Alert.alert('Perfil atualizado', values.newPassword ? 'Seus dados e sua senha foram atualizados.' : 'Seus dados foram atualizados.');
    navigation.goBack();
  }, 'Não foi possível salvar');

  return (
    <Screen
      title="Editar Perfil"
      footer={<Button title="Salvar Alterações" loading={saving} onPress={handleSubmit((v) => save(v))} />}
    >
      <View style={styles.photo}>
        <Avatar name={user.name} uri={user.avatarUrl} size={88} />
        <Button title="Alterar Foto" size="sm" variant="soft" fullWidth={false} loading={changingPhoto} onPress={() => changePhoto()} />
      </View>

      <View>
        <FormInput control={control} name="name" label="Nome Completo" autoCapitalize="words" />
        <FormInput control={control} name="phone" label="Telefone / WhatsApp" keyboardType="phone-pad" mask={maskPhone} />
        <FormInput control={control} name="email" label="E-mail" keyboardType="email-address" autoCapitalize="none" />
        <FormInput
          control={control}
          name="area"
          label={isPro ? 'Área de Atuação (Bairro/Cidade)' : 'Bairro/Cidade'}
          placeholder="Ex: Vila da Fábrica, Camaragibe"
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      <View style={styles.divider} />
      <Text style={styles.heading}>Alterar senha</Text>
      <Text style={styles.muted}>Deixe em branco para manter a senha atual.</Text>
      <View>
        <FormInput control={control} name="currentPassword" label="Senha atual" secureTextEntry autoCapitalize="none" />
        <FormInput control={control} name="newPassword" label="Nova senha" placeholder="Mínimo 8 caracteres" secureTextEntry autoCapitalize="none" />
        <FormInput control={control} name="confirmPassword" label="Confirmar nova senha" secureTextEntry autoCapitalize="none" containerStyle={{ marginBottom: 0 }} />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  photo: { alignItems: 'center', gap: spacing.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  heading: { ...typography.body, fontWeight: '700', color: colors.text, marginBottom: -spacing.sm },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: -spacing.sm },
}));
