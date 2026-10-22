import type { Theme } from 'react-native-calendars/src/types';
import { colors, fontFamily } from '@/theme';

/**
 * Theme de react-native-calendars armado con los tokens de la app, para que
 * el calendario se vea parte del design system y no "de librería".
 *
 * `stylesheet.day.basic` no está en el tipo `Theme` de la librería pero sí
 * lo lee en runtime: pisa estilos internos del día (acá, "hoy" en negrita).
 */
export const calendarTheme: Theme & Record<string, unknown> = {
  calendarBackground: 'transparent',

  // Días
  textDayFontFamily: fontFamily.medium,
  textDayFontSize: 15,
  dayTextColor: colors.textPrimary,
  textDisabledColor: colors.textTertiary,
  textInactiveColor: colors.textTertiary,
  todayTextColor: colors.primary,

  // Día seleccionado: círculo relleno azul
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.surface,

  // Puntos de días con entrenamiento
  dotColor: colors.primary,
  selectedDotColor: colors.surface,

  // Cabecera de días (Lun, Mar...)
  textDayHeaderFontFamily: fontFamily.semiBold,
  textDayHeaderFontSize: 12,
  textSectionTitleColor: colors.textTertiary,

  arrowColor: colors.primary,

  'stylesheet.day.basic': {
    todayText: {
      color: colors.primary,
      fontFamily: fontFamily.bold,
    },
  },
};
