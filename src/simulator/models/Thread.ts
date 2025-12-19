import EventEmitter from "node:events";
import { Simulation } from "./Simulation";
import { DefaultEventMap, EventMap } from "../utils/types";

export abstract class Thread<
  T extends EventMap<T> = DefaultEventMap,
> extends EventEmitter<T> {
  public refreshingRate: number = 0;
  public framingRate: number = 0;

  public constructor(public readonly simulation: Simulation) {
    super();
  }

  public abstract run(): Promise<void>;
  public abstract stop(): Promise<void>;
}
