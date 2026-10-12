import { useMemo } from 'react';
import { Workout } from '@/types';
import { startOfWeekISO, toISODate } from '@/utils/date';
import { computeStreakDays, groupByMonth, sumDuration, sumMeters } from '@/utils/stats';
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
  return { workouts: workouts.length, meters: sumMeters(workouts), seconds: sumDuration(workouts) };
}

/**
 * Estadísticas derivadas de los entrenamientos compartidos: las pantallas
 * piden "stats" y no suman arrays. Se recalcula solo cuando cambia la lista.
 */
export function useWorkoutStats(): { stats: WorkoutStats; isLoading: boolean } {
  const { workouts, isLoading } = useWorkouts();

  const stats = useMemo<WorkoutStats>(() => {
    const byMonth = Object.fromEntries(
      groupByMonth(workouts).map(({ month, workouts: list }) => [month, totalsOf(list)])
    );

    // Fecha local (no toISOString, que es UTC y a la noche ya es el día/mes siguiente).
    const currentMonth = toISODate(new Date()).slice(0, 7);
    const weekStart = startOfWeekISO();

    return {
      total: totalsOf(workouts),
      thisMonth: byMonth[currentMonth] ?? EMPTY_TOTALS,
      byMonth,
      currentWeekMeters: sumMeters(workouts.filter((w) => w.date >= weekStart)),
      streakDays: computeStreakDays(workouts),
    };
  }, [workouts]);

  return { stats, isLoading };
}
