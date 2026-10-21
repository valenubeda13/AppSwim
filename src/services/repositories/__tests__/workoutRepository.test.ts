import { NewWorkout } from '@/types';
import { workoutRepository } from '../workoutRepository';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/utils/id', () => {
  let n = 0;
  return { generateId: () => `id-${++n}` };
});

const input = (totalMeters: number): NewWorkout => ({
  date: '2026-10-12',
  poolLength: 25,
  totalMeters,
  durationSeconds: 1800,
  intensity: 'medium',
  sets: [],
});

describe('workoutRepository: escrituras simultáneas', () => {
  it('dos create a la vez (doble toque en Guardar) guardan los dos', async () => {
    await Promise.all([
      workoutRepository.create(input(1000)),
      workoutRepository.create(input(2000)),
    ]);

    const all = await workoutRepository.getAll();
    expect(all.map((w) => w.totalMeters).sort()).toEqual([1000, 2000]);
  });

  it('create y update simultáneos no se pisan', async () => {
    const existing = (await workoutRepository.getAll())[0];

    await Promise.all([
      workoutRepository.update(existing.id, { totalMeters: 9999 }),
      workoutRepository.create(input(3000)),
    ]);

    const all = await workoutRepository.getAll();
    expect(all).toHaveLength(3);
    expect(all.find((w) => w.id === existing.id)?.totalMeters).toBe(9999);
  });
});

describe('workoutRepository: restore (deshacer borrado)', () => {
  it('vuelve a guardar el entreno borrado con el mismo id y fechas', async () => {
    const created = await workoutRepository.create(input(1234));
    await workoutRepository.remove(created.id);
    expect(await workoutRepository.getById(created.id)).toBeNull();

    await workoutRepository.restore(created);
    expect(await workoutRepository.getById(created.id)).toEqual(created);
  });

  it('no duplica si el entreno ya existe', async () => {
    const created = await workoutRepository.create(input(4321));
    await workoutRepository.restore(created);

    const all = await workoutRepository.getAll();
    expect(all.filter((w) => w.id === created.id)).toHaveLength(1);
  });
});
