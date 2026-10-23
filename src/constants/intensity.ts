import type { BadgeLevel } from '@/components/ui';
import { colors } from '@/theme';
import type { Intensity } from '@/types';

/** Orden de menor a mayor (chips del formulario). */
export const INTENSITIES: Intensity[] = ['low', 'medium', 'high', 'max'];

/** Texto de cada intensidad, igual al del formulario. */
export const INTENSITY_LABEL: Record<Intensity, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  max: 'Máxima',
};

/** Qué color de Badge le toca a cada intensidad. */
export const INTENSITY_BADGE_LEVEL: Record<Intensity, BadgeLevel> = {
  low: 'baja',
  medium: 'media',
  high: 'alta',
  max: 'maxima',
};

/** Color progresivo de cada intensidad, de celeste a azul profundo. */
export const INTENSITY_COLOR: Record<Intensity, string> = {
  low: colors.intensityLow,
  medium: colors.intensityMedium,
  high: colors.intensityHigh,
  max: colors.intensityMax,
};
