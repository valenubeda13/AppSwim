/** Recordatorio de entrenamiento configurado por el usuario */
export interface Reminder {
  id: string;
  label: string;
  timeOfDay: string; // "HH:mm:ss"
  daysOfWeek: number[]; // 0 = domingo ... 6 = sábado
  isActive: boolean;
}

/** Datos que carga el usuario al crear/editar un recordatorio */
export type ReminderInput = Omit<Reminder, 'id'>;
