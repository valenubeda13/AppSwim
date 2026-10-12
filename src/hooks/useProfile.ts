import { useContext } from 'react';
import { ProfileContext, ProfileContextValue } from '@/context/ProfileProvider';

/** Perfil compartido por toda la app (ver ProfileProvider). */
export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile tiene que usarse dentro de <ProfileProvider>.');
  return context;
}
