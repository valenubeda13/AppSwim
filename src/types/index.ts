/** Estilos de nado */
export type SwimStyle = 'crol' | 'espalda' | 'pecho' | 'mariposa' | 'combinado';

/** Intensidad percibida del entrenamiento */
export type Intensity = 'suave' | 'moderada' | 'alta';

/** Una serie dentro de un entrenamiento (ej: 8x100 crol) */
export interface WorkoutSet {
  id: string;
  repetitions: number;
  distanceMeters: number;
  style: SwimStyle;
  restSeconds?: number;
}

/** Entrenamiento completo registrado por el usuario */
export interface Workout {
  id: string;
  date: string; // ISO string (yyyy-MM-dd)
  poolLength: 25 | 50;
  totalMeters: number;
  totalTimeMinutes: number;
  calories?: number;
  intensity: Intensity;
  sets: WorkoutSet[];
  notes?: string;
}

/** Marca personal en una distancia/estilo determinado */
export interface PersonalRecord {
  id: string;
  style: SwimStyle;
  distanceMeters: number;
  timeSeconds: number;
  date: string;
  poolLength: 25 | 50;
}

/** Perfil básico del usuario (sin login, solo local) */
export interface UserProfile {
  name: string;
  goalMetersPerWeek?: number;
}

/** Estadísticas resumidas para la pantalla de Inicio */
export interface HomeStats {
  workoutsThisMonth: number;
  totalMetersThisMonth: number;
  totalMinutesThisMonth: number;
  currentStreakDays: number;
}
