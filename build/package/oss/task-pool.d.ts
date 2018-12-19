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
export declare enum TaskStatuses {
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
export declare class TaskPool<T extends TaskResultInfo> {
    private options;
    private status;
    private tasks;
    private index;
    private size;
    private current;
    /**
     * Creates an instance of TaskPool.
     * @param {Promise<T>[]} tasks
     * @param {TaskPoolOptionsInfo} options
     * @memberof TaskPool
     */
    constructor(tasks: Promise<T>[], options: TaskPoolOptionsInfo);
    /**
     * Start the first task and continue.
     *
     * @memberof TaskPool
     */
    start(): void;
    /**
     * Wrap the task for starting next task after it's ending.
     *
     * @param {Promise<T>} task
     * @returns
     * @memberof TaskPool
     */
    wrap(task: Promise<T>): Promise<void>;
    /**
     * Run promise task.
     *
     * @param {Promise<void>} task
     * @returns
     * @memberof TaskPool
     */
    run(task: Promise<void>): Promise<void>;
}
