import { useMemo } from 'react';
import { Workout } from '@/types';
import { useWorkouts } from './useWorkouts';

/**
 * Un entrenamiento por id, desde el estado compartido: si se edita o se
 * borra en otra pantalla, esto se actualiza solo. `workout` es undefined
 * mientras carga o si ya no existe.
 */
export function useWorkout(id: string): { workout: Workout | undefined; isLoading: boolean } {
  const { workouts, isLoading } = useWorkouts();
  const workout = useMemo(() => workouts.find((w) => w.id === id), [workouts, id]);
  return { workout, isLoading };
}
