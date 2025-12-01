import z from "zod";
import { Line } from "./Line";
import { Subsection } from "./Subsection";
import { Global } from "@/simulator/Global";

export class ParametersSubsection extends Subsection {
  public constructor(
    public readonly lines: Line[],
    public readonly title?: string,
    public readonly nestedIn?: string,
    public readonly id = ++Global.lastId,
  ) {
    super(lines, title, nestedIn, id);
  }

  /**
   * Returns a Zod schema that represents the parameters of a module.
   * This schema is an object where each key is the name of a parameter
   * and each value is the Zod schema of that parameter.
   * @returns A Zod schema that represents the parameters of the module.
   */
  public getSchema(): z.ZodObject {
    return z.object(
      Object.fromEntries(
        this.lines.flatMap((line) =>
          line.fields.map((field) => [field.name, field.schema]),
        ),
      ),
    );
  }
}
