import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {
  BottomTabBarHeightCallbackContext,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import { colors, fontFamily, radius, spacing } from '@/theme';

/** Alto de la barra sin contar el espacio inferior del safe area. */
const TAB_BAR_CONTENT_HEIGHT = 50;
const TAB_BAR_PADDING_TOP = 6;
/** Tamaño fijo de los íconos de las tabs (se ignora el `size` de React Navigation). */
export const ICON_SIZE = 22;
const INDICATOR_WIDTH = 48;
const INDICATOR_HEIGHT = 28;
const LABEL_FONT_SIZE = 11;
const LABEL_LINE_HEIGHT = 14;
const SPRING = { damping: 18, stiffness: 220, mass: 0.6 };

/** Espacio inferior de la barra: el inset del dispositivo, con un mínimo. */
const bottomSpaceFor = (insetBottom: number) => Math.max(insetBottom, spacing.sm);

/**
 * Alto total de la tab bar para un inset inferior dado. Lo usan los
 * elementos que flotan sobre ella (ej. el toast) sin tener que medirla.
 */
export const tabBarHeightFor = (insetBottom: number) =>
  TAB_BAR_CONTENT_HEIGHT + bottomSpaceFor(insetBottom);

/**
 * Tab bar propia (reemplaza la default de React Navigation).
 * - Fondo blanco (colors.surface) con borde superior hairline, sin sombra.
 * - Indicador "pill" detrás del ícono activo que se desliza con spring.
 * - La altura se calcula con el inset inferior del dispositivo (home
 *   indicator) en lugar de ser fija.
 * - Haptic de selección al cambiar de tab (no al tocar la tab ya activa).
 */
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomSpace = bottomSpaceFor(insets.bottom);
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  // Centra el indicador en la tab activa. Sin animar en el primer layout
  // para que no "viaje" desde la izquierda al montar.
  const hasPositioned = useRef(false);
  useEffect(() => {
    if (tabWidth === 0) return;
    const target = state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2;
    indicatorX.value = hasPositioned.current ? withSpring(target, SPRING) : target;
    hasPositioned.current = true;
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    // Informa la altura real para que useBottomTabBarHeight() sea exacto.
    onHeightChange?.(e.nativeEvent.layout.height);
  };

  const handleRowLayout = (e: LayoutChangeEvent) => {
    setTabWidth(e.nativeEvent.layout.width / state.routes.length);
  };

  return (
    <View
      style={[
        styles.container,
        { height: TAB_BAR_CONTENT_HEIGHT + bottomSpace, paddingBottom: bottomSpace },
      ]}
      onLayout={handleLayout}
    >
      <View style={styles.row} onLayout={handleRowLayout}>
        {tabWidth > 0 && <Animated.View style={[styles.indicator, indicatorStyle]} />}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? colors.primary : colors.textTertiary;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              Haptics.selectionAsync();
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <View style={styles.iconSlot}>
                {options.tabBarIcon?.({ focused: isFocused, color, size: ICON_SIZE })}
              </View>
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: TAB_BAR_PADDING_TOP,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  iconSlot: {
    height: INDICATOR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: LABEL_FONT_SIZE,
    lineHeight: LABEL_LINE_HEIGHT,
    marginTop: spacing.xs / 2,
  },
});
