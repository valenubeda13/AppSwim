import { getQuoteOfDay, Quote, QUOTES } from '../quotes';

describe('QUOTES', () => {
  it('tiene entre 20 y 30 frases, sin repetidas', () => {
    expect(QUOTES.length).toBeGreaterThanOrEqual(20);
    expect(QUOTES.length).toBeLessThanOrEqual(30);
    expect(new Set(QUOTES.map((q) => q.text)).size).toBe(QUOTES.length);
  });
});

describe('getQuoteOfDay', () => {
  const quotes: Quote[] = [{ text: 'a' }, { text: 'b' }, { text: 'c' }];

  it('usa día del año % cantidad', () => {
    // 1 de enero = día 1 -> índice 1
    expect(getQuoteOfDay('2026-01-01', quotes).text).toBe('b');
    expect(getQuoteOfDay('2026-01-02', quotes).text).toBe('c');
    expect(getQuoteOfDay('2026-01-03', quotes).text).toBe('a');
  });

  it('el mismo día da siempre la misma frase', () => {
    expect(getQuoteOfDay('2026-10-20')).toBe(getQuoteOfDay('2026-10-20'));
  });
});
