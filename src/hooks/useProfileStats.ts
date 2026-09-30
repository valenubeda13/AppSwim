import { useMemo } from 'react';
import { useWorkouts } from './useWorkouts';
import { computeStreakDays, startOfWeekIso, sumWorkouts } from '@/utils/workoutStats';

export interface ProfileStats {
  totalWorkouts: number;
  totalMeters: number;
  totalMinutes: number;
  streakDays: number;
  currentWeekMeters: number;
}

/**
 * Estadísticas de toda la vida del usuario (para el header de Perfil) +
 * metros nadados en la semana actual (para el progreso de la meta semanal).
 */
export function useProfileStats() {
  const { workouts, isLoading } = useWorkouts();

  const stats = useMemo<ProfileStats>(() => {
    const { totalMeters, totalMinutes } = sumWorkouts(workouts);
    const weekStart = startOfWeekIso();
    const currentWeekMeters = workouts
      .filter((w) => w.date >= weekStart)
      .reduce((sum, w) => sum + w.totalMeters, 0);

    return {
      totalWorkouts: workouts.length,
      totalMeters,
      totalMinutes,
      streakDays: computeStreakDays(workouts),
      currentWeekMeters,
    };
  }, [workouts]);

  return { stats, isLoading };
}
