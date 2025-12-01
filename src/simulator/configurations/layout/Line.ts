import { Global } from "@/simulator/Global";
import { Field } from "./fields/Field";

export class Line {
  public constructor(
    public readonly fields: Field[],
    public readonly id = ++Global.lastId,
  ) {
    const totalOccupedColumns = fields.reduce(
      (prev, curr) => prev + curr.occupedColumns,
      0,
    );

    if (totalOccupedColumns > 12)
      throw new Error("The line exceed the maximum width");
  }
}
