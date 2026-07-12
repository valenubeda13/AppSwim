import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { StreakBadge } from './StreakBadge';
import { WaveShape } from './WaveShape';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeHeaderProps {
  userName: string;
  greeting: string;
  streakDays: number;
  hasNotifications?: boolean;
  onPressNotifications?: () => void;
}

/**
 * Header principal de la pantalla Inicio.
 * Foto de fondo + degradado + saludo personalizado + racha + ola final.
 */
export function HomeHeader({
  userName,
  greeting,
  streakDays,
  hasNotifications = true,
  onPressNotifications,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@/assets/images/fondoSwimora.png')}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={[colors.headerGradientStart, colors.headerGradientEnd, 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.topRow}>
          <View />
          <TouchableOpacity
            style={styles.bellButton}
            onPress={onPressNotifications}
            activeOpacity={0.8}
          >
            <Bell size={20} color={colors.primaryDark} />
            {hasNotifications && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

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
    transform: [
    { scale: 1 },
  ],
    
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  textBlock: {
    paddingHorizontal: spacing.lg,
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
