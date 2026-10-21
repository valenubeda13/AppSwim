import type { BadgeLevel } from '@/components/ui';
import type { Intensity } from '@/types';

/** Texto de cada intensidad, igual al del formulario. */
export const INTENSITY_LABEL: Record<Intensity, string> = {
  low: 'Suave',
  medium: 'Moderada',
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
