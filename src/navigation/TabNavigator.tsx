import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, CalendarDays, Trophy, User, FlaskConical } from 'lucide-react-native';

import { CustomTabBar, ICON_SIZE } from '@/components/navigation/CustomTabBar';
import { HomeScreen } from '@/screens/HomeScreen';
import { DevPlaygroundScreen } from '@/screens/DevPlaygroundScreen';
import { WorkoutsStack } from './WorkoutsStack';
import { RecordsStack } from './RecordsStack';
import { ProfileStack } from './ProfileStack';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

// El aspecto de la barra vive en CustomTabBar; acá solo rutas e iconos.
const renderTabBar = (props: React.ComponentProps<typeof CustomTabBar>) => (
  <CustomTabBar {...props} />
);

export function TabNavigator() {
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <House color={color} size={ICON_SIZE} />,
        }}
      />
      <Tab.Screen
        name="Entrenamientos"
        component={WorkoutsStack}
        options={{
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={ICON_SIZE} />,
        }}
      />
      <Tab.Screen
        name="MisMarcas"
        component={RecordsStack}
        options={{
          tabBarLabel: 'Mis marcas',
          tabBarIcon: ({ color }) => <Trophy color={color} size={ICON_SIZE} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={ICON_SIZE} />,
        }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="Dev"
          component={DevPlaygroundScreen}
          options={{
            tabBarIcon: ({ color }) => <FlaskConical color={color} size={ICON_SIZE} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}
