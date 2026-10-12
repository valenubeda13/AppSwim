import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEGACY_KEYS, StorageKey } from './storageKeys';

/**
 * Wrapper tipado sobre AsyncStorage: el resto de la app trabaja con objetos
 * y nunca ve JSON.parse. Centraliza el acceso para poder reemplazarlo por
 * una base de datos real en el futuro sin tocar los services.
 */

let legacyMigration: Promise<void> | null = null;

/**
 * Mueve los datos de las claves viejas (@swimapp/...) a las versionadas,
 * una sola vez por arranque y solo si la clave nueva todavía está vacía.
 * Si falla no bloquea: la app sigue con las claves nuevas.
 */
function migrateLegacyKeys(): Promise<void> {
  legacyMigration ??= (async () => {
    try {
      const pairs = Object.entries(LEGACY_KEYS) as [StorageKey, string][];
      const values = await AsyncStorage.multiGet(pairs.flatMap(([key, legacy]) => [key, legacy]));
      const current = new Map(values);

      const toMove = pairs.filter(([key, legacy]) => !current.get(key) && current.get(legacy));
      if (toMove.length === 0) return;

      await AsyncStorage.multiSet(toMove.map(([key, legacy]) => [key, current.get(legacy)!]));
      await AsyncStorage.multiRemove(toMove.map(([, legacy]) => legacy));
    } catch (err) {
      console.warn('[storage] No se pudieron migrar las claves viejas', err);
    }
  })();
  return legacyMigration;
}

/**
 * Lee y parsea `key`. Devuelve null si no hay nada guardado o si el JSON
 * está corrupto; en ese caso guarda el texto crudo en `<key>/corrupt` para
 * no perderlo del todo, en vez de dejar que la app crashee al abrir.
 */
export async function getItem<T>(key: StorageKey): Promise<T | null> {
  await migrateLegacyKeys();
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] JSON corrupto en ${key}; se respalda y se ignora`, err);
    try {
      await AsyncStorage.setItem(`${key}/corrupt`, raw);
    } catch {
      // Si ni el respaldo se puede guardar, igual seguimos con el fallback.
    }
    return null;
  }
}

export async function setItem<T>(key: StorageKey, value: T): Promise<void> {
  await migrateLegacyKeys();
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: StorageKey): Promise<void> {
  await migrateLegacyKeys();
  await AsyncStorage.removeItem(key);
}
