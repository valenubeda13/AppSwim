/**
 * Cola de escrituras: ejecuta las tareas de a una, en orden de llegada.
 *
 * Los repositorios hacen "leer todo → modificar → guardar todo". Si dos de
 * esas operaciones corren a la vez (ej. doble toque en Guardar), las dos
 * leen la misma lista y la segunda en guardar pisa a la primera. Pasándolas
 * por la cola, la segunda recién lee cuando la primera ya guardó.
 *
 * Cada repositorio crea la suya (una por clave de storage). Si una tarea
 * falla, el error le llega a quien la encoló y la cola sigue con la próxima.
 */
export function createWriteQueue() {
  let tail: Promise<unknown> = Promise.resolve();

  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task);
    tail = run.catch(() => {});
    return run;
  };
}
