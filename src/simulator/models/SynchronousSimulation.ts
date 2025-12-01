import { Simulation, SimulationOptions } from "./Simulation";
import { SynchronousSimulationStatistics } from "./SynchronousSimulationStatistics";
import { OrderedSet } from 'js-sdsl'
import { Timer } from "./Timer";

export type SynchronousSimulationOptions = SimulationOptions & {};

export class SynchronousSimulation extends Simulation {
  public isEvenRound: boolean = false;
  public readonly isAsyncMode: boolean = false;
  public startTimeOfRound: Date | null = null;
  public statistics: SynchronousSimulationStatistics;
  public globalTimers: OrderedSet<Timer<true>> = new OrderedSet();

  public constructor({ ...options }: SimulationOptions) {
    super(options);
    this.statistics = new SynchronousSimulationStatistics(this, {
      registerStatisticsForEveryRound:
        this.project.simulationConfig.getRegisterStatisticsForEveryRound(),
    });
  }
}
