import { TextStyle } from 'react-native';

/**
 * Escala tipográfica de la app.
 * Tipografía grande y clara, como pide el brief (estilo Strava/Apple Fitness).
 */
export const typography: Record<string, TextStyle> = {
  display: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
};
