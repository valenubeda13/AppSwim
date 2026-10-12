import type { NavigatorScreenParams } from '@react-navigation/native';

export type WorkoutsStackParamList = {
  WorkoutsList: undefined;
  WorkoutDetail: { workoutId: string };
  /** Sin workoutId = alta; con workoutId = edición. `date` (YYYY-MM-DD) preselecciona el día. */
  WorkoutForm: { workoutId?: string; date?: string };
};

export type RecordsStackParamList = {
  RecordsList: undefined;
  RecordDetail: { recordId: string };
  /** Sin recordId = alta; con recordId = edición. */
  RecordForm: { recordId?: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};

/**
 * Los tabs que contienen un stack usan NavigatorScreenParams para poder
 * navegar directo a una pantalla anidada:
 *   navigate('Entrenamientos', { screen: 'WorkoutForm', params: { date } })
 */
export type RootTabParamList = {
  Inicio: undefined;
  Entrenamientos: NavigatorScreenParams<WorkoutsStackParamList> | undefined;
  /** Hoy es un placeholder; el stack de RecordsStackParamList llega con la card de Mis marcas. */
  MisMarcas: NavigatorScreenParams<RecordsStackParamList> | undefined;
  Perfil: NavigatorScreenParams<ProfileStackParamList> | undefined;
  /** Solo en desarrollo (card 1.3) — ver DevPlaygroundScreen. */
  Dev: undefined;
};

// Tipa useNavigation(), Link, etc. en toda la app sin pasar el genérico.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootTabParamList {}
  }
}
