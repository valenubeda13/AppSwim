/** Largo de la pileta en metros */
export type PoolLength = 25 | 50;

/** Intensidad percibida del entrenamiento */
export type Intensity = 'low' | 'medium' | 'high' | 'max';

/** Estilos de nado ('medley' = combinado) */
export type SwimStroke = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'medley';

/** Una serie dentro de un entrenamiento (ej: 8x100 crol) */
export interface WorkoutSet {
  id: string;
  repetitions: number;
  /** Metros de cada repetición */
  distance: number;
  stroke: SwimStroke;
  restSeconds?: number;
  description?: string;
}

/** Entrenamiento completo registrado por el usuario */
export interface Workout {
  id: string;
  /**
   * Día del entreno, "YYYY-MM-DD" (string, no Date: evita que un entreno
   * del 5 aparezca el 4 por la zona horaria). Es la clave del calendario.
   */
  date: string;
  poolLength: PoolLength;
  totalMeters: number;
  durationSeconds: number;
  calories?: number;
  intensity: Intensity;
  sets: WorkoutSet[];
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/** Datos para crear o editar un entrenamiento (id y timestamps los pone el service) */
export type NewWorkout = Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>;
