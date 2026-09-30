import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors, typography } from '@/theme';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Stack propio del tab "Perfil": pantalla principal (header propio, sin
 * header nativo) -> Editar perfil (con header nativo, como el resto de
 * las pantallas secundarias de la app).
 */
export function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { ...typography.bodyStrong, color: colors.textPrimary },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil' }} />
    </Stack.Navigator>
  );
}
