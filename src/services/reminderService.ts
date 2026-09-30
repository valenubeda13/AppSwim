import { Reminder, ReminderInput } from '@/types';
import { generateId, storage, STORAGE_KEYS } from './storage';

async function readAll(): Promise<Reminder[]> {
  return (await storage.get<Reminder[]>(STORAGE_KEYS.reminders)) ?? [];
}

function sortedByTime(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));
}

export const reminderService = {
  async getAll(): Promise<Reminder[]> {
    return sortedByTime(await readAll());
  },

  async create(input: ReminderInput): Promise<Reminder> {
    const reminder: Reminder = { ...input, id: generateId() };
    const all = await readAll();
    await storage.set(STORAGE_KEYS.reminders, [...all, reminder]);
    return reminder;
  },

  async update(id: string, input: ReminderInput): Promise<Reminder> {
    const all = await readAll();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('No se encontró el recordatorio.');

    const updated: Reminder = { ...input, id };
    all[index] = updated;
    await storage.set(STORAGE_KEYS.reminders, all);
    return updated;
  },

  async remove(id: string): Promise<void> {
    const all = await readAll();
    await storage.set(STORAGE_KEYS.reminders, all.filter((r) => r.id !== id));
  },
};
