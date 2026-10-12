import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import type { ParamListBase } from '@react-navigation/native';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { colors, spacing, typography } from '@/theme';

/**
 * Opciones de header compartidas por todos los stacks, para que la app se
 * vea igual en cada tab. El header usa el mismo fondo que las pantallas y
 * no tiene sombra/borde: se "funde" con el contenido, como en iOS.
 */
export const stackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.primary,
  headerTitleStyle: { ...typography.bodyStrong, color: colors.textPrimary },
  headerLargeTitleStyle: { ...typography.display, color: colors.textPrimary },
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

/** Pantalla raíz de un tab (listado): título grande estilo iOS. */
export const rootScreenOptions: NativeStackNavigationOptions = {
  headerLargeTitle: true,
};

/**
 * Formularios (alta/edición): modal en iOS (se cierra deslizando hacia
 * abajo) y slide desde abajo en Android (se cierra con back).
 * En iOS el modal no tiene botón "atrás", así que se agrega "Cancelar".
 */
export function formModalOptions({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}): NativeStackNavigationOptions {
  return {
    presentation: 'modal',
    animation: Platform.OS === 'android' ? 'slide_from_bottom' : 'default',
    headerLeft:
      Platform.OS === 'ios'
        ? () => (
            <Pressable onPress={navigation.goBack} hitSlop={spacing.sm}>
              <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>
          )
        : undefined,
  };
}

const styles = StyleSheet.create({
  cancel: {
    ...typography.body,
    color: colors.primary,
  },
});
