import { Workout } from '@/types';
import { computeStreakDays, groupByMonth, sumDuration, sumMeters } from '../stats';

function workout(date: string, totalMeters = 1000, durationSeconds = 1800): Workout {
  return {
    id: date,
    date,
    poolLength: 25,
    totalMeters,
    durationSeconds,
    intensity: 'medium',
    sets: [],
    createdAt: `${date}T10:00:00.000Z`,
    updatedAt: `${date}T10:00:00.000Z`,
  };
}

describe('sumMeters / sumDuration', () => {
  const list = [workout('2026-09-01', 1500, 1800), workout('2026-09-02', 2500, 3600)];

  it('suman la lista', () => {
    expect(sumMeters(list)).toBe(4000);
    expect(sumDuration(list)).toBe(5400);
  });

  it('dan 0 con la lista vacía', () => {
    expect(sumMeters([])).toBe(0);
    expect(sumDuration([])).toBe(0);
  });
});

describe('groupByMonth', () => {
  it('agrupa respetando el orden de entrada', () => {
    const groups = groupByMonth([
      workout('2026-09-20'),
      workout('2026-09-02'),
      workout('2026-08-31'),
      workout('2026-07-15'),
    ]);
    expect(groups.map((g) => g.month)).toEqual(['2026-09', '2026-08', '2026-07']);
    expect(groups[0].workouts.map((w) => w.date)).toEqual(['2026-09-20', '2026-09-02']);
  });

  it('devuelve [] sin entrenos', () => {
    expect(groupByMonth([])).toEqual([]);
  });
});

describe('computeStreakDays', () => {
  const today = new Date(2026, 8, 29);

  it('cuenta días seguidos hasta hoy', () => {
    const list = ['2026-09-29', '2026-09-28', '2026-09-27', '2026-09-25'].map((d) => workout(d));
    expect(computeStreakDays(list, today)).toBe(3);
  });

  it('si hoy no entrenó, cuenta desde ayer', () => {
    const list = ['2026-09-28', '2026-09-27'].map((d) => workout(d));
    expect(computeStreakDays(list, today)).toBe(2);
  });

  it('está cortada si el último fue antes de ayer', () => {
    expect(computeStreakDays([workout('2026-09-27')], today)).toBe(0);
    expect(computeStreakDays([], today)).toBe(0);
  });

  it('dos entrenos el mismo día cuentan una vez', () => {
    const list = ['2026-09-29', '2026-09-29', '2026-09-28'].map((d) => workout(d));
    expect(computeStreakDays(list, today)).toBe(2);
  });

  it('cruza el cambio de mes', () => {
    const list = ['2026-10-01', '2026-09-30'].map((d) => workout(d));
    expect(computeStreakDays(list, new Date(2026, 9, 1))).toBe(2);
  });
});
