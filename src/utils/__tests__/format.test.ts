import { formatMeters, formatMetersParts, formatNumber, getGreeting, getInitials } from '../format';

describe('formatNumber', () => {
  it('usa punto como separador de miles', () => {
    expect(formatNumber(98400)).toBe('98.400');
    expect(formatNumber(500)).toBe('500');
  });
});

describe('formatMeters', () => {
  it('muestra metros debajo de 10 km', () => {
    expect(formatMeters(8400)).toBe('8.400 m');
    expect(formatMeters(0)).toBe('0 m');
  });

  it('pasa a km desde 10.000 m, con un decimal como máximo', () => {
    expect(formatMeters(12500)).toBe('12,5 km');
    expect(formatMeters(20000)).toBe('20 km');
    expect(formatMeters(10049)).toBe('10 km');
  });
});

describe('getInitials', () => {
  it('toma hasta dos iniciales', () => {
    expect(getInitials('Valentina Ubeda')).toBe('VU');
    expect(getInitials('Nadador/a')).toBe('N');
    expect(getInitials('  ')).toBe('?');
  });
});

describe('formatMetersParts', () => {
  it('separa número y unidad', () => {
    expect(formatMetersParts(8400)).toEqual({ value: '8.400', unit: 'm' });
    expect(formatMetersParts(12500)).toEqual({ value: '12,5', unit: 'km' });
  });
});

describe('getGreeting', () => {
  it('cambia según la hora', () => {
    expect(getGreeting(new Date(2026, 0, 1, 8))).toBe('Buenos días');
    expect(getGreeting(new Date(2026, 0, 1, 15))).toBe('Hola');
    expect(getGreeting(new Date(2026, 0, 1, 22))).toBe('Buenas noches');
  });
});
