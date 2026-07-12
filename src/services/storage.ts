import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper tipado sobre AsyncStorage.
 * Centraliza el acceso a almacenamiento local para poder
 * reemplazarlo por una base de datos real en el futuro sin
 * tocar el resto de la app.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export const STORAGE_KEYS = {
  workouts: '@swimapp/workouts',
  personalRecords: '@swimapp/personal_records',
  profile: '@swimapp/profile',
} as const;
