import { useCallback, useEffect, useState } from 'react';
import { Workout } from '@/types';
import { workoutRepository } from '@/services/repositories';
import { computeStreakDays, isSameMonth, sumWorkouts } from '@/utils/workoutStats';

/** Estadísticas resumidas para la pantalla de Inicio (mes actual) */
export interface HomeStats {
  workoutsThisMonth: number;
  totalMetersThisMonth: number;
  totalSecondsThisMonth: number;
  currentStreakDays: number;
}

function computeStats(workouts: Workout[]): HomeStats {
  const now = new Date();
  const monthWorkouts = workouts.filter((w) => isSameMonth(w.date, now));
  const { totalMeters, totalSeconds } = sumWorkouts(monthWorkouts);

  return {
    workoutsThisMonth: monthWorkouts.length,
    totalMetersThisMonth: totalMeters,
    totalSecondsThisMonth: totalSeconds,
    currentStreakDays: computeStreakDays(workouts),
  };
}

/**
 * Hook de la pantalla Inicio: carga entrenamientos guardados
 * y devuelve las estadísticas ya calculadas para el mes actual.
 */
export function useHomeStats() {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const workouts = await workoutRepository.getAll();
    setStats(computeStats(workouts));
    setIsLoading(false);
  }, []);

  // IIFE: evita el falso positivo de react-hooks/set-state-in-effect
  // (facebook/react#34743) al llamar a `load` desde el efecto.
  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  return { stats, isLoading, reload: load };
}
