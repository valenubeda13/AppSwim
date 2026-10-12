import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ProfileInput, UserProfile } from '@/types';
import { profileRepository } from '@/services/repositories';

export interface ProfileContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  updateProfile: (input: ProfileInput) => Promise<void>;
  updateAvatar: (localUri: string) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Perfil compartido: Inicio (saludo), Perfil y Editar perfil leen el mismo
 * estado, así que guardar en Editar perfil se ve al instante en las otras.
 * Se consume con `useProfile()`.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProfile(await profileRepository.get());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // IIFE: evita el falso positivo de react-hooks/set-state-in-effect
  // (facebook/react#34743) al llamar a `reload` desde el efecto.
  useEffect(() => {
    void (async () => {
      await reload();
    })();
  }, [reload]);

  const updateProfile = useCallback(async (input: ProfileInput) => {
    setProfile(await profileRepository.update(input));
  }, []);

  const updateAvatar = useCallback(async (localUri: string) => {
    setProfile(await profileRepository.setAvatar(localUri));
  }, []);

  const value = useMemo(
    () => ({ profile, isLoading, error, reload, updateProfile, updateAvatar }),
    [profile, isLoading, error, reload, updateProfile, updateAvatar]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
