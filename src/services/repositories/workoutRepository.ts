import { Intensity, NewWorkout, SwimStroke, Workout, WorkoutSet } from '@/types';
import { generateId } from '@/utils/id';
import { createWriteQueue, getItem, setItem, STORAGE_KEYS } from '../storage';

/** Forma con la que se guardaban los entrenos antes de pasar a `durationSeconds`. */
interface LegacyWorkout {
  id: string;
  date: string;
  poolLength: Workout['poolLength'];
  totalMeters: number;
  totalTimeMinutes: number;
  calories?: number;
  intensity: 'suave' | 'moderada' | 'alta';
  sets: {
    id: string;
    repetitions: number;
    distanceMeters: number;
    style: string;
    restSeconds?: number;
  }[];
  notes?: string;
}

const LEGACY_INTENSITY: Record<LegacyWorkout['intensity'], Intensity> = {
  suave: 'low',
  moderada: 'medium',
  alta: 'high',
};

const LEGACY_STROKE: Record<string, SwimStroke> = {
  crol: 'freestyle',
  espalda: 'backstroke',
  pecho: 'breaststroke',
  mariposa: 'butterfly',
  combinado: 'medley',
};

/** Pasa un entreno guardado con el formato viejo al actual (los nuevos quedan igual). */
function migrate(stored: Workout | LegacyWorkout): Workout {
  if (!('totalTimeMinutes' in stored)) return stored;

  const { totalTimeMinutes, intensity, sets, ...rest } = stored;
  const timestamp = `${stored.date}T00:00:00.000Z`;
  return {
    ...rest,
    durationSeconds: totalTimeMinutes * 60,
    intensity: LEGACY_INTENSITY[intensity],
    sets: sets.map((set): WorkoutSet => ({
      id: set.id,
      repetitions: set.repetitions,
      distance: set.distanceMeters,
      stroke: LEGACY_STROKE[set.style] ?? 'freestyle',
      restSeconds: set.restSeconds,
    })),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function readAll(): Promise<Workout[]> {
  const stored = await getItem<(Workout | LegacyWorkout)[]>(STORAGE_KEYS.workouts);
  return (stored ?? []).map(migrate);
}

function sortedByDateDesc(workouts: Workout[]): Workout[] {
  // Orden estable: más reciente primero. Si dos entrenamientos comparten
  // fecha, gana el que se guardó último (por eso `create` inserta al
  // principio del array antes de persistir).
  return [...workouts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Qué operaciones hay sobre los entrenamientos, sin decir cómo se guardan.
 * El resto de la app depende solo de esta interfaz: cambiar AsyncStorage
 * por otra base (ej. Supabase) es escribir otra implementación.
 */
export interface WorkoutRepository {
  /** Todos los entrenos, del más reciente al más viejo. */
  getAll(): Promise<Workout[]>;
  getById(id: string): Promise<Workout | null>;
  /** Genera id y createdAt/updatedAt. */
  create(input: NewWorkout): Promise<Workout>;
  /** Pisa solo los campos presentes en `changes` y actualiza updatedAt. */
  update(id: string, changes: Partial<NewWorkout>): Promise<Workout>;
  remove(id: string): Promise<void>;
}

/** Serializa las escrituras de esta clave (ver createWriteQueue). */
const enqueue = createWriteQueue();

/** Implementación local: guarda la lista completa en AsyncStorage. */
export const localWorkoutRepository: WorkoutRepository = {
  async getAll() {
    return sortedByDateDesc(await readAll());
  },

  async getById(id) {
    return (await readAll()).find((w) => w.id === id) ?? null;
  },

  create(input) {
    return enqueue(async () => {
      const now = new Date().toISOString();
      const workout: Workout = { ...input, id: generateId(), createdAt: now, updatedAt: now };
      const all = await readAll();
      await setItem(STORAGE_KEYS.workouts, [workout, ...all]);
      return workout;
    });
  },

  update(id, changes) {
    return enqueue(async () => {
      const all = await readAll();
      const index = all.findIndex((w) => w.id === id);
      if (index === -1) throw new Error('No se encontró el entrenamiento.');

      const updated: Workout = {
        ...all[index],
        ...changes,
        id,
        createdAt: all[index].createdAt,
        updatedAt: new Date().toISOString(),
      };
      all[index] = updated;
      await setItem(STORAGE_KEYS.workouts, all);
      return updated;
    });
  },

  remove(id) {
    return enqueue(async () => {
      const all = await readAll();
      await setItem(
        STORAGE_KEYS.workouts,
        all.filter((w) => w.id !== id)
      );
    });
  },
};

/** La implementación que usa la app. Cambiar de backend = cambiar esta línea. */
export const workoutRepository: WorkoutRepository = localWorkoutRepository;
