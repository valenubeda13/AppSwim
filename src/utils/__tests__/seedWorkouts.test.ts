import { buildSeedWorkouts, SEED_NOTE } from '../dev/seedWorkouts';
import { isISODate } from '../date';

jest.mock('../id', () => {
  let n = 0;
  return { generateId: () => `id-${++n}` };
});

describe('buildSeedWorkouts', () => {
  it('arma 15 entrenos válidos, sin fechas futuras', () => {
    const seed = buildSeedWorkouts(new Date(2026, 8, 29));

    expect(seed).toHaveLength(15);
    for (const w of seed) {
      expect(isISODate(w.date)).toBe(true);
      expect(w.date <= '2026-09-29').toBe(true);
      expect(w.durationSeconds).toBeGreaterThan(0);
      expect(w.notes).toBe(SEED_NOTE);
      expect(w.totalMeters).toBe(w.sets.reduce((s, set) => s + set.repetitions * set.distance, 0));
    }
  });

  it('a fin de mes, todos caen en el mes actual', () => {
    const seed = buildSeedWorkouts(new Date(2026, 8, 29));
    expect(seed.every((w) => w.date.startsWith('2026-09'))).toBe(true);
  });

  it('a principio de mes completa con el mes anterior', () => {
    const seed = buildSeedWorkouts(new Date(2026, 9, 3));
    expect(seed).toHaveLength(15);
    expect(seed.some((w) => w.date.startsWith('2026-09'))).toBe(true);
  });
});
