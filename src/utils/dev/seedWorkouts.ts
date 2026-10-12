import { addDays, startOfMonth } from 'date-fns';
import { Intensity, NewWorkout, PoolLength, SwimStroke, Workout, WorkoutSet } from '@/types';
import { toISODate } from '../date';
import { generateId } from '../id';

/** Marca en `notes` para reconocer (y borrar) los entrenos de ejemplo. */
export const SEED_NOTE = '[seed] Entreno de ejemplo';

const SEED_COUNT = 15;

const INTENSITIES: Intensity[] = ['low', 'medium', 'medium', 'high', 'max'];
const STROKES: SwimStroke[] = ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'medley'];

/**
 * Días para los entrenos: los del mes actual hasta hoy, de a uno sí y uno
 * no con algunos seguidos (para que haya racha). Si el mes recién empieza y
 * no alcanzan, completa con días del mes anterior. Nunca días futuros.
 */
function seedDates(today: Date): string[] {
  const dates: string[] = [];
  let cursor = today;
  let index = 0;
  const monthStart = startOfMonth(today);

  // Primero el mes actual, salteando algunos días para que no quede todo pintado.
  while (cursor >= monthStart && dates.length < SEED_COUNT) {
    if (index < 3 || index % 3 !== 2) dates.push(toISODate(cursor));
    cursor = addDays(cursor, -1);
    index += 1;
  }
  // Si no alcanzó (principio de mes), completa hacia atrás.
  while (dates.length < SEED_COUNT) {
    dates.push(toISODate(cursor));
    cursor = addDays(cursor, -2);
  }
  return dates;
}

function buildSets(i: number, poolLength: PoolLength): WorkoutSet[] {
  return [
    {
      id: generateId(),
      repetitions: 1,
      distance: 400,
      stroke: 'freestyle',
      description: 'Entrada en calor',
    },
    {
      id: generateId(),
      repetitions: 4 + (i % 5) * 2,
      distance: poolLength * 4,
      stroke: STROKES[i % STROKES.length],
      restSeconds: 15 + (i % 3) * 15,
    },
    {
      id: generateId(),
      repetitions: 1,
      distance: 200,
      stroke: 'backstroke',
      description: 'Vuelta a la calma',
    },
  ];
}

/**
 * ~15 entrenos variados (pileta, metros, duración, intensidad, series) del
 * mes actual. Determinístico: la misma fecha de hoy da los mismos datos.
 */
export function buildSeedWorkouts(today: Date = new Date()): NewWorkout[] {
  return seedDates(today).map((date, i) => {
    const poolLength: PoolLength = i % 4 === 3 ? 50 : 25;
    const sets = buildSets(i, poolLength);
    const totalMeters = sets.reduce((sum, set) => sum + set.repetitions * set.distance, 0);
    // Ritmo de entre 1:50 y 2:20 por cada 100 m, más descansos.
    const pacePer100 = 110 + (i % 4) * 10;
    const durationSeconds = Math.round(((totalMeters / 100) * pacePer100) / 60) * 60;

    return {
      date,
      poolLength,
      totalMeters,
      durationSeconds,
      calories: Math.round(totalMeters * 0.25),
      intensity: INTENSITIES[i % INTENSITIES.length],
      sets,
      notes: SEED_NOTE,
    };
  });
}

/**
 * Carga los entrenos de ejemplo a través de `addWorkout` (el del
 * WorkoutsProvider, así todas las pantallas se enteran). Solo en desarrollo.
 */
export async function seedWorkouts(addWorkout: (input: NewWorkout) => Promise<unknown>) {
  if (!__DEV__) throw new Error('El seed de entrenos solo está disponible en desarrollo.');
  for (const workout of buildSeedWorkouts()) await addWorkout(workout);
}

/** Borra solo los entrenos de ejemplo (los reconoce por `SEED_NOTE`). */
export async function clearSeedWorkouts(
  workouts: Workout[],
  deleteWorkout: (id: string) => Promise<unknown>
) {
  if (!__DEV__) throw new Error('El seed de entrenos solo está disponible en desarrollo.');
  for (const workout of workouts) {
    if (workout.notes === SEED_NOTE) await deleteWorkout(workout.id);
  }
}
