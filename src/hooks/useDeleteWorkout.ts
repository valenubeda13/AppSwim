import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Workout } from '@/types';
import { useToast } from './useToast';
import { useWorkouts } from './useWorkouts';

/**
 * Borrar un entreno con "Deshacer" en vez de "¿estás segura?": borra al
 * toque (vibración de advertencia) y muestra un toast 4 s. El entreno
 * borrado queda en memoria en el closure del toast; si se toca "Deshacer"
 * se vuelve a guardar tal cual (mismo id), así el calendario recupera el punto.
 *
 * Mismo camino para el swipe de la lista, el menú del detalle y el formulario.
 */
export function useDeleteWorkout(): (workout: Workout) => Promise<void> {
  const { deleteWorkout, restoreWorkout } = useWorkouts();
  const { showToast } = useToast();

  return useCallback(
    async (workout: Workout) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      try {
        await deleteWorkout(workout.id);
      } catch {
        showToast({ message: 'No se pudo eliminar el entrenamiento.' });
        return;
      }
      showToast({
        message: 'Entrenamiento eliminado',
        actionLabel: 'Deshacer',
        onAction: () => {
          restoreWorkout(workout).catch(() =>
            showToast({ message: 'No se pudo recuperar el entrenamiento.' })
          );
        },
      });
    },
    [deleteWorkout, restoreWorkout, showToast]
  );
}
