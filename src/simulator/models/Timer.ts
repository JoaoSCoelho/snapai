import { AsynchronousSimulation } from "./AsynchronousSimulation";
import { Node } from "./Node";
import { Simulation } from "./Simulation";
import { SynchronousSimulation } from "./SynchronousSimulation";
import { TimerEvent } from "./TimerEvent";

export abstract class Timer<Started extends boolean = boolean> {
  public node?: Node;
  private fireTime: Started extends true ? number : null =
    null as Started extends true ? number : null;

  public constructor(private readonly simulation: Simulation) {}

  /**
   * Returns the absolute time at which this timer will fire, or null if no firing time has been set yet.
   */
  public getFireTime(): Started extends true ? number : null {
    return this.fireTime;
  }

  /**
   * Returns true if this timer is associated with a node (i.e. it is a node timer), false otherwise.
   * A node timer is a timer that is associated with a particular node and is only valid for that node.
   * A non-node timer is a global timer that is valid for all nodes.
   */
  public isNodeTimer(): boolean {
    return this.node !== undefined;
  }

  /**
   * Starts a global relative timer.
   * The timer will fire after the given relative time has elapsed.
   * If the simulation is running in asynchronous mode, a TimerEvent will be enqueued.
   * If the simulation is running in synchronous mode, the timer will be inserted into the global timers set.
   *
   * In synchrone mode, set the relative time to 1 to have the timer go off in the following round.
   * @param relativeTime - The relative time after which the timer will fire.
   * @throws {Error} If the relative time is less than or equal to 0.
   */
  public startGlobalRelativeTimer(relativeTime: number): Timer<true> {
    if (relativeTime <= 0)
      throw new Error("relativeTime must be greater than 0");

    this.startGlobalAbsolute(this.simulation.currentTime + relativeTime);

    return this as Timer<true>;
  }

  /**
   * Starts a global absolute timer.
   * The timer will fire at the given absolute time.
   * If the simulation is running in asynchronous mode, a TimerEvent will be enqueued.
   * If the simulation is running in synchronous mode, the timer will be inserted into the global timers set.
   * @param time - The absolute time at which the timer will fire.
   * @throws {Error} If the absolute time is less than or equal to 0.
   */
  public startGlobalAbsolute(time: number): Timer<true> {
    if (time <= 0) throw new Error("time must be greater than 0");

    this.node = undefined;
    (this as Timer<true>).fireTime = time;

    if (this.simulation.isAsyncMode) {
      const simulation = this.simulation as AsynchronousSimulation;
      simulation.eventQueue.enqueue(
        new TimerEvent(
          this as Timer<true>,
          (this as Timer<true>).fireTime,
          simulation,
        ),
      );
    } else {
      const simulation = this.simulation as SynchronousSimulation;
      simulation.globalTimers.insert(this as Timer<true>);
    }

    return this as Timer<true>;
  }

  /**
   * Starts a relative timer associated with a node.
   * The timer will fire after the given relative time has elapsed.
   * If the simulation is running in asynchronous mode, a TimerEvent will be enqueued.
   * If the simulation is running in synchronous mode, the timer will be inserted into the node's timers set.
   * @param relativeTimer - The relative time after which the timer will fire.
   * @param node - The node associated with the timer.
   * @throws {Error} If the relative time is less than or equal to 0.
   */
  public startRelativeTimer(relativeTimer: number, node: Node): Timer<true> {
    if (relativeTimer <= 0)
      throw new Error("relativeTimer must be greater than 0");

    this.startAbsoluteTimer(this.simulation.currentTime + relativeTimer, node);

    return this as Timer<true>;
  }

  /**
   * Starts an absolute timer.
   * The timer will fire at the given absolute time.
   * If the simulation is running in asynchronous mode, a TimerEvent will be enqueued.
   * If the simulation is running in synchronous mode, the timer will be inserted into the node's timers set.
   * @param time - The absolute time of the simulation at which the timer will fire.
   * @param node - The node for which the timer will fire.
   * @throws {Error} If the absolute time is less than or equal to 0.
   */
  public startAbsoluteTimer(time: number, node: Node): Timer<true> {
    if (time <= 0) throw new Error("time must be greater than 0");

    this.node = node;
    (this as Timer<true>).fireTime = time;

    if (this.simulation.isAsyncMode) {
      // Async
      const simulation = this.simulation as AsynchronousSimulation;
      simulation.eventQueue.enqueue(
        new TimerEvent(
          this as Timer<true>,
          (this as Timer<true>).fireTime,
          simulation,
        ),
      );
    } else {
      // Sync
      node.addTimer(this as Timer<true>);
    }

    return this as Timer<true>;
  }

  /**
   * When the timer goes off, it calls this method, which executes the desired task.
   * Overwrite this method in your subclass to execute the actions that should happen
   * when the timer goes off.
   *
   * You may access the `node` member of this class to refer
   * to the node on which the timer is handled.
   */
  public abstract fire(): void;
}
