import { AsynchronousSimulation } from "./AsynchronousSimulation";
import {
  SimulationStatistics,
  SimulationStatisticsOptions,
} from "./SimulationStatistics";

export type AsynchronousSimulationStatisticsOptions =
  SimulationStatisticsOptions & {};

export class AsynchronousSimulationStatistics extends SimulationStatistics {
  public constructor(
    private readonly simulation: AsynchronousSimulation,
    options: AsynchronousSimulationStatisticsOptions,
  ) {
    super(options);
  }
}
