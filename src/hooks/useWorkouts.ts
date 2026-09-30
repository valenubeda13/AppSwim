import { useCallback, useEffect, useState } from 'react';
import { Workout, WorkoutInput } from '@/types';
import { workoutService } from '@/services/workoutService';

/**
 * Entrenamientos guardados localmente (AsyncStorage). Usado por la
 * pantalla Entrenamientos para listar, crear, editar y borrar.
 */
export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setWorkouts(await workoutService.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los entrenamientos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // IIFE: evita el falso positivo de react-hooks/set-state-in-effect
  // (facebook/react#34743) al llamar a `load` desde el efecto.
  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  const createWorkout = useCallback(
    async (input: WorkoutInput) => {
      await workoutService.create(input);
      await load();
    },
    [load]
  );

  const updateWorkout = useCallback(
    async (id: string, input: WorkoutInput) => {
      await workoutService.update(id, input);
      await load();
    },
    [load]
  );

  const deleteWorkout = useCallback(
    async (id: string) => {
      await workoutService.remove(id);
      await load();
    },
    [load]
  );

  return { workouts, isLoading, error, reload: load, createWorkout, updateWorkout, deleteWorkout };
}
