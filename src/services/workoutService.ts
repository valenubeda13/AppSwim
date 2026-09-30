import { Workout, WorkoutInput } from '@/types';
import { generateId, storage, STORAGE_KEYS } from './storage';

async function readAll(): Promise<Workout[]> {
  return (await storage.get<Workout[]>(STORAGE_KEYS.workouts)) ?? [];
}

function sortedByDateDesc(workouts: Workout[]): Workout[] {
  // Orden estable: más reciente primero. Si dos entrenamientos comparten
  // fecha, gana el que se guardó último (por eso `create` inserta al
  // principio del array antes de persistir).
  return [...workouts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const workoutService = {
  async getAll(): Promise<Workout[]> {
    return sortedByDateDesc(await readAll());
  },

  async create(input: WorkoutInput): Promise<Workout> {
    const workout: Workout = { ...input, id: generateId(), sets: [] };
    const all = await readAll();
    await storage.set(STORAGE_KEYS.workouts, [workout, ...all]);
    return workout;
  },

  async update(id: string, input: WorkoutInput): Promise<Workout> {
    const all = await readAll();
    const index = all.findIndex((w) => w.id === id);
    if (index === -1) throw new Error('No se encontró el entrenamiento.');

    const updated: Workout = { ...all[index], ...input, id };
    all[index] = updated;
    await storage.set(STORAGE_KEYS.workouts, all);
    return updated;
  },

  async remove(id: string): Promise<void> {
    const all = await readAll();
    await storage.set(
      STORAGE_KEYS.workouts,
      all.filter((w) => w.id !== id)
    );
  },
};
