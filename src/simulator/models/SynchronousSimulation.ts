import { Simulation, SimulationOptions } from "./Simulation";
import { SynchronousSimulationStatistics } from "./SynchronousSimulationStatistics";

export type SynchronousSimulationOptions = SimulationOptions & {};

export class SynchronousSimulation extends Simulation {
  public isEvenRound: boolean = false;
  public readonly isAsyncMode: boolean = false;
  public startTimeOfRound: Date | null = null;
  public statistics: SynchronousSimulationStatistics;

  public constructor({ ...options }: SimulationOptions) {
    super(options);
    this.statistics = new SynchronousSimulationStatistics(this, {
      registerStatisticsForEveryRound:
        this.project.simulationConfig.getRegisterStatisticsForEveryRound(),
    });
  }
}
