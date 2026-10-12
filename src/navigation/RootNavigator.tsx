import React from 'react';
import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';

import { colors } from '@/theme';
import { TabNavigator } from './TabNavigator';

// Tema de React Navigation alineado con src/theme: evita el fondo blanco
// por defecto que se ve un instante durante las transiciones.
const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
  },
};

/** Punto de entrada de la navegación: contenedor + tabs (cada tab con su stack). */
export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}
