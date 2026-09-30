import { useCallback, useEffect, useState } from 'react';
import { ProfileInput, UserProfile } from '@/types';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Perfil del usuario logueado (Supabase). Se reutiliza en la Home
 * (saludo) y en la pantalla Perfil.
 */
export function useProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      setProfile(await profileService.get(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(
    async (input: ProfileInput) => {
      if (!userId) throw new Error('No hay sesión activa.');
      setProfile(await profileService.update(userId, input));
    },
    [userId]
  );

  const updateAvatar = useCallback(
    async (localUri: string, mimeType: string) => {
      if (!userId) throw new Error('No hay sesión activa.');
      setProfile(await profileService.uploadAvatar(userId, localUri, mimeType));
    },
    [userId]
  );

  return { profile, isLoading, error, reload: load, updateProfile, updateAvatar };
}
