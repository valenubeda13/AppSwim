import { useCallback, useEffect, useState } from 'react';
import { Reminder, ReminderInput } from '@/types';
import { reminderService } from '@/services/reminderService';

/**
 * Recordatorios guardados localmente (AsyncStorage). Expone también
 * `activeCount`, el número que se muestra en Perfil ("Recordatorios: N activos").
 */
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setReminders(await reminderService.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los recordatorios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createReminder = useCallback(
    async (input: ReminderInput) => {
      await reminderService.create(input);
      await load();
    },
    [load]
  );

  const updateReminder = useCallback(
    async (id: string, input: ReminderInput) => {
      await reminderService.update(id, input);
      await load();
    },
    [load]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      await reminderService.remove(id);
      await load();
    },
    [load]
  );

  const activeCount = reminders.filter((r) => r.isActive).length;

  return {
    reminders,
    activeCount,
    isLoading,
    error,
    reload: load,
    createReminder,
    updateReminder,
    deleteReminder,
  };
}
