import { AsynchronousSimulation } from "./AsynchronousSimulation";
import { Event } from "./Event";
import { Node } from "./Node";
import { Timer } from "./Timer";

export class TimerEvent extends Event {
  public constructor(
    public readonly timer: Timer<true>,
    public readonly time: number,
    protected readonly simulation: AsynchronousSimulation,
  ) {
    super(time, simulation);
  }

  /**
   * Fires the associated timer, which will execute the timer's callback
   * if it has one.
   * @see Timer#fire
   * @override
   */
  public handle(): void {
    this.timer.fire();
  }

  /**
   * **Do nothing.**
   *
   * @see Event#drop
   * @override
   */
  public drop(): void {
    // do nothing
  }

  /**
   * Returns the node associated with the timer event (if it is a node timer)
   * or null if it is a global timer event.
   * @override
   * @returns The node associated with the timer event, or null if it is a global timer event.
   */
  public getEventNode(): Node | null {
    return this.timer.node ?? null;
  }

  /**
   * @override
   * @returns true if the timer is associated with a node (node timer),
   * false otherwise (global timer).
   */
  public isNodeEvent(): boolean {
    return this.timer.isNodeTimer();
  }
}
