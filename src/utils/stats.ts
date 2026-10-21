import { addDays } from 'date-fns';
import { Workout } from '@/types';
import { toISODate } from './date';

/** Cálculos sobre listas de entrenamientos (funciones puras). */

export function sumMeters(workouts: Workout[]): number {
  return workouts.reduce((sum, w) => sum + w.totalMeters, 0);
}

/** Duración total en segundos. */
export function sumDuration(workouts: Workout[]): number {
  return workouts.reduce((sum, w) => sum + w.durationSeconds, 0);
}

/**
 * Ritmo promedio cada 100 m, en segundos. Es un dato derivado: no se guarda,
 * así si se editan los metros o el tiempo se recalcula solo.
 * null si no hay metros o tiempo (no se puede dividir).
 */
export function pacePer100Seconds(durationSeconds: number, totalMeters: number): number | null {
  if (totalMeters <= 0 || durationSeconds <= 0) return null;
  return (durationSeconds / totalMeters) * 100;
}

export interface MonthGroup {
  /** "YYYY-MM" */
  month: string;
  workouts: Workout[];
}

/**
 * Agrupa por mes respetando el orden de entrada (si llegan del más nuevo al
 * más viejo, los meses salen igual).
 */
export function groupByMonth(workouts: Workout[]): MonthGroup[] {
  const groups = new Map<string, Workout[]>();
  for (const workout of workouts) {
    const month = workout.date.slice(0, 7);
    const group = groups.get(month);
    if (group) group.push(workout);
    else groups.set(month, [workout]);
  }
  return Array.from(groups, ([month, list]) => ({ month, workouts: list }));
}

/**
 * Días consecutivos con al menos un entreno, contando hacia atrás desde hoy
 * (o desde ayer, si hoy todavía no entrenó). Si el último entreno fue antes
 * de ayer, la racha está cortada y da 0.
 */
export function computeStreakDays(workouts: Workout[], today: Date = new Date()): number {
  const days = new Set(workouts.map((w) => w.date));

  let cursor = today;
  if (!days.has(toISODate(cursor))) cursor = addDays(cursor, -1);

  let streak = 0;
  while (days.has(toISODate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
