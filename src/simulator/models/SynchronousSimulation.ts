import { Simulation, SimulationOptions } from "./Simulation";
import { SynchronousSimulationStatistics } from "./SynchronousSimulationStatistics";
import { OrderedTimerSet } from "../modules/OrderedTimerSet";

export type SynchronousSimulationOptions = SimulationOptions & {};

export class SynchronousSimulation extends Simulation {
  public isEvenRound: boolean = false;
  public readonly isAsyncMode: boolean = false;
  public startTimeOfRound: Date | null = null;
  public statistics: SynchronousSimulationStatistics;
  public globalTimers: OrderedTimerSet = new OrderedTimerSet();

  public constructor({ ...options }: SimulationOptions) {
    super(options);
    this.statistics = new SynchronousSimulationStatistics(this, {
      registerStatisticsForEveryRound:
        this.project.simulationConfig.getRegisterStatisticsForEveryRound(),
    });
  }

  public handleGlobalTimers() {
    if (this.globalTimers.empty()) return;

    while (
      this.globalTimers.begin().pointer.getFireTime() <= this.currentTime
    ) {
      const timer = this.globalTimers.begin().pointer;

      this.globalTimers.eraseElementByIterator(this.globalTimers.begin());
      timer.fire();
    }
  }
}
