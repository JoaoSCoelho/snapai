import { Simulation } from "./Simulation";

export abstract class Thread {
  public refreshingRate: number = 0;
  public framingRate: number = 0;

  public constructor(public readonly simulation: Simulation) {}

  public abstract run(): Promise<void>;
  public abstract stop(): Promise<void>;
}
