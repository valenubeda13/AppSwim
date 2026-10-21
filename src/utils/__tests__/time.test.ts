import { formatDuration, formatDurationParts, formatSwimTime, parseDuration } from '../time';

describe('formatDuration', () => {
  it('muestra horas con minutos de dos dígitos', () => {
    expect(formatDuration(3900)).toBe('1 h 05 min');
    expect(formatDuration(7200)).toBe('2 h 00 min');
  });

  it('muestra solo minutos debajo de una hora', () => {
    expect(formatDuration(2700)).toBe('45 min');
    expect(formatDuration(0)).toBe('0 min');
  });

  it('redondea al minuto', () => {
    expect(formatDuration(89)).toBe('1 min');
    expect(formatDuration(3570)).toBe('1 h 00 min');
  });
});

describe('formatDurationParts', () => {
  it('separa número y unidad', () => {
    expect(formatDurationParts(2700)).toEqual({ value: '45', unit: 'min' });
    expect(formatDurationParts(3600)).toEqual({ value: '1:00', unit: 'h' });
    expect(formatDurationParts(3900)).toEqual({ value: '1:05', unit: 'h' });
    expect(formatDurationParts(0)).toEqual({ value: '0', unit: 'min' });
  });
});

describe('formatSwimTime', () => {
  it('formatea minutos, segundos y centésimas', () => {
    expect(formatSwimTime(62450)).toBe('1:02.45');
    expect(formatSwimTime(600000)).toBe('10:00.00');
  });

  it('omite los minutos debajo de uno', () => {
    expect(formatSwimTime(28300)).toBe('28.30');
    expect(formatSwimTime(5070)).toBe('5.07');
  });

  it('redondea a la centésima', () => {
    expect(formatSwimTime(62456)).toBe('1:02.46');
  });
});

describe('parseDuration', () => {
  it('acepta hh:mm:ss y mm:ss', () => {
    expect(parseDuration('01:05:00')).toBe(3900);
    expect(parseDuration('45:30')).toBe(2730);
    expect(parseDuration(' 1:00:05 ')).toBe(3605);
  });

  it('devuelve null con formatos inválidos', () => {
    expect(parseDuration('')).toBeNull();
    expect(parseDuration('90')).toBeNull();
    expect(parseDuration('1:75')).toBeNull();
    expect(parseDuration('1:2:3:4')).toBeNull();
    expect(parseDuration('ab:cd')).toBeNull();
    expect(parseDuration('-1:00')).toBeNull();
  });
});
