import { WorkoutSet } from '@/types';
import { fromSetFormValues, sumSetsMeters, toSetFormValues } from '../sets';

jest.mock('expo-crypto', () => ({ randomUUID: () => 'test-id' }));

const set: WorkoutSet = {
  id: 's1',
  repetitions: 4,
  distance: 100,
  stroke: 'backstroke',
  restSeconds: 20,
  description: 'Fuerte',
};

describe('sumSetsMeters', () => {
  it('suma repeticiones × distancia', () => {
    expect(sumSetsMeters([set, { repetitions: 8, distance: 50 }])).toBe(800);
    expect(sumSetsMeters([])).toBe(0);
  });
});

describe('toSetFormValues / fromSetFormValues', () => {
  it('ida y vuelta conserva la serie', () => {
    expect(fromSetFormValues(toSetFormValues(set))).toEqual(set);
  });

  it('descanso y descripción vacíos quedan undefined', () => {
    const result = fromSetFormValues({
      id: 's2',
      repetitions: '2',
      distance: '200',
      stroke: 'freestyle',
      rest: ' ',
      description: '',
    });
    expect(result.restSeconds).toBeUndefined();
    expect(result.description).toBeUndefined();
  });
});
