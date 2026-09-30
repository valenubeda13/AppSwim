import { useCallback, useEffect, useState } from 'react';
import { Workout, WorkoutInput } from '@/types';
import { workoutService } from '@/services/workoutService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Entrenamientos del usuario logueado (Supabase). Usado por la pantalla
 * Entrenamientos para listar, crear, editar y borrar.
 */
export function useWorkouts() {
  const { session } = useAuth();
  const userId = session?.user.id;

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

  useEffect(() => {
    load();
  }, [load]);

  const createWorkout = useCallback(
    async (input: WorkoutInput) => {
      if (!userId) throw new Error('No hay sesión activa.');
      await workoutService.create(input, userId);
      await load();
    },
    [userId, load]
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
