import { getDayOfYear } from 'date-fns';
import { parseISODate } from '@/utils/date';

/** Frase motivacional. `author` solo si es una cita célebre (las propias van sin autor). */
export interface Quote {
  text: string;
  author?: string;
}

/**
 * Frases propias sobre constancia y agua. Sumar o sacar frases no rompe
 * nada: la del día se elige por módulo sobre la cantidad.
 */
export const QUOTES: Quote[] = [
  { text: 'Cada largo cuenta, aunque nadie lo esté mirando.' },
  { text: 'El agua no premia al más rápido, premia al que vuelve todos los días.' },
  { text: 'Hoy no hace falta ser el mejor. Hace falta meterse al agua.' },
  { text: 'La constancia es una brazada más cuando ya querías parar.' },
  { text: 'Los metros de hoy son la marca de mañana.' },
  { text: 'El cloro se va con la ducha. Lo que entrenaste, se queda.' },
  { text: 'No es el tiempo que tardás, es que no dejás de nadar.' },
  { text: 'Respirá, estirá, avanzá. Así se cruza cualquier pileta.' },
  { text: 'El progreso se mide en meses, pero se construye en cada entreno.' },
  { text: 'Hay días de récord y días de solo ir. Los dos suman.' },
  { text: 'Tu único rival está en el andanivel del espejo.' },
  { text: 'El agua fría dura un minuto. La satisfacción, todo el día.' },
  { text: 'Disciplina es tirarte al agua aunque afuera llueva.' },
  { text: 'Una vuelta olímpica a la vez: así se nadan los kilómetros.' },
  { text: 'Lo difícil no es la serie, es salir de la cama. Eso ya lo hiciste.' },
  { text: 'La técnica se pule largo a largo, con paciencia.' },
  { text: 'Nadar cansado también es nadar. Y también es entrenar.' },
  { text: 'Cada viraje es una oportunidad de empezar de nuevo.' },
  { text: 'El reloj marca tu tiempo; la constancia marca tu camino.' },
  { text: 'Ningún mar se cruza de un salto. Se cruza brazada a brazada.' },
  { text: 'Hoy sumás metros. Mañana sumás confianza.' },
  { text: 'El que entrena cuando no tiene ganas, compite cuando hay que competir.' },
  { text: 'La pileta siempre está ahí. Volver depende de vos.' },
  { text: 'Más importante que una gran sesión es no cortar la racha.' },
  { text: 'Fluí como el agua: sin pausa, pero sin apuro.' },
];

/**
 * Frase del día, determinística: el mismo día da siempre la misma frase
 * (índice = día del año % cantidad), así no cambia en cada render.
 */
export function getQuoteOfDay(isoDate: string, quotes: Quote[] = QUOTES): Quote {
  const dayOfYear = getDayOfYear(parseISODate(isoDate));
  return quotes[dayOfYear % quotes.length];
}
