import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

const DEFAULT_DURATION_MS = 900;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Número que "cuenta" hasta `target`: de 0 al aparecer y desde el valor
 * anterior cuando cambia (ej. al cambiar de período). Devuelve enteros.
 *
 * Si el sistema tiene "Reducir movimiento" activado, salta directo al valor.
 */
export function useCountUp(target: number, durationMs = DEFAULT_DURATION_MS): number {
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(reduceMotion ? target : 0);
  // Desde dónde arranca la próxima animación (el último valor mostrado).
  const fromRef = useRef(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) {
      fromRef.current = target;
      return;
    }

    const from = fromRef.current;
    const start = Date.now();
    let frame: number;

    const tick = () => {
      const progress = Math.min((Date.now() - start) / durationMs, 1);
      const value = Math.round(from + (target - from) * easeOutCubic(progress));
      fromRef.current = value;
      setCurrent(value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, reduceMotion]);

  // Con movimiento reducido se muestra el valor final sin pasar por el estado.
  return reduceMotion ? target : current;
}
