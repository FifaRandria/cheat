/**
 * File d'attente en mémoire : au plus `concurrency` jobs en parallèle,
 * au plus `maxQueue` jobs en attente. Suffisant pour un seul runner ;
 * à remplacer par BullMQ + Redis pour plusieurs instances.
 */
export class JobQueue {
  private running = 0;
  private waiting: Array<() => void> = [];

  constructor(
    private readonly concurrency: number,
    private readonly maxQueue: number,
  ) {}

  get stats() {
    return { running: this.running, waiting: this.waiting.length };
  }

  isFull() {
    return this.waiting.length >= this.maxQueue;
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.running >= this.concurrency) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      this.waiting.shift()?.();
    }
  }
}
