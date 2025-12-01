import { AsynchronousSimulation } from "./AsynchronousSimulation";
import { Node } from "./Node";
import { Simulation } from "./Simulation";

export abstract class Event {
  public constructor(
    public readonly time: number,
    protected readonly simulation: AsynchronousSimulation,
    public readonly id: number = this.simulation.nextEventId++,
  ) {}

  /**
   * Returns the execution time of the event as a string with the given number of decimal places.
   * @param {number} digits - The number of decimal places to round to.
   * @returns {string} The execution time of the event as a string with the given number of decimal places.
   */
  public getExecutionTimeString(digits: number): string {
    return this.time.toFixed(digits);
  }

  /**
   * @return true if this event is associated with a node (e.g. receiver of a
   * packet or the handler of a timer). Otherwise, if this event is framework
   * specific, this method returns false.
   */
  public abstract isNodeEvent(): boolean;

  /**
   * @return The node for which the event is scheduled (receiver of a packet,
   * handler of a timer event), null if the event is not associated with a node.
   */
  public abstract getEventNode(): Node | null;

  /**
   * Called when this event is removed before it was handled.
   */
  public abstract drop(): void;

  /**
   * Executes this event.
   */
  public abstract handle(): void;
}
