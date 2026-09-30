export type RootTabParamList = {
  Inicio: undefined;
  Entrenamientos: undefined;
  MisMarcas: undefined;
  Perfil: undefined;
  /** Solo en desarrollo (card 1.3) — ver DevPlaygroundScreen. */
  Dev: undefined;
};

export type WorkoutsStackParamList = {
  WorkoutsList: undefined;
  WorkoutForm: { workoutId?: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};
