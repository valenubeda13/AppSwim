import { differenceInCalendarDays, format, isValid, parse, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Fechas. Los entrenos guardan el día como "YYYY-MM-DD" (sin hora ni zona
 * horaria); acá están las conversiones a Date local y los formatos para
 * mostrar. Nunca usar `new Date('YYYY-MM-DD')` ni `toISOString()`: trabajan
 * en UTC y en Argentina (UTC-3) corren el día.
 */

const ISO_DATE = 'yyyy-MM-dd';

/** Date -> "YYYY-MM-DD" en horario local. */
export function toISODate(date: Date): string {
  return format(date, ISO_DATE);
}

/** "YYYY-MM-DD" -> Date local a medianoche. */
export function parseISODate(isoDate: string): Date {
  return parse(isoDate, ISO_DATE, new Date());
}

/** true si el texto es una fecha "YYYY-MM-DD" real (rechaza "2026-02-30"). */
export function isISODate(text: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(text) && isValid(parseISODate(text));
}

/** "2026-09-29" -> "martes 29 de septiembre" */
export function formatLongDate(isoDate: string): string {
  return format(parseISODate(isoDate), "EEEE d 'de' MMMM", { locale: es });
}

/**
 * Etiqueta corta para listados: "Hoy", "Ayer", o "18 ago" (agrega el año
 * solo si no es el actual).
 */
export function formatDateLabel(isoDate: string, today: Date = new Date()): string {
  const date = parseISODate(isoDate);
  const diffDays = differenceInCalendarDays(today, date);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';

  const pattern = date.getFullYear() === today.getFullYear() ? 'd MMM' : 'd MMM yyyy';
  return format(date, pattern, { locale: es });
}

/** Fecha del campo de formulario: "2026-09-29" -> "Martes 29 sep" */
export function formatShortDate(isoDate: string): string {
  const label = format(parseISODate(isoDate), 'EEEE d MMM', { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Título de agrupación mensual: "2026-08-15" -> "Agosto 2026" */
export function formatMonthTitle(isoDate: string): string {
  const label = format(parseISODate(isoDate), 'MMMM yyyy', { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Lunes de la semana que contiene `reference`, en "YYYY-MM-DD". Se puede
 * comparar como string contra `workout.date` porque el formato ISO ordena
 * igual lexicográfica y cronológicamente.
 */
export function startOfWeekISO(reference: Date = new Date()): string {
  return toISODate(startOfWeek(reference, { weekStartsOn: 1 }));
}
