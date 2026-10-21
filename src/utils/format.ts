/** Formatos de números y textos para mostrar. */

const KM_THRESHOLD = 10_000;

/** Número con separador de miles: 98400 -> "98.400" */
export function formatNumber(value: number): string {
  return value.toLocaleString('es-AR');
}

/** Un valor ya formateado con su unidad aparte, para mostrarlos con estilos distintos. */
export interface ValueWithUnit {
  value: string;
  unit: string;
}

/**
 * Distancia separada en número y unidad: desde 10.000 m pasa a km con un decimal.
 * 8400 -> { "8.400", "m" }, 12500 -> { "12,5", "km" }.
 */
export function formatMetersParts(meters: number): ValueWithUnit {
  if (meters < KM_THRESHOLD) return { value: formatNumber(meters), unit: 'm' };
  const km = (meters / 1000).toLocaleString('es-AR', { maximumFractionDigits: 1 });
  return { value: km, unit: 'km' };
}

/**
 * Distancia con unidad: desde 10.000 m pasa a km con un decimal.
 * 8400 -> "8.400 m", 12500 -> "12,5 km", 20000 -> "20 km".
 */
export function formatMeters(meters: number): string {
  const { value, unit } = formatMetersParts(meters);
  return `${value} ${unit}`;
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

/** Saludo según la hora del día. */
export function getGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Hola';
  return 'Buenas noches';
}
