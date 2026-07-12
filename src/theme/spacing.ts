/**
 * Tokens de layout: espaciado, radios de borde y sombras.
 * Mantener todo en un solo lugar evita "números mágicos" repetidos.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

/**
 * Sombra sutil estilo "app premium" (iOS y Android).
 * Se usa como spread: <View style={[styles.card, shadow.card]} />
 */
export const shadow = {
  card: {
    shadowColor: '#0B2545',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  soft: {
    shadowColor: '#0B2545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
