/**
 * Formatea metros con separador de miles, ej: 98400 -> "98.400"
 */
export function formatMeters(meters: number): string {
  return meters.toLocaleString('es-AR');
}

/**
 * Convierte minutos totales a formato "Xh Ymin".
 * Ej: 2790 -> "46 h 30 min"
 */
export function formatDuration(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

/**
 * Devuelve un saludo según la hora del día.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Hola';
  return 'Buenas noches';
}
