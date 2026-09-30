import { Workout, WorkoutInput } from '@/types';
import { supabase } from './supabaseClient';

/**
 * Fila cruda de la tabla `workouts` (snake_case, como la deja Postgres).
 * `workout_sets` todavía no se consulta acá: v1 no tiene desglose de series.
 */
interface WorkoutRow {
  id: string;
  date: string;
  pool_length: 25 | 50;
  total_meters: number;
  total_time_minutes: number;
  calories: number | null;
  intensity: Workout['intensity'];
  notes: string | null;
}

function fromRow(row: WorkoutRow): Workout {
  return {
    id: row.id,
    date: row.date,
    poolLength: row.pool_length,
    totalMeters: row.total_meters,
    totalTimeMinutes: row.total_time_minutes,
    calories: row.calories ?? undefined,
    intensity: row.intensity,
    notes: row.notes ?? undefined,
    sets: [],
  };
}

function toRow(input: WorkoutInput) {
  return {
    date: input.date,
    pool_length: input.poolLength,
    total_meters: input.totalMeters,
    total_time_minutes: input.totalTimeMinutes,
    calories: input.calories ?? null,
    intensity: input.intensity,
    notes: input.notes ?? null,
  };
}

export const workoutService = {
  async getAll(): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as WorkoutRow[]).map(fromRow);
  },

  async create(input: WorkoutInput, userId: string): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .insert({ ...toRow(input), user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data as WorkoutRow);
  },

  async update(id: string, input: WorkoutInput): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .update(toRow(input))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data as WorkoutRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
