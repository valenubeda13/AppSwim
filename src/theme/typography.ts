import { TextStyle } from 'react-native';

/**
 * Nombres de familia que expone `useFonts` (@expo-google-fonts/inter) en App.tsx.
 * Un solo peso por variante: no se combina con `fontWeight` porque ya viene
 * "horneado" en el archivo de la fuente (evita bold sintético en iOS).
 */
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
} as const;

/**
 * Escala tipográfica de la app.
 * Tipografía grande y clara, como pide el brief (estilo Strava/Apple Fitness).
 */
export const typography = {
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  statValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
  },
} satisfies Record<string, TextStyle>;
