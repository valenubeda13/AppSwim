import { NewPersonalRecord, PersonalRecord } from '@/types';
import { generateId } from '@/utils/id';
import { getItem, setItem, STORAGE_KEYS } from '../storage';

async function readAll(): Promise<PersonalRecord[]> {
  return (await getItem<PersonalRecord[]>(STORAGE_KEYS.records)) ?? [];
}

/** Qué operaciones hay sobre las marcas personales (ver WorkoutRepository). */
export interface RecordRepository {
  /** Todas las marcas, de la más reciente a la más vieja. */
  getAll(): Promise<PersonalRecord[]>;
  getById(id: string): Promise<PersonalRecord | null>;
  /** Genera el id. */
  create(input: NewPersonalRecord): Promise<PersonalRecord>;
  /** Pisa solo los campos presentes en `changes`. */
  update(id: string, changes: Partial<NewPersonalRecord>): Promise<PersonalRecord>;
  remove(id: string): Promise<void>;
}

/** Implementación local: guarda la lista completa en AsyncStorage. */
export const localRecordRepository: RecordRepository = {
  async getAll() {
    return (await readAll()).sort((a, b) => b.date.localeCompare(a.date));
  },

  async getById(id) {
    return (await readAll()).find((r) => r.id === id) ?? null;
  },

  async create(input) {
    const record: PersonalRecord = { ...input, id: generateId() };
    const all = await readAll();
    await setItem(STORAGE_KEYS.records, [record, ...all]);
    return record;
  },

  async update(id, changes) {
    const all = await readAll();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('No se encontró la marca.');

    const updated: PersonalRecord = { ...all[index], ...changes, id };
    all[index] = updated;
    await setItem(STORAGE_KEYS.records, all);
    return updated;
  },

  async remove(id) {
    const all = await readAll();
    await setItem(
      STORAGE_KEYS.records,
      all.filter((r) => r.id !== id)
    );
  },
};

/** La implementación que usa la app. Cambiar de backend = cambiar esta línea. */
export const recordRepository: RecordRepository = localRecordRepository;
