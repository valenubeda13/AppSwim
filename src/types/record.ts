import { PoolLength, SwimStroke } from './workout';

/** Marca personal en una distancia/estilo determinado */
export interface PersonalRecord {
  id: string;
  stroke: SwimStroke;
  /** Metros de la prueba */
  distance: number;
  poolLength: PoolLength;
  /** Tiempo en milisegundos enteros (guarda centésimas sin decimales flotantes) */
  timeMs: number;
  date: string; // "YYYY-MM-DD"
  /** Torneo o contexto de la marca (ej: "Metropolitano 2026") */
  event?: string;
  notes?: string;
}

/** Datos para crear o editar una marca (el id lo pone el repositorio) */
export type NewPersonalRecord = Omit<PersonalRecord, 'id'>;
