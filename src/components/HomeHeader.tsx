import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { StreakBadge } from './StreakBadge';
import { WaveShape } from './WaveShape';

const HEADER_IMAGE = require('@/assets/images/fondoSwimora.jpg');

/** Alto mínimo de la zona útil (sin contar el safe area de arriba). */
const MIN_CONTENT_HEIGHT = 280;
/** Espacio que se reserva abajo para que la ola no tape el badge. */
const WAVE_SPACE = 48;

interface HomeHeaderProps {
  /** Nombre del perfil. Si viene vacío se muestra solo el saludo. */
  userName?: string;
  greeting: string;
  streakDays: number;
}

/**
 * Header principal de la pantalla Inicio.
 * Foto de fondo + degradado + saludo personalizado + racha + ola final.
 *
 * La foto se extiende por debajo del status bar / Dynamic Island y el texto
 * arranca después del inset de arriba, así no queda tapado en ningún iPhone.
 * El alto lo define el contenido (con un mínimo), para que en pantallas
 * chicas como el iPhone SE no se recorte nada.
 */
export function HomeHeader({ userName, greeting, streakDays }: HomeHeaderProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const name = userName?.trim();
  const salutation = name ? `${greeting}, ${name} 👋` : `${greeting} 👋`;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.md, minHeight: insets.top + MIN_CONTENT_HEIGHT },
      ]}
    >
      <Image
        source={HEADER_IMAGE}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />

      {/* Oscurece arriba para que el texto se lea sobre la foto */}
      <LinearGradient
        colors={[colors.headerGradientStart, colors.headerGradientEnd, 'transparent']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Funde el final de la foto con el fondo de la pantalla */}
      <LinearGradient
        colors={['transparent', colors.background]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      <View style={styles.textBlock}>
        <Text style={styles.greeting} numberOfLines={1}>
          {salutation}
        </Text>
        <Text style={styles.title}>
          Lista para{'\n'}superar <Text style={styles.titleAccent}>tus límites</Text>
        </Text>

        <StreakBadge days={streakDays} />
      </View>

      <WaveShape width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    paddingBottom: WAVE_SPACE + spacing.md,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
  },
  textBlock: {
    paddingHorizontal: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textOnDark,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.display,
    color: colors.textOnDark,
    marginBottom: spacing.md,
  },
  titleAccent: {
    color: colors.accent,
  },
});
