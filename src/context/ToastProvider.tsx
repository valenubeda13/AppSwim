import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius, shadow, spacing, typography } from '@/theme';
import { tabBarHeightFor } from '@/components/navigation/CustomTabBar';

const DEFAULT_DURATION_MS = 4000;

export interface ToastOptions {
  message: string;
  /** Botón a la derecha (ej. "Deshacer"). Al tocarlo se cierra el toast. */
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  /** true mientras hay un toast en pantalla (ej. para correr el FAB). */
  isToastVisible: boolean;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

interface ActiveToast extends ToastOptions {
  /** Cambia en cada show: reinicia la animación aunque el texto sea el mismo. */
  id: number;
}

/**
 * Toast global ("Entrenamiento eliminado · Deshacer"). Va en la raíz (fuera
 * de las pantallas) para que siga visible al volver atrás después de borrar.
 * Se muestra uno a la vez: uno nuevo reemplaza al anterior.
 * Se consume con `useToast()`.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const hide = useCallback(() => {
    clearTimer();
    setToast(null);
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      clearTimer();
      nextId.current += 1;
      setToast({ ...options, id: nextId.current });
      timer.current = setTimeout(hide, options.durationMs ?? DEFAULT_DURATION_MS);
    },
    [hide]
  );

  useEffect(() => clearTimer, []);

  const handleAction = () => {
    toast?.onAction?.();
    hide();
  };

  const value = useMemo(() => ({ showToast, isToastVisible: toast !== null }), [showToast, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* El contenedor queda montado siempre: si se desmontara junto con el
          toast, Reanimated no llegaría a correr la animación de salida. */}
      <View
        pointerEvents="box-none"
        style={[styles.overlay, { bottom: tabBarHeightFor(insets.bottom) + spacing.md }]}
      >
        {toast && (
          <Animated.View
            key={toast.id}
            entering={FadeInDown.duration(220)}
            exiting={FadeOutDown.duration(180)}
            style={[styles.toast, shadow.card]}
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
            {toast.actionLabel && (
              <Pressable onPress={handleAction} hitSlop={spacing.sm} accessibilityRole="button">
                <Text style={styles.action}>{toast.actionLabel}</Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textOnDark,
    flex: 1,
  },
  action: {
    ...typography.bodyStrong,
    fontFamily: fontFamily.bold,
    color: colors.accent,
  },
});
