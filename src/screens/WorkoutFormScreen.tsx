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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, radius, spacing, typography } from '@/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { SegmentedControl } from '@/components';
import { Intensity, WorkoutInput } from '@/types';
import { toIsoDate } from '@/utils/formatters';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutForm'>;

interface WorkoutFormValues {
  date: string;
  poolLength: 25 | 50;
  totalMeters: string;
  totalTimeMinutes: string;
  intensity: Intensity;
  calories: string;
  notes: string;
}

const POOL_OPTIONS: { value: 25 | 50; label: string }[] = [
  { value: 25, label: '25 m' },
  { value: 50, label: '50 m' },
];

const INTENSITY_OPTIONS: { value: Intensity; label: string }[] = [
  { value: 'suave', label: 'Suave' },
  { value: 'moderada', label: 'Moderada' },
  { value: 'alta', label: 'Alta' },
];

const QUICK_DATES = [
  { label: 'Hoy', offset: 0 },
  { label: 'Ayer', offset: 1 },
  { label: 'Anteayer', offset: 2 },
];

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function quickDateIso(offsetDays: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - offsetDays);
  return toIsoDate(date);
}

/**
 * Alta y edición de un entrenamiento (mismo formulario para ambos casos,
 * según si `route.params.workoutId` viene definido).
 */
export function WorkoutFormScreen({ navigation, route }: Props) {
  const { workoutId } = route.params;
  const isEditing = Boolean(workoutId);
  const { workouts, isLoading, createWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  const [serverError, setServerError] = useState<string | null>(null);

  const existing = workoutId ? workouts.find((w) => w.id === workoutId) : undefined;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkoutFormValues>({
    defaultValues: {
      date: toIsoDate(new Date()),
      poolLength: 25,
      totalMeters: '',
      totalTimeMinutes: '',
      intensity: 'moderada',
      calories: '',
      notes: '',
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar entrenamiento' : 'Nuevo entrenamiento' });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (!existing) return;
    reset({
      date: existing.date,
      poolLength: existing.poolLength,
      totalMeters: String(existing.totalMeters),
      totalTimeMinutes: String(existing.totalTimeMinutes),
      intensity: existing.intensity,
      calories: existing.calories !== undefined ? String(existing.calories) : '',
      notes: existing.notes ?? '',
    });
  }, [existing, reset]);

  if (isEditing && isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isEditing && !isLoading && !existing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se encontró el entrenamiento.</Text>
      </View>
    );
  }

  const onSubmit = async (values: WorkoutFormValues) => {
    setServerError(null);

    const input: WorkoutInput = {
      date: values.date,
      poolLength: values.poolLength,
      totalMeters: Number(values.totalMeters),
      totalTimeMinutes: Number(values.totalTimeMinutes),
      intensity: values.intensity,
      calories: values.calories.trim() ? Number(values.calories) : undefined,
      notes: values.notes.trim() ? values.notes.trim() : undefined,
    };

    try {
      if (isEditing && workoutId) {
        await updateWorkout(workoutId, input);
      } else {
        await createWorkout(input);
      }
      navigation.goBack();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No se pudo guardar el entrenamiento.');
    }
  };

  const handleDelete = () => {
    if (!workoutId) return;
    Alert.alert(
      'Eliminar entrenamiento',
      'Esta acción no se puede deshacer. ¿Querés eliminarlo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkout(workoutId);
              navigation.goBack();
            } catch (err) {
              setServerError(err instanceof Error ? err.message : 'No se pudo eliminar el entrenamiento.');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Fecha</Text>
          <Controller
            control={control}
            name="date"
            rules={{
              required: 'La fecha es obligatoria',
              pattern: { value: DATE_REGEX, message: 'Formato AAAA-MM-DD' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.date && <Text style={styles.fieldError}>{errors.date.message}</Text>}

          <View style={styles.quickDatesRow}>
            {QUICK_DATES.map((quick) => (
              <TouchableOpacity
                key={quick.label}
                style={styles.quickDateChip}
                activeOpacity={0.8}
                onPress={() => setValue('date', quickDateIso(quick.offset))}
              >
                <Text style={styles.quickDateLabel}>{quick.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pileta</Text>
          <Controller
            control={control}
            name="poolLength"
            render={({ field: { onChange, value } }) => (
              <SegmentedControl options={POOL_OPTIONS} value={value} onChange={onChange} />
            )}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.flexField]}>
            <Text style={styles.label}>Metros totales</Text>
            <Controller
              control={control}
              name="totalMeters"
              rules={{
                required: 'Requerido',
                validate: (value) => (/^\d+$/.test(value) ? true : 'Ingresá un número'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="3000"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.totalMeters && <Text style={styles.fieldError}>{errors.totalMeters.message}</Text>}
          </View>

          <View style={{ width: spacing.md }} />

          <View style={[styles.field, styles.flexField]}>
            <Text style={styles.label}>Tiempo (min)</Text>
            <Controller
              control={control}
              name="totalTimeMinutes"
              rules={{
                required: 'Requerido',
                validate: (value) => (/^\d+$/.test(value) ? true : 'Ingresá un número'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="60"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.totalTimeMinutes && (
              <Text style={styles.fieldError}>{errors.totalTimeMinutes.message}</Text>
            )}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Intensidad</Text>
          <Controller
            control={control}
            name="intensity"
            render={({ field: { onChange, value } }) => (
              <SegmentedControl options={INTENSITY_OPTIONS} value={value} onChange={onChange} />
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Calorías (opcional)</Text>
          <Controller
            control={control}
            name="calories"
            rules={{
              validate: (value) => !value.trim() || /^\d+$/.test(value) || 'Ingresá un número',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="450"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.calories && <Text style={styles.fieldError}>{errors.calories.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notas (opcional)</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Cómo te sentiste, qué trabajaste..."
                placeholderTextColor={colors.textTertiary}
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
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
            <Text style={styles.submitLabel}>{isEditing ? 'Guardar cambios' : 'Agregar entrenamiento'}</Text>
          )}
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8} onPress={handleDelete}>
            <Text style={styles.deleteLabel}>Eliminar entrenamiento</Text>
          </TouchableOpacity>
        )}
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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  field: {
    marginBottom: spacing.md,
  },
  flexField: {
    flex: 1,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
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
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
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
  quickDatesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  quickDateChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  quickDateLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
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
  deleteButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  deleteLabel: {
    ...typography.bodyStrong,
    color: '#D14343',
  },
});
