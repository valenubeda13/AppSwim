import { useCallback, useEffect, useState } from 'react';
import { ProfileInput, UserProfile } from '@/types';
import { profileService } from '@/services/profileService';

/**
 * Perfil guardado localmente (AsyncStorage). Se reutiliza en la Home
 * (saludo) y en la pantalla Perfil.
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProfile(await profileService.get());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(async (input: ProfileInput) => {
    setProfile(await profileService.update(input));
  }, []);

  const updateAvatar = useCallback(async (localUri: string, _mimeType: string) => {
    setProfile(await profileService.uploadAvatar(localUri));
  }, []);

  return { profile, isLoading, error, reload: load, updateProfile, updateAvatar };
}
