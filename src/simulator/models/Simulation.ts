export class Simulation {
  public isRunnig: boolean = false;
  public isEvenRound: boolean = false;
  public isAsyncMode: boolean = false;
  public startTime: Date | null = null;
  public startTimeOfRound: Date | null = null;
  public logger: SimulationLogger;
}
