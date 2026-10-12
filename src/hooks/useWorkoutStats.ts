import { useMemo } from 'react';
import { Workout } from '@/types';
import { parseISODate, startOfWeekISO } from '@/utils/date';
import { computeStreakDays, groupByMonth, sumDuration, sumMeters } from '@/utils/stats';
import { useToday } from './useToday';
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
 * piden "stats" y no suman arrays. Se recalcula cuando cambia la lista o el
 * día (para que la racha y "este mes" no queden viejos si pasa la medianoche).
 */
export function useWorkoutStats(): { stats: WorkoutStats; isLoading: boolean } {
  const { workouts, isLoading } = useWorkouts();
  const today = useToday();

  const stats = useMemo<WorkoutStats>(() => {
    const byMonth = Object.fromEntries(
      groupByMonth(workouts).map(({ month, workouts: list }) => [month, totalsOf(list)])
    );

    const todayDate = parseISODate(today);
    const currentMonth = today.slice(0, 7);
    const weekStart = startOfWeekISO(todayDate);

    return {
      total: totalsOf(workouts),
      thisMonth: byMonth[currentMonth] ?? EMPTY_TOTALS,
      byMonth,
      currentWeekMeters: sumMeters(workouts.filter((w) => w.date >= weekStart)),
      streakDays: computeStreakDays(workouts, todayDate),
    };
  }, [workouts, today]);

  return { stats, isLoading };
}
