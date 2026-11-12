import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import type { LocalFile } from '../types';

export type PhotoSource = 'camera' | 'library';

const toFile = (asset: { uri: string; fileName?: string | null; name?: string; mimeType?: string | null }, fallback: string): LocalFile => ({
  uri: asset.uri,
  name: asset.fileName ?? asset.name ?? `${fallback}-${Date.now()}.jpg`,
  mimeType: asset.mimeType ?? 'image/jpeg',
});

/** Pergunta se a pessoa quer usar a câmera ou a galeria. Devolve null se cancelar. */
export function askPhotoSource(title: string, allowLibrary = true): Promise<PhotoSource | null> {
  if (!allowLibrary) return Promise.resolve('camera');
  return new Promise((resolve) => {
    Alert.alert(
      title,
      undefined,
      [
        { text: 'Tirar foto', onPress: () => resolve('camera') },
        { text: 'Escolher da galeria', onPress: () => resolve('library') },
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}

/** Tira uma foto ou escolhe uma da galeria. Devolve null se cancelar ou negar permissão. */
export async function pickPhoto(source: PhotoSource, front = false): Promise<LocalFile | null> {
  try {
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Permita o uso da câmera nas configurações do aparelho.');
        return null;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        cameraType: front ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
      });
      return result.canceled ? null : toFile(result.assets[0], 'foto');
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso às fotos nas configurações do aparelho.');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    return result.canceled ? null : toFile(result.assets[0], 'foto');
  } catch {
    Alert.alert('Não foi possível abrir', 'Tente novamente ou escolha outra opção.');
    return null;
  }
}

/** Escolhe várias fotos da galeria, até `limit`. */
export async function pickPhotos(limit: number): Promise<LocalFile[]> {
  if (limit <= 0) return [];
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso às fotos nas configurações do aparelho.');
      return [];
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: limit,
      quality: 0.7,
    });
    return result.canceled ? [] : result.assets.slice(0, limit).map((a) => toFile(a, 'foto'));
  } catch {
    Alert.alert('Não foi possível abrir a galeria', 'Tente novamente.');
    return [];
  }
}

/** Escolhe um documento (PDF ou imagem). */
export async function pickDocument(): Promise<LocalFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return null;
    const asset = result.assets[0];
    return { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? 'application/pdf' };
  } catch {
    Alert.alert('Não foi possível abrir', 'Tente novamente.');
    return null;
  }
}
