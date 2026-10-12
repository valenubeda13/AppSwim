import { File, Paths } from 'expo-file-system';
import { ProfileInput, UserProfile } from '@/types';
import { storage, STORAGE_KEYS } from './storage';

const DEFAULT_PROFILE: UserProfile = {
  id: 'local',
  name: 'Nadador/a',
  distanceUnit: 'metros',
  timeFormat: 'min:seg',
};

const AVATAR_PREFIX = 'avatar-';

/** Nombre del archivo si la URI es una copia de avatar hecha por nosotros. */
function ownedAvatarName(uri: string): string | null {
  const name = uri.split('/').pop() ?? '';
  return name.startsWith(AVATAR_PREFIX) ? name : null;
}

/**
 * En iOS la ruta absoluta del sandbox cambia al actualizar la app, así que
 * una URI guardada puede quedar apuntando a una carpeta vieja. Como el
 * archivo sigue en documentos, rearmamos la URI con la ruta actual.
 */
function resolveAvatarUri(uri: string): string {
  const name = ownedAvatarName(uri);
  return name ? new File(Paths.document, name).uri : uri;
}

function deleteOwnedAvatar(uri: string): void {
  const name = ownedAvatarName(uri);
  if (!name) return; // URI vieja de la caché: no es nuestra, no la tocamos.
  try {
    const file = new File(Paths.document, name);
    if (file.exists) file.delete();
  } catch {
    // Si falla queda un archivo huérfano; no vale la pena romper el flujo.
  }
}

async function readProfile(): Promise<UserProfile> {
  const profile = (await storage.get<UserProfile>(STORAGE_KEYS.profile)) ?? DEFAULT_PROFILE;
  return profile.avatarUrl
    ? { ...profile, avatarUrl: resolveAvatarUri(profile.avatarUrl) }
    : profile;
}

export const profileService = {
  async get(): Promise<UserProfile> {
    return readProfile();
  },

  /**
   * Update parcial: solo pisa los campos presentes en `input`. Los campos
   * "core" (name/goalMetersPerWeek/preferredPoolLength) siempre se mandan
   * porque ya los pedía el formulario de perfil; los demás son opcionales
   * y, si no vienen, se conservan.
   */
  async update(input: ProfileInput): Promise<UserProfile> {
    const current = await readProfile();
    const updated: UserProfile = {
      ...current,
      name: input.name,
      goalMetersPerWeek: input.goalMetersPerWeek,
      preferredPoolLength: input.preferredPoolLength,
      ...(input.username !== undefined && { username: input.username || undefined }),
      ...(input.bio !== undefined && { bio: input.bio || undefined }),
      ...(input.gender !== undefined && { gender: input.gender || undefined }),
      ...(input.swimmingSince !== undefined && { swimmingSince: input.swimmingSince || undefined }),
      ...(input.distanceUnit !== undefined && { distanceUnit: input.distanceUnit }),
      ...(input.timeFormat !== undefined && { timeFormat: input.timeFormat }),
      ...(input.favoriteStyle !== undefined && { favoriteStyle: input.favoriteStyle || undefined }),
    };
    if (input.username !== undefined && input.username !== current.username) {
      updated.usernameUpdatedAt = new Date().toISOString();
    }

    await storage.set(STORAGE_KEYS.profile, updated);
    return updated;
  },

  /**
   * Copia la foto elegida (expo-image-picker la deja en la caché, que el
   * sistema puede limpiar) al directorio de documentos y guarda la URI de
   * la copia. Sin Supabase Storage no hay a dónde subirla: la app la lee
   * directo desde el filesystem del dispositivo.
   */
  async uploadAvatar(localUri: string): Promise<UserProfile> {
    const current = await readProfile();

    const source = new File(localUri);
    const extension = source.extension || '.jpg';
    const destination = new File(Paths.document, `${AVATAR_PREFIX}${Date.now()}${extension}`);
    await source.copy(destination);

    const updated: UserProfile = { ...current, avatarUrl: destination.uri };
    await storage.set(STORAGE_KEYS.profile, updated);

    // Recién con el perfil ya guardado borramos la copia anterior.
    if (current.avatarUrl) deleteOwnedAvatar(current.avatarUrl);
    return updated;
  },
};
