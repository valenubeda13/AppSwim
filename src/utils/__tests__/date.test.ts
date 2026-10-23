import {
  formatDateLabel,
  formatLongDate,
  formatMonthTitle,
  formatShortDate,
  isISODate,
  parseISODate,
  startOfWeekISO,
  toISODate,
} from '../date';

describe('toISODate / parseISODate', () => {
  it('convierte en horario local, sin correrse de día', () => {
    expect(toISODate(new Date(2026, 8, 29, 23, 30))).toBe('2026-09-29');
    expect(toISODate(new Date(2026, 8, 29, 0, 0))).toBe('2026-09-29');
  });

  it('parsea a medianoche local', () => {
    const date = parseISODate('2026-09-29');
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
      2026, 8, 29, 0,
    ]);
  });

  it('ida y vuelta da lo mismo', () => {
    expect(toISODate(parseISODate('2026-01-01'))).toBe('2026-01-01');
  });
});

describe('isISODate', () => {
  it('acepta fechas reales y rechaza el resto', () => {
    expect(isISODate('2026-09-29')).toBe(true);
    expect(isISODate('2026-02-30')).toBe(false);
    expect(isISODate('29/09/2026')).toBe(false);
    expect(isISODate('2026-9-29')).toBe(false);
  });
});

describe('formatLongDate', () => {
  it('usa día de la semana y mes en español', () => {
    expect(formatLongDate('2026-09-29')).toBe('martes 29 de septiembre');
    expect(formatLongDate('2026-01-01')).toBe('jueves 1 de enero');
  });
});

describe('formatDateLabel', () => {
  const today = new Date(2026, 8, 29);

  it('dice Hoy y Ayer', () => {
    expect(formatDateLabel('2026-09-29', today)).toBe('Hoy');
    expect(formatDateLabel('2026-09-28', today)).toBe('Ayer');
  });

  it('agrega el año solo si no es el actual', () => {
    expect(formatDateLabel('2026-08-18', today)).toBe('18 ago');
    expect(formatDateLabel('2025-08-18', today)).toBe('18 ago 2025');
  });
});

describe('formatMonthTitle', () => {
  it('capitaliza el mes', () => {
    expect(formatMonthTitle('2026-08-15')).toBe('Agosto 2026');
  });
});

describe('startOfWeekISO', () => {
  it('devuelve el lunes de la semana', () => {
    expect(startOfWeekISO(new Date(2026, 8, 29))).toBe('2026-09-28'); // martes
    expect(startOfWeekISO(new Date(2026, 9, 4))).toBe('2026-09-28'); // domingo
    expect(startOfWeekISO(new Date(2026, 8, 28))).toBe('2026-09-28'); // lunes
  });
});

describe('formatShortDate', () => {
  it('día de la semana con mayúscula, día y mes corto', () => {
    expect(formatShortDate('2026-09-29')).toBe('Martes 29 sep');
    expect(formatShortDate('2026-01-01')).toBe('Jueves 1 ene');
  });
});
