import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Waves } from 'lucide-react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { AvatarPicker } from './AvatarPicker';
import { WaveShape } from './WaveShape';
import { Gender } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileHeaderProps {
  name: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  gender?: Gender;
  swimmingSinceYear?: number;
  onPressEdit: () => void;
}

const SWIMMER_LABEL: Record<Gender | 'default', string> = {
  nadador: 'Nadador',
  nadadora: 'Nadadora',
  default: 'Nadador/a',
};

/**
 * Header oscuro de la pantalla Perfil: título + acceso a editar arriba, y
 * debajo avatar + nombre + bio + "Nadador/a desde <año>". La foto es de
 * solo lectura acá (se cambia desde Editar perfil, ícono de lápiz). El
 * resto de Perfil (objetivos, logros, stats de toda la vida) se arma en
 * pasos siguientes.
 */
export function ProfileHeader({
  name,
  username,
  bio,
  avatarUrl,
  gender,
  swimmingSinceYear,
  onPressEdit,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.title}>Mi perfil</Text>
            <Text style={styles.subtitle}>Tu progreso, tu historia.</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={onPressEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Pencil size={20} color={colors.textOnDark} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatarRing}>
            <AvatarPicker name={name} avatarUrl={avatarUrl} editable={false} size={84} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {username || name}
            </Text>
            {bio && (
              <Text style={styles.bio} numberOfLines={2}>
                {bio}
              </Text>
            )}
            {swimmingSinceYear && (
              <View style={styles.badge}>
                <Waves size={13} color={colors.accent} strokeWidth={2.4} />
                <Text style={styles.badgeLabel}>
                  {SWIMMER_LABEL[gender ?? 'default']} desde {swimmingSinceYear}
                </Text>
              </View>
            )}
          </View>
        </View>

        <WaveShape width={SCREEN_WIDTH} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  background: {
    backgroundColor: colors.primaryDark,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.xl + spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h1,
    color: colors.textOnDark,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  iconButton: {
    padding: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  avatarRing: {
    borderWidth: 2.5,
    borderColor: colors.accent,
    borderRadius: radius.full,
    padding: 3,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.textOnDark,
  },
  bio: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentMuted,
    borderRadius: radius.full,
    paddingVertical: spacing.xs - 1,
    paddingHorizontal: spacing.sm + 2,
    marginTop: spacing.sm,
  },
  badgeLabel: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: fontFamily.bold,
  },
});
