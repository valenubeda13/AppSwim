import { useMemo } from 'react';
import { useWorkouts } from './useWorkouts';

/** Formato de `markedDates` de react-native-calendars. */
export type MarkedDates = Record<string, { marked: true }>;

/** Días con al menos un entreno, listos para pasarle al calendario. */
export function useMarkedDates(): MarkedDates {
  const { workouts } = useWorkouts();
  return useMemo(() => {
    const marked: MarkedDates = {};
    for (const workout of workouts) marked[workout.date] = { marked: true };
    return marked;
  }, [workouts]);
}
