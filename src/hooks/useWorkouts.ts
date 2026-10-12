import { useContext } from 'react';
import { WorkoutsContext, WorkoutsContextValue } from '@/context/WorkoutsProvider';

/** Entrenamientos compartidos por toda la app (ver WorkoutsProvider). */
export function useWorkouts(): WorkoutsContextValue {
  const context = useContext(WorkoutsContext);
  if (!context) throw new Error('useWorkouts tiene que usarse dentro de <WorkoutsProvider>.');
  return context;
}
