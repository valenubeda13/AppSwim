/**
 * Paleta de colores de la app.
 * Inspirada en el agua: azules profundos, celestes y blancos.
 * Un único lugar para tocar el color de toda la app.
 */
export const colors = {
  // Azules principales
  primary: '#1F6FEB', // azul acción (botones, links, iconos activos)
  primaryDark: '#0B2545', // azul profundo (header, textos fuertes sobre claro)
  primaryLight: '#EAF2FF', // fondo suave para cards "azules"

  // Celeste / acento agua
  accent: '#3DD6D0', // celeste turquesa (detalles, texto destacado)
  accentLight: '#E6FBFA',

  // Verde (usado puntualmente, ej: acceso "Mis marcas")
  success: '#1FAE7E',
  successLight: '#E4F8F0',

  // Neutros
  background: '#F5F8FC', // fondo general de la app
  surface: '#FFFFFF', // cards, tab bar
  border: '#E7EDF5',

  textPrimary: '#0B2545',
  textSecondary: '#5C6B7A',
  textTertiary: '#93A2B3',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.78)',

  // Gradiente del header (oscuro -> transparente sobre la foto)
  headerGradientStart: 'rgba(6, 20, 40, 0.85)',
  headerGradientEnd: 'rgba(6, 20, 40, 0.25)',

  shadow: '#0B2545',
} as const;

export type AppColors = typeof colors;
