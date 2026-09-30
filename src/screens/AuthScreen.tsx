import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';

import { colors, radius, spacing, typography } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';

interface FormValues {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Login y registro con email + contraseña (Supabase Auth).
 * Se muestra cuando no hay sesión activa (ver App.tsx).
 */
export function AuthScreen() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { signInWithPassword, signUpWithPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: '', password: '' } });

  const onSubmit = async ({ email, password }: FormValues) => {
    setServerError(null);
    setInfoMessage(null);

    const result =
      mode === 'signIn'
        ? await signInWithPassword(email.trim(), password)
        : await signUpWithPassword(email.trim(), password);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    if (mode === 'signUp') {
      setInfoMessage(
        'Cuenta creada. Si tu proyecto pide confirmar el email, revisá tu casilla antes de ingresar.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>SwimApp</Text>
          <Text style={styles.subtitle}>
            {mode === 'signIn' ? 'Ingresá a tu cuenta' : 'Creá tu cuenta'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'El email es obligatorio',
                pattern: { value: EMAIL_REGEX, message: 'Email inválido' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && <Text style={styles.fieldError}>{errors.email.message}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.password && <Text style={styles.fieldError}>{errors.password.message}</Text>}
          </View>

          {serverError && <Text style={styles.serverError}>{serverError}</Text>}
          {infoMessage && <Text style={styles.infoMessage}>{infoMessage}</Text>}

          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.submitLabel}>
                {mode === 'signIn' ? 'Ingresar' : 'Crear cuenta'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setServerError(null);
              setInfoMessage(null);
              setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
            }}
          >
            <Text style={styles.toggleLabel}>
              {mode === 'signIn' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Ingresá'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
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
  fieldError: {
    ...typography.caption,
    color: '#D14343',
    marginTop: spacing.xs,
  },
  serverError: {
    ...typography.caption,
    color: '#D14343',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  infoMessage: {
    ...typography.caption,
    color: colors.success,
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
  toggleButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  toggleLabel: {
    ...typography.body,
    color: colors.primary,
  },
});
