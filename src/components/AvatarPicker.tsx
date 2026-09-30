import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors, radius, shadow, typography } from '@/theme';
import { getInitials } from '@/utils/formatters';

interface AvatarPickerProps {
  name: string;
  avatarUrl?: string;
  isUploading?: boolean;
  onPress?: () => void;
  size?: number;
  /** false = solo muestra la foto, sin badge de cámara ni poder tocarla (ej: header de Perfil). Default true. */
  editable?: boolean;
}

/**
 * Círculo de avatar (foto o iniciales), opcionalmente con badge de cámara
 * para cambiarla (`editable`, default true). Con `editable={false}` es de
 * solo lectura: se usa en el header de Perfil, donde la foto se cambia
 * desde Editar perfil (lápiz), no tocándola directamente.
 */
export function AvatarPicker({
  name,
  avatarUrl,
  isUploading,
  onPress,
  size = 96,
  editable = true,
}: AvatarPickerProps) {
  const circleStyle = { width: size, height: size, borderRadius: size / 2 };

  const content = (
    <>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={[styles.image, circleStyle]} />
      ) : (
        <View style={[styles.placeholder, circleStyle]}>
          <Text style={styles.initials}>{getInitials(name)}</Text>
        </View>
      )}

      {editable &&
        (isUploading ? (
          <View style={[styles.overlay, circleStyle]}>
            <ActivityIndicator color={colors.surface} />
          </View>
        ) : (
          <View style={[styles.badge, shadow.soft]}>
            <Camera size={16} color={colors.surface} strokeWidth={2.4} />
          </View>
        ))}
    </>
  );

  if (!editable) {
    return <View style={[styles.container, circleStyle]}>{content}</View>;
  }

  return (
    <TouchableOpacity
      style={[styles.container, circleStyle]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isUploading}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.h1,
    color: colors.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 37, 69, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
