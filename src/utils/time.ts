/**
 * Tiempos. Se guardan como enteros (duración de entrenos en segundos,
 * marcas en milisegundos) y se formatean recién al mostrarlos.
 */

const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * Duración de un entreno: 3900 -> "1 h 05 min", 2700 -> "45 min".
 * Redondea al minuto.
 */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} h ${pad2(minutes)} min` : `${minutes} min`;
}

/**
 * Duración corta para stats, con la unidad aparte (entra en una columna
 * angosta): 2700 -> { "45", "min" }, 3900 -> { "1:05", "h" }.
 * Redondea al minuto.
 */
export function formatDurationParts(seconds: number): { value: string; unit: string } {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0
    ? { value: `${hours}:${pad2(minutes)}`, unit: 'h' }
    : { value: String(minutes), unit: 'min' };
}

/**
 * Ritmo o descanso corto en "m:ss": 105 -> "1:45", 20 -> "0:20".
 * Redondea al segundo.
 */
export function formatMinSec(seconds: number): string {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${pad2(total % 60)}`;
}

/** Descanso entre repeticiones: 20 -> "20 s", 90 -> "1:30". */
export function formatRest(seconds: number): string {
  return seconds < 60 ? `${Math.round(seconds)} s` : formatMinSec(seconds);
}

/**
 * Tiempo de una marca, con centésimas: 62450 -> "1:02.45", 28300 -> "28.30".
 * Redondea a la centésima.
 */
export function formatSwimTime(ms: number): string {
  const totalHundredths = Math.round(ms / 10);
  const minutes = Math.floor(totalHundredths / 6000);
  const seconds = Math.floor(totalHundredths / 100) % 60;
  const hundredths = totalHundredths % 100;
  return minutes > 0
    ? `${minutes}:${pad2(seconds)}.${pad2(hundredths)}`
    : `${seconds}.${pad2(hundredths)}`;
}

/**
 * Texto "hh:mm:ss" o "mm:ss" -> segundos: "01:05:00" -> 3900, "45:30" -> 2730.
 * Devuelve null si el texto no tiene ese formato (ej. "1:75", "abc").
 */
export function parseDuration(text: string): number | null {
  const parts = text.trim().split(':');
  if (parts.length < 2 || parts.length > 3) return null;
  if (!parts.every((part) => /^\d+$/.test(part))) return null;

  const numbers = parts.map(Number);
  // Minutos y segundos (todo lo que no es la primera parte) van de 0 a 59.
  if (numbers.slice(1).some((n) => n > 59)) return null;

  return numbers.reduce((total, n) => total * 60 + n, 0);
}

export interface DurationParts {
  hours: number;
  minutes: number;
  seconds: number;
}

/** Segundos -> horas, minutos y segundos: 3725 -> { 1, 2, 5 }. */
export function splitDuration(totalSeconds: number): DurationParts {
  const total = Math.max(0, Math.round(totalSeconds));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

/** Inversa de `splitDuration`. Acepta minutos o segundos > 59 (90 min = 1 h 30). */
export function joinDuration({ hours, minutes, seconds }: DurationParts): number {
  return hours * 3600 + minutes * 60 + seconds;
}
