import { PoolLength } from './workout';

/** Género elegido para el badge del header ("Nadador"/"Nadadora") */
export type Gender = 'nadador' | 'nadadora';

/** Perfil del usuario, guardado localmente (AsyncStorage) */
export interface UserProfile {
  name: string;
  club?: string;
  birthYear?: number;
  usualPool?: PoolLength;
  weeklyGoalMeters?: number;
  bio?: string;
  avatarUrl?: string;
  gender?: Gender;
  /** Desde cuándo nada (no es la fecha en que se registró en la app) */
  swimmingSince?: string; // "YYYY-MM-DD"
}

/** Datos que carga el usuario al editar su perfil (la foto se sube aparte). */
export type ProfileInput = Omit<UserProfile, 'avatarUrl'>;
