import { useCallback, useEffect, useState } from 'react';
import { HomeStats, Workout } from '@/types';
import { workoutService } from '@/services/workoutService';

function isSameMonth(dateIso: string, reference: Date): boolean {
  const date = new Date(dateIso);
  return date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear();
}

function computeStats(workouts: Workout[]): HomeStats {
  const now = new Date();
  const monthWorkouts = workouts.filter((w) => isSameMonth(w.date, now));

  return {
    workoutsThisMonth: monthWorkouts.length,
    totalMetersThisMonth: monthWorkouts.reduce((sum, w) => sum + w.totalMeters, 0),
    totalMinutesThisMonth: monthWorkouts.reduce((sum, w) => sum + w.totalTimeMinutes, 0),
    // Placeholder simple: se reemplaza por cálculo real de días consecutivos
    // cuando se implemente la pantalla de Entrenamientos.
    currentStreakDays: 12,
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
