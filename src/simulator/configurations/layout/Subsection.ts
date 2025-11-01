import { Line } from "./Line";

export class Subsection {
  public constructor(
    public readonly lines: Line[],
    public readonly title?: string,
  ) {}
}
