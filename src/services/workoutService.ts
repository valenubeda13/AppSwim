import { Workout } from '@/types';
import { storage, STORAGE_KEYS } from './storage';

/**
 * Datos de ejemplo para poder ver la Home con contenido real
 * mientras la pantalla "Entrenamientos" todavía no está construida.
 * Se cargan una sola vez si no hay nada guardado en AsyncStorage.
 */
const SEED_WORKOUTS: Workout[] = [
  {
    id: 'seed-1',
    date: new Date().toISOString().slice(0, 10),
    poolLength: 25,
    totalMeters: 3200,
    totalTimeMinutes: 65,
    intensity: 'alta',
    sets: [],
  },
  {
    id: 'seed-2',
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    poolLength: 50,
    totalMeters: 2800,
    totalTimeMinutes: 55,
    intensity: 'moderada',
    sets: [],
  },
];

export const workoutService = {
  async getAll(): Promise<Workout[]> {
    const stored = await storage.get<Workout[]>(STORAGE_KEYS.workouts);
    if (stored && stored.length > 0) return stored;

    await storage.set(STORAGE_KEYS.workouts, SEED_WORKOUTS);
    return SEED_WORKOUTS;
  },

  async save(workouts: Workout[]): Promise<void> {
    await storage.set(STORAGE_KEYS.workouts, workouts);
  },
};
