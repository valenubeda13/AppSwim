import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';

export interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  /** Dato corto debajo del título (ej: "12 este mes"). */
  subtitle: string;
  onPress: () => void;
}

const PRESS_SCALE = 0.96;
const ICON_CIRCLE_SIZE = 48;

/**
 * Card de acceso rápido de la pantalla Inicio: icono en círculo celeste +
 * título + dato. Encoge al presionar y vibra suave al tocar (igual que el
 * tab bar), así se siente como un botón y no como una card estática.
 */
export function QuickAccessCard({ icon: Icon, title, subtitle, onPress }: QuickAccessCardProps) {
  // useState (no useRef) por la misma razón que en ui/Card: no leer
  // `.current` durante el render con el React Compiler activado.
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      style={styles.pressable}
      onPress={handlePress}
      onPressIn={() => animateTo(PRESS_SCALE)}
      onPressOut={() => animateTo(1)}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
    >
      <Animated.View style={[styles.card, shadow.soft, { transform: [{ scale }] }]}>
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <Icon size={24} color={colors.primary} strokeWidth={2.2} />
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </View>

        <View>
          {/* En pantallas chicas (iPhone SE) achica un poco en vez de cortar */}
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 136,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
