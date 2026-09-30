import React, { useState } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';

type CardPadding = keyof typeof spacing | 0;

interface CardProps {
  children: React.ReactNode;
  /** Padding en los 4 lados, en tokens de `spacing` (o 0 para ninguno). Default 'md'. */
  padding?: CardPadding;
  /** Si viene, la card se vuelve tocable y encoge levemente al presionar. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const PRESS_SCALE = 0.97;

/**
 * Superficie blanca base: radio grande + sombra suave. Es tocable (con
 * efecto de escala) solo si se le pasa `onPress`; si no, es una <View> simple.
 */
export function Card({ children, padding = 'md', onPress, style }: CardProps) {
  // useState (no useRef) para no leer `.current` durante el render:
  // react-hooks/refs lo marca como error con el React Compiler activado.
  const [scale] = useState(() => new Animated.Value(1));

  const cardStyle = [
    styles.card,
    shadow.soft,
    { padding: padding === 0 ? 0 : spacing[padding] },
    style,
  ];

  if (!onPress) {
    return <Animated.View style={cardStyle}>{children}</Animated.View>;
  }

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(PRESS_SCALE)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[cardStyle, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
});
