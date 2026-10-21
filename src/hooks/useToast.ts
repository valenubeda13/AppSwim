import { useContext } from 'react';
import { ToastContext, ToastContextValue } from '@/context/ToastProvider';

/** Mostrar un toast global (ver ToastProvider). */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast tiene que usarse dentro de <ToastProvider>.');
  return context;
}
