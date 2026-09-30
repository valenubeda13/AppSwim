import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { ProfileInput, UserProfile } from '@/types';
import { supabase } from './supabaseClient';

const AVATARS_BUCKET = 'avatars';

interface ProfileRow {
  id: string;
  name: string;
  username: string | null;
  username_updated_at: string | null;
  bio: string | null;
  avatar_url: string | null;
  gender: UserProfile['gender'] | null;
  swimming_since: string | null;
  goal_meters_per_week: number | null;
  preferred_pool_length: 25 | 50 | null;
  distance_unit: UserProfile['distanceUnit'];
  time_format: UserProfile['timeFormat'];
  favorite_style: UserProfile['favoriteStyle'] | null;
}

function fromRow(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    username: row.username ?? undefined,
    usernameUpdatedAt: row.username_updated_at ?? undefined,
    bio: row.bio ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    gender: row.gender ?? undefined,
    swimmingSince: row.swimming_since ?? undefined,
    goalMetersPerWeek: row.goal_meters_per_week ?? undefined,
    preferredPoolLength: row.preferred_pool_length ?? undefined,
    distanceUnit: row.distance_unit,
    timeFormat: row.time_format,
    favoriteStyle: row.favorite_style ?? undefined,
  };
}

export const profileService = {
  async get(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw new Error(error.message);
    return fromRow(data as ProfileRow);
  },

  /**
   * Update parcial: solo escribe las columnas presentes en `input`. Los
   * campos "core" (name/goalMetersPerWeek/preferredPoolLength) siempre se
   * mandan porque ya los pedía el formulario de perfil; los nuevos
   * (username/bio/swimmingSince/distanceUnit/timeFormat/favoriteStyle) son
   * opcionales y, si no vienen, no se tocan.
   */
  async update(userId: string, input: ProfileInput): Promise<UserProfile> {
    const payload: Record<string, unknown> = {
      name: input.name,
      goal_meters_per_week: input.goalMetersPerWeek ?? null,
      preferred_pool_length: input.preferredPoolLength ?? null,
    };
    if (input.username !== undefined) payload.username = input.username || null;
    if (input.bio !== undefined) payload.bio = input.bio || null;
    if (input.gender !== undefined) payload.gender = input.gender || null;
    if (input.swimmingSince !== undefined) payload.swimming_since = input.swimmingSince || null;
    if (input.distanceUnit !== undefined) payload.distance_unit = input.distanceUnit;
    if (input.timeFormat !== undefined) payload.time_format = input.timeFormat;
    if (input.favoriteStyle !== undefined) payload.favorite_style = input.favoriteStyle || null;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Ese nombre de usuario ya está en uso.');
      throw new Error(error.message);
    }
    return fromRow(data as ProfileRow);
  },

  /**
   * Sube la foto elegida al bucket `avatars` (siempre a `<userId>/avatar.jpg`,
   * pisando la anterior), guarda la URL en `profiles.avatar_url` y la
   * devuelve. Se agrega un query param de cache-busting porque el path no
   * cambia y <Image> cachea por URL.
   *
   * `fetch(localUri).blob()` no sirve acá: en Expo/React Native produce un
   * blob vacío o corrupto (issue conocido), así que la subida "funciona"
   * (no tira error) pero la imagen nunca carga. Por eso se lee el archivo
   * como base64 con expo-file-system y se decodifica a ArrayBuffer.
   */
  async uploadAvatar(userId: string, localUri: string, mimeType: string): Promise<UserProfile> {
    const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
    const path = `${userId}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(path, decode(base64), { upsert: true, contentType: mimeType });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
    const avatarUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data as ProfileRow);
  },
};
