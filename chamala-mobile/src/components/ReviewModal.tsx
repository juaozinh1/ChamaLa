import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, spacing, typography, minTouchTarget } from '../theme';
import { Button } from './Button';
import { api } from '../services/api';

interface ReviewModalProps {
  visible: boolean;
  orderId: string;
  clientId: string;
  professionalName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  orderId,
  clientId,
  professionalName = 'o profissional',
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/api/v1/reviews', {
        orderId,
        clientId,
        rating,
        comment: comment.trim(),
      });

      Alert.alert('Obrigado!', 'Sua avaliação foi registrada com sucesso.');
      onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao enviar avaliação.';
      Alert.alert('Aviso', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Avaliar Atendimento</Text>
          <Text style={styles.subtitle}>
            Como foi o serviço prestado por {professionalName}?
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
              >
                <Text style={[styles.starText, rating >= star && styles.starSelected]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingLabel}>{rating} de 5 estrelas</Text>

          <TextInput
            style={styles.input}
            placeholder="Deixe um comentário sobre o serviço (opcional)"
            placeholderTextColor={colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelText}>Depois</Text>
            </TouchableOpacity>

            <Button
              title={loading ? 'Enviando...' : 'Confirmar'}
              onPress={handleSubmit}
              loading={loading}
              style={styles.confirmBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  starBtn: {
    padding: spacing.xs,
  },
  starText: {
    fontSize: 34,
    color: '#D1D5DB',
  },
  starSelected: {
    color: '#EAB308',
  },
  ratingLabel: {
    ...typography.caption,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 80,
    ...typography.body,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  cancelText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },
  confirmBtn: {
    borderRadius: 0,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
  },
});