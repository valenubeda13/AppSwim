import { NewWorkout } from '@/types';
import { WorkoutFormInput, workoutSchema } from '../workoutSchema';

jest.mock('expo-crypto', () => ({ randomUUID: () => 'test-id' }));

const valid: WorkoutFormInput = {
  date: '2026-10-22',
  poolLength: 25,
  totalMeters: '2000',
  durationSeconds: 45 * 60,
  intensity: 'medium',
  calories: '',
  notes: '',
  sets: [],
};

/** Mensaje del primer error de cada campo (como lo muestra el form). */
function errorsOf(input: WorkoutFormInput): Record<string, string> {
  const result = workoutSchema.safeParse(input);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.');
    errors[key] ??= issue.message;
  }
  return errors;
}

describe('workoutSchema', () => {
  it('convierte un form válido en un NewWorkout', () => {
    const result = workoutSchema.parse({
      ...valid,
      calories: '450',
      notes: '  Buen ritmo  ',
      sets: [
        {
          id: 's1',
          repetitions: '8',
          distance: '100',
          stroke: 'freestyle',
          rest: '20',
          description: '',
        },
      ],
    });
    const expected: NewWorkout = {
      date: '2026-10-22',
      poolLength: 25,
      totalMeters: 2000,
      durationSeconds: 45 * 60,
      intensity: 'medium',
      calories: 450,
      notes: 'Buen ritmo',
      sets: [{ id: 's1', repetitions: 8, distance: 100, stroke: 'freestyle', restSeconds: 20 }],
    };
    expect(result).toEqual(expected);
  });

  it('calorías y notas vacías quedan undefined', () => {
    const result = workoutSchema.parse({ ...valid, notes: '   ' });
    expect(result.calories).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it('el form vacío da errores claros en los campos obligatorios', () => {
    expect(errorsOf({ ...valid, date: '', totalMeters: '', durationSeconds: 0 })).toEqual({
      date: 'Elegí la fecha del entrenamiento',
      totalMeters: 'Ingresá los metros totales',
      durationSeconds: 'Ingresá el tiempo total',
    });
  });

  it('rechaza fechas inválidas', () => {
    expect(errorsOf({ ...valid, date: '2026-02-30' }).date).toMatch(/Fecha inválida/);
  });

  it('el tiempo se guarda en segundos, sin redondear', () => {
    expect(workoutSchema.parse({ ...valid, durationSeconds: 3725 }).durationSeconds).toBe(3725);
  });

  it('los metros son al menos 25 y múltiplo del largo de la pileta', () => {
    expect(errorsOf({ ...valid, totalMeters: '0' }).totalMeters).toMatch(/al menos 25/);
    expect(errorsOf({ ...valid, totalMeters: '1010' }).totalMeters).toMatch(/múltiplo de 25/);
    expect(errorsOf({ ...valid, poolLength: 50, totalMeters: '1025' }).totalMeters).toMatch(
      /múltiplo de 50/
    );
    expect(errorsOf({ ...valid, poolLength: 50, totalMeters: '1050' })).toEqual({});
  });

  it('el múltiplo se valida aunque otro campo tenga error', () => {
    expect(errorsOf({ ...valid, durationSeconds: 0, totalMeters: '1010' })).toEqual({
      durationSeconds: 'Ingresá el tiempo total',
      totalMeters: expect.stringMatching(/múltiplo de 25/),
    });
  });

  it('las notas tienen un máximo de 500 caracteres', () => {
    expect(errorsOf({ ...valid, notes: 'a'.repeat(500) })).toEqual({});
    expect(errorsOf({ ...valid, notes: 'a'.repeat(501) }).notes).toMatch(/500/);
  });

  it('valida cada serie', () => {
    const set = {
      id: 's1',
      repetitions: '0',
      distance: '',
      stroke: 'freestyle' as const,
      rest: 'x',
      description: '',
    };
    expect(errorsOf({ ...valid, sets: [set] })).toEqual({
      'sets.0.repetitions': 'Las repeticiones tienen que ser más de 0',
      'sets.0.distance': 'Ingresá los metros de cada repetición',
      'sets.0.rest': 'El descanso va en segundos (solo números)',
    });
  });
});
