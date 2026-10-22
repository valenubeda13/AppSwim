import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useDeleteWorkout } from '@/hooks/useDeleteWorkout';
import { SegmentedControl } from '@/components/ui';
import { SetsEditor } from '@/components/workouts';
import { Intensity, NewWorkout, PoolLength } from '@/types';
import { isISODate, toISODate } from '@/utils/date';
import { fromSetFormValues, SetFormValues, toSetFormValues } from '@/utils/sets';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutForm'>;

interface WorkoutFormValues {
  date: string;
  poolLength: PoolLength;
  totalMeters: string;
  durationMinutes: string;
  intensity: Intensity;
  calories: string;
  notes: string;
  sets: SetFormValues[];
}

const POOL_OPTIONS: { value: PoolLength; label: string }[] = [
  { value: 25, label: '25 m' },
  { value: 50, label: '50 m' },
];

const INTENSITY_OPTIONS: { value: Intensity; label: string }[] = [
  { value: 'low', label: 'Suave' },
  { value: 'medium', label: 'Moderada' },
  { value: 'high', label: 'Alta' },
  { value: 'max', label: 'Máxima' },
];

const QUICK_DATES = [
  { label: 'Hoy', offset: 0 },
  { label: 'Ayer', offset: 1 },
  { label: 'Anteayer', offset: 2 },
];

function quickDateIso(offsetDays: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - offsetDays);
  return toISODate(date);
}

/**
 * Alta y edición de un entrenamiento (mismo formulario para ambos casos,
 * según si `route.params.workoutId` viene definido).
 */
export function WorkoutFormScreen({ navigation, route }: Props) {
  // `date` llega al abrir el alta desde un día del calendario (FAB o "Registrar").
  const { workoutId, date: initialDate } = route.params;
  const isEditing = Boolean(workoutId);
  const { workouts, isLoading, addWorkout, updateWorkout } = useWorkouts();
  const deleteWithUndo = useDeleteWorkout();
  const [serverError, setServerError] = useState<string | null>(null);

  const existing = workoutId ? workouts.find((w) => w.id === workoutId) : undefined;

  const form = useForm<WorkoutFormValues>({
    defaultValues: {
      date: initialDate && isISODate(initialDate) ? initialDate : toISODate(new Date()),
      poolLength: 25,
      totalMeters: '',
      durationMinutes: '',
      intensity: 'medium',
      calories: '',
      notes: '',
      sets: [],
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar entrenamiento' : 'Nuevo entrenamiento' });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (!existing) return;
    reset({
      date: existing.date,
      poolLength: existing.poolLength,
      totalMeters: String(existing.totalMeters),
      durationMinutes: String(Math.round(existing.durationSeconds / 60)),
      intensity: existing.intensity,
      calories: existing.calories !== undefined ? String(existing.calories) : '',
      notes: existing.notes ?? '',
      sets: existing.sets.map(toSetFormValues),
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

    const input: NewWorkout = {
      date: values.date,
      poolLength: values.poolLength,
      totalMeters: Number(values.totalMeters),
      // El formulario pide minutos; se guarda en segundos.
      durationSeconds: Number(values.durationMinutes) * 60,
      intensity: values.intensity,
      calories: values.calories.trim() ? Number(values.calories) : undefined,
      notes: values.notes.trim() ? values.notes.trim() : undefined,
      sets: values.sets.map(fromSetFormValues),
    };

    try {
      if (isEditing && workoutId) {
        await updateWorkout(workoutId, input);
      } else {
        await addWorkout(input);
      }
      navigation.goBack();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No se pudo guardar el entrenamiento.');
    }
  };

  const handleDelete = () => {
    if (!existing) return;
    // Mismo borrado con "Deshacer" que el resto de la app (sin confirmación).
    void deleteWithUndo(existing);
    navigation.goBack();
  };

  return (
    <FormProvider {...form}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.root}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <Text style={styles.label}>Fecha</Text>
            <Controller
              control={control}
              name="date"
              rules={{
                required: 'La fecha es obligatoria',
                validate: (value) => isISODate(value) || 'Fecha inválida (formato AAAA-MM-DD)',
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
              {errors.totalMeters && (
                <Text style={styles.fieldError}>{errors.totalMeters.message}</Text>
              )}
            </View>

            <View style={{ width: spacing.md }} />

            <View style={[styles.field, styles.flexField]}>
              <Text style={styles.label}>Tiempo (min)</Text>
              <Controller
                control={control}
                name="durationMinutes"
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
              {errors.durationMinutes && (
                <Text style={styles.fieldError}>{errors.durationMinutes.message}</Text>
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

          <View style={styles.field}>
            <Text style={styles.label}>Series (opcional)</Text>
            <SetsEditor />
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
              <Text style={styles.submitLabel}>
                {isEditing ? 'Guardar cambios' : 'Agregar entrenamiento'}
              </Text>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              onPress={handleDelete}
            >
              <Text style={styles.deleteLabel}>Eliminar entrenamiento</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
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
    color: colors.error,
    marginTop: spacing.xs,
  },
  serverError: {
    ...typography.caption,
    color: colors.error,
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
    fontFamily: fontFamily.bold,
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
    color: colors.error,
  },
});
