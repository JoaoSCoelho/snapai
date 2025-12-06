import { EventQueue } from "../tools/EventQueue";
import { AsynchronousSimulationStatistics } from "./AsynchronousSimulationStatistics";
import { Simulation, SimulationOptions } from "./Simulation";

export type AsynchronousSimulationOptions = SimulationOptions & {};

export class AsynchronousSimulation extends Simulation {
  public readonly isAsyncMode: boolean = false;
  public statistics: AsynchronousSimulationStatistics;
  public eventQueue: EventQueue = new EventQueue(this);
  public nextEventId: number = 1;

  public constructor({ ...options }: SimulationOptions) {
    super(options);
    this.statistics = new AsynchronousSimulationStatistics(this, {});
  }

  public async reevaluateConnections(): Promise<void> {
    // TODO: implement it
  }
}
