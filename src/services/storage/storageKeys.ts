/**
 * Claves de AsyncStorage, centralizadas y versionadas. Si cambia la forma
 * de lo que se guarda en una clave, se sube a /v2 y se migra desde /v1.
 */
export const STORAGE_KEYS = {
  workouts: '@swimora/workouts/v1',
  records: '@swimora/records/v1',
  profile: '@swimora/profile/v1',
  reminders: '@swimora/reminders/v1',
  /** Objeto de prueba del DevPlayground (verifica que el storage persista). */
  devPlayground: '@swimora/dev-playground/v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Claves sin versionar que usaba la app antes; se mueven a las nuevas una sola vez. */
export const LEGACY_KEYS: Partial<Record<StorageKey, string>> = {
  [STORAGE_KEYS.workouts]: '@swimapp/workouts',
  [STORAGE_KEYS.records]: '@swimapp/personal_records',
  [STORAGE_KEYS.profile]: '@swimapp/profile',
  [STORAGE_KEYS.reminders]: '@swimapp/reminders',
};
