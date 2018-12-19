import * as _ from 'lodash';

export interface TaskPoolOptionsInfo {
  size: number;
  onEnd: (status: TaskPoolStatusInfo) => void;
  onEachEnd?: (res: TaskResultInfo, status: TaskPoolStatusInfo) => void;
}

export interface TaskPoolStatusInfo {
  total: number;
  succeed: number;
  failed: number;
}

export enum TaskStatuses {
  succeed = 200
}

export interface TaskResultInfo {
  status: TaskStatuses;
}

/**
 * Promise task pool for async operations.
 *
 * @export
 * @class TaskPool
 * @template T
 */
export class TaskPool<T extends TaskResultInfo> {
  private options: TaskPoolOptionsInfo;
  private status: TaskPoolStatusInfo;
  private tasks: Promise<void>[];
  private index: number;
  private size: number;
  private current: number;

  /**
   * Creates an instance of TaskPool.
   * @param {Promise<T>[]} tasks
   * @param {TaskPoolOptionsInfo} options
   * @memberof TaskPool
   */
  constructor(tasks: Promise<T>[], options: TaskPoolOptionsInfo) {
    this.options = _.cloneDeep(options);
    this.tasks = tasks.map(this.wrap.bind(this));
    this.index = 0;
    this.current = 0;
    this.size = options.size;
    this.status = {
      total: tasks.length,
      succeed: 0,
      failed: 0
    };
  }

  /**
   * Start the first task and continue.
   *
   * @memberof TaskPool
   */
  start() {
    while (this.current < Math.min(this.size, this.tasks.length - 1)) {
      const task = this.tasks[this.index];

      this.index += 1;
      this.current += 1;
      this.run(task);
    }
  }

  /**
   * Wrap the task for starting next task after it's ending.
   *
   * @param {Promise<T>} task
   * @returns
   * @memberof TaskPool
   */
  wrap(task: Promise<T>) {
    const { onEachEnd, onEnd } = this.options;

    return task.then((res: any) => {
      res.status === TaskStatuses.succeed ? (this.status.succeed += 1) : (this.status.failed += 1);

      if (onEachEnd) {
        onEachEnd(res, this.status);
      }

      if (this.current === 0 && this.index === this.tasks.length - 1) {
        this.options.onEnd(this.status);
      } else {
        this.current -= 1;

        if (this.index < this.tasks.length - 1) {
          if (this.current < this.size) {
            const localTask = this.tasks[this.index];

            this.index += 1;
            this.current += 1;
            this.run(localTask);
          }
        }
      }
    });
  }

  /**
   * Run promise task.
   *
   * @param {Promise<void>} task
   * @returns
   * @memberof TaskPool
   */
  run(task: Promise<void>) {
    return Promise.resolve(task);
  }
}
