import { ProfileInput, UserProfile } from '@/types';
import { storage, STORAGE_KEYS } from './storage';

const DEFAULT_PROFILE: UserProfile = {
  id: 'local',
  name: 'Nadador/a',
  distanceUnit: 'metros',
  timeFormat: 'min:seg',
};

async function readProfile(): Promise<UserProfile> {
  return (await storage.get<UserProfile>(STORAGE_KEYS.profile)) ?? DEFAULT_PROFILE;
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
   * Guarda la foto elegida como su URI local (expo-image-picker). Sin
   * Supabase Storage no hay a dónde subirla: la app la lee directo desde
   * el filesystem del dispositivo.
   */
  async uploadAvatar(localUri: string): Promise<UserProfile> {
    const current = await readProfile();
    const updated: UserProfile = { ...current, avatarUrl: localUri };
    await storage.set(STORAGE_KEYS.profile, updated);
    return updated;
  },
};
