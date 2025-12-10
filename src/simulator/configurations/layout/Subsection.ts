import { Global } from "@/simulator/Global";
import { Line } from "./Line";
import z from "zod";

export class Subsection {
  public constructor(
    public readonly lines: Line[],
    public readonly title?: string,
    public readonly nestedIn?: string,
    public readonly disabled: boolean = false,
    public readonly id = ++Global.lastId,
  ) {}

  /**
   * Returns a Zod schema that represents the fields of this subsection.
   * This schema is an object where each key is the name of a field
   * and each value is the Zod schema of that field.
   * If the subsection is nested in another subsection, the name of the field
   * will be prefixed with the name of the nested subsection and a dot.
   * @returns A Zod schema that represents the fields of this subsection.
   */
  public getSchema(): z.ZodObject {
    return z.object(
      Object.fromEntries(
        this.lines.flatMap((line) =>
          line.fields.map((field) => [
            this.nestedIn ? `${this.nestedIn}.${field.name}` : field.name,
            field.schema,
          ]),
        ),
      ),
    );
  }
}
