import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, radius, spacing, typography } from '@/theme';
import { useProfile } from '@/hooks/useProfile';
import { AvatarPicker, SegmentedControl } from '@/components';
import { Gender, ProfileInput } from '@/types';
import { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

interface EditProfileFormValues {
  name: string;
  username: string;
  bio: string;
  gender: Gender;
  swimmingSinceYear: string;
  goalMetersPerWeek: string;
  preferredPoolLength: 25 | 50;
}

const BIO_WORD_LIMIT = 20;
const USERNAME_COOLDOWN_DAYS = 30;
const CURRENT_YEAR = new Date().getFullYear();

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'nadador', label: 'Nadador' },
  { value: 'nadadora', label: 'Nadadora' },
];

const POOL_OPTIONS: { value: 25 | 50; label: string }[] = [
  { value: 25, label: '25 m' },
  { value: 50, label: '50 m' },
];

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/**
 * Editar perfil (lápiz del header): nombre, género, bio (máx. 20 palabras),
 * año en que arrancó a nadar, meta semanal, pileta preferida y nombre de
 * usuario (máx. 1 cambio cada 30 días, validado en el servidor por el
 * trigger enforce_username_rate_limit). Es el único lugar donde se editan
 * los datos y preferencias del perfil.
 */
export function EditProfileScreen({ navigation }: Props) {
  const { profile, isLoading, updateProfile, updateAvatar } = useProfile();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      gender: 'nadador',
      swimmingSinceYear: '',
      goalMetersPerWeek: '',
      preferredPoolLength: 25,
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name,
      username: profile.username ?? '',
      bio: profile.bio ?? '',
      gender: profile.gender ?? 'nadador',
      swimmingSinceYear: profile.swimmingSince
        ? String(new Date(profile.swimmingSince).getFullYear())
        : '',
      goalMetersPerWeek:
        profile.goalMetersPerWeek !== undefined ? String(profile.goalMetersPerWeek) : '',
      preferredPoolLength: profile.preferredPoolLength ?? 25,
    });
  }, [profile, reset]);

  const bioWordCount = countWords(watch('bio'));

  const usernameCooldownUntil = (() => {
    if (!profile?.usernameUpdatedAt) return null;
    const nextAllowed = new Date(profile.usernameUpdatedAt);
    nextAllowed.setDate(nextAllowed.getDate() + USERNAME_COOLDOWN_DAYS);
    return nextAllowed > new Date() ? nextAllowed : null;
  })();

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        'Activá el acceso a tus fotos desde los ajustes del sistema para poder cambiar tu foto de perfil.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setServerError(null);
    setIsUploadingAvatar(true);
    try {
      await updateAvatar(asset.uri, asset.mimeType ?? 'image/jpeg');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No se pudo subir la foto.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    setServerError(null);

    const input: ProfileInput = {
      name: values.name.trim(),
      goalMetersPerWeek: values.goalMetersPerWeek.trim()
        ? Number(values.goalMetersPerWeek)
        : undefined,
      preferredPoolLength: values.preferredPoolLength,
      username: values.username.trim(),
      bio: values.bio.trim(),
      gender: values.gender,
      swimmingSince: values.swimmingSinceYear.trim()
        ? `${values.swimmingSinceYear.trim()}-01-01`
        : undefined,
    };

    try {
      await updateProfile(input);
      navigation.goBack();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No se pudo guardar el perfil.');
    }
  };

  if (isLoading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <AvatarPicker
            name={profile?.name ?? 'Nadador/a'}
            avatarUrl={profile?.avatarUrl}
            isUploading={isUploadingAvatar}
            onPress={handlePickAvatar}
            size={96}
          />
          <Text style={styles.avatarHint}>Tocá la foto para cambiarla</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'El nombre es obligatorio' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.name && <Text style={styles.fieldError}>{errors.name.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Género</Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <SegmentedControl options={GENDER_OPTIONS} value={value} onChange={onChange} />
            )}
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Descripción</Text>
            <Text
              style={[styles.wordCount, bioWordCount > BIO_WORD_LIMIT && styles.wordCountError]}
            >
              {bioWordCount}/{BIO_WORD_LIMIT} palabras
            </Text>
          </View>
          <Controller
            control={control}
            name="bio"
            rules={{
              validate: (value) =>
                countWords(value) <= BIO_WORD_LIMIT || `Máximo ${BIO_WORD_LIMIT} palabras`,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder='"La constancia de hoy son los resultados de mañana"'
                placeholderTextColor={colors.textTertiary}
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.bio && <Text style={styles.fieldError}>{errors.bio.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>¿En qué año arrancaste a nadar?</Text>
          <Controller
            control={control}
            name="swimmingSinceYear"
            rules={{
              validate: (value) => {
                if (!value.trim()) return true;
                const year = Number(value);
                return (
                  (/^\d{4}$/.test(value) && year >= 1900 && year <= CURRENT_YEAR) ||
                  `Ingresá un año entre 1900 y ${CURRENT_YEAR}`
                );
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="2012"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                maxLength={4}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.swimmingSinceYear && (
            <Text style={styles.fieldError}>{errors.swimmingSinceYear.message}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Meta semanal (metros, opcional)</Text>
          <Controller
            control={control}
            name="goalMetersPerWeek"
            rules={{
              validate: (value) => !value.trim() || /^\d+$/.test(value) || 'Ingresá un número',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="10000"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.goalMetersPerWeek && (
            <Text style={styles.fieldError}>{errors.goalMetersPerWeek.message}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pileta preferida</Text>
          <Controller
            control={control}
            name="preferredPoolLength"
            render={({ field: { onChange, value } }) => (
              <SegmentedControl options={POOL_OPTIONS} value={value} onChange={onChange} />
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <View style={styles.usernameInputWrapper}>
            <Text style={styles.usernamePrefix}>@</Text>
            <Controller
              control={control}
              name="username"
              rules={{
                validate: (value) =>
                  !value.trim() ||
                  /^[a-z0-9_.]{3,20}$/i.test(value.trim()) ||
                  'Entre 3 y 20 letras, números, "." o "_"',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.usernameInput}
                  placeholder="valen_swim"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!usernameCooldownUntil}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          {errors.username && <Text style={styles.fieldError}>{errors.username.message}</Text>}
          <Text style={styles.helperText}>
            {usernameCooldownUntil
              ? `Ya lo cambiaste este mes. Podés volver a cambiarlo a partir del ${usernameCooldownUntil.toLocaleDateString('es-AR')}.`
              : 'Podés cambiarlo una vez por mes.'}
          </Text>
        </View>

        {serverError && <Text style={styles.serverError}>{serverError}</Text>}

        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.85}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.submitLabel}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  field: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  wordCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  wordCountError: {
    color: '#D14343',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.textPrimary,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  usernameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.md,
  },
  usernamePrefix: {
    ...typography.body,
    color: colors.textTertiary,
  },
  usernameInput: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.textPrimary,
  },
  fieldError: {
    ...typography.caption,
    color: '#D14343',
    marginTop: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  serverError: {
    ...typography.caption,
    color: '#D14343',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  submitLabel: {
    ...typography.bodyStrong,
    color: colors.surface,
  },
});
