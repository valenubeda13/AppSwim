import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogOut, Mail, ShieldAlert, Trash2 } from 'lucide-react-native';

import { colors, radius, shadow, spacing, typography } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import { accountService } from '@/services/accountService';

/**
 * Cuenta y sesión (rueda del header de Perfil): datos de inicio de sesión,
 * cerrar sesión, y borrar cuenta (con modal de confirmación, irreversible).
 */
export function AccountSettingsScreen() {
  const { session, signOut } = useAuth();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const email = session?.user.email;
  const memberSince = session?.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : undefined;

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Querés cerrar la sesión actual?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleConfirmDelete = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await accountService.deleteOwnAccount();
      await signOut();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'No se pudo borrar la cuenta.');
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de inicio de sesión</Text>
        <View style={[styles.infoCard, shadow.soft]}>
          <View style={styles.infoRow}>
            <Mail size={18} color={colors.textSecondary} strokeWidth={2.2} />
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email ?? '—'}</Text>
            </View>
          </View>
          {memberSince && (
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <ShieldAlert size={18} color={colors.textSecondary} strokeWidth={2.2} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Cuenta creada</Text>
                <Text style={styles.infoValue}>{memberSince}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} activeOpacity={0.85} onPress={handleSignOut}>
        <LogOut size={18} color="#D14343" strokeWidth={2.2} />
        <Text style={styles.signOutLabel}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        activeOpacity={0.85}
        onPress={() => setIsDeleteModalVisible(true)}
      >
        <Trash2 size={18} color="#D14343" strokeWidth={2.2} />
        <Text style={styles.deleteLabel}>Borrar cuenta</Text>
      </TouchableOpacity>

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, shadow.card]}>
            <View style={styles.modalIconWrapper}>
              <ShieldAlert size={28} color="#D14343" strokeWidth={2.2} />
            </View>
            <Text style={styles.modalTitle}>¿Borrar tu cuenta?</Text>
            <Text style={styles.modalMessage}>
              Esta acción no tiene vuelta atrás: se van a borrar tu perfil, entrenamientos, marcas y todo lo
              demás asociado a tu cuenta.
            </Text>

            {deleteError && <Text style={styles.modalError}>{deleteError}</Text>}

            <TouchableOpacity
              style={styles.modalConfirmButton}
              activeOpacity={0.85}
              onPress={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.modalConfirmLabel}>Sí, borrar mi cuenta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              activeOpacity={0.7}
              onPress={() => setIsDeleteModalVisible(false)}
              disabled={isDeleting}
            >
              <Text style={styles.modalCancelLabel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  infoRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#F3D5D5',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  signOutLabel: {
    ...typography.bodyStrong,
    color: '#D14343',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  deleteLabel: {
    ...typography.bodyStrong,
    color: '#D14343',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 37, 69, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: '#FBEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalError: {
    ...typography.caption,
    color: '#D14343',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalConfirmButton: {
    width: '100%',
    backgroundColor: '#D14343',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmLabel: {
    ...typography.bodyStrong,
    color: colors.surface,
  },
  modalCancelButton: {
    paddingVertical: spacing.md,
  },
  modalCancelLabel: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
});
