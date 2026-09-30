import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '@/theme';
import { StreakBadge } from './StreakBadge';
import { WaveShape } from './WaveShape';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeHeaderProps {
  userName: string;
  greeting: string;
  streakDays: number;
}

/**
 * Header principal de la pantalla Inicio.
 * Foto de fondo + degradado + saludo personalizado + racha + ola final.
 */
export function HomeHeader({ userName, greeting, streakDays }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@/assets/images/fondoSwimora.jpg')}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={[colors.headerGradientStart, colors.headerGradientEnd, 'transparent']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.textBlock}>
          <Text style={styles.greeting}>
            {greeting}, {userName}! 👋
          </Text>
          <Text style={styles.title}>
            Lista para{'\n'}superar <Text style={styles.titleAccent}>tus límites</Text>
          </Text>

          <StreakBadge days={streakDays} />
        </View>

        <WaveShape width={SCREEN_WIDTH} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 420,
    justifyContent: 'space-between',
  },
  imageRadius: {
    resizeMode: 'cover',
  },
  textBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl + spacing.md,
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
