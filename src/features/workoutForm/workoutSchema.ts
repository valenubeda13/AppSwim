import { z } from 'zod';
import { isISODate } from '@/utils/date';
import { WorkoutSet } from '@/types';

/**
 * Reglas del formulario de entrenamiento: única fuente de verdad.
 *
 * La entrada es lo que tiene el form (los números como texto, que es lo que
 * devuelve un TextInput) y la salida ya es un
 * `NewWorkout` listo para guardar. Por eso hay dos tipos:
 * - `WorkoutFormInput`: valores del form (`defaultValues`, `useFormContext`).
 * - `WorkoutFormValues`: lo que recibe `onSubmit` después de validar.
 */

export const NOTES_MAX_LENGTH = 500;

const DIGITS = /^\d+$/;

/**
 * Texto obligatorio con un entero >= 0 -> number. Las reglas no cortan con
 * `abort`: eso haría que Zod saltee la regla de múltiplo a nivel objeto.
 */
const requiredInt = (requiredMessage: string, invalidMessage = 'Ingresá solo números') =>
  z.string().trim().min(1, requiredMessage).regex(DIGITS, invalidMessage).transform(Number);

/** Texto opcional con un entero >= 0 -> number | undefined (vacío = sin dato). */
const optionalInt = (invalidMessage = 'Ingresá solo números') =>
  z
    .string()
    .trim()
    .refine((value) => !value || DIGITS.test(value), invalidMessage)
    .transform((value) => (value ? Number(value) : undefined));

const setSchema = z
  .object({
    id: z.string(),
    repetitions: requiredInt('Ingresá las repeticiones').refine(
      (n) => n > 0,
      'Las repeticiones tienen que ser más de 0'
    ),
    distance: requiredInt('Ingresá los metros de cada repetición').refine(
      (n) => n > 0,
      'Los metros tienen que ser más de 0'
    ),
    stroke: z.enum(['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'medley']),
    rest: optionalInt('El descanso va en segundos (solo números)'),
    description: z
      .string()
      .trim()
      .transform((value) => value || undefined),
  })
  .transform(({ rest, ...set }): WorkoutSet => ({ ...set, restSeconds: rest }));

export const workoutSchema = z
  .object({
    date: z
      .string()
      .trim()
      .min(1, 'Elegí la fecha del entrenamiento')
      .refine(isISODate, 'Fecha inválida, usá el formato AAAA-MM-DD'),
    poolLength: z.union([z.literal(25), z.literal(50)], {
      error: 'Elegí el largo de la pileta',
    }),
    totalMeters: requiredInt('Ingresá los metros totales').refine(
      (n) => n >= 25,
      'Tienen que ser al menos 25 m'
    ),
    // Ya llega en segundos: DurationField suma h : min : s (0 = sin completar).
    durationSeconds: z.number().int().positive('Ingresá el tiempo total'),
    intensity: z.enum(['low', 'medium', 'high', 'max'], { error: 'Elegí la intensidad' }),
    calories: optionalInt(),
    notes: z
      .string()
      .trim()
      .max(NOTES_MAX_LENGTH, `Las notas pueden tener hasta ${NOTES_MAX_LENGTH} caracteres`)
      .transform((value) => value || undefined),
    sets: z.array(setSchema),
  })
  // Se nada de pared a pared: el total tiene que ser una cantidad entera de largos.
  .refine((values) => values.totalMeters % values.poolLength === 0, {
    path: ['totalMeters'],
    error: (issue) =>
      `Tiene que ser múltiplo de ${(issue.input as { poolLength: number }).poolLength} (largos completos de pileta)`,
    // Por defecto Zod no corre esta regla si hay errores en cualquier campo;
    // así el aviso aparece aunque, por ejemplo, falte el tiempo.
    when: (payload) =>
      !payload.issues.some((i) => i.path?.[0] === 'totalMeters' || i.path?.[0] === 'poolLength'),
  });

export type WorkoutFormInput = z.input<typeof workoutSchema>;
export type WorkoutFormValues = z.infer<typeof workoutSchema>;
