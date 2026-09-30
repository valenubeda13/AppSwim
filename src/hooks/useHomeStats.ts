import { useCallback, useEffect, useState } from 'react';
import { HomeStats, Workout } from '@/types';
import { workoutService } from '@/services/workoutService';
import { computeStreakDays, isSameMonth, sumWorkouts } from '@/utils/workoutStats';

function computeStats(workouts: Workout[]): HomeStats {
  const now = new Date();
  const monthWorkouts = workouts.filter((w) => isSameMonth(w.date, now));
  const { totalMeters, totalMinutes } = sumWorkouts(monthWorkouts);

  return {
    workoutsThisMonth: monthWorkouts.length,
    totalMetersThisMonth: totalMeters,
    totalMinutesThisMonth: totalMinutes,
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
    const workouts = await workoutService.getAll();
    setStats(computeStats(workouts));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, isLoading, reload: load };
}
