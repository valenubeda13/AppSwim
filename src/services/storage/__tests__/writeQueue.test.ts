import { createWriteQueue } from '../writeQueue';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('createWriteQueue', () => {
  it('ejecuta las tareas de a una, en orden de llegada', async () => {
    const enqueue = createWriteQueue();
    const events: string[] = [];

    const slow = enqueue(async () => {
      events.push('a:start');
      await wait(20);
      events.push('a:end');
      return 'a';
    });
    const fast = enqueue(async () => {
      events.push('b:start');
      events.push('b:end');
      return 'b';
    });

    await expect(Promise.all([slow, fast])).resolves.toEqual(['a', 'b']);
    expect(events).toEqual(['a:start', 'a:end', 'b:start', 'b:end']);
  });

  it('si una tarea falla, el error le llega a quien la encoló y la cola sigue', async () => {
    const enqueue = createWriteQueue();

    const failing = enqueue(async () => {
      throw new Error('boom');
    });
    const next = enqueue(async () => 'sigue');

    await expect(failing).rejects.toThrow('boom');
    await expect(next).resolves.toBe('sigue');
  });
});
