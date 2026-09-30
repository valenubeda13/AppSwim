import { Workout } from '@/types';
import { parseLocalDate, toIsoDate } from './formatters';

export function isSameMonth(dateIso: string, reference: Date): boolean {
  const date = parseLocalDate(dateIso);
  return date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear();
}

/**
 * Lunes de la semana que contiene `reference`, en "yyyy-MM-dd". Comparable
 * como string contra `workout.date` porque el formato ISO ordena igual
 * lexicográfica y cronológicamente.
 */
export function startOfWeekIso(reference: Date = new Date()): string {
  const date = new Date(reference);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0 = domingo ... 6 = sábado
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return toIsoDate(date);
}

export function sumWorkouts(workouts: Workout[]): { totalMeters: number; totalMinutes: number } {
  return workouts.reduce(
    (acc, w) => ({
      totalMeters: acc.totalMeters + w.totalMeters,
      totalMinutes: acc.totalMinutes + w.totalTimeMinutes,
    }),
    { totalMeters: 0, totalMinutes: 0 }
  );
}

/**
 * Cuenta los días consecutivos (hasta hoy o ayer) en los que hubo
 * al menos un entrenamiento registrado. Si el último entrenamiento
 * fue hace más de un día, la racha se considera cortada.
 */
export function computeStreakDays(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;

  const uniqueDaysDesc = Array.from(new Set(workouts.map((w) => w.date))).sort().reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = parseLocalDate(uniqueDaysDesc[0]);
  const daysSinceLast = Math.round((today.getTime() - mostRecent.getTime()) / 86_400_000);
  if (daysSinceLast > 1) return 0;

  let streak = 0;
  let cursor = mostRecent;

  for (const dayIso of uniqueDaysDesc) {
    const day = parseLocalDate(dayIso);
    if (day.getTime() === cursor.getTime()) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 86_400_000);
    } else if (day.getTime() < cursor.getTime()) {
      break;
    }
  }

  return streak;
}
