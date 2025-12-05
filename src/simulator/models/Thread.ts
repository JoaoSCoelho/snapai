import { Simulation } from "./Simulation";

export abstract class Thread {
  public constructor(public readonly simulation: Simulation) {}

  public abstract run(): Promise<void>;
  public abstract stop(): Promise<void>;
}
