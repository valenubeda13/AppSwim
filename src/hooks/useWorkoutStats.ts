import { useMemo } from 'react';
import { Workout } from '@/types';
import { toIsoDate } from '@/utils/formatters';
import { computeStreakDays, startOfWeekIso, sumWorkouts } from '@/utils/workoutStats';
import { useWorkouts } from './useWorkouts';

/** Totales de un conjunto de entrenamientos. */
export interface WorkoutTotals {
  workouts: number;
  meters: number;
  seconds: number;
}

export interface WorkoutStats {
  /** De toda la vida. */
  total: WorkoutTotals;
  /** Del mes actual. */
  thisMonth: WorkoutTotals;
  /** Por mes, con clave "YYYY-MM". */
  byMonth: Record<string, WorkoutTotals>;
  /** Metros desde el lunes de esta semana (para la meta semanal). */
  currentWeekMeters: number;
  streakDays: number;
}

const EMPTY_TOTALS: WorkoutTotals = { workouts: 0, meters: 0, seconds: 0 };

function totalsOf(workouts: Workout[]): WorkoutTotals {
  const { totalMeters, totalSeconds } = sumWorkouts(workouts);
  return { workouts: workouts.length, meters: totalMeters, seconds: totalSeconds };
}

/**
 * Estadísticas derivadas de los entrenamientos compartidos: las pantallas
 * piden "stats" y no suman arrays. Se recalcula solo cuando cambia la lista.
 */
export function useWorkoutStats(): { stats: WorkoutStats; isLoading: boolean } {
  const { workouts, isLoading } = useWorkouts();

  const stats = useMemo<WorkoutStats>(() => {
    const listsByMonth: Record<string, Workout[]> = {};
    for (const workout of workouts) {
      (listsByMonth[workout.date.slice(0, 7)] ??= []).push(workout);
    }
    const byMonth = Object.fromEntries(
      Object.entries(listsByMonth).map(([month, list]) => [month, totalsOf(list)])
    );

    // Fecha local (no toISOString, que es UTC y a la noche ya es el día/mes siguiente).
    const currentMonth = toIsoDate(new Date()).slice(0, 7);
    const weekStart = startOfWeekIso();

    return {
      total: totalsOf(workouts),
      thisMonth: byMonth[currentMonth] ?? EMPTY_TOTALS,
      byMonth,
      currentWeekMeters: workouts
        .filter((w) => w.date >= weekStart)
        .reduce((sum, w) => sum + w.totalMeters, 0),
      streakDays: computeStreakDays(workouts),
    };
  }, [workouts]);

  return { stats, isLoading };
}
