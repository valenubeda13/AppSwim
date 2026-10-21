import { LocaleConfig } from 'react-native-calendars';

/** Nombres de los meses (también los usa el header de WorkoutCalendar). */
export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * Español para react-native-calendars. Se importa una sola vez en App.tsx
 * (efecto de lado: registra el locale y lo deja por defecto).
 *
 * dayNames/dayNamesShort arrancan en domingo aunque la semana se muestre
 * desde el lunes: eso lo resuelve `firstDay={1}` en el calendario.
 */
LocaleConfig.locales.es = {
  monthNames: MONTH_NAMES,
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};

LocaleConfig.defaultLocale = 'es';
