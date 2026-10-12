import { useCallback, useEffect, useState } from 'react';
import { NewWorkout, Workout } from '@/types';
import { workoutRepository } from '@/services/repositories';

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
      setWorkouts(await workoutRepository.getAll());
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
    async (input: NewWorkout) => {
      await workoutRepository.create(input);
      await load();
    },
    [load]
  );

  const updateWorkout = useCallback(
    async (id: string, input: NewWorkout) => {
      await workoutRepository.update(id, input);
      await load();
    },
    [load]
  );

  const deleteWorkout = useCallback(
    async (id: string) => {
      await workoutRepository.remove(id);
      await load();
    },
    [load]
  );

  return { workouts, isLoading, error, reload: load, createWorkout, updateWorkout, deleteWorkout };
}
