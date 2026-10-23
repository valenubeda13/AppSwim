import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormProvider } from 'react-hook-form';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

import { colors, radius, spacing, typography } from '@/theme';
import { useDeleteWorkout } from '@/hooks/useDeleteWorkout';
import {
  DateField,
  DurationField,
  IntensityPicker,
  PoolLengthField,
  TextField,
} from '@/components/form';
import { SetsEditor } from '@/components/workouts';
import { NOTES_MAX_LENGTH, useWorkoutForm } from '@/features/workoutForm';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutForm'>;

/**
 * Alta y edición de un entrenamiento (mismo formulario para ambos casos,
 * según si `route.params.workoutId` viene definido).
 */
export function WorkoutFormScreen({ navigation, route }: Props) {
  // `date` llega al abrir el alta desde un día del calendario (FAB o "Registrar").
  const { workoutId, date: initialDate } = route.params;
  const deleteWithUndo = useDeleteWorkout();

  // Lleva el calendario a la fecha guardada (puede no ser el día que estaba
  // seleccionado). Se setea el param sin navegar: si se editó desde el
  // detalle, se vuelve al detalle como siempre.
  const showDateInCalendar = (savedDate: string) => {
    const listRoute = navigation.getState().routes.find((r) => r.name === 'WorkoutsList');
    if (listRoute) {
      navigation.dispatch({
        ...CommonActions.setParams({ date: savedDate }),
        source: listRoute.key,
      });
    }
  };

  const { form, onSubmit, isEditing, existing, isLoading, serverError } = useWorkoutForm(
    workoutId,
    initialDate,
    {
      onSaved: (saved) => {
        showDateInCalendar(saved.date);
        navigation.goBack();
      },
    }
  );
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar entrenamiento' : 'Nuevo entrenamiento' });
  }, [navigation, isEditing]);

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
          <DateField control={control} name="date" label="Fecha" />
          <PoolLengthField control={control} name="poolLength" label="Pileta" />
          <TextField
            control={control}
            name="totalMeters"
            label="Metros totales"
            placeholder="3000"
            keyboardType="number-pad"
            suffix="m"
          />
          <DurationField control={control} name="durationSeconds" label="Tiempo total" />
          <IntensityPicker control={control} name="intensity" label="Intensidad" />
          <TextField
            control={control}
            name="calories"
            label="Calorías (opcional)"
            placeholder="450"
            keyboardType="number-pad"
            suffix="kcal"
          />
          <TextField
            control={control}
            name="notes"
            label="Notas (opcional)"
            placeholder="Cómo te sentiste, qué trabajaste..."
            multiline
            maxLength={NOTES_MAX_LENGTH}
            showCounter
          />

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
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  serverError: {
    ...typography.caption,
    color: colors.error,
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
