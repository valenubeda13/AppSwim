import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '@/screens/ProfileScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { stackScreenOptions } from './stackOptions';
import { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Stack propio del tab "Perfil": pantalla principal (header propio, sin
 * header nativo) -> Editar perfil (con header nativo, como el resto de
 * las pantallas secundarias de la app).
 */
export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar perfil' }}
      />
    </Stack.Navigator>
  );
}
