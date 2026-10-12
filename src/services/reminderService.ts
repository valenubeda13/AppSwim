import { Reminder, ReminderInput } from '@/types';
import { generateId } from '@/utils/id';
import { createWriteQueue, getItem, setItem, STORAGE_KEYS } from './storage';

async function readAll(): Promise<Reminder[]> {
  return (await getItem<Reminder[]>(STORAGE_KEYS.reminders)) ?? [];
}

function sortedByTime(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));
}

/** Serializa las escrituras de esta clave (ver createWriteQueue). */
const enqueue = createWriteQueue();

export const reminderService = {
  async getAll(): Promise<Reminder[]> {
    return sortedByTime(await readAll());
  },

  create(input: ReminderInput): Promise<Reminder> {
    return enqueue(async () => {
      const reminder: Reminder = { ...input, id: generateId() };
      const all = await readAll();
      await setItem(STORAGE_KEYS.reminders, [...all, reminder]);
      return reminder;
    });
  },

  update(id: string, input: ReminderInput): Promise<Reminder> {
    return enqueue(async () => {
      const all = await readAll();
      const index = all.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('No se encontró el recordatorio.');

      const updated: Reminder = { ...input, id };
      all[index] = updated;
      await setItem(STORAGE_KEYS.reminders, all);
      return updated;
    });
  },

  remove(id: string): Promise<void> {
    return enqueue(async () => {
      const all = await readAll();
      await setItem(
        STORAGE_KEYS.reminders,
        all.filter((r) => r.id !== id)
      );
    });
  },
};
