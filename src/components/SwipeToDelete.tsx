import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Trash2 } from 'lucide-react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
  /** Para VoiceOver/TalkBack (el gesto no es accesible). */
  accessibilityLabel?: string;
}

const ACTION_WIDTH = 88;

/**
 * Deslizar hacia la izquierda muestra "Eliminar" detrás del contenido.
 * Borra al tocar el botón (no al soltar el gesto), así un swipe sin querer
 * no borra nada.
 */
export function SwipeToDelete({ children, onDelete, accessibilityLabel }: SwipeToDeleteProps) {
  return (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
      overshootRight={false}
      // Visible: si no, recorta la sombra de la card.
      containerStyle={styles.container}
      renderRightActions={(_progress, _translation, methods) => (
        <Pressable
          style={styles.action}
          onPress={() => {
            methods.close();
            onDelete();
          }}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? 'Eliminar'}
        >
          <Trash2 size={20} color={colors.surface} />
          <Text style={styles.actionLabel}>Eliminar</Text>
        </Pressable>
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  action: {
    width: ACTION_WIDTH,
    marginLeft: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionLabel: {
    ...typography.caption,
    fontFamily: fontFamily.bold,
    color: colors.surface,
  },
});
