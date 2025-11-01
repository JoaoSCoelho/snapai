import { Node } from "./Node";
import { Simulation } from "./Simulation";

export abstract class Timer {
  public node?: Node;
  public fireTime?: number;

  public constructor(private readonly simulation: Simulation) {}

  public startGlobalTimer(time: number): void {
    if (time <= 0) throw new Error("Timer must be greater than 0");

    this.fireTime = time;
  }
}
