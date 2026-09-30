import { Reminder, ReminderInput } from '@/types';
import { supabase } from './supabaseClient';

/** Fila cruda de la tabla `reminders` (snake_case, como la deja Postgres). */
interface ReminderRow {
  id: string;
  label: string;
  time_of_day: string;
  days_of_week: number[];
  is_active: boolean;
}

function fromRow(row: ReminderRow): Reminder {
  return {
    id: row.id,
    label: row.label,
    timeOfDay: row.time_of_day,
    daysOfWeek: row.days_of_week,
    isActive: row.is_active,
  };
}

function toRow(input: ReminderInput) {
  return {
    label: input.label,
    time_of_day: input.timeOfDay,
    days_of_week: input.daysOfWeek,
    is_active: input.isActive,
  };
}

export const reminderService = {
  async getAll(): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('time_of_day', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as ReminderRow[]).map(fromRow);
  },

  async create(input: ReminderInput, userId: string): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .insert({ ...toRow(input), user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data as ReminderRow);
  },

  async update(id: string, input: ReminderInput): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .update(toRow(input))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data as ReminderRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
