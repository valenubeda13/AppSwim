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
 * Iniciales de un nombre para usar como avatar de respaldo (sin foto),
 * ej: "Valentina Ubeda" -> "VU", "Nadador/a" -> "N".
 */
export function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials || '?';
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

/**
 * Convierte un string de fecha "yyyy-MM-dd" a un Date en horario local
 * a medianoche. `new Date('yyyy-MM-dd')` interpreta el string como UTC,
 * lo que corre la fecha un día para usuarios en zonas horarias negativas
 * (ej: Argentina, UTC-3) y puede hacer que un entrenamiento quede
 * contado en el mes o día equivocado.
 */
export function parseLocalDate(dateIso: string): Date {
  const [year, month, day] = dateIso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Inverso de parseLocalDate: Date local -> "yyyy-MM-dd" */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Etiqueta corta para mostrar una fecha en listados/formularios:
 * "Hoy", "Ayer", o "18 ago" (agrega el año solo si no es el actual).
 */
export function formatDateLabel(dateIso: string): string {
  const date = parseLocalDate(dateIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';

  const includeYear = date.getFullYear() !== today.getFullYear();
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: includeYear ? 'numeric' : undefined,
  });
}

/** Título de agrupación mensual para la lista de entrenamientos, ej: "Agosto 2026" */
export function formatMonthTitle(dateIso: string): string {
  const date = parseLocalDate(dateIso);
  const label = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
