import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { startOfTomorrow } from 'date-fns';
import { toISODate } from '@/utils/date';

/**
 * Fecha de hoy ("YYYY-MM-DD") que cambia sola al pasar la medianoche.
 * Sirve como dependencia de los cálculos que dependen de "hoy" (racha, mes
 * actual, semana), que si no quedan viejos cuando la app sigue abierta de
 * un día para otro.
 *
 * Se actualiza al volver la app a primer plano y con un timer a la
 * medianoche (por si queda abierta en pantalla). Como es un string, si el
 * día no cambió el setState no re-renderiza.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => toISODate(new Date()));

  useEffect(() => {
    const refresh = () => setToday(toISODate(new Date()));

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });

    let timer: ReturnType<typeof setTimeout>;
    const scheduleMidnight = () => {
      // +1 s de margen para no disparar justo antes de que cambie el día.
      const delay = startOfTomorrow().getTime() - Date.now() + 1000;
      timer = setTimeout(() => {
        refresh();
        scheduleMidnight();
      }, delay);
    };
    scheduleMidnight();

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, []);

  return today;
}
