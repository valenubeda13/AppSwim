import { File, Paths } from 'expo-file-system';
import { ProfileInput, UserProfile } from '@/types';
import { storage, STORAGE_KEYS } from './storage';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Nadador/a',
};

/** Campos con el nombre que tenían antes de alinear el tipo con la card de modelos. */
interface LegacyProfileFields {
  goalMetersPerWeek?: number;
  preferredPoolLength?: UserProfile['usualPool'];
}

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
  const stored: UserProfile & LegacyProfileFields =
    (await storage.get<UserProfile & LegacyProfileFields>(STORAGE_KEYS.profile)) ?? DEFAULT_PROFILE;
  const { goalMetersPerWeek, preferredPoolLength, ...rest } = stored;
  const profile: UserProfile = {
    ...rest,
    weeklyGoalMeters: rest.weeklyGoalMeters ?? goalMetersPerWeek,
    usualPool: rest.usualPool ?? preferredPoolLength,
  };
  return profile.avatarUrl
    ? { ...profile, avatarUrl: resolveAvatarUri(profile.avatarUrl) }
    : profile;
}

export const profileService = {
  async get(): Promise<UserProfile> {
    return readProfile();
  },

  /**
   * Reemplaza los datos editables con los del formulario. Se arma el objeto
   * campo por campo (sin `...current`) para que un perfil guardado con
   * campos viejos (username, preferencias de la cuenta, nombres anteriores)
   * quede limpio al guardar.
   */
  async update(input: ProfileInput): Promise<UserProfile> {
    const current = await readProfile();
    const updated: UserProfile = {
      avatarUrl: current.avatarUrl,
      name: input.name,
      club: input.club || undefined,
      birthYear: input.birthYear,
      usualPool: input.usualPool,
      weeklyGoalMeters: input.weeklyGoalMeters,
      bio: input.bio || undefined,
      gender: input.gender,
      swimmingSince: input.swimmingSince || undefined,
    };

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
