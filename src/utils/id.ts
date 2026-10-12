import * as Crypto from 'expo-crypto';

/** Genera un id (UUID v4) para filas nuevas (no hay base de datos que lo asigne). */
export function generateId(): string {
  return Crypto.randomUUID();
}
