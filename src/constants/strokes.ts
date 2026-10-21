import type { SwimStroke } from '@/types';

/** Nombre de cada estilo, en minúscula para usar dentro de una frase ("4 × 100 m crol"). */
export const STROKE_LABEL: Record<SwimStroke, string> = {
  freestyle: 'crol',
  backstroke: 'espalda',
  breaststroke: 'pecho',
  butterfly: 'mariposa',
  medley: 'combinado',
};
