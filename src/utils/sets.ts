import { SwimStroke, WorkoutSet } from '@/types';
import { generateId } from './id';

/**
 * Series tal como las edita el formulario: los números van como texto
 * (lo que devuelve un TextInput) y se convierten recién al guardar.
 */
export interface SetFormValues {
  id: string;
  repetitions: string;
  distance: string;
  stroke: SwimStroke;
  /** Segundos de descanso; vacío = sin descanso. */
  rest: string;
  description: string;
}

/** Metros de un conjunto de series (repeticiones × distancia). */
export function sumSetsMeters(sets: Pick<WorkoutSet, 'repetitions' | 'distance'>[]): number {
  return sets.reduce((sum, set) => sum + set.repetitions * set.distance, 0);
}

/** Serie vacía para el botón "Agregar serie" (crol 4 × 100 por ser la más común). */
export function emptySetFormValues(): SetFormValues {
  return {
    id: generateId(),
    repetitions: '4',
    distance: '100',
    stroke: 'freestyle',
    rest: '',
    description: '',
  };
}

export function toSetFormValues(set: WorkoutSet): SetFormValues {
  return {
    id: set.id,
    repetitions: String(set.repetitions),
    distance: String(set.distance),
    stroke: set.stroke,
    rest: set.restSeconds !== undefined ? String(set.restSeconds) : '',
    description: set.description ?? '',
  };
}

/** Texto del form -> serie guardable. Un número inválido cuenta como 0 (lo frena la validación antes). */
export function fromSetFormValues(values: SetFormValues): WorkoutSet {
  const rest = values.rest.trim();
  const description = values.description.trim();
  return {
    id: values.id,
    repetitions: Number(values.repetitions) || 0,
    distance: Number(values.distance) || 0,
    stroke: values.stroke,
    restSeconds: rest ? Number(rest) : undefined,
    description: description || undefined,
  };
}
