import { Global } from "@/simulator/Global";
import { Line } from "./Line";

export class Subsection {
  public constructor(
    public readonly lines: Line[],
    public readonly title?: string,
    public readonly nestedIn?: string,
    public readonly id = ++Global.lastId,
  ) {}
}
