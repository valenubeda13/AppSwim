import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { NewWorkout, Workout } from '@/types';
import { workoutRepository } from '@/services/repositories';

export interface WorkoutsContextValue {
  /** Del más reciente al más viejo. */
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addWorkout: (input: NewWorkout) => Promise<Workout>;
  updateWorkout: (id: string, changes: Partial<NewWorkout>) => Promise<Workout>;
  deleteWorkout: (id: string) => Promise<void>;
  /** Deshace un borrado: vuelve a guardar el entreno tal cual era. */
  restoreWorkout: (workout: Workout) => Promise<void>;
}

export const WorkoutsContext = createContext<WorkoutsContextValue | null>(null);

/**
 * Única fuente de verdad de los entrenamientos: carga una vez al iniciar y
 * cada alta/edición/baja actualiza este estado, así que todas las pantallas
 * (Inicio, Entrenamientos, Perfil, calendario) se re-renderizan solas.
 * Se consume con `useWorkouts()` y los hooks derivados.
 */
export function WorkoutsProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
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
  // (facebook/react#34743) al llamar a `reload` desde el efecto.
  useEffect(() => {
    void (async () => {
      await reload();
    })();
  }, [reload]);

  // Después de cada cambio se vuelve a pedir la lista al repositorio (en vez
  // de editar el array acá) para que el orden lo decida un solo lugar.
  const refresh = useCallback(async () => {
    setWorkouts(await workoutRepository.getAll());
  }, []);

  const addWorkout = useCallback(
    async (input: NewWorkout) => {
      const created = await workoutRepository.create(input);
      await refresh();
      return created;
    },
    [refresh]
  );

  const updateWorkout = useCallback(
    async (id: string, changes: Partial<NewWorkout>) => {
      const updated = await workoutRepository.update(id, changes);
      await refresh();
      return updated;
    },
    [refresh]
  );

  const deleteWorkout = useCallback(
    async (id: string) => {
      await workoutRepository.remove(id);
      await refresh();
    },
    [refresh]
  );

  const restoreWorkout = useCallback(
    async (workout: Workout) => {
      await workoutRepository.restore(workout);
      await refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      workouts,
      isLoading,
      error,
      reload,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      restoreWorkout,
    }),
    [workouts, isLoading, error, reload, addWorkout, updateWorkout, deleteWorkout, restoreWorkout]
  );

  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>;
}
