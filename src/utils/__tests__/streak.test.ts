import { formatStreakDays, getStreakMessage } from '../streak';

describe('formatStreakDays', () => {
  it('usa singular solo con 1', () => {
    expect(formatStreakDays(0)).toBe('0 días');
    expect(formatStreakDays(1)).toBe('1 día');
    expect(formatStreakDays(12)).toBe('12 días');
  });
});

describe('getStreakMessage', () => {
  it('con 0 invita a arrancar en vez de festejar', () => {
    expect(getStreakMessage(0)).toBe('¡Hoy es un buen día para arrancar!');
  });

  it('cambia según la racha', () => {
    expect(getStreakMessage(1)).toBe('¡Buen comienzo, seguí así!');
    expect(getStreakMessage(3)).toBe('¡Vas muy bien!');
    expect(getStreakMessage(7)).toBe('¡Seguís imparable!');
  });
});
