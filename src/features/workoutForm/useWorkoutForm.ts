import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Workout } from '@/types';
import { useWorkout } from '@/hooks/useWorkout';
import { useWorkouts } from '@/hooks/useWorkouts';
import { isISODate, toISODate } from '@/utils/date';
import { toSetFormValues } from '@/utils/sets';
import { WorkoutFormInput, WorkoutFormValues, workoutSchema } from './workoutSchema';

interface UseWorkoutFormOptions {
  /** Se llama después de guardar (para navegar, etc.). */
  onSaved?: (workout: Workout) => void;
}

/** Valores iniciales de un alta: el día recibido (si es válido) o hoy. */
function newWorkoutDefaults(date?: string): WorkoutFormInput {
  return {
    date: date && isISODate(date) ? date : toISODate(new Date()),
    poolLength: 25,
    totalMeters: '',
    durationSeconds: 0,
    intensity: 'medium',
    calories: '',
    notes: '',
    sets: [],
  };
}

/** Entreno guardado -> valores del form (inversa de lo que hace el esquema). */
function toFormInput(workout: Workout): WorkoutFormInput {
  return {
    date: workout.date,
    poolLength: workout.poolLength,
    totalMeters: String(workout.totalMeters),
    durationSeconds: workout.durationSeconds,
    intensity: workout.intensity,
    calories: workout.calories !== undefined ? String(workout.calories) : '',
    notes: workout.notes ?? '',
    sets: workout.sets.map(toSetFormValues),
  };
}

/**
 * Lógica del formulario de entrenamiento (alta y edición), separada de su
 * maquetado. Las reglas viven en `workoutSchema`; acá se arman los valores
 * iniciales y se guarda.
 *
 * - Sin `workoutId`: alta, con `date` como día inicial.
 * - Con `workoutId`: edición; el form se completa cuando el entreno carga.
 */
export function useWorkoutForm(
  workoutId?: string,
  date?: string,
  { onSaved }: UseWorkoutFormOptions = {}
) {
  const isEditing = Boolean(workoutId);
  const { addWorkout, updateWorkout } = useWorkouts();
  const { workout: existing, isLoading } = useWorkout(workoutId ?? '');
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<WorkoutFormInput, unknown, WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: existing ? toFormInput(existing) : newWorkoutDefaults(date),
    // Valida al salir de cada campo, no mientras se escribe.
    mode: 'onBlur',
  });
  const { reset } = form;

  // En edición el entreno puede no estar cargado al montar.
  useEffect(() => {
    if (existing) reset(toFormInput(existing));
  }, [existing, reset]);

  const onSubmit = useCallback(
    async (values: WorkoutFormValues) => {
      setServerError(null);
      try {
        const saved = workoutId ? await updateWorkout(workoutId, values) : await addWorkout(values);
        onSaved?.(saved);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : 'No se pudo guardar el entrenamiento.');
      }
    },
    [workoutId, addWorkout, updateWorkout, onSaved]
  );

  return { form, onSubmit, isEditing, existing, isLoading, serverError };
}
