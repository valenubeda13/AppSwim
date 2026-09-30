import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: React.ReactNode;
  /** Si el contenido va en un ScrollView. Default true. */
  scroll?: boolean;
  /** Lados donde aplicar el inset del safe area. Default arriba/izq/der
   * (abajo lo suele resolver el bottom tab bar o el propio contenido). */
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

/**
 * Layout base de una pantalla: SafeArea + fondo del theme + padding
 * horizontal estándar, con o sin scroll. Evita repetir este wrapper en
 * cada pantalla nueva.
 */
export function Screen({
  children,
  scroll = true,
  edges = ['top', 'left', 'right'],
  contentContainerStyle,
  style,
}: ScreenProps) {
  return (
    <SafeAreaView style={[styles.root, style]} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
});
