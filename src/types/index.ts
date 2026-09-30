/** Estilos de nado */
export type SwimStyle = 'crol' | 'espalda' | 'pecho' | 'mariposa' | 'combinado';

/** Estilo favorito del perfil (no incluye "combinado", que solo aplica a series/marcas) */
export type FavoriteStyle = Exclude<SwimStyle, 'combinado'>;

/** Unidad de distancia preferida para mostrar los totales */
export type DistanceUnit = 'metros' | 'yardas';

/** Formato preferido para mostrar tiempos */
export type TimeFormat = 'min:seg' | 'segundos';

/** Género elegido para el badge del header ("Nadador"/"Nadadora") */
export type Gender = 'nadador' | 'nadadora';

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

/** Datos que carga el usuario al crear/editar un entrenamiento (sin series por ahora) */
export type WorkoutInput = Omit<Workout, 'id' | 'sets'>;

/** Marca personal en una distancia/estilo determinado */
export interface PersonalRecord {
  id: string;
  style: SwimStyle;
  distanceMeters: number;
  timeSeconds: number;
  date: string;
  poolLength: 25 | 50;
}

/** Perfil del usuario, guardado localmente (AsyncStorage) */
export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  /** Cuándo se guardó el username actual (para el límite de 1 cambio/mes) */
  usernameUpdatedAt?: string; // ISO timestamp
  bio?: string;
  avatarUrl?: string;
  gender?: Gender;
  /** Desde cuándo nada (no es la fecha en que se registró en la app) */
  swimmingSince?: string; // ISO string (yyyy-MM-dd)
  goalMetersPerWeek?: number;
  preferredPoolLength?: 25 | 50;
  distanceUnit: DistanceUnit;
  timeFormat: TimeFormat;
  favoriteStyle?: FavoriteStyle;
}

/**
 * Datos que carga el usuario al editar su perfil (la foto se sube aparte).
 * `username`/`bio`/`swimmingSince`/`distanceUnit`/`timeFormat`/`favoriteStyle`
 * son opcionales acá: si el formulario que llama a `updateProfile` no los
 * incluye, `profileService.update` no los toca (no pisa el valor guardado).
 */
export type ProfileInput = Omit<
  UserProfile,
  | 'id'
  | 'avatarUrl'
  | 'username'
  | 'usernameUpdatedAt'
  | 'bio'
  | 'gender'
  | 'swimmingSince'
  | 'distanceUnit'
  | 'timeFormat'
  | 'favoriteStyle'
> &
  Partial<
    Pick<UserProfile, 'username' | 'bio' | 'gender' | 'swimmingSince' | 'distanceUnit' | 'timeFormat' | 'favoriteStyle'>
  >;

/** Estadísticas resumidas para la pantalla de Inicio (mes actual) */
export interface HomeStats {
  workoutsThisMonth: number;
  totalMetersThisMonth: number;
  totalMinutesThisMonth: number;
  currentStreakDays: number;
}

/** Estadísticas de toda la vida del usuario (para el header de Perfil) */
export interface LifetimeStats {
  totalWorkouts: number;
  totalMeters: number;
  totalMinutes: number;
  currentStreakDays: number;
}

/** Recordatorio de entrenamiento configurado por el usuario */
export interface Reminder {
  id: string;
  label: string;
  timeOfDay: string; // "HH:mm:ss"
  daysOfWeek: number[]; // 0 = domingo ... 6 = sábado
  isActive: boolean;
}

/** Datos que carga el usuario al crear/editar un recordatorio */
export type ReminderInput = Omit<Reminder, 'id'>;
