import React, { useState } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Plus, LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadow } from '@/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  /** Default: ícono "+" (lucide Plus). */
  icon?: LucideIcon;
  /** Diámetro del círculo. Default 56. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const PRESS_SCALE = 0.92;

/**
 * Botón flotante circular (FAB): sombra marcada, encoge al presionar y
 * dispara feedback háptico en el tap (no en pressIn, para no vibrar si
 * el usuario arrastra el dedo fuera y cancela el toque).
 */
export function FloatingActionButton({
  onPress,
  icon: Icon = Plus,
  size = 56,
  style,
}: FloatingActionButtonProps) {
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => animateTo(PRESS_SCALE)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View
        style={[
          styles.fab,
          shadow.card,
          { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] },
          style,
        ]}
      >
        <Icon size={Math.round(size * 0.45)} color={colors.surface} strokeWidth={2.5} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
