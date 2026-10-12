import { useMemo } from 'react';
import { Workout } from '@/types';
import { useWorkouts } from './useWorkouts';

/** Entrenamientos de un día ("YYYY-MM-DD"), ej. el día tocado en el calendario. */
export function useWorkoutsByDate(date: string): Workout[] {
  const { workouts } = useWorkouts();
  return useMemo(() => workouts.filter((w) => w.date === date), [workouts, date]);
}
